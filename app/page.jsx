import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/productRepository";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-1">
        New In
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-black/5 overflow-hidden mb-3">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
            <div className="text-xs text-black/40">{p.brand}</div>
            <div className="text-sm leading-snug">{p.name}</div>
            <div className="text-sm font-medium mt-1">
              {formatPrice(p.price, p.currency)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
