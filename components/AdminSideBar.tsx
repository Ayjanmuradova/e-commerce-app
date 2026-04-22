import Link from "next/link";

export default function AdminSideBar() {
    return(
        <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 hidden md:block">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
            </div>
            <nav className="flex flex-col gap-2 px-4 mt-4">
                <Link href="/admin" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                    Dashboard
                </Link>
                <Link href="/admin/products" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                    All Products
                </Link>
                <Link href="/admin/products/new" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                    Add New Product
                </Link>
                <Link href="/admin/orders" className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                    Orders
                </Link>
            </nav>

        </aside>
    );
}