"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { QuestTask } from "@/types/quest";
import { useConnectModal } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { useUser } from "@/providers/user-provider";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

type Props = {
  task: QuestTask;
};

export function TaskItem({ task }: Props) {
  const { user } = useUser();
  const { connect } = useConnectModal();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const platformIconMap: Record<string, string> = {
    x: "/x-black.png",
    discord: "/discord.png",
  };

  const platformPrefix = task.type.split("_")[0] as "x" | "discord";
  const iconSrc = platformIconMap[platformPrefix];

  const handleRequireIdCheck = () => {
    const requiredId = user?.socialIds?.[platformPrefix];
    if (!requiredId) {
      // TODO: react-toastify が発火しない原因を調査し、下記を戻す
      // toast.warn(`Please set your ${platformPrefix} ID before proceeding.`);
      alert(`Please set your ${platformPrefix} ID before proceeding.`);
      router.push("/profile");
      return false;
    }
    return true;
  };

  // TODO: Ensure connect modal uses same config as <ConnectButton>
  // (email/google only via inAppWallet)
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

        if (connectedWallet) {
          setOpen(true);
        }
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
          <div className="flex items-center gap-3">
            <Image src={iconSrc} alt={task.label} width={20} height={20} />
            <span>{task.label}</span>
          </div>
          {open && <ChevronDown className="w-6 h-6" />}
        </div>
      </div>

      {open && (
        <div className="border-2 border-white rounded-b-md overflow-hidden">
          <div className="flex gap-4 justify-start items-center p-4">
            {/* Action Button */}
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
              <a
                href={task.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!handleRequireIdCheck()) {
                    e.preventDefault();
                  }
                }}
                className="relative z-10 bg-white text-black font-bold py-2 px-6 rounded-md border-2 border-white flex 
             items-center gap-2 transition-transform duration-200 ease-in-out transform
             translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
              >
                <Image src={iconSrc} alt="platform" width={16} height={16} />
                Go to task
              </a>
            </div>

            {/* Verify Button */}
            <div className="relative w-fit h-fit">
              <div className="absolute top-0 left-0 w-full h-full rounded-md border-2 border-white z-0" />
              <button
                onClick={() => {
                  if (!handleRequireIdCheck()) return;
                  // Verify処理をここに追加
                }}
                className="relative z-10 bg-lime-300 font-bold py-2 px-6 rounded-md text-black border-2 border-white
  transition-transform duration-200 ease-in-out transform
  translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
