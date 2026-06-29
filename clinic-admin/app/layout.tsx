import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin — aftech Klinik",
  description: "Dashboard admin aftech Klinik",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="h-full bg-slate-100">{children}</body>
    </html>
  );
}
