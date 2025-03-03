"use client";

import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const userInfo = useAuthStore((state) => state.userInfo);

  console.table(userInfo);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1>Home</h1>
        </div>
      </main>
    </div>
  );
}
