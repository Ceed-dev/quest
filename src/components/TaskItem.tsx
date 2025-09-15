// -----------------------------------------------------------------------------
// TaskItem: renders a single quest task with optional external action,
// image upload, and submission handling.
// -----------------------------------------------------------------------------

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import type { QuestTask } from "@/types/quest";
import type { TaskSubmission } from "@/types/taskSubmission";

import { useTranslations, useLocale } from "next-intl";
import { getLText } from "@/lib/i18n-data";

import { useConnectModal } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

import { useUser } from "@/providers/user-provider";
import { uploadTaskImageAndSaveSubmission } from "@/lib/uploadTaskImageAndSaveSubmission";
import { fetchTaskSubmission } from "@/lib/fetchTaskSubmission";

/* -----------------------------------------------------------------------------
 * Props
 * ---------------------------------------------------------------------------*/
type TaskItemProps = {
  questId: string;
  task: QuestTask;
};

/* -----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/
export function TaskItem({ questId, task }: TaskItemProps) {
  const { user } = useUser();
  const { connect } = useConnectModal();

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState<TaskSubmission | null>(null);

  const t = useTranslations("taskItem");
  const locale = useLocale() as "en" | "ja";

  // Thirdweb wallets list (stable)
  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  // Fetch existing submission (if any)
  useEffect(() => {
    if (!user) return;

    const loadSubmission = async () => {
      try {
        const submissionData = await fetchTaskSubmission({
          userId: user.walletAddress!,
          questId,
          taskId: task.id,
        });
        setSubmission(submissionData ?? null);
      } catch (err) {
        console.error("Failed to fetch task submission:", err);
      }
    };

    loadSubmission();
  }, [user, questId, task.id]);

  // Toggle open; if not connected, open connect modal first
  const handleToggle = async () => {
    if (!user) {
      try {
        const connectedWallet = await connect({ client, wallets });
        if (connectedWallet) setOpen(true);
      } catch (err) {
        console.warn("Wallet connect dismissed:", err);
      }
      return;
    }
    setOpen((v) => !v);
  };

  // Submit selected image as a task submission
  const handleSubmit = async () => {
    if (!user) return;
    if (!selectedFile) {
      alert(t("alerts.selectImageFirst"));
      return;
    }

    const confirmed = window.confirm(t("alerts.confirmUpload"));
    if (!confirmed) return;

    try {
      await uploadTaskImageAndSaveSubmission({
        userId: user.walletAddress!,
        questId,
        taskId: task.id,
        file: selectedFile,
        points: task.points,
      });

      const updated = await fetchTaskSubmission({
        userId: user.walletAddress!,
        questId,
        taskId: task.id,
      });
      setSubmission(updated);
      alert(t("alerts.uploadSuccess"));
    } catch (err) {
      console.error(err);
      alert(t("alerts.uploadFail"));
    }
  };

  // Shared button class for inner actions (per Figma spec)
  const innerBtnClass =
    "inline-flex items-center justify-center rounded-md bg-[#1C1F21] text-white px-4 py-2 text-sm font-semibold transition hover:opacity-90";

  // Upload button (toggle select/remove)
  const UploadButton = (
    <>
      <label
        htmlFor={`upload-${task.id}`}
        className={innerBtnClass + " cursor-pointer"}
        onClick={() => {
          // If already selected, clicking the label clears it (existing behavior)
          if (selectedImage) {
            setSelectedImage(null);
            setSelectedFile(null);
          }
        }}
      >
        {selectedImage ? t("removeImage") : t("uploadImage")}
      </label>

      <input
        type="file"
        id={`upload-${task.id}`}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setSelectedFile(file);
          }
        }}
      />
    </>
  );

  // Submit button
  const SubmitButton = (
    <button type="button" onClick={handleSubmit} className={innerBtnClass}>
      {t("submit")}
    </button>
  );

  return (
    <div className="w-full">
      {/* Collapsed row (header) */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className={`
          w-full select-none
          bg-[#7F0019] text-white
          px-4 py-3
          flex items-center justify-between gap-4
          shadow-sm
          ${open ? "rounded-t-md" : "rounded-md"}
        `}
      >
        {/* Left: status icon + label */}
        <span className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-7 h-7 p-1 rounded-[4px] bg-white shrink-0">
            {submission?.status === "approved" && (
              <Image
                src="/status-approved.svg"
                alt="Approved"
                width={30}
                height={30}
              />
            )}
          </span>
          <span className="font-semibold truncate">
            {getLText(task.label, locale)}
          </span>
        </span>
        {task.points} pts
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-2 border-[#7F0019] rounded-b-md bg-white overflow-hidden">
          <div className="p-4 flex flex-col items-center gap-4">
            {/* Status pill (kept as-is) */}
            {submission && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  submission.status === "approved"
                    ? "bg-green-200 text-green-900"
                    : submission.status === "pending"
                      ? "bg-yellow-200 text-yellow-900"
                      : "bg-red-200 text-red-900"
                }`}
              >
                {t(`status.${submission.status}`)}
              </span>
            )}

            {/* Preview (submitted image or currently selected) */}
            {submission?.imageUrl ? (
              <Image
                src={submission.imageUrl}
                alt={t("alt.submitted")}
                width={480}
                height={480}
                className="rounded border"
              />
            ) : selectedImage ? (
              <Image
                src={selectedImage}
                alt={t("alt.selected")}
                width={480}
                height={480}
                className="rounded border"
              />
            ) : null}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              {task.actionButton && (
                <a
                  href={task.actionButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={innerBtnClass}
                >
                  {getLText(task.actionButton.label, locale)}
                </a>
              )}

              {/* Upload / Remove */}
              {submission === null && !selectedImage && UploadButton}
              {submission === null && selectedImage && (
                <>
                  {UploadButton}
                  {SubmitButton}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
