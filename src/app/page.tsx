"use client";

import { useRouter } from "next/navigation";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { logout } from "@/utils/auth";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  useAuthCheck();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="p-10 flex flex-col gap-6 items-center justify-center">
      <h1 className="text-2xl text-center font-bold">Welcome!</h1>
      <p className="text-gray-600">You are logged in 🎉</p>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
}
