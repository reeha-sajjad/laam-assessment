import { NextResponse } from "next/server";
import { getProductById } from "@/lib/productRepository";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.productId || !body.size) {
    return NextResponse.json(
      { error: "productId and size are required." },
      { status: 400 }
    );
  }

  const product = await getProductById(body.productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const sizeEntry = product.sizes.find((s) => s.size === body.size);

  // Never trust the client's idea of stock — re-validate server-side.
  // This guards against a stale page (someone else bought the last unit
  // between page load and click) as well as a tampered request.
  if (!sizeEntry || sizeEntry.stock <= 0) {
    return NextResponse.json(
      { error: `Size ${body.size} is no longer available.` },
      { status: 409 }
    );
  }

  // No real cart/order persistence in this demo — see README (Scope, Future Improvements).
  return NextResponse.json({
    ok: true,
    productId: body.productId,
    size: body.size,
    action: body.action ?? "add-to-cart",
  });
}
