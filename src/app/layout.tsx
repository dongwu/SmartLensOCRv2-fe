import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Lens OCR",
  description: "Premium Developer-Managed OCR Service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
