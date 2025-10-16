import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

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
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
