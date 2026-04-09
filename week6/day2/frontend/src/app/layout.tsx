import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHOP.CO | Ecommerce & Loyalty",
  description: "Ecommerce website with loyalty points system, built with Next.js and NestJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
