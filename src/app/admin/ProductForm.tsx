"use client";

type Product = {
  id: string;
  name: string;
  category: string;
  price_from: number;
  unit: string;
  image: string | null;
  description: string;
  variants: string[];
  specs: string[];
  note: string | null;
  sold_out: boolean;
};

export default function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void;
  product?: Product;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">
          ID (slug trong URL, vd <code>so-can-ban</code> — không đổi được sau khi tạo)
        </label>
        <input
          name="id"
          required
          defaultValue={product?.id}
          readOnly={!!product}
          className="w-full border border-black/15 rounded-lg px-3 py-2 disabled:bg-black/5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
        <input name="name" required defaultValue={product?.name} className="w-full border border-black/15 rounded-lg px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Danh mục</label>
          <input
            name="category"
            required
            defaultValue={product?.category}
            placeholder="Văn phòng phẩm / In ấn / Túi xách / Thời trang / Phụ kiện đời sống"
            className="w-full border border-black/15 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Đơn vị</label>
          <input name="unit" defaultValue={product?.unit ?? "sản phẩm"} className="w-full border border-black/15 rounded-lg px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Giá (VNĐ, để 0 nếu chưa có giá — sẽ hiện &quot;Liên hệ&quot;)</label>
        <input
          type="number"
          name="price_from"
          min={0}
          defaultValue={product?.price_from ?? 0}
          className="w-full border border-black/15 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ảnh (đường dẫn trong /public, vd /images/ten-anh.png)</label>
        <input name="image" defaultValue={product?.image ?? ""} className="w-full border border-black/15 rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          className="w-full border border-black/15 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Biến thể (mỗi dòng 1 loại, vd Size M / Size L)</label>
        <textarea
          name="variants"
          rows={3}
          defaultValue={product?.variants?.join("\n")}
          className="w-full border border-black/15 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Thông số (mỗi dòng 1 dòng specs)</label>
        <textarea
          name="specs"
          rows={4}
          defaultValue={product?.specs?.join("\n")}
          className="w-full border border-black/15 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lưu ý (không bắt buộc)</label>
        <input name="note" defaultValue={product?.note ?? ""} className="w-full border border-black/15 rounded-lg px-3 py-2" />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="sold_out" defaultChecked={product?.sold_out} />
        <span className="text-sm font-medium">Hết hàng</span>
      </label>
      <button type="submit" className="bg-[var(--color-purple)] text-white font-semibold px-6 py-3 rounded-lg">
        {product ? "Lưu thay đổi" : "Tạo sản phẩm"}
      </button>
    </form>
  );
}
