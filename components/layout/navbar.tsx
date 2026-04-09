// components/layout/navbar.tsx
import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function Navbar() {
  // Auth0 v4'te session server-side okunuyor
  // Bu fonksiyon her request'te çalışır
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl text-indigo-600">
        E-commerce
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link href="/products" className="text-gray-600 hover:text-gray-900">
          Products
        </Link>

        {user ? (
          // Kullanıcı giriş yapmışsa
          <>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-gray-900"
            >
              {user.name ?? user.email}
            </Link>
            
             <a href="/auth/logout"
              className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600"
            >
              Logout
            </a>
          </>
        ) : (
          // Giriş yapmamışsa
          <>
            
             <a href="/auth/login"
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Login
            </a>
            
             <a href="/auth/login?screen_hint=signup"
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
            >
              Sign Up
            </a>
          </>
        )}
      </nav>
    </header>
  );
}