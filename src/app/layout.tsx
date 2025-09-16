import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Providers } from "@/components/providers";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/ui/mobile-nav";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Builder Pro",
  description: "Create professional CVs with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="cv-builder-theme">
          <Providers>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <ThemeToggle />
              <MobileNav />
              
              {/* Header */}
              <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      CV Builder Pro
                    </h1>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                      <Link href="/templates" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Templates
                      </Link>
                      <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Pricing
                      </Link>
                      <div className="flex items-center space-x-4">
                        <Link 
                          href="/auth/signin" 
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link 
                          href="/dashboard" 
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Get Started
                        </Link>
                      </div>
                    </nav>
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1">
                {children}
              </main>

              {/* Footer */}
              <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    © 2024 CV Builder Pro. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
