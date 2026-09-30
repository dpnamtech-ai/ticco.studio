import { NextResponse, type NextRequest } from "next/server";
import { cleanQuery, search } from "@/lib/search";

// GET /api/search?q=… — results for the search drawer (only the fields it shows).
export async function GET(req: NextRequest) {
  const { products, content } = await search(cleanQuery(req.nextUrl.searchParams.get("q")));
  return NextResponse.json({
    products: products.map(({ id, name, image, priceFrom, soldOut }) => ({ id, name, image, priceFrom, soldOut })),
    content,
  });
}
