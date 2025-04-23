"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { QuestCard } from "@/components/QuestCard";
import { quests } from "@/data/quests";

export default function HomePage() {
  useAuthCheck();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Token Reward</h1>

        <div className="flex items-center gap-4">
          {/* Profile Icon */}
          <Link href="/profile">
            <Image
              src="https://app.questn.com/static/users/cute_squad_3.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-black cursor-pointer"
            />
          </Link>

          {/* Logout Button */}
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto w-full">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}
