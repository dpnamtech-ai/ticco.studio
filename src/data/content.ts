export const brand = {
  name: "Tíc Cơ",
  shortName: "tíc cơ",
  slogan: "Đời dễ ợt,\nvợt Tíc Cơ.",
  instagram: "https://www.instagram.com/ticco.studios",
  facebook: "https://www.facebook.com/ticco.studios",
  threads: "https://www.threads.net/@ticco.studios",
  tiktok: "https://www.tiktok.com/@ticco.trongdoi",
  email: "ticcoo.studio@gmail.com",
  address: "Nhận ký gửi tại TP. Hồ Chí Minh",
  mission:
    "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.\n\nChúng tôi hướng tới việc lan toả lối sống phóng khoáng, xởi lởi và tích cực, bước đi cùng người trẻ trong hành trình phát triển mình và khám phá cuộc sống hàng ngày theo những góc nhìn mới.",
};

export const navLinks = [
  { label: "Về Tíc Cơ", href: "/ve-tic-co" },
  { label: "Sản phẩm", href: "/san-pham", dropdown: true },
  { label: "Khám phá", href: "/kham-pha", dropdown: true },
  { label: "Mascot Dần", href: "/mascot-dan" },
];

export const productCategories = [
  "Văn phòng phẩm",
  "In ấn",
  "Túi xách",
  "Thời trang",
  "Phụ kiện đời sống",
];

