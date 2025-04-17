"use client";

// pages/register.tsx
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://test-down-lo7r.vercel.app/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      // Parse response as JSON
      const data = await response.json();

      if (data.success) {
        alert(data.message);
        router.push("/"); // Chuyển trang sau khi đăng ký
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* GitHub Logo */}
        <GithubIcon className="w-12 h-12 mb-4" />

        {/* Sign in heading */}
        <h1 className="text-xl font-normal mb-6">Sign in to GitHub</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-4 mb-4"
        >
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm mb-2">
              Username or email address
            </label>
            <Input
              id="username"
              type="text"
              className="w-full bg-[#0d1117] border-[#30363d] text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4 flex justify-between items-center">
            <label htmlFor="password" className="block text-sm">
              Password
            </label>
            <Link href="#" className="text-xs text-[#2f81f7] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            className="w-full bg-[#0d1117] border-[#30363d] text-white mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white border-none"
          >
            Sign in
          </Button>
        </form>

        {/* Passkey option */}
        <div className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-4 text-center mb-4">
          <Link href="#" className="text-sm text-[#2f81f7] hover:underline">
            Sign in with a passkey
          </Link>
        </div>

        {/* Create account */}
        <div className="w-full bg-[#161b22] border border-[#30363d] rounded-md p-4 text-center text-sm">
          <span className="text-[#7d8590]">New to GitHub?</span>{" "}
          <Link href="#" className="text-[#2f81f7] hover:underline">
            Create an account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-[#7d8590] flex flex-wrap justify-center gap-4">
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Terms
        </Link>
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Privacy
        </Link>
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Docs
        </Link>
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Contact GitHub Support
        </Link>
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Manage cookies
        </Link>
        <Link href="#" className="hover:text-[#2f81f7] hover:underline">
          Do not share my personal information
        </Link>
      </div>
    </div>
  );
}
