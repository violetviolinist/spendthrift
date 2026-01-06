import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Spendthrift",
  description: "Expense tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