export const productLines = [
  {
    id: "so-can-ban",
    name: "BST Sổ Căn Bản",
    category: "Văn phòng phẩm",
    priceFrom: 255000,
    unit: "box",
    image: "/images/so-can-ban-hero.png",
    description:
      "Ai cũng bắt đầu từ việc viết tay. Học bài viết vở, nhật ký viết sổ, lao động ghi chú. Công nghệ khiến trải nghiệm ghi chép đơn giản và tiện lợi, nhưng cảm giác đưa bút trên giấy lại tăng sự tập trung tỉ mẩn và truyền thêm cảm hứng sáng tạo.\n\nNhư một bước để đưa bạn thực hành sự chú tâm hàng ngày, bộ sưu tập Sổ Căn Bản là tập hợp 03 cuốn sổ phục vụ cho hoạt động cần thiết trong đời sống — Sổ trống, Sổ nhật ký, Sổ lao động.",
    variants: ["Sổ trống", "Sổ nhật ký", "Sổ lao động", "Bộ 3 sổ"],
    specs: [
      "Định lượng giấy ruột sổ: 80gsm",
      "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày",
      "Số trang: 160 trang",
      "Kích thước: 12.6 x 17.8cm",
    ],
    note: "Mua bộ 03 sổ tặng kèm hộp ngoài. Không kèm theo hộp khi mua sổ lẻ.",
  },
  {
    id: "so-nghi-di",
    name: "Sổ Nghỉ Đi",
    category: "Văn phòng phẩm",
    priceFrom: 150000,
    unit: "sổ",
    description:
      "Tíc Cơ có một cuốn sổ để nhắc bạn Nghỉ đi! Làm nhiều thì dễ mệt, mệt nhiều thì nghỉ đi. Sổ Nghỉ đi nằm trong hộp quà Nghỉ Đi, hợp tác bởi Tíc Cơ và Freezedom trong chiến dịch 'Thu Rồi Nghỉ Đi'!",
    specs: [
      "Kích thước: size B6 (12.5 x 17.6cm)",
      "Chất liệu: giấy kraft",
      "Số trang: 196 trang không kể bìa, ruột sổ chấm dot",
      "Khâu chỉ keo gáy",
      "Trong sổ bao gồm 8 trang minh hoạ chủ đề Nghỉ đi",
    ],
  },
  {
    id: "sticker-01-doi-de-ot",
    name: "Sticker 01: Đời Dễ Ợt",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Là set sticker đầu tiên mà Tíc Cơ mở bán, mang tinh thần mà chúng tôi mong muốn lan toả: Đời dễ ợt như là ăn kẹo, bóc stickers dễ ợt như là bóc kẹo, đời dễ ợt khi mà mình dám sống. Sẵn sàng hành trình nhìn lại cuộc đời theo một cách nhìn khác!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-02-nguoi-viet-yeu-nuoc",
    name: "Sticker 02: Người Việt Yêu Nước",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Lấy cảm hứng từ cờ Hội Việt Nam với 5 màu sắc đặc trưng rực rỡ, Người Việt Yêu Nước là set sticker nhỏ theo bạn mỗi ngày, cùng bạn mang tinh thần Việt và sống một đời sống Việt.\n\nTrên là cờ đỏ sao vàng, dưới là tấc đất nước mình, trong tim là dòng máu chảy về cội nguồn.",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-03-hay-ho",
    name: "Sticker 03: Hay Ho",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Chắc như đinh đóng cột, bạn là người hay ho! Dân chơi chính hiệu, người sống phong cách, tay đua cool cuốn, chính là set sticker dành cho bạn!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-04-ca-hoa",
    name: "Sticker 04: Cà Hoa",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Thích đi cà phê, thích ngắm hoa ngắm lá, thích lãng mạn cuộc đời, Cà Hoa dành cho mọi người yêu cuộc đời!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-05-ban-lam-duoc-ma",
    name: "Sticker 05: Bạn Làm Được Mà",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Chuyện khó thì làm từ từ, chuyện dễ thì làm cẩn thận, chuyện gì rồi cũng sẽ thành. Dán sticker Bạn làm được mà và nhẩm kỹ khẩu hiệu này mỗi ngày mỗi tháng!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-06-doi-moi",
    name: "Sticker 06: Đời Mới",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Đời mới khi mình mới. Mọi điều cũ hoá mới, mọi điều mới hoá vui, mang tinh thần phơi phới sẵn sàng đón mọi điều sắp tới!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-07-dan-noi",
    name: "Sticker 07: Đần Nói",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Vô tri nhưng không vô nghĩa, đấy là cách mà Đần chơi với đời. Một set sticker thấm nhuần tinh thần và lối sống Đần — đời dễ ợt nên sống dễ chịu với chính mình thôi!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-08-dan-lao-dong",
    name: "Sticker 08: Đần Lao Động",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Sống và cống hiến, làm và sống chiến, không ngừng lao động. Đần tiếp nối tinh thần lao động của người đồng bào mình và đưa tinh thần ấy vào một set sticker!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "sticker-09-chuc-nhau-that-su",
    name: 'Sticker 09: Chúc Nhau Thật Sự',
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    description:
      "Thuộc BST 'Chúc Tết Nhau Thật Sự' — thay cho lời chúc bằng lời, một set sticker nhỏ để bạn gửi gián tiếp những lời chúc thành thật, chúc sức khoẻ, chúc bình an, chúc vững bền, chúc mọi điều. Hơn cả một lời nói ngắn, dán câu chúc bên cạnh để nhắc mình nhớ, nhắc ai đừng quên, nhắc nhau cho mọi ngày!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm",
    ],
  },
  {
    id: "postcard-nguoi-viet-yeu-nuoc",
    name: "Postcard Người Việt Yêu Nước",
    category: "In ấn",
    priceFrom: 90000,
    unit: "set",
    description:
      "Từ đời sống, từ hơi thở, từ chất liệu hàng ngày, tinh thần Việt sống ở trong từng ngóc ngách. Tôn trọng và nương tựa những người chảy chung một dòng máu, người Việt mình chất, người Việt đẳng cấp, người Việt có nhau!",
    specs: ["Một set gồm 03 tấm", "Kích thước: 10.5 x 15cm", "Chất liệu: giấy mỹ thuật"],
  },
  {
    id: "bst-postcard-triet-ly-song-dan",
    name: 'BST Postcard "Triết Lý Sống Đần"',
    category: "In ấn",
    priceFrom: 30000,
    unit: "tấm",
    description:
      "Đần là quản gia của Tíc Cơ, Đần yêu tự do, yêu lao động, thích trải nghiệm ưa tận hưởng, sống đời vô tri nhưng không vô nghĩa. Vì có lẽ đến cuối cùng mình chỉ muốn sống 'đần' và không phải lo nghĩ gì nhiều, 'Triết lý sống Đần' bởi thế mà ra đời, dành để tặng mình tặng người tặng nhau!",
    variants: [
      "Lối sống 3 không",
      "Cười vì điều nhỏ",
      "Hạnh phúc là tự thân",
      "Lao động với mọi sự chỉn chu, chăm chú và say mê",
      "Đời nhỏ tí, đừng xé to",
    ],
    specs: ["Chất liệu: giấy mỹ thuật cao cấp", "Kích thước: 10.5 x 14.8cm", "Định lượng giấy: 300gsm"],
    note: "Mua bộ 05 tấm (BST đầy đủ): 120.000 VNĐ.",
  },
  {
    id: "box-set-tim-kiem-dieu-ky-dieu",
    name: 'Box Set "Tìm Kiếm Điều Kỳ Diệu"',
    category: "In ấn",
    priceFrom: 200000,
    unit: "box set",
    description:
      "Đời thực kỳ diệu khi mình dành thời gian chú tâm ngó nhìn. Hơn cả một-cái-hộp, box set 'TÌM KIẾM ĐIỀU KỲ DIỆU' dẫn bạn đi vào khu phố Tíc Cơ, quan sát đời sống trên mặt phẳng, chúng tôi mong được làm bạn bất giác mỉm cười khi khám phá ra những điều giấu kín trong bản đồ ấy.\n\nMột sản phẩm để bạn thấy hàng ngày chẳng phải bình thường, một sản phẩm để bạn mở ra ngắm nhìn, một sản phẩm để tặng nhau chẳng nhân dịp gì!",
    specs: [
      "01 box, chất liệu craft cứng",
      "01 tấm bản đồ",
      "01 set cards (gồm 10 tấm card điều kỳ diệu)",
      "01 tờ hướng dẫn sử dụng",
    ],
  },
  {
    id: "li-xi-2026",
    name: "Lì Xì 2026",
    category: "In ấn",
    priceFrom: 85000,
    unit: "bộ",
    soldOut: true,
    description:
      "Thuộc BST 'Chúc Tết Nhau Thật Sự' — câu chúc đi trước, lì xì ngay sau. Tết về qua những phong lì xì màu sắc người ta hân hoan gửi nhau, mong muốn chúc nhau sức khoẻ, may mắn, niềm vui và tỉ ti thứ tốt đẹp trên đời. Chúc ngắn gọn mặt trước, thủ thỉ dài dài mặt sau, Tíc Cơ gửi lời chúc Tết qua bộ lì xì 2026, không hề sáo rỗng hay cho có, như một lời thì thầm gửi tới nhau mùa năm mới!",
    specs: [
      "Một bộ gồm 06 lì xì (chỉ bán theo bộ)",
      "Kích thước: 8 x 16cm",
      "Chất liệu: giấy mỹ thuật",
      "Màu sắc bên ngoài có sự chênh lệch nhẹ",
    ],
  },
  {
    id: "than-chu-nam-moi-2026",
    name: "Thần Chú Năm Mới 2026",
    category: "In ấn",
    priceFrom: 130000,
    unit: "thần chú",
    description:
      "Thuộc BST 'Chúc Tết Nhau Thật Sự' — sản phẩm giới hạn hàng năm, ra mắt duy nhất vào đầu năm mới. Với tinh thần vận động toàn dân chúc Tết nhau thật sự, Thần Chú Năm Mới 2026 dưới hình thức một cuốn lịch cầm tay mini, đan xen với những câu chúc quen thuộc gần gũi, Tíc Cơ đơn giản là muốn nói: mấy câu chúc thuận miệng ấy vốn không hề qua loa, khi người ta nói ra từ sự chân thành và quý mến!",
    specs: ["Lịch 12 tháng", "Kích thước: 9 x 9cm", "Chất liệu: giấy mỹ thuật ánh ngọc trai"],
  },
  {
    id: "gile-yen-tam",
    name: "Gile Yên Tâm",
    category: "Thời trang",
    priceFrom: 540000,
    unit: "chiếc",
    description:
      "Thuộc BST 'Chúc Tết Nhau Thật Sự' — đầu năm yên tâm, một năm yên tâm, cả đời yên tâm. Mọi điều an lành khi bạn yên ở tâm. Tíc Cơ gọi đây là một chiếc gile đơn giản, sẵn sàng để bạn khoác lên mình sự yên tâm và khởi đầu cho một năm thật trơn tru.",
    variants: ["Size M", "Size L", "Size XL"],
    specs: ["Chất liệu: kaki thô", "Màu sắc: xanh rêu", "Form suông, chữ thêu"],
  },
  {
    id: "ao-phong-thoai-mai",
    name: "Áo Phông Thoải Mái",
    category: "Thời trang",
    priceFrom: 300000,
    unit: "chiếc",
    soldOut: true,
    description:
      "Nghĩ đơn giản, làm thoải mái, sống giản đơn, mặc Thoải Mái! Giống như hoạt động đầu tiên trong ngày là chọn quần chọn áo, ăn mặc thoải mái là bước đầu để giữ cho mình một tinh thần thoải mái!",
    variants: ["Size M", "Size L", "Size XL"],
    specs: ["Chất liệu: cotton 2 chiều", "Màu sắc: đen & trắng"],
  },
  {
    id: "khan-bandana-van-su-tuy-minh",
    name: 'Khăn Bandana "Vạn Sự Tuỳ Mình"',
    category: "Thời trang",
    priceFrom: 140000,
    unit: "chiếc",
    description:
      "Đời của mình, đời do mình, vì bàn tay ta làm nên tất cả, mọi điều đến và đi là do cách mình đón nhận và hành động. Một chiếc khăn để Đần đưa bạn vào miền tự do. Năng nổ, màu sắc, phóng khoáng, chủ động, sống như là Đần, vạn sự là tuỳ vào bản thân mình!",
    variants: ["Xanh lá", "Tím"],
    specs: ["Chất liệu: lụa vân xước", "Kích thước: 70 x 70cm"],
  },
  {
    id: "tote-xoi-loi-voi-doi",
    name: "Tote Bag Xởi Lởi Với Đời",
    category: "Túi xách",
    priceFrom: 320000,
    unit: "túi",
    description:
      "Nhắc mình xởi lởi, chuyện gì rồi cũng sẽ qua. Một chiếc túi đồng hành cùng bạn trong đời, đeo Xởi lởi với đời trên vai để nhắc mình hân hoan mỗi ngày!",
    specs: [
      "Có khoá bấm, ngăn nhỏ đựng đồ, móc nhỏ treo keychain",
      "Chất liệu: vải jeans sọc xanh",
      "Kích thước đáy: 38.5 x 15cm",
      "Chiều cao túi: 30cm",
      "Độ dài quai: 65cm",
    ],
  },
  {
    id: "tui-ngu-du",
    name: "Túi Ngủ Đủ",
    category: "Túi xách",
    priceFrom: 350000,
    unit: "túi",
    description:
      "Lấy cảm hứng từ cái gối đưa bạn vào giấc, làm từ chất vải chần bông và chất liệu êm ru, một chiếc túi êm như gối, trông như gối, nhìn là muốn kê lên nằm, một chiếc túi nhắc bạn ngủ đủ, ngủ đủ và ngủ đủ!",
    specs: [
      "Chất liệu: vải gió chần bông",
      "Quai túi có thể điều chỉnh độ dài nút thắt",
      "Túi tròn nhỏ có thể tháo rời",
      "Đường kính (túi lớn): 23cm — Đường kính (túi bé): 9cm",
      "Dây quai: 120cm (khi chưa thắt nút)",
    ],
  },
  {
    id: "tui-thuyen",
    name: "Túi Thuyền",
    category: "Túi xách",
    priceFrom: 360000,
    unit: "túi",
    soldOut: true,
    description:
      "Ra biển để ra khơi, ra khơi để thử điều mới. Lấy cảm hứng từ chiếc thuyền miền biển, Tíc Cơ ra mắt Túi Thuyền, nhắc mình cứ việc ra khơi và xông pha, thử cái này cái kia và dám không ngừng đi lên!",
    specs: [
      "Đứng form dày dặn, hai ngăn nhỏ bên trong, có khoá kéo",
      "Chất liệu: vải gió dù dày, chống thấm nước",
      "Quai túi có thể điều chỉnh độ dài (130cm - 160cm)",
      "Kích thước đáy túi: 13 x 30cm",
      "Chiều cao túi: (trên: 45cm - dưới: 30cm - cao: 29cm)",
    ],
  },
  {
    id: "bst-dan-sinh-ton",
    name: "BST Đần Sinh Tồn",
    category: "Phụ kiện đời sống",
    priceFrom: 165000,
    unit: "set",
    description:
      "Đần đồng hành cùng bạn qua mọi cung bậc cảm xúc và mọi giai đoạn trong đời. Bộ sưu tập bao gồm 03 móc khoá Đần tạo thành một vòng lặp sinh tồn, sẵn sàng cùng bạn sống một đời vui khoẻ và có ích!",
    variants: [
      "Đần Cứ Bình Tĩnh",
      "Đần Nuốt Nước Mắt Vào Trong",
      "Đần Vắt Cực Khô, Sống Cực Căng",
    ],
    specs: [
      "Một set gồm: 1 box đựng, 1 gấu bông Đần, 1 piece mica trong suốt",
      "Kích thước: 12cm cả móc treo (có sai số nhẹ)",
    ],
    note: "Mua 2 set giảm 5%, mua 3 set giảm 10%.",
  },
  {
    id: "lot-coc-ra-khoi",
    name: "Lót Cốc Ra Khơi",
    category: "Phụ kiện đời sống",
    priceFrom: 85000,
    unit: "cái",
    description:
      "Mọi cuộc hải trình đều bắt đầu từ việc ra khơi. Đưa tinh thần ấy vào đời sống hàng ngày, Tíc Cơ ra mắt sản phẩm lót cốc Ra Khơi, lót bước đệm cho mọi bước đi bạn dám xông pha!",
    specs: [
      "Chất liệu: vải thô chần bông, thấm nước",
      "Màu sắc: xanh rêu, hoạ tiết sọc",
      "Kích thước: 10 x 10cm (có sai số nhẹ)",
      "Sản phẩm may máy thủ công, có độ hoàn thiện riêng, không tuyệt đối đồng nhất",
    ],
  },
  {
    id: "bst-dau-doi-mu-chan-vao-doi",
    name: "BST Đầu Đội Mũ, Chân Vào Đời",
    category: "Phụ kiện đời sống",
    priceFrom: 320000,
    unit: "chiếc",
    soldOut: true,
    description:
      "Một cú hợp tác bởi Neenee và Tíc Cơ! Không có mũ cũng được, nhưng có thì còn vui hơn. Biến mấy thứ mình đội hàng ngày thêm màu sắc và vào mood! Đầu đội mũ nâng cao tinh thần, chân cứ thế mà hoan hỷ nhảy vào đời!",
    variants: ['Mũ tai bèo "Ha Ha"', 'Mũ lưỡi trai "Chả Sao"'],
    specs: [
      "Mũ tai bèo 'Ha Ha': chất liệu kaki, đội được 2 mặt, kèm 2 màu dây (rêu, kem), nút bấm ở mặt màu kem, 2 size S (55-57cm) / M (58-60cm)",
      "Mũ lưỡi trai 'Chả Sao': chất liệu kaki, mũi ngắn, vành cứng, có dây chỉnh size",
    ],
  },
  {
    id: "keychain-nguoi-viet-yeu-nuoc",
    name: 'Keychain "Người Việt Yêu Nước"',
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    description:
      "Đi cùng bạn trên mọi nẻo đường, yêu nước bắt đầu từ những điều nhỏ. Tiếp nối với set sticker cùng tên, Tíc Cơ ra mắt keychain dành cho người yêu nước Việt, tạo ra tiếng 'leng keng' cho đời!",
    specs: ["Kích thước: 6-8cm/piece", "Chất liệu: mica cứng", "Một set gồm 2 piece"],
  },
  {
    id: "keychain-uoc-duoc-lam-con-cho",
    name: 'Keychain "Ước Được Làm Con Chó"',
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    description:
      "Thi thoảng đời nó khó, chẳng sao nếu có ngồi xuống nghỉ tí, làm một con chó nằm dài chỉ việc ngắm nhìn cuộc đời. Nghỉ ngơi, hít thở, lấy đà, vặn ga, phóng vào đời, hôm nay Tíc Cơ cùng bạn ước được làm con chó!",
    specs: ["Kích thước: 6-8cm/piece", "Chất liệu: mica cứng", "Một set gồm 2 piece"],
  },
  {
    id: "keychain-khong-so-cuoc-doi",
    name: 'Keychain "Không Sợ Cuộc Đời"',
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    description:
      "Đời toàn chuyện cỏn con, chuyện lớn hóa chuyện nhỏ, chuyện nhỏ hóa ra chẳng có gì. Không sợ hãi và lo nghĩ nhiều, Tíc Cơ có keychain 'Không sợ cuộc đời' dành cho mọi trái tim can trường!",
    specs: ["Kích thước: 6-8cm/piece", "Chất liệu: mica cứng", "Một set gồm 2 piece"],
  },
];

