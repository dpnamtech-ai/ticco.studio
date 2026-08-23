import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ProductForm from "../../ProductForm";
import { updateProduct } from "../../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).single();

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-8">
          Sửa: {product.name}
        </h1>
        <ProductForm action={updateProduct.bind(null, id)} product={product} />
      </div>
    </div>
  );
}
