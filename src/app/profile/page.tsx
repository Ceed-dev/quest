"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const points = 1200;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-10">
      {/* ユーザー情報 */}
      <div className="flex items-center gap-4">
        <Image
          src={
            user.photoURL ||
            "https://app.questn.com/static/users/cute_squad_3.png"
          } // fallbackアイコン
          alt="user-icon"
          width={64}
          height={64}
          className="rounded-full border-2 border-black"
        />
        <div>
          <h2 className="text-lg font-bold">{user.email}</h2>
          <p className="text-sm text-gray-500">Your registered email</p>
        </div>
      </div>

      {/* 獲得ポイント */}
      <div className="relative w-full h-fit">
        {/* 黒い影背景 */}
        <div className="absolute top-0 left-0 w-full h-full bg-lime-300 rounded-md border-2 border-black z-0" />

        {/* 白いボックス本体 */}
        <div
          className="relative z-10 bg-white px-6 py-6 rounded-md border-2 border-black
          transition-transform duration-200 ease-in-out transform
          translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
        >
          <p className="text-sm font-bold mb-2 text-gray-500">Total Points</p>
          <p className="text-4xl font-extrabold text-black">{points} pts</p>
        </div>
      </div>
    </div>
  );
}