export const collections = [
  {
    id: "so-can-ban",
    name: "Bộ Sưu Tập Sổ Căn Bản",
    description: "Sổ trống, sổ nhật ký, sổ lao động — bộ 3 cuốn cho việc ghi chép hàng ngày.",
    season: "2026",
    items: 3,
    color: "#F9D9BC",
  },
  {
    id: "carry",
    name: "Túi Sống Cừ Khôi",
    description: "Túi tote, túi đeo chéo — đựng được cả ngày dài.",
    season: "2026",
    items: 8,
    color: "#E5FF00",
  },
  {
    id: "in-an",
    name: "Bộ Sưu Tập Đần Sinh Tồn",
    description: "Postcard, lịch bàn — mấy thứ nhỏ để bàn làm việc bớt nhàm.",
    season: "2026",
    items: 6,
    color: "#E3D3F5",
  },
];

export const giftGuides = [
  {
    occasion: "Sinh nhật",
    emoji: "🎂",
    tagline: "Không cần đắt, chỉ cần đúng ý.",
    picks: ["BST Sổ Căn Bản", "Móc Khoá Dần", "Combo tự chọn"],
    color: "#F9D9BC",
    seoTag: "quà tặng sinh nhật",
  },
  {
    occasion: "Valentine",
    emoji: "🌸",
    tagline: "Nhỏ thôi, nhưng ngọt lắm.",
    picks: ["Postcard Dần", "Combo sổ tay + móc khoá"],
    color: "#E5FF00",
    seoTag: "quà valentine ý nghĩa",
  },
  {
    occasion: "Quà đồng nghiệp",
    emoji: "☕",
    tagline: "Vừa dễ thương, vừa không awkward.",
    picks: ["Sổ Tay Đời Thường", "Túi Tote Canvas"],
    color: "#E3D3F5",
    seoTag: "quà tặng đồng nghiệp",
  },
  {
    occasion: "Không cần dịp",
    emoji: "✨",
    tagline: "Vì 'tao nghĩ đến mày' không cần lý do.",
    picks: ["Bất kỳ thứ gì Đần xuất hiện"],
    color: "#F9D9BC",
    seoTag: "quà nhỏ dễ thương",
  },
];

