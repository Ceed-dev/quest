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
      {/* 中央ダークパネル（Gachaと統一） */}
      <section
        className="
          mx-auto w-full
          rounded-2xl bg-[#1C1C1C] text-white
          shadow-[0_6px_28px_rgba(0,0,0,0.28)]
          px-6 sm:px-8 py-8
          h-[calc(100vh-160px)]
          overflow-auto
          flex flex-col gap-8
        "
      >
        {/* ===== ヘッダーカード（Figma準拠） ===== */}
        <div
          className="
            relative rounded-2xl border border-[#D5B77A]/80 bg-[#0F0F0F]/70
            px-5 sm:px-7 py-6
          "
        >
          {/* グロー（下中央→上に広がる） */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
            style={{
              background:
                // 横はやや狭め(80%)、縦は広め(140%)の楕円。中心は 50% 90%（下寄り）
                "radial-gradient(80% 140% at 50% 90%, rgba(213,183,122,0.22) 0%, rgba(213,183,122,0.10) 32%, rgba(213,183,122,0.04) 55%, transparent 72%)",
            }}
          />
          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6">
            {/* 左：ロゴ（角丸スクエア） */}
            <div className="flex items-center justify-center">
              <Image
                src="/qube.svg"
                alt={t("userIconAlt")}
                width={224}
                height={224}
                priority
              />
            </div>

            {/* 中央：名前 / レベル / 編集リンク（Coming Soon） */}
            <div className="min-w-0 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-[48px] text-[#D5B77A] tracking-tight">
                  {/* メールしか無ければメール表示。名前があるなら置き換えてOK */}
                  {user.email}
                </h2>
                <p className="mt-1 text-[32px] text-[#BBA98D]">Level 1</p>
              </div>

              <div className="mt-3 text-[20px] text-[#BBA98D]">
                <span className="hover:opacity-80 cursor-not-allowed">
                  Edit Character (Coming Soon)
                </span>
                <span className="mx-2 opacity-50">|</span>
                <span className="hover:opacity-80 cursor-not-allowed">
                  Edit Thumbnail (Coming Soon)
                </span>
              </div>
            </div>

            {/* 右：TOTAL POINTS（黒面＋金枠、数値は縦グラデ） */}
            <div
              className="
                px-5 py-4 min-w-[220px]
              "
            >
              <p className="text-[20px] tracking-widest uppercase mb-1.5 text-white text-right">
                TOTAL POINTS
              </p>
              <p
                className="
                  text-[64px] font-extrabold leading-none text-right
                  bg-gradient-to-b from-[#D5B77A] to-white
                  bg-clip-text text-transparent
                  drop-shadow-[0_6px_0_rgba(0,0,0,0.55)]
                "
              >
                {user.inventory.points}
              </p>
            </div>
          </div>
        </div>

        {/* ===== 入力カード（背景アートのみ：X / Discord） ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* X (Twitter) 背景アート + 見出し & ボタン */}
          <div className="relative w-full aspect-[605/139] rounded-2xl overflow-hidden">
            <Image
              src="/profile/x-card-bg.svg"
              alt=""
              aria-hidden
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-contain"
              priority={false}
            />

            {/* テキスト & ボタンのオーバーレイ */}
            <div className="absolute inset-0 flex items-center px-6">
              {/* 左：タイトル & 説明 */}
              <div className="text-left flex-1 min-w-0 pr-4 md:pr-6">
                <h3 className="text-[28px] md:text-[32px] leading-tight font-extrabold text-[#D7C6A4]">
                  X (Twitter) ID
                </h3>
                <input
                  type="text"
                  value={xId}
                  onChange={(e) => setXId(e.target.value)}
                  placeholder="e.g. your_x_username"
                  className="
        w-full bg-transparent outline-none 
        text-[18px] md:text-[20px] text-[#D7C6A4]/90
        placeholder:text-[#D7C6A4]/70
        border-b border-transparent
        focus:border-[#D5B77A]/70 caret-[#D5B77A]
      "
                />
              </div>

              {/* 右：ボタン（ピル） */}
              <div className="ml-4 md:ml-auto shrink-0 relative">
                {/* ボタン背面の淡いグロー */}
                <div
                  className="pointer-events-none absolute -inset-6 -z-10 opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 50%, rgba(213,183,122,0.35) 0%, rgba(213,183,122,0.0) 70%)",
                    filter: "blur(4px)",
                  }}
                />
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center px-5 md:px-6 py-2 md:py-2.5
                   rounded-md font-semibold text-[#1C1C1C]
                   bg-gradient-to-r from-[#D5B77A] to-white
                   border border-[#D5B77A]/70 shadow-md shadow-black/40
                   transition-transform hover:-translate-y-0.5"
                >
                  Save IDs
                </button>
              </div>
            </div>
          </div>

          {/* Discord 背景アート + 見出し & 入力 & ボタン */}
          <div className="relative w-full aspect-[605/139] rounded-2xl overflow-hidden">
            <Image
              src="/profile/discord-card-bg.svg"
              alt=""
              aria-hidden
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-contain"
              priority={false}
            />

            {/* テキスト & 入力 & ボタンのオーバーレイ */}
            <div className="absolute inset-0 flex items-center px-6">
              {/* 左：タイトル & 入力 */}
              <div className="text-left flex-1 min-w-0 pr-4 md:pr-6">
                <h3 className="text-[28px] md:text-[32px] leading-tight font-extrabold text-[#D7C6A4]">
                  Discord ID
                </h3>
                <input
                  type="text"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  placeholder={t("discordPlaceholder")}
                  className="
          w-full bg-transparent outline-none
          text-[18px] md:text-[20px] text-[#D7C6A4]/90
          placeholder:text-[#D7C6A4]/70
          border-b border-transparent
          focus:border-[#D5B77A]/70 caret-[#D5B77A]
        "
                />
              </div>

              {/* 右：保存ボタン */}
              <div className="ml-4 md:ml-auto shrink-0 relative">
                <div
                  className="pointer-events-none absolute -inset-6 -z-10 opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 50%, rgba(213,183,122,0.35) 0%, rgba(213,183,122,0.0) 70%)",
                    filter: "blur(4px)",
                  }}
                />
                <button
                  onClick={handleSave}
                  className="inline-flex items-center justify-center px-5 md:px-6 py-2 md:py-2.5
                   rounded-md font-semibold text-[#1C1C1C]
                   bg-gradient-to-r from-[#D5B77A] to-white
                   border border-[#D5B77A]/70 shadow-md shadow-black/40
                   transition-transform hover:-translate-y-0.5"
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
