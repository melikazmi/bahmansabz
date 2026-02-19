import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "چالش فرانت اند بهمن سبز",
  description:
    "پیاده سازی ۳ تسک مستقل شامل داشبورد DummyJSON، صفحه بازی RAWG و Dropdown پیشرفته.",
};

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={vazirmatn.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