export const projects = [
  {
    id: "freezedom-thu-roi-nghi-di",
    group: "hop-tac",
    title: "Tíc Cơ x Freezedom: Thu rồi nghỉ đi",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "neenee-dau-doi-mu-chan-vao-doi",
    group: "hop-tac",
    title: "Tíc Cơ x Neenee: Đầu đội mũ, chân vào đời",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "le-hoi-doc-lap",
    group: "event",
    title: "Tíc Cơ tại Khu vực trải nghiệm Lễ Hội Độc Lập",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "nguoi-viet-van-dong",
    group: "rieng",
    title: "Người Việt Vận Động",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "chuc-tet-nhau-that-su",
    group: "rieng",
    title: "Chúc Tết Nhau Thật Sự",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "tet-o-rat-gan",
    group: "rieng",
    title: "Tết Ở Rất Gần",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "lam-moi-doi-di",
    group: "rieng",
    title: "Làm Mới Đời Đi",
    productHref: "/san-pham",
    articleHref: "#",
  },
  {
    id: "minh-trong-nha-nha-trong-nuoc",
    group: "rieng",
    title: "Mình trong nhà, nhà trong nước",
    productHref: "/san-pham",
    articleHref: "#",
  },
];

export const aboutPage = {
  intro: [
    "Bắt đầu từ việc quan sát đời sống theo những góc nhìn mới, Tíc Cơ ra đời với ý tưởng về một thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo do người trẻ Việt thiết kế.",
    "Lấy cảm hứng từ chất liệu đời thường, chú tâm vào tinh thần và lối sống người Việt: câu chữ mẹ đẻ, tinh thần hào sảng, thái độ xởi lởi, lao động hăng say,..",
    "Những điều bình thường và chân thật được ghi lại với một thái độ khác — vui, nghệ, gần gũi.",
  ],
  mission: [
    "Châm ngôn là làm mọi thứ với niềm vui giản đơn và sự tò mò với đời.",
    "Tíc Cơ mong muốn lan toả lối sống phóng khoáng và tích cực, bước đi cùng bạn trong hành trình phát triển mình và khám phá cuộc sống hàng ngày theo những góc nhìn mới.",
  ],
  statement: {
    left: ["nghệ", "một", "cách", "đời thường"],
    right: ["ai", "cũng", "có", "gu"],
  },
  closing: {
    heading: "Tíc Cơ hân hoan chào bạn!",
    born: "khai sinh từ 2024",
  },
};

