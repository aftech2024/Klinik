import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "aftech Klinik — Special Care and Best Treatment",
  description:
    "aftech Klinik menyediakan layanan kesehatan modern dan terpercaya dengan 11 cabang, 50+ dokter spesialis, dan fasilitas lengkap. Booking appointment online sekarang.",
  keywords: ["klinik", "dokter", "kesehatan", "booking online", "medical check up", "aftech klinik"],
  openGraph: {
    title: "aftech Klinik — Special Care and Best Treatment",
    description: "Layanan kesehatan modern dan terpercaya dengan booking online mudah.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
