import { LoginForm } from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#013162] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium text-white"
        >
          VietStrix.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
