import type { Product } from "@/lib/products";
import type { ImageTransform } from "@/lib/figmaCrop";

// Product cards exactly as placed in the DEMO Figma frames (generated from .figma-cache/demo/*.json): each card
// uses its own Figma photo + crop (imageTransform m, box aspect ar), name copy (with line breaks) and price
// text, in reading order.
type FigmaCard = { id: string; img: string; m: ImageTransform; ar: number; name: string; price: string };

export const HOME_FEATURED: FigmaCard[] = [
  { id: "so-can-ban", img: "26f455ea91307277bc01af1057c1e6a7e3ad7ad6", m: [[0.94144, 0, 0.04955], [0, 0.99826, 0.00087]], ar: 0.75451, name: "BỘ SƯU TẬP SỔ CĂN BẢN", price: "255.000 VNĐ" },
  { id: "tui-song-cu-khoi", img: "49ed335455d55ceb3c5617fba6bbb556634841e3", m: [[0.97582, 0, 0.02621], [0, 0.86231, 0.10436]], ar: 0.75451, name: "TÚI SỐNG CỪ KHÔI", price: "355.000 VNĐ" },
  { id: "bst-dan-sinh-ton", img: "ef4ef25a6a8f4a710f9fd609c193d5f2f856275e", m: [[0.5875, -0.02424, 0.23522], [0.01234, 0.51541, 0.31492]], ar: 0.76173, name: "BỘ SƯU TẬP\nĐẦN SINH TỒN", price: "165.000 VNĐ" },
  { id: "gile-yen-tam", img: "e3bb3efef65e3164986172913836d0c9834070d4", m: [[0.82609, 0, 0.05453], [0, 0.87603, 0.12433]], ar: 0.75451, name: "GILE YÊN TÂM", price: "540.000 VNĐ" },
];

export const HOME_CATEGORY: FigmaCard[] = [
  { id: "box-set-tim-kiem-dieu-ky-dieu", img: "00ed240b6839f517b382232a87b0d82ff6a3a2b6", m: [[0.62563, 0, 0.21089], [0, 0.54962, 0.29728]], ar: 0.75812, name: "BOXSET TÌM KIẾM\nĐIỀU KỲ DIỆU", price: "200.000 VNĐ" },
  { id: "gile-yen-tam", img: "e3bb3efef65e3164986172913836d0c9834070d4", m: [[0.83399, 0, 0.05453], [0, 0.87603, 0.12433]], ar: 0.76173, name: "GILE YÊN TÂM", price: "540.000 VNĐ" },
  { id: "bst-dan-sinh-ton", img: "ef4ef25a6a8f4a710f9fd609c193d5f2f856275e", m: [[0.6345, -0.02618, 0.21574], [0.01333, 0.55665, 0.28074]], ar: 0.76173, name: "BỘ SƯU TẬP\nĐẦN SINH TỒN", price: "165.000 VNĐ" },
  { id: "so-can-ban", img: "26f455ea91307277bc01af1057c1e6a7e3ad7ad6", m: [[0.94144, 0, 0.04955], [0, 0.99826, 0.00087]], ar: 0.75451, name: "BỘ SƯU TẬP\nSỔ CĂN BẢN", price: "255.000 VNĐ" },
  { id: "tui-song-cu-khoi", img: "49ed335455d55ceb3c5617fba6bbb556634841e3", m: [[0.97582, 0, 0.02621], [0, 0.86231, 0.10436]], ar: 0.75451, name: "TÚI SỐNG CỪ KHÔI", price: "355.000 VNĐ" },
  { id: "sticker-07-dan-noi", img: "3d650bab8dc0f5d72c72283231dec776c2ca9ec8", m: [[0.70639, 0, 0.14548], [0, 0.62175, 0.21922]], ar: 0.75725, name: "SET STICKER 07:\nĐẦN NÓI", price: "65.000 VNĐ" },
  { id: "tui-vung-vang", img: "696a948dbd52efaf23bbc2d9de80036d2647c1d0", m: [[0.91266, 0, 0.03984], [0, 0.8065, 0.15412]], ar: 0.75451, name: "TÚI VỮNG VÀNG", price: "265.000 VNĐ" },
  { id: "sticker-05-ban-lam-duoc-ma", img: "5ff6b4f225ebfc43bc34e32606fe86f88c1fa527", m: [[0.71584, 0, 0.14117], [0, 0.63234, 0.24547]], ar: 0.75451, name: "SET STICKER 05:\nBẠN LÀM ĐƯỢC MÀ", price: "65.000 VNĐ" },
  { id: "khan-bandana-van-su-tuy-minh", img: "b02ab0f314e5bcf9fa14e5833302b9ac612d5089", m: [[0.72345, 0, 0.13854], [0, 0.64238, 0.17746]], ar: 0.7509, name: "BANDANA\nVẠN SỰ TUỲ MÌNH", price: "140.000 VNĐ" },
  { id: "tote-xoi-loi-voi-doi", img: "5e314c6822b69042209605df5465620aca291bae", m: [[0.80974, 0, 0.1187], [0, 0.809, 0.05188]], ar: 0.7509, name: "TÚI XỞI LỞI VỚI ĐỜI", price: "320.000 VNĐ" },
  { id: "lot-coc-ra-khoi", img: "0c42dbdde44f81e4db9b9eaaee899d0fa8ff4524", m: [[0.63409, 0, 0.1763], [0, 0.56034, 0.26829]], ar: 0.75451, name: "LÓT CỐC RA KHƠI", price: "85.000 VNĐ" },
  { id: "bst-postcard-triet-ly-song-dan", img: "d0d34833c9a6fa41716c2b284225c18e5fd5eacc", m: [[0.72674, 0, 0.16552], [0, 0.74898, 0.05136]], ar: 0.75451, name: "SET POSTCARD\nTRIẾT LÝ SỐNG ĐẦN", price: "120.000 VNĐ" },
];

