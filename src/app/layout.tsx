import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavAuth } from "@/components/layout/nav-auth";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { getSession } from "@/lib/session";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Хладоны — B2B рынок России",
  description: "Каталог компаний, мероприятия и нормативные документы рынка хладагентов",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()

  const navLinks = [
    { href: "/catalog", label: "Каталог" },
    { href: "/companies", label: "Компании" },
    { href: "/events", label: "Мероприятия" },
    { href: "/documents", label: "Документы" },
    ...(session ? [{ href: "/packages", label: "Пакеты" }] : []),
  ]

  return (
    <html
      lang="ru"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6 text-sm">
            <Link href="/" className="font-bold text-primary tracking-tight shrink-0">
              Хладоны
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks links={navLinks} />
            </div>

            <span className="flex-1" />

            {/* Desktop auth */}
            <div className="hidden md:flex">
              <NavAuth />
            </div>

            {/* Mobile hamburger */}
            <MobileMenu links={navLinks} email={session?.username} />
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
