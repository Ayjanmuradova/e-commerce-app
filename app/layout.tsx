import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { getSessionUser } from "@/lib/authz";
import { GUEST_STORAGE_USER } from "@/lib/user-storage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NORD — Phones, audio, computers",
    template: "%s · NORD",
  },
  description:
    "NORD is a tech store for smartphones, headphones, computers, tablets, and accessories.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();
  const userKey =
    typeof user?.sub === "string" && user.sub.length > 0
      ? user.sub
      : GUEST_STORAGE_USER;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider userKey={userKey}>
          <FavoritesProvider userKey={userKey}>{children}</FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
