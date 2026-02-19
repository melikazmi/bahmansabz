import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Task2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e3f9ef_0%,#f4fbff_38%,#f8fbfd_100%)]">
      <header className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2.5 shadow-sm">
              <Image
                src="/Logo.png"
                alt="Bahman Sabz"
                width={46}
                height={36}
                className="h-auto w-[46px]"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wide text-emerald-700">TASK 02</p>
              <h1 className="text-sm font-bold text-gray-900 md:text-lg">
                لیست بازی ها، فیلتر پیشرفته و جزئیات RAWG
              </h1>
            </div>
          </div>

          <nav className="flex items-center gap-2 text-xs md:text-sm">
            <Link
              href="/"
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              صفحه اصلی
            </Link>
            <Link
              href="/task-3"
              className="rounded-xl bg-[#41BA89] px-3 py-1.5 font-bold text-white shadow-sm transition-colors hover:bg-[#32956e]"
            >
              تسک ۳
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
