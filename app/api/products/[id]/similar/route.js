import { NextResponse } from "next/server";
import { getSimilarProducts } from "@/lib/productRepository";

export async function GET(request, { params }) {
  const { id } = await params;
  const similar = await getSimilarProducts(id, 4);
  return NextResponse.json(similar);
}
