"use client";

import { useState } from "react";
import Image from "next/image";
import { productCategories } from "@/data/content";
import DescriptionEditor from "./DescriptionEditor";

type Product = {
  id: string;
  name: string;
  category: string;
  price_from: number;
  unit: string;
  image: string | null;
  thumbnails: string[] | null;
  description: string;
  variants: string[];
  specs: string[];
  note: string | null;
  sold_out: boolean;
  stock: number;
  bundle_items: { id: string; qty: number }[] | null;
};

// One image field: file upload (wins) + a text fallback for a manual URL/path, with a preview
// of whatever is already saved. Reused for the main image and each of the 2 thumbnail slots.
function ImageField({ field, label, value }: { field: string; label: string; value?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {value && (
        <Image src={value} alt="" width={96} height={96} className="w-24 h-24 object-cover rounded-lg mb-2 border border-black/10" />
      )}
      <input type="file" name={`${field}_file`} accept="image/*" className="w-full border border-black/15 rounded-lg px-3 py-2 mb-2" />
      <input
        name={field}
        defaultValue={value ?? ""}
        placeholder="hoặc dán URL/đường dẫn ảnh có sẵn"
        className="w-full border border-black/15 rounded-lg px-3 py-2 text-sm text-black/50"
      />
    </div>
  );
}

export default function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void;
  product?: Product;
}) {
  const [customCategory, setCustomCategory] = useState(!!product?.category && !productCategories.includes(product.category));

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
          {customCategory ? (
            <input
              name="category"
              required
              autoFocus
              defaultValue={product?.category}
              placeholder="Tên danh mục mới"
              className="w-full border border-black/15 rounded-lg px-3 py-2"
            />
          ) : (
            <select
              name="category"
              required
              defaultValue={product?.category ?? productCategories[0]}
              onChange={(e) => {
                if (e.target.value === "__custom__") setCustomCategory(true);
              }}
              className="w-full border border-black/15 rounded-lg px-3 py-2 bg-white"
            >
              {productCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">+ Danh mục khác...</option>
            </select>
          )}
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
        <label className="block text-sm font-medium mb-1">Tồn kho</label>
        <input
          type="number"
          name="stock"
          min={0}
          defaultValue={product?.stock ?? 0}
          className="w-full border border-black/15 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <ImageField field="image" label="Ảnh chính" value={product?.image ?? undefined} />
        <p className="text-xs text-black/40 mt-1">Chọn ảnh để tải lên (ưu tiên) hoặc dán URL nếu ảnh đã có sẵn ở nơi khác.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ImageField field="thumb_0" label="Ảnh phụ 1" value={product?.thumbnails?.[0]} />
        <ImageField field="thumb_1" label="Ảnh phụ 2" value={product?.thumbnails?.[1]} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <DescriptionEditor name="description" defaultValue={product?.description} />
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
        <label className="block text-sm font-medium mb-1">
          Bộ sản phẩm (combo — không bắt buộc). Mỗi dòng 1 sản phẩm con theo ID, vd <code>so-trong</code> hoặc{" "}
          <code>so-trong 2</code> nếu bộ gồm 2 quyển. Để trống nếu đây là sản phẩm bán lẻ bình thường.
        </label>
        <textarea
          name="bundle_items"
          rows={3}
          defaultValue={product?.bundle_items?.map((b) => (b.qty > 1 ? `${b.id} ${b.qty}` : b.id)).join("\n")}
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
