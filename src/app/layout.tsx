import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavAuth } from "@/components/layout/nav-auth";
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

  return (
    <html
      lang="ru"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-8 text-sm">
            <Link href="/" className="font-bold text-primary tracking-tight">
              Хладоны
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/companies" className="text-muted-foreground hover:text-foreground transition-colors">Компании</Link>
              <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">Мероприятия</Link>
              <Link href="/documents" className="text-muted-foreground hover:text-foreground transition-colors">Документы</Link>
              {session && (
                <Link href="/packages" className="text-muted-foreground hover:text-foreground transition-colors">Пакеты</Link>
              )}
            </div>
            <span className="flex-1" />
            <NavAuth />
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