export const mascotPage = {
  headline: "“Sống Đần lên!”",
  quote: [
    "Chẳng phải đến cuối cùng",
    "mình cũng chỉ muốn sống vui khoẻ,",
    "chẳng lo nghĩ gì nhiều và cười ngốc nghếch thôi sao?",
  ],
  tagline: "Vô tri nhưng không vô nghĩa, Đần là Đần thôi!",
  traitCaption: "cống hiến và sống chiến",
  introBanner:
    "Đần là quản gia của Tíc Cơ, đại diện thay mặt chúng tôi truyền tải thông tin đến bạn!",
  bio: [
    {
      image: "/images/dan-cheer.png",
      text: "Ra đời vào 6/2024\nĐịa lý: không có địa chỉ thường trú (Tíc Cơ ở đâu thì Đần ở đấy)\nHọc vấn: trường đời",
    },
    {
      image: "/images/dan-lift.png",
      text: "Hướng tới cuộc sống tự do, vô tri nhưng không vô nghĩa, yêu lao động, vui thì làm mà không vui thì vui",
    },
    {
      image: "/images/dan-phone.png",
      text: "Nhảy híp hóp, cười khà khà, thích làm thơ con cóc và kể chuyện này chuyện kia\nHành vi phương tiện: Online 24/7, gọi là có, đến là đón",
    },
  ],
  closingHeading: "Mấy thứ ngố ngố làm bạn sống vui vui!",
  closingBanner: "Lan toả lối sống Đần qua các sản phẩm Tíc Cơ:",
};

export const ugcPhotos = [
  { id: 1, caption: "@user1 • sổ căn bản trên bàn làm việc 📓", color: "#E3D3F5" },
  { id: 2, caption: "@user2 • mang tote đi cafe ☕", color: "#F9D9BC" },
  { id: 3, caption: "@user3 • móc khoá Dần mới 🔑", color: "#E5FF00" },
  { id: 4, caption: "@user4 • postcard dán tường phòng trọ 🖼️", color: "#F9D9BC" },
  { id: 5, caption: "@user5 • combo quà sinh nhật 🎂", color: "#E3D3F5" },
  { id: 6, caption: "@user6 • lịch bàn Tíc Cơ 🗓️", color: "#E5FF00" },
];
