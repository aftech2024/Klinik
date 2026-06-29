import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6281234567890",
    svg: <MessageCircle size={18} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
        <path d="m10 15 5-3-5-3v6Z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Image src="/logo-aftech.png" alt="aftech Klinik" width={32} height={32} style={{ width: "auto", height: "32px" }} />
              <span className="footer-logo-text">aftech Klinik</span>
            </div>
            <p className="footer-brand-desc">
              Platform kesehatan digital modern yang menyediakan layanan klinik terpadu dengan teknologi terkini untuk keluarga Indonesia.
            </p>
            {/* Hanya menampilkan sosmed yang sering digunakan */}
            <div className="footer-social">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={s.label}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {["Home", "About Us", "Services", "Doctors", "Branches", "Promotions"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-").replace("about-us", "about")}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              {[
                ["Praktek Umum", "/services/general-practice"],
                ["Gigi & Mulut", "/services/dental"],
                ["Anak", "/services/pediatrics"],
                ["Laboratorium", "/services/laboratory"],
                ["Medical Check Up", "/services/medical-check-up"],
                ["Vaksinasi", "/services/vaccination"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="footer-col">
            <h4>Help & Support</h4>
            <ul className="footer-links">
              {[
                ["FAQ", "/faq"],
                ["Consultation Call", "/contact"],
                ["Booking Guide", "/booking"],
                ["Articles", "/articles"],
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact-row">
              <span className="footer-contact-icon">
                <Phone size={16} />
              </span>
              <span>021-555-0000</span>
            </div>
            <div className="footer-contact-row">
              <span className="footer-contact-icon">
                <Mail size={16} />
              </span>
              <span>hello@aftechklinik.com</span>
            </div>
            <div className="footer-contact-row">
              <span className="footer-contact-icon">
                <MessageCircle size={16} />
              </span>
              <span>WhatsApp: 0812-3456-7890</span>
            </div>
            <div className="footer-contact-row">
              <span className="footer-contact-icon">
                <MapPin size={16} />
              </span>
              <span>Jakarta, Bekasi, Tangerang, Depok, Bogor, dan 6 kota lainnya</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © 2026 aftech Klinik. All rights reserved.
          </span>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
