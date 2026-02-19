import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Task3Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8f8f0_0%,#f7fcf9_45%,#f4f8fb_100%)]">
      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2.5 shadow-sm">
              <Image
                src="/Logo.png"
                alt="Bahman Sabz"
                width={40}
                height={32}
                className="h-auto w-[42px]"
              />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-emerald-700">TASK 03</p>
              <h1 className="text-sm font-bold text-gray-900 md:text-base">
                Dropdown Select پیشرفته (Headless + Tailwind)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/task-2"
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              تسک ۲
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[#41BA89] px-3 py-1.5 font-bold text-white shadow-sm hover:bg-[#32956e]"
            >
              صفحه اصلی
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
