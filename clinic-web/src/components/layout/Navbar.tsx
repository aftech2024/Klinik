"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "Services", href: "/services", sectionId: "services" },
  { label: "Find a Doctor", href: "/doctors", sectionId: "doctors" },
  { label: "Branches", href: "/branches", sectionId: "branches" },
  { label: "Articles", href: "/articles", sectionId: "testimonials" },
  { label: "Apps & Contact", href: "/contact", sectionId: "cta" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const navItemIds = ["home", "services", "doctors", "branches", "testimonials", "cta"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      const validElements = navItemIds
        .map(id => {
          const el = document.getElementById(id);
          return el ? { id, top: el.offsetTop } : null;
        })
        .filter((item): item is { id: string; top: number } => item !== null)
        .sort((a, b) => a.top - b.top);

      for (let i = validElements.length - 1; i >= 0; i--) {
        if (validElements[i].top <= scrollPos) {
          setActiveSection(validElements[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (pathname === "/" && link.sectionId) {
      const el = document.getElementById(link.sectionId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        setDrawerOpen(false);
      }
    }
  };

  return (
    <>
      <header className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link
            href="/"
            className="navbar-logo"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/logo-aftech.png"
              alt="aftech Klinik"
              width={36}
              height={36}
              style={{ width: "auto", height: "36px" }}
            />
            <span className="navbar-logo-text">
              aftech <span>Klinik</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {navLinks.map((link) => {
              const isActive = pathname === "/" ? activeSection === link.sectionId : pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={isActive ? "active" : ""}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <Link href="/login" className="btn-login">Login</Link>
            <Link href="/booking" className="btn-book flex items-center gap-1.5"><CalendarCheck size={16} /> Book now</Link>
          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            aria-label="Open Navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
        <div className="drawer-panel">
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
          <ul className="drawer-menu">
            {navLinks.map((link) => {
              const isActive = pathname === "/" ? activeSection === link.sectionId : pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link);
                      setDrawerOpen(false);
                    }}
                    className={isActive ? "font-bold text-[#0D9488]" : ""}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/login" className="btn-login" style={{ textAlign: "center" }}>Login</Link>
            <Link href="/booking" className="btn-book flex items-center justify-center gap-1.5" style={{ textAlign: "center" }}><CalendarCheck size={16} /> Book Appointment</Link>
          </div>
        </div>
      </div>
    </>
  );
}
