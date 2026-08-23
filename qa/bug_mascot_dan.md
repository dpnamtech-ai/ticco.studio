### BÁO CÁO FIX BUG TRANG MASCOT DẦN (Dành cho Claude)

Claude, trang `mascot-dan/page.tsx` đang có lỗi cực nặng về responsive do bạn dùng absolute % positioning cho khối Bio (3 mascot xếp hàng dọc). Hãy thay thế toàn bộ theo cấu trúc DOM chuẩn Flexbox dưới đây:

**1. Nếu đoạn "cống hiến và sống chiến" cần hiện đủ 3 ảnh (Khối nền xám)**
Tìm dòng: `{i === 0 && ( <Image src="/images/dan-laptop.png"... /> )}` 
Bỏ điều kiện `i === 0` đi để cả 3 cột đều hiện Mascot Đần.

**2. Làm lại hoàn toàn khối Bio (3 con Đần và thanh ngang màu tím)**
Hãy xóa hẳn thẻ `<div className="relative w-full max-w-7xl mx-auto aspect-[1280/607]...` chứa các mảng `x, y, w, h` và map lại giao diện bằng cấu trúc Flex sau:

```tsx
<div className="w-full overflow-hidden pb-20 space-y-16 md:space-y-10">
  {/* Row 1: Mascot Cheer (Bar from Left) */}
  <div className="relative flex items-center min-h-[220px]">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[60%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
    <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-6 md:gap-16">
      <div className="relative w-[150px] md:w-[200px] aspect-square flex-shrink-0 md:ml-[35%]">
        <Image src={mascotPage.bio[0].image} alt="" fill className="object-contain" />
      </div>
      <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
        {mascotPage.bio[0].text}
      </p>
    </div>
  </div>

  {/* Row 2: Mascot Lift (Bar from Right) */}
  <div className="relative flex items-center min-h-[220px]">
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[60%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
    <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
      <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
        {mascotPage.bio[1].text}
      </p>
      <div className="relative w-[220px] md:w-[316px] aspect-[316/228] flex-shrink-0 md:mr-[15%]">
        <Image src={mascotPage.bio[1].image} alt="" fill className="object-contain" />
      </div>
    </div>
  </div>

  {/* Row 3: Mascot Phone (Bar from Right) */}
  <div className="relative flex items-center min-h-[220px]">
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] md:w-[55%] h-8 md:h-10 bg-[var(--color-purple)] -z-10" />
    <div className="w-full max-w-5xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center md:items-start justify-center md:justify-end gap-6 md:gap-16">
      <p className="text-[var(--color-purple)] font-medium text-sm md:text-base leading-snug max-w-xs whitespace-pre-line text-center md:text-left">
        {mascotPage.bio[2].text}
      </p>
      <div className="relative w-[180px] md:w-[223px] aspect-square flex-shrink-0 md:mr-[30%]">
        <Image src={mascotPage.bio[2].image} alt="" fill className="object-contain" />
      </div>
    </div>
  </div>
</div>
```