export const MASCOT_GRID: FigmaCard[] = [
  { id: "bst-dan-sinh-ton", img: "ef4ef25a6a8f4a710f9fd609c193d5f2f856275e", m: [[0.6345, -0.02618, 0.21574], [0.01333, 0.55665, 0.28074]], ar: 0.76173, name: "BỘ SƯU TẬP\nĐẦN SINH TỒN", price: "165.000 VNĐ" },
  { id: "sticker-07-dan-noi", img: "3d650bab8dc0f5d72c72283231dec776c2ca9ec8", m: [[0.70639, 0, 0.14548], [0, 0.62175, 0.21922]], ar: 0.75725, name: "SET STICKER 07:\nĐẦN NÓI", price: "65.000 VNĐ" },
  { id: "sticker-08-dan-lao-dong", img: "510012b54d1bcbd94cb9923ce3fcc0d95060d2e9", m: [[0.72002, 0, 0.14588], [0, 0.63527, 0.2064]], ar: 0.75451, name: "SET STICKER 08:\nĐẦN LAO ĐỘNG", price: "65.000 VNĐ" },
  { id: "sticker-09-chuc-nhau-that-su", img: "9113ff9c37a8a0d99474fc70aa5298d7b1f5f347", m: [[0.72393, 0, 0.13479], [0, 0.63741, 0.22871]], ar: 0.75725, name: "SET STICKER 09:\nCHÚC NHAU THẬT SỰ", price: "65.000 VNĐ" },
  { id: "khan-bandana-van-su-tuy-minh", img: "b02ab0f314e5bcf9fa14e5833302b9ac612d5089", m: [[0.72345, 0, 0.13854], [0, 0.64238, 0.17746]], ar: 0.7509, name: "BANDANA\nVẠN SỰ TUỲ MÌNH", price: "140.000 VNĐ" },
  { id: "postcard-ban-hoi-toi-y-nghia-cuoc-doi", img: "fb9d0bd247f522eb3fdf1e008db65380135165d3", m: [[0.64007, 0, 0.20817], [0, 0.56833, 0.30348]], ar: 0.7509, name: "POSTCARD\nBẠN HỎI TÔI Ý NGHĨA CUỘC ĐỜI", price: "90.000 VNĐ" },
  { id: "bst-postcard-triet-ly-song-dan", img: "8bbe29285991058e0d74a7c4f611ed8ad8da3921", m: [[0.94144, 0, 0.02849], [0, 0.99826, 0.00087]], ar: 0.75451, name: "BST POSTCARD\nTRIẾT LÝ SỐNG ĐẦN", price: "120.000 VNĐ" },
  { id: "so-nghi-di", img: "cd855dd03b918695a0f161a5e550b7502901ef71", m: [[0.86722, 0, 0.0658], [0, 0.9195, 0.00083]], ar: 0.75451, name: "SỔ NGHỈ ĐI", price: "150.000 VNĐ" },
];

/** ProductCard props for a Figma card; falls back to the Figma copy if the product is not in the catalog. */
export function figmaCardProps(card: FigmaCard, products: Product[]) {
  const p = products.find((x) => x.id === card.id);
  return {
    ...(p ?? { id: card.id, name: card.name.replace(/\n/g, " "), priceFrom: 0 }),
    image: `/images/figma/${card.img}.webp`,
    crop: { src: card.img, m: card.m, ar: card.ar },
    displayName: card.name,
    priceLabel: card.price,
  };
}
