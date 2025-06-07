"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/providers/user-provider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUserSocialIds } from "@/lib/user";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const [xId, setXId] = useState("");
  const [discordId, setDiscordId] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view your profile.");
      router.push("/");
      return;
    }

    setXId(user.socialIds.x || "");
    setDiscordId(user.socialIds.discord || "");
  }, [user, router]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserSocialIds(user, {
        x: xId,
        discord: discordId,
      });

      toast.success("Your IDs have been saved.");
    } catch (err) {
      console.error("Failed to save IDs:", err);
      toast.error("Failed to save your IDs. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center gap-4">
        <Image
          src="/qube.png"
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

      <div className="relative w-full h-fit">
        <div className="absolute top-0 left-0 w-full h-full bg-lime-300 rounded-md border-2 border-black z-0" />
        <div
          className="relative z-10 bg-white px-6 py-6 rounded-md border-2 border-black
          transition-transform duration-200 ease-in-out transform
          translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
        >
          <p className="text-sm font-bold mb-2 text-gray-500">Total Points</p>
          <p className="text-4xl font-extrabold text-black">
            {user.inventory.points} pts
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-bold">X (Twitter) ID</label>
          <input
            type="text"
            value={xId}
            onChange={(e) => setXId(e.target.value)}
            placeholder="e.g. your_x_username"
            className="w-full border-2 border-white rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold">Discord ID</label>
          <input
            type="text"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
            placeholder="e.g. your_discord_username"
            className="w-full border-2 border-white rounded-md px-4 py-2"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-lime-300 text-black px-6 py-2 rounded-md font-bold border-2 border-white hover:bg-lime-500 transition"
        >
          Save IDs
        </button>
      </div>

      <div className="mt-10 text-center border-t border-white pt-6">
        <p className="text-gray-400 font-semibold">
          🕒 Participation History & Progress Dashboard — Coming Soon!
        </p>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
