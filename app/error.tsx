"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-stone-500">
        The store hit an unexpected error. Try again, or return to the homepage.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
