export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="aspect-square rounded-3xl bg-stone-200" />
      <div className="space-y-4 pt-6">
        <div className="h-4 w-24 rounded bg-stone-200" />
        <div className="h-10 w-2/3 rounded bg-stone-200" />
        <div className="h-6 w-32 rounded bg-stone-200" />
        <div className="h-24 w-full rounded bg-stone-200" />
      </div>
    </div>
  );
}
