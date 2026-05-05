// app/layout.tsx
import StoreProvider from "@/components/StoreProvider";
import { SessionProvider } from "next-auth/react"; // 1. Import this
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* 2. Wrap children in SessionProvider */}
        <SessionProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}