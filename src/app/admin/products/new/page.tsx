import ProductForm from "../../ProductForm";
import { createProduct } from "../../actions";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)] mb-8">
          Thêm sản phẩm
        </h1>
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
