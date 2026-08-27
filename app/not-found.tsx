import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-stone-500">
        That page does not exist, or the product has been removed.
      </p>
      <Link
        href="/products"
        className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
      >
        Back to shop
      </Link>
    </div>
  );
}
