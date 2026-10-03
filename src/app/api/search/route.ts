import { NextResponse, type NextRequest } from "next/server";
import { cleanQuery, search } from "@/lib/search";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

// GET /api/search?q=…&lang=en — results for the search drawer (only the fields it shows).
export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  const { products, content } = await search(cleanQuery(req.nextUrl.searchParams.get("q")), isLang(lang) ? lang : DEFAULT_LANG);
  return NextResponse.json({
    products: products.map(({ id, name, image, priceFrom, soldOut }) => ({ id, name, image, priceFrom, soldOut })),
    content,
  });
}
