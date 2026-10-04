# Infra check — 2026-10-04 19:08 UTC

Target: https://ticcostudios.com · **27/27 pass**

| | check | detail |
|---|---|---|
| PASS | TLS certificate valid > 21 days | 89 days left, authorized=true |
| PASS | http -> https | 308 https://ticcostudios.com/ |
| PASS | www serves the site | 200  |
| PASS | home 200 + fast (< 1.5 s) | 200 in 175 ms |
| PASS | header strict-transport-security | max-age=31536000; includeSubDomains |
| PASS | header x-content-type-options | nosniff |
| PASS | header referrer-policy | strict-origin-when-cross-origin |
| PASS | can't be framed (X-Frame-Options or CSP frame-ancestors) | DENY |
| PASS | /vi/... redirects to the unprefixed page | 308 /san-pham |
| PASS | /en pages served |  |
| PASS | unknown page -> 404 | 404 |
| PASS | unknown product -> 404 | 404 |
| PASS | /admin closed (404 or login redirect, never 200/500) | 404 |
| PASS | sitemap.xml lists both languages | 126 urls |
| PASS | robots.txt points at the sitemap |  |
| PASS | llms.txt |  |
| PASS | asset /favicon.ico | 200 image/vnd.microsoft.icon |
| PASS | asset /favicon-48.png | 200 image/png |
| PASS | asset /icon-512.png | 200 image/png |
| PASS | asset /apple-touch-icon.png | 200 image/png |
| PASS | asset /images/qr-thanh-toan.jpg | 200 image/jpeg |
| PASS | home <title> is 'Tíc Cơ' | <title>Tíc Cơ</title> |
| PASS | link preview: og:title / og:description / og:image | Tíc Cơ / Thương hiệu Việt với các sản phẩm tiêu d… / https://ticcostudios.com/images/hero-basket.png |
| PASS | canonical + hreflang on home |  |
| PASS | GET /api/orders refused (405) |  |
| PASS | POST /api/orders validates (empty order -> 422, nothing written) | 422 |
| PASS | search API answers | 7 products |
