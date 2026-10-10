import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin-check";
import { describeShipRule } from "@/lib/checkout";
import { getShipRule } from "@/lib/ship-rule";
import { saveShipRule } from "../actions";
import SubmitButton from "../SubmitButton";

const ROWS = 6;
const input = "border border-black/20 rounded-lg px-3 py-2 w-32 text-right";

export default async function AdminShipping({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const {
    data: { user },
  } = await (await supabaseServer()).auth.getUser();
  if (!isAdmin(user)) redirect("/admin/login");

  const rule = await getShipRule();
  const rows = [...rule.tiers, ...Array(Math.max(0, ROWS - rule.tiers.length)).fill({ maxItems: null, fee: null })] as {
    maxItems: number | null;
    fee: number | null;
  }[];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--color-purple)]">Phí ship</h1>
          <Link href="/admin" className="border border-black/20 px-5 py-2.5 rounded-lg font-semibold">
            ← Sản phẩm
          </Link>
        </div>

        <p className="mb-6 rounded-xl bg-white p-4 text-sm">
          <b>Đang áp dụng:</b> {describeShipRule(rule)}.
        </p>
        {saved && <p className="mb-6 rounded-xl bg-green-100 p-4 text-sm font-semibold text-green-800">Đã lưu. Trang thanh toán dùng phí mới ngay.</p>}
        {error && <p className="mb-6 rounded-xl bg-red-100 p-4 text-sm font-semibold text-red-700">{error}</p>}

        <form action={saveShipRule} className="rounded-2xl bg-white p-6 space-y-6">
          <div>
            <h2 className="font-bold mb-1">Phí theo số sản phẩm trong đơn</h2>
            <p className="text-sm text-black/50 mb-4">
              Mỗi dòng: đơn có tới bao nhiêu sản phẩm thì tính phí bao nhiêu. Để trống ô số sản phẩm ở dòng cuối = &quot;trở lên&quot;. Dòng để trống cả hai ô sẽ bị bỏ qua.
            </p>
            <div className="space-y-2">
              {rows.map((r, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="w-16 text-black/50">Mức {i + 1}</span>
                  <span>Đến</span>
                  <input name="maxItems" inputMode="numeric" defaultValue={r.maxItems ?? ""} placeholder="trở lên" className={input} />
                  <span>sản phẩm: phí</span>
                  <input name="fee" inputMode="numeric" defaultValue={r.fee ?? ""} placeholder="vd 23000" className={input} />
                  <span>đ</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-bold mb-1">Miễn phí ship</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span>Đơn từ</span>
              <input name="freeFrom" inputMode="numeric" defaultValue={rule.freeFrom ?? ""} placeholder="không miễn phí" className={input} />
              <span>đ trở lên được miễn phí ship (để trống = không miễn phí).</span>
            </div>
          </div>
          <SubmitButton className="bg-[var(--color-purple)] text-white font-semibold px-6 py-3 rounded-lg">Lưu phí ship</SubmitButton>
        </form>
      </div>
    </div>
  );
}
