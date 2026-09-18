import { brand } from "@/data/content";

const social = [
  ["Facebook", "Tíc Cơ Studios", brand.facebook],
  ["Instagram", "ticco.studios", brand.instagram],
  ["Threads", "ticco.studios", brand.threads],
  ["TikTok", "Tíc Cơ trong đời", brand.tiktok],
] as const;

// Figma "footer": purple 1283x337 band, 4 text blocks (heading + 3 columns).
export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[var(--color-purple)] text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-0 py-12 md:py-0 md:h-[337px] md:relative text-base leading-[19px]">
        <p className="text-[35px] leading-[35px] font-medium uppercase md:absolute md:left-[81px] md:top-[61px] mb-10 md:mb-0">
          Tíc Cơ
          <br />
          hân hoan
          <br />
          chào bạn!
        </p>
        <div className="grid gap-8 sm:grid-cols-3 md:block">
          <p className="md:absolute md:left-[572px] md:top-[149px] md:whitespace-nowrap">
            Liên hệ trao đổi công việc:
            <br />
            <a href={`mailto:${brand.email}`} className="hover:underline break-all">
              {brand.email}
            </a>
          </p>
          <p className="md:absolute md:left-[783px] md:top-[149px] md:whitespace-nowrap">
            @ Tíc Cơ Studios
            <br />
            khai sinh từ 2024
          </p>
          <div className="md:absolute md:right-[103px] md:top-[148px] md:whitespace-nowrap md:text-right">
            <p className="mb-[19px]">Gặp Tíc Cơ nhiều hơn tại:</p>
            {social.map(([name, handle, href]) => (
              <p key={name}>
                {name}:{" "}
                <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {handle}
                </a>
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
