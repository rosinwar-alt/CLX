import { cn } from "@/shared/utils/cn";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-slate-50">
      <div className="z-10 max-w-5xl text-center">
        <h1 className="text-6xl font-bold tracking-tighter mb-4">
          CLX
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          Async Browser MMORPG Foundation
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/login"
            className={cn(
              "px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium",
              "shadow-lg shadow-blue-900/20"
            )}
          >
            Login
          </a>
          <a
            href="/auth/register"
            className={cn(
              "px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors font-medium",
              "border border-slate-700"
            )}
          >
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
