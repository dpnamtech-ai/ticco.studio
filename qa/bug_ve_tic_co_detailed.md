### BÁO CÁO FIX BUG GIAO DIỆN `ve-tic-co` DÀNH CHO CLAUDE

Claude, layout bạn vừa fix ở commit trước vẫn chưa chuẩn với Figma. Hãy sửa lại file `src/app/ve-tic-co/page.tsx` tuân thủ CHÍNH XÁC cấu trúc DOM và Tailwind sau đây, tuyệt đối không tự chế thêm:

**1. Sửa khối Hero (Xóa mảng BUBBLES cũ đi, đưa Bubble vào trong từng cột)**
Thay thế toàn bộ thẻ `<div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16">` bằng cấu trúc sau:

```tsx
<div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16">
  {/* Cột 1 */}
  <div className="relative z-10 pt-10">
    <div className="absolute -z-10 rounded-[15%] bg-[#35165a] w-[140%] h-[140%] -top-10 -left-10" />
    <p className="text-lg md:text-xl leading-relaxed relative z-10 text-left">{aboutPage.intro[0]}</p>
  </div>

  {/* Cột 2: Phải có mt-20 để thụt xuống */}
  <div className="relative z-10 mt-20 space-y-6">
    <div className="absolute -z-10 rounded-[15%] bg-[#35165a] w-[120%] h-[140%] -top-10 -left-10" />
    <p className="text-white/90 relative z-10 text-left">{aboutPage.intro[1]}</p>
    <p className="text-white/90 relative z-10 text-left">{aboutPage.intro[2]}</p>
  </div>

  {/* Cột 3 */}
  <div className="flex flex-col space-y-10">
    <div className="text-right border-b-2 border-white pb-4 self-end">
      <h1 className="font-[family-name:var(--font-heading)] text-6xl font-extrabold leading-none uppercase">
        Về<br />Tíc<br />Cơ
      </h1>
    </div>
    <div className="relative z-10 space-y-6">
      <div className="absolute -z-10 rounded-[15%] bg-[#35165a] w-[140%] h-[140%] -top-10 -left-4" />
      {aboutPage.mission.map((p, i) => (
        <p key={i} className="text-white/90 leading-relaxed relative z-10 text-left">
          {p}
        </p>
      ))}
    </div>
  </div>
</div>
```

**2. Sửa khối Bottom Banner (Dưới cùng)**
Phần này thiết kế là 4 cột ngang nhau (1 row). Hãy thay thế toàn bộ khối thẻ section bằng cấu trúc sau:

```tsx
<section className="bg-[var(--color-orange)] text-white px-6 py-16">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Cột 1 */}
    <div>
      <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-extrabold leading-tight uppercase">
        TÍC CƠ<br />HÂN HOAN<br />CHÀO BẠN!
      </h2>
    </div>

    {/* Cột 2 */}
    <div className="text-sm text-white/90 space-y-1">
      <p>Liên hệ trao đổi công việc:</p>
      <p>{brand.email}</p>
    </div>

    {/* Cột 3 */}
    <div className="text-sm text-white/90 space-y-1">
      <p>@ Tíc Cơ Studios</p>
      <p>{aboutPage.closing.born}</p>
    </div>

    {/* Cột 4 */}
    <div className="text-sm text-white/90 space-y-1">
      <p>Gặp Tíc Cơ nhiều hơn tại:</p>
      <a href={brand.facebook} target="_blank" rel="noopener noreferrer" className="block hover:underline">
        Facebook: Tíc Cơ Studios
      </a>
      <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="block hover:underline">
        Instagram: ticco.studios
      </a>
      <a href={brand.threads} target="_blank" rel="noopener noreferrer" className="block hover:underline">
        Threads: ticco.studios
      </a>
      <a href={brand.tiktok} target="_blank" rel="noopener noreferrer" className="block hover:underline">
        TikTok: Tíc Cơ trong đời
      </a>
    </div>
  </div>
</section>
```
