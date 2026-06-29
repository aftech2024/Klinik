import Link from "next/link";
import { Calendar, Phone } from "lucide-react";
import { CLINIC_PHONE, BOOKING_URL } from "@/lib/constants";
import { btn } from "@/lib/utils";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Siap Menjaga Kesehatan Anda?
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Booking appointment sekarang dan dapatkan layanan kesehatan terbaik dari dokter-dokter terpercaya kami.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={BOOKING_URL}
            className={btn("primary", "lg", "bg-white text-emerald-800 hover:bg-emerald-50")}
          >
            <Calendar size={18} />
            Booking Sekarang
          </Link>
          <a
            href={`tel:${CLINIC_PHONE}`}
            className={btn("outline", "lg")}
          >
            <Phone size={18} />
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}
