'use client'

import { MobileNav } from "@/components/ui/mobile-nav";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen w-full flex flex-col bg-gray-50">
        <MobileNav />
        <main className="flex-grow w-full max-w-full px-0">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <Link 
                  href="/" 
                  className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
                >
                  CV Builder Pro
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  Create professional CVs with ease
                </p>
              </div>
              <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link 
                  href="/templates" 
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Templates
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/settings"
                  aria-current={window.location.pathname === '/settings' ? 'page' : undefined}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Settings
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Privacy
                </Link>
              </nav>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} CV Builder Pro. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
