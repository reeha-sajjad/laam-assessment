import { NextResponse } from "next/server";
import { getProductById, estimateDeliveryDate, totalStock } from "@/lib/productRepository";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...product,
    estimatedDelivery: estimateDeliveryDate(product.deliveryDays),
    inStockTotal: totalStock(product.sizes),
  });
}
