"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/providers/user-provider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUserSocialIds } from "@/lib/user";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const t = useTranslations("profile");

  const [xId, setXId] = useState("");
  const [discordId, setDiscordId] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error(t("needLoginError"));
      router.push("/");
      return;
    }
    setXId(user.socialIds.x || "");
    setDiscordId(user.socialIds.discord || "");
  }, [user, router, t]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUserSocialIds(user, { x: xId, discord: discordId });
      toast.success(t("savedToast"));
    } catch (err) {
      console.error("Failed to save IDs:", err);
      toast.error(t("saveFailedToast"));
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      {/* 中央ダークパネル（モバイルは高さ制約解除、デスクトップは従来のまま） */}
      <section
        className="
          mx-auto w-full
          rounded-2xl bg-[#1C1C1C] text-white
          shadow-[0_6px_28px_rgba(0,0,0,0.28)]
          px-4 sm:px-8 pt-4 pb-8 md:py-8
          h-auto md:h-[calc(100vh-160px)]
          overflow-visible md:overflow-auto
          flex flex-col gap-3 md:gap-8
        "
      >
        {/* ===== ヘッダーカード ===== */}
        <div
          className="
            relative rounded-2xl border border-[#D5B77A]/80 bg-[#0F0F0F]/70
            px-4 sm:px-7 py-5 md:py-6
          "
        >
          {/* グロー */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
            style={{
              background:
                "radial-gradient(80% 140% at 50% 90%, rgba(213,183,122,0.22) 0%, rgba(213,183,122,0.10) 32%, rgba(213,183,122,0.04) 55%, transparent 72%)",
            }}
          />
          {/* 
            モバイル： [アイコン][TOTAL POINTS] の2カラム → その下にテキスト一式
            デスクトップ：既存の [アイコン][テキスト][TOTAL POINTS]
          */}
          <div className="relative grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 items-center">
            {/* 左：ロゴ（角丸スクエア） */}
            <div className="row-start-1 col-start-1 flex items-center justify-center">
              <Image
                src="/qube.svg"
                alt={t("userIconAlt")}
                width={224}
                height={224}
                className="w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] md:w-[224px] md:h-[224px]"
                priority
              />
            </div>

            {/* 右上：TOTAL POINTS（モバイルでは右上に寄せ） */}
            <div className="row-start-1 col-start-2 md:col-start-3 md:row-start-1 justify-self-end md:justify-self-end self-start md:self-auto px-2 md:px-5 py-2 md:py-4 min-w-[160px] md:min-w-[220px]">
              <p className="text-right md:text-right text-[16px] md:text-[20px] tracking-widest uppercase mb-1 md:mb-1.5 text-white">
                TOTAL POINTS
              </p>
              <p
                className="
                  text-right md:text-right
                  text-[40px] md:text-[64px] font-extrabold leading-none
                  bg-gradient-to-b from-[#D5B77A] to-white
                  bg-clip-text text-transparent
                  drop-shadow-[0_6px_0_rgba(0,0,0,0.55)]
                "
              >
                {user.inventory.points}
              </p>
            </div>

            {/* 下段：名前 / レベル / 編集リンク（モバイルは小さめ） */}
            <div className="row-start-2 col-span-2 md:row-start-1 md:col-start-2 min-w-0 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-[24px] sm:text-[28px] md:text-[48px] text-[#D5B77A] tracking-tight">
                  {user.email}
                </h2>
                <p className="mt-1 text-[18px] sm:text-[20px] md:text-[32px] text-[#BBA98D]">
                  Level 1
                </p>
              </div>

              <div className="mt-3 text-[14px] sm:text-[16px] md:text-[20px] text-[#BBA98D]">
                <span className="hover:opacity-80 cursor-not-allowed">
                  Edit Character (Coming Soon)
                </span>
                <span className="mx-2 opacity-50">|</span>
                <span className="hover:opacity-80 cursor-not-allowed">
                  Edit Thumbnail (Coming Soon)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 入力カード（X / Discord） ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {/* X (Twitter) */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[605/139] min-h-[140px]">
            <Image
              src="/profile/x-card-bg.svg"
              alt=""
              aria-hidden
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-contain"
            />
            <div className="absolute inset-0 flex items-center px-5 md:px-6">
              <div className="text-left flex-1 min-w-0 pr-4 md:pr-6">
                <h3 className="text-[24px] md:text-[32px] leading-tight font-extrabold text-[#D7C6A4]">
                  X (Twitter) ID
                </h3>
                <input
                  type="text"
                  value={xId}
                  onChange={(e) => setXId(e.target.value)}
                  placeholder="e.g. your_x_username"
                  className="
                    w-full bg-transparent outline-none 
                    text-[16px] md:text-[20px] text-[#D7C6A4]/90
                    placeholder:text-[#D7C6A4]/70
                    border-b border-transparent
                    focus:border-[#D5B77A]/70 caret-[#D5B77A]
                  "
                />
              </div>

              <div className="ml-3 md:ml-auto shrink-0 relative">
                <div
                  className="pointer-events-none absolute -inset-5 -z-10 opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 50%, rgba(213,183,122,0.35) 0%, rgba(213,183,122,0.0) 70%)",
                    filter: "blur(4px)",
                  }}
                />
                <button
                  onClick={handleSave}
                  className="
                    inline-flex items-center justify-center
                    px-4 md:px-6 py-2 md:py-2.5
                    rounded-md font-semibold text-[#1C1C1C]
                    bg-gradient-to-r from-[#D5B77A] to-white
                    border border-[#D5B77A]/70 shadow-md shadow-black/40
                    transition-transform hover:-translate-y-0.5
                    text-[14px] md:text-[16px]
                  "
                >
                  Save IDs
                </button>
              </div>
            </div>
          </div>

          {/* Discord */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[605/139] min-h-[140px]">
            <Image
              src="/profile/discord-card-bg.svg"
              alt=""
              aria-hidden
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-contain"
            />
            <div className="absolute inset-0 flex items-center px-5 md:px-6">
              <div className="text-left flex-1 min-w-0 pr-4 md:pr-6">
                <h3 className="text-[24px] md:text-[32px] leading-tight font-extrabold text-[#D7C6A4]">
                  Discord ID
                </h3>
                <input
                  type="text"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  placeholder={t("discordPlaceholder")}
                  className="
                    w-full bg-transparent outline-none
                    text-[16px] md:text-[20px] text-[#D7C6A4]/90
                    placeholder:text-[#D7C6A4]/70
                    border-b border-transparent
                    focus:border-[#D5B77A]/70 caret-[#D5B77A]
                  "
                />
              </div>

              <div className="ml-3 md:ml-auto shrink-0 relative">
                <div
                  className="pointer-events-none absolute -inset-5 -z-10 opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 50%, rgba(213,183,122,0.35) 0%, rgba(213,183,122,0.0) 70%)",
                    filter: "blur(4px)",
                  }}
                />
                <button
                  onClick={handleSave}
                  className="
                    inline-flex items-center justify-center
                    px-4 md:px-6 py-2 md:py-2.5
                    rounded-md font-semibold text-[#1C1C1C]
                    bg-gradient-to-r from-[#D5B77A] to-white
                    border border-[#D5B77A]/70 shadow-md shadow-black/40
                    transition-transform hover:-translate-y-0.5
                    text-[14px] md:text-[16px]
                  "
                >
                  Save IDs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
