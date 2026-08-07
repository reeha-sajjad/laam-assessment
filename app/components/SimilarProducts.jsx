import Image from "next/image";
import Link from "next/link";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SimilarProducts({ products }) {
  if (!products.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 py-16 border-t border-black/10">
      <h2 className="font-[family-name:var(--font-display)] text-2xl mb-1">
        Not quite right? Try these instead
      </h2>
      <p className="text-sm text-black/50 mb-8">
        Similar style, price, and category — picked from current stock.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-black/5 overflow-hidden mb-3">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
            {/* <div className="text-xs text-black/40">{p.brand}</div> */}
            <div className="text-sm leading-snug">{p.name}</div>
            <div className="text-sm font-medium mt-1">
              {formatPrice(p.price, p.currency)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
