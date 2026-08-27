import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-stone-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=80"
        alt="NORD electronics"
        fill
        priority
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
        <p className="text-sm uppercase tracking-[0.35em] text-white/70">Stockholm · Tech store</p>
        <p className="mt-4 max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl">
          Phones, audio, computers.
        </p>
        <p className="mt-5 max-w-lg text-lg text-white/80">
          NORD sells considered electronics — smartphones, headphones, laptops, and the accessories that go with them.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-stone-900 hover:bg-stone-100"
          >
            Shop tech
          </Link>
          <Link
            href="/category/audio"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            Headphones
          </Link>
        </div>
      </div>
    </section>
  );
}
