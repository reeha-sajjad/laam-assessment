import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProductById,
  getSimilarProducts,
  estimateDeliveryDate,
} from "@/lib/productRepository";
import PurchasePanel from "@/app/components/PurchasePanel";
import SimilarProducts from "@/app/components/SimilarProducts";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? `${product.name} | LAAM` : "Product | LAAM" };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const similar = await getSimilarProducts(id, 4);
  const estimatedDelivery = estimateDeliveryDate(product.deliveryDays);

  return (
    <>
      <div className="max-w-6xl mx-auto px-5 py-8 grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-black/5 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.sizes.every((s) => s.stock === 0) && (
            <span className="absolute bottom-3 left-3 bg-black text-white text-[11px] tracking-wide px-2.5 py-1">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Info + purchase panel */}
        <div>
          <div className="text-sm text-black/50">{product.brand}</div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl mt-1 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-black/50 mb-6">
            <span>★ {product.rating}</span>
            <span>&middot;</span>
            <span>{product.reviewCount} reviews</span>
          </div>

          <PurchasePanel product={product} estimatedDelivery={estimatedDelivery} />

          <p className="text-sm text-black/60 leading-relaxed mt-8 border-t border-black/10 pt-6">
            {product.description}
          </p>
        </div>
      </div>

      <SimilarProducts products={similar} />
    </>
  );
}
