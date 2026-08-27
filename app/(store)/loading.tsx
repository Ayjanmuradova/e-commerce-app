export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6">
      <div className="h-8 w-48 rounded bg-stone-200" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] rounded-2xl bg-stone-200" />
        ))}
      </div>
    </div>
  );
}
