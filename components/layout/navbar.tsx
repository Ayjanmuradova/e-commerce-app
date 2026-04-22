import Link from "next/link";
import { isAdmin, getSessionUser } from "@/lib/authz";

export default async function Navbar() {
  
 const user = await getSessionUser();//
 const isUserAdmin = isAdmin(user);

  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl text-indigo-600">
        E-commerce
      </Link>

      <nav className="flex items-center gap-4 text-sm">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>

        {isUserAdmin && (
          <Link href="/admin/products/new" className="text-indigo-600 font-meduim hover:underline">
            New Product
          </Link>
        )}

        {user ? (
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