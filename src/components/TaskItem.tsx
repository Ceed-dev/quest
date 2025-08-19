"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { QuestTask } from "@/types/quest";
import type { TaskSubmission } from "@/types/taskSubmission";
import { useConnectModal } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { useUser } from "@/providers/user-provider";
import { client } from "@/lib/client";
import { uploadTaskImageAndSaveSubmission } from "@/lib/uploadTaskImageAndSaveSubmission";
import { fetchTaskSubmission } from "@/lib/fetchTaskSubmission";
import { getLText } from "@/lib/i18n-data";
import { useTranslations, useLocale } from "next-intl";

type TaskItemProps = {
  questId: string;
  task: QuestTask;
};

export function TaskItem({ questId, task }: TaskItemProps) {
  const { user } = useUser();
  const { connect } = useConnectModal();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState<TaskSubmission | null>(null);
  const t = useTranslations("taskItem");
  const locale = useLocale() as "en" | "ja";

  useEffect(() => {
    if (!user) return;

    const loadSubmission = async () => {
      try {
        const submissionData = await fetchTaskSubmission({
          userId: user.walletAddress!,
          questId,
          taskId: task.id,
        });

        if (submissionData) {
          setSubmission(submissionData);
        } else {
          setSubmission(null);
        }
      } catch (err) {
        console.error("Failed to fetch task submission:", err);
      }
    };

    loadSubmission();
  }, [user, questId, task.id]);

  const wallets = useMemo(
    () => [
      inAppWallet({
        auth: { options: ["email", "google"] },
      }),
    ],
    [],
  );

  const handleToggle = async () => {
    if (!user) {
      try {
        const connectedWallet = await connect({ client, wallets });
        if (connectedWallet) setOpen(true);
      } catch (err) {
        console.warn(
          "User closed the wallet connection modal or rejected the request.",
          err,
        );
      }
      return;
    }
    setOpen(!open);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!selectedFile) {
      alert(t("alerts.selectImageFirst"));
      return;
    }

    const confirmed = window.confirm(t("alerts.confirmUpload"));
    if (!confirmed) {
      return;
    }

    try {
      await uploadTaskImageAndSaveSubmission({
        userId: user.walletAddress!,
        questId,
        taskId: task.id,
        file: selectedFile,
        points: task.points,
      });

      const updatedSubmission = await fetchTaskSubmission({
        userId: user.walletAddress!,
        questId,
        taskId: task.id,
      });
      setSubmission(updatedSubmission);

      alert(t("alerts.uploadSuccess"));
    } catch (err) {
      console.error(err);
      alert(t("alerts.uploadFail"));
    }
  };

  const UploadButton = (
    <div className="relative w-fit h-fit flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
      <label
        htmlFor={`upload-${task.id}`}
        onClick={() => {
          if (selectedImage) {
            setSelectedImage(null); // Remove image if already selected
          }
        }}
        className="relative z-10 bg-blue-300 font-bold py-2 px-6 rounded-md text-black border-2 border-white
                transition-transform duration-200 ease-in-out transform
                translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0 cursor-pointer"
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
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFile(file);
          }
        }}
      />
    </div>
  );

  const SubmitButton = (
    <div className="relative w-fit h-fit">
      <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
      <button
        onClick={handleSubmit}
        className="relative z-10 bg-lime-300 font-bold py-2 px-6 rounded-md text-black border-2 border-white
                transition-transform duration-200 ease-in-out transform
                translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
      >
        {t("submit")}
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <div
        onClick={handleToggle}
        className="relative w-full h-fit cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
        <div
          className={`relative z-10 flex items-center justify-between gap-3
                      px-4 py-3 font-bold bg-white text-black
                      ${
                        open
                          ? "rounded-t-md translate-x-0 translate-y-0"
                          : "rounded-md transition-transform duration-200 ease-in-out transform translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
                      }`}
        >
          <div className="flex flex-col md:flex-row items-center md:gap-3">
            <div className="flex items-center gap-3 mr-auto">
              <Image
                src={
                  submission && submission.status === "approved"
                    ? "/check-box.svg"
                    : "/check-box-outline-blank.svg"
                }
                alt={getLText(task.label, locale)}
                width={30}
                height={30}
              />
              {submission ? (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    submission.status === "approved"
                      ? "bg-green-300 text-green-900"
                      : submission.status === "pending"
                        ? "bg-yellow-300 text-yellow-900"
                        : "bg-red-300 text-red-900"
                  }`}
                >
                  {t(`status.${submission.status}`)}
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-300 text-gray-700">
                  {t("status.notSubmitted")}
                </span>
              )}
            </div>
            <span>{getLText(task.label, locale)}</span>
          </div>
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
            {task.points} pts
          </span>
        </div>
      </div>

      {open && (
        <div className="border-2 border-white rounded-b-md overflow-hidden">
          <div className="flex flex-col gap-4 items-center p-4">
            {submission?.imageUrl ? (
              <Image
                src={submission.imageUrl}
                alt={t("alt.submitted")}
                width={400}
                height={400}
                className="rounded border"
              />
            ) : selectedImage ? (
              <Image
                src={selectedImage}
                alt={t("alt.selected")}
                width={400}
                height={400}
                className="rounded border"
              />
            ) : null}

            <div className="flex gap-4">
              {/* Action Button (e.g., Follow on X) */}
              {task.actionButton && (
                <div className="relative w-fit h-fit flex flex-col items-center">
                  <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
                  <a
                    href={task.actionButton.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 bg-indigo-300 font-bold py-2 px-6 rounded-md text-black border-2 border-white
        transition-transform duration-200 ease-in-out transform
        translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0 cursor-pointer"
                  >
                    {getLText(task.actionButton.label, locale)}
                  </a>
                </div>
              )}

              {submission === null &&
                !selectedImage &&
                // Upload Button
                UploadButton}

              {submission === null && selectedImage && (
                <>
                  {/* Remove Button */}
                  {UploadButton}
                  {/* Submit Button */}
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
