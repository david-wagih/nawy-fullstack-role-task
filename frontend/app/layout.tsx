import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./layout.scss";
import Link from "next/link";
import Providers from "@/components/Providers";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apartments App",
  description: "A modern black and white apartment listing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // For SSR/SSG, fallback to "" (no highlight)
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <nav className="main-nav">
            <div className="nav-container">
              <Link href="/" className="logo">Apartments App</Link>
              <input type="checkbox" id="nav-toggle" className="nav-toggle" />
              <label htmlFor="nav-toggle" className="nav-toggle-label">
                <span></span>
              </label>
              <ul className="nav-links">
                <li>
                  <Link
                    href="/"
                    className={pathname === "/" ? "font-bold underline" : undefined}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/apartments"
                    className={pathname.startsWith("/apartments") ? "font-bold underline" : undefined}
                  >
                    Apartments
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main className="main-content">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
