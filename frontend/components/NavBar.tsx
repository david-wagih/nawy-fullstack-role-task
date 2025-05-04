"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/", match: (pathname: string) => pathname === "/" },
  { label: "Apartments", href: "/apartments", match: (pathname: string) => pathname === "/apartments" || pathname.startsWith("/apartments/") },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link href="/" className="logo">Apartments App</Link>
        <input type="checkbox" id="nav-toggle" className="nav-toggle" />
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive ? "active" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
} 