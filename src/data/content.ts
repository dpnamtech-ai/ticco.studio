export const brand = {
  name: "Tíc Cơ",
  shortName: "tíc cơ",
  slogan: "Đời dễ ợt,\nvợt Tíc Cơ.",
  instagram: "https://www.instagram.com/ticco.studios",
  facebook: "https://www.facebook.com/ticco.studios",
  threads: "https://www.threads.net/@ticco.studios",
  tiktok: "https://www.tiktok.com/@ticco.studios",
  email: "ticcoo.studio@gmail.com",
  address: "Nhận ký gửi tại TP. Hồ Chí Minh",
  mission:
    "Tíc Cơ là thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo lấy cảm hứng từ chất liệu đời thường, do người trẻ Việt thiết kế.\n\nChúng tôi hướng tới việc lan toả lối sống phóng khoáng, xởi lởi và tích cực, bước đi cùng người trẻ trong hành trình phát triển mình và khám phá cuộc sống hàng ngày theo những góc nhìn mới.",
};

export const navLinks = [
  { label: "Về Tíc Cơ", href: "/ve-tic-co" },
  { label: "Sản phẩm", href: "/san-pham", dropdown: true },
  {
    label: "Khám phá",
    href: "/kham-pha",
    dropdown: true,
    children: [
      { label: "Dự án riêng", href: "/kham-pha#du-an-rieng" },
      { label: "Dự án chung tay hợp tác", href: "/kham-pha#du-an-hop-tac" },
      { label: "Sự kiện", href: "/kham-pha#su-kien" },
    ],
  },
  { label: "Mascot Đần", href: "/mascot-dan" },
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
    id: "tui-vung-vang",
    name: "Túi Vững Vàng",
    category: "Túi xách",
    priceFrom: 265000,
    unit: "túi",
    image: "/images/figma/4b9813af3b98a31255145a5e41ce9782b2efa0e9.webp",
    thumbnails: [
      "/images/figma/e8d0e4521fb2b59bcc22db33966ec48820ba1314.webp",
      "/images/figma/8f7fccc2f282fea48e8a76b1b55c759f03a28aca.webp",
      "/images/figma/5c3f3364bce2c426f4773b6e0d6aee39a17d51f3.webp",
      "/images/figma/1709ae5b045917daa88b71947ade71e44eaf44a8.webp"
    ],
    description: "Từ khoá quan trọng bạn cần có lẽ là vững-vàng.\n\nCông việc ngổn ngang, tương lai mơ hồ, tình cảm trục trặc, đời sống chẳng khi nào như cách mình mong muốn. Thế nên nếu không thể xoay chuyển càn khôn thì cần giữ tinh thần vững vàng dám đón nhận mọi điều.\n\nSáng màu, tối giản, đậm nét, một chiếc túi vững vàng để bạn vững vàng đeo hàng ngày!",
    specs: [
      "Vải kaki canvas 100% cotton",
      "Kỹ thuật in lụa",
      "Chiều cao thân túi: 38.5cm",
      "Chiều rộng thân túi: 40cm",
      "Tổng độ dài quai: 60cm"
    ]
  },
  {
    id: "khan-bandana-van-su-tuy-minh",
    name: "Bandana Vạn Sự Tuỳ Mình",
    category: "Thời trang",
    priceFrom: 140000,
    unit: "chiếc",
    image: "/images/figma/b02ab0f314e5bcf9fa14e5833302b9ac612d5089.webp",
    thumbnails: [
      "/images/figma/8f4aeb957cd3457bf7ced840994302423451bed4.webp",
      "/images/figma/a818503a6987cbd3d8d463eced5aa7a5057b5487.webp",
      "/images/figma/e1ec588d839e0bd2ae8e31653878336330700c6f.webp",
      "/images/figma/942ff2c862f7049d1367b487d9d1cdfd7ca65813.webp"
    ],
    description: "Đời của mình, đời do mình, vì bàn tay ta làm nên tất cả, mọi điều đến và đi là do cách mình đón nhận và hành động. Một chiếc khăn để Đần đưa bạn vào miền tự do. Năng nổ, màu sắc, phóng khoáng, chủ động, sống như là Đần, vạn sự là tuỳ vào bản thân mình!",
    variants: [
      "Xanh lá",
      "Tím"
    ],
    specs: [
      "Chất liệu: lụa vân xước",
      "Kích thước: 70x70cm",
      "Màu sắc: xanh lá, tím"
    ]
  },
  {
    id: "gile-yen-tam",
    name: "Gile Yên Tâm",
    category: "Thời trang",
    priceFrom: 540000,
    unit: "chiếc",
    image: "/images/figma/e3bb3efef65e3164986172913836d0c9834070d4.webp",
    thumbnails: [
      "/images/figma/16fda81ca50e272583bd276c6e0cf99e6f5609ce.webp",
      "/images/figma/46697727376ef50b532473dc20a375e2c9d92b4c.webp",
      "/images/figma/c20d421ded6be34d64262808f1d25ba3af4f3948.webp",
      "/images/figma/4ba7b0e46d14120eadb6f9c6ce2a0fd5b74da2dc.webp"
    ],
    description: "Thuộc BST \"Chúc Tết Nhau Thật Sự\"\n\nĐầu năm yên tâm, một năm yên tâm, cả đời yên tâm. Mọi điều an lành khi bạn yên ở tâm. Tíc Cơ gọi đây là một chiếc gile đơn giản, sẵn sàng để bạn khoác lên mình sự yên tâm và khởi đầu cho một năm thật trơn tru.",
    variants: [
      "Size M",
      "Size L",
      "Size XL"
    ],
    specs: [
      "Chất liệu: kaki thô",
      "Màu sắc: xanh rêu",
      "Form suông, chữ thêu",
      "Size: M/L/XL"
    ]
  },
  {
    id: "tui-song-cu-khoi",
    name: "Túi Sống Cừ Khôi",
    category: "Túi xách",
    priceFrom: 355000,
    unit: "túi",
    image: "/images/figma/49ed335455d55ceb3c5617fba6bbb556634841e3.webp",
    thumbnails: [
      "/images/figma/673cbb53e3ca2dad0d5f7a9ffff936b872663924.webp",
      "/images/figma/f198dc24a10b50aba91ee812d5d6e7ef11d2ba12.webp",
      "/images/figma/6716280f777aaa7145a0fb5bda98963a75e9a1d2.webp",
      "/images/figma/0ce81e9b51a0ddd7a0d6a9680e8ce16c3e4f0563.webp"
    ],
    description: "Ai cũng có thể sống cừ khôi với chính cuộc đời mình!\n\nLàm thì làm cho nó tới, bắt đầu thì sẽ đi đến cuối, trọn vẹn và tâm huyết với những điều mình có, sống cho thật oách và khiến mình nể chính cuộc đời mình.\n\nKhẩu hiệu ngắn gọn và đơn giản, đó là tất cả những gì Tíc Cơ muốn nói với bạn qua một chiếc túi rực màu! Đeo túi hàng ngày cho đời sống khoẻ và cho cuộc đời cừ khôi!",
    specs: [
      "Vải dù gió nhăn, chữ thêu",
      "Lớp lót dày giữ form",
      "02 khoá bấm, bên trong chia ngăn",
      "Chiều rộng miệng túi: 60cm",
      "Chiều rộng đáy túi: 31x13cm",
      "Chiều cao thân túi: 28cm",
      "Tổng độ dài quai: 63cm"
    ]
  },
  {
    id: "tote-xoi-loi-voi-doi",
    name: "Túi Xởi Lởi Với Đời",
    category: "Túi xách",
    priceFrom: 320000,
    unit: "túi",
    image: "/images/figma/5e314c6822b69042209605df5465620aca291bae.webp",
    thumbnails: [
      "/images/figma/119485dabffc8f5f9f99e16a6db62fe0590a2824.webp",
      "/images/figma/c3017a415bc25687c8488bc720f3555113964d2a.webp",
      "/images/figma/97a707626fa8e531230cffc566b78daefba992d8.webp",
      "/images/figma/2686123db9b4c193dab84e3954a25b4f6b58267b.webp"
    ],
    description: "Nhắc mình xởi lởi, chuyện gì rồi cũng sẽ qua. Một chiếc túi đồng hành cùng bạn trong đời, đeo Xởi lởi với đời trên vai để nhắc mình hân hoan mỗi ngày!",
    specs: [
      "Có khoá bấm, ngăn nhỏ đựng đồ, móc nhỏ treo keychain",
      "Chất liệu: vải jeans sọc xanh",
      "Kích thước đáy: 38,5x15cm",
      "Chiều cao túi: 30cm",
      "Độ dài quai: 65cm"
    ]
  },
  {
    id: "bst-dan-sinh-ton",
    name: "BST móc khoá Đần Sinh Tồn",
    category: "Phụ kiện đời sống",
    priceFrom: 445000,
    unit: "BST 3 box",
    image: "/images/figma/ef4ef25a6a8f4a710f9fd609c193d5f2f856275e.webp",
    thumbnails: [
      "/images/figma/4ce44f4330ae8bc2fef5ac4b56d607aee3dacd70.webp",
      "/images/figma/96469be5dfa3d01b37bde51905a0a9d58ef20ec5.webp",
      "/images/figma/368d07ae0a72eaabf2d8258a8251108eb7dd7bdd.webp",
      "/images/figma/1828f0dd902e6e171a18989b5fc3dd36ab491e35.webp",
      "/images/figma/3192e63386fc8f154aa17a14297f5acb41297bbc.webp",
      "/images/figma/c60a39c7d1c58584d602762dffa7935dad47fd86.webp"
    ],
    description: "Đần đồng hành cùng bạn qua mọi cung bậc cảm xúc và mọi giai đoạn trong đời. Bộ sưu tập bao gồm 03 móc khoá Đần tạo thành một vòng lặp sinh tồn, sẵn sàng cùng bạn sống một đời vui khoẻ và có ích!",
    variants: [
      "01 - Đần cứ bình tình",
      "02 - Đần nuốt nước mắt vào trong",
      "03 - Đần vắt cực khô, sống cực căng",
      "BST 3 box"
    ],
    specs: [
      "Một set gồm: 1 box đựng, 1 gấu bông Đần, 1 piece mica trong suốt",
      "Kích thước: 12cm cả móc treo (có sai số nhẹ)"
    ],
    note: "Mua 2 set giảm 5%, mua 3 set giảm 10%"
  },
  {
    id: "lot-coc-ra-khoi",
    name: "Lót cốc Ra Khơi",
    category: "Phụ kiện đời sống",
    priceFrom: 85000,
    unit: "cái",
    image: "/images/figma/0c42dbdde44f81e4db9b9eaaee899d0fa8ff4524.webp",
    thumbnails: [
      "/images/figma/68f6557185e9e714ee1244405202bb3e030c7a3f.webp",
      "/images/figma/01ea6ab7f6b705b3cb9ae48edb920032001dc5ab.webp",
      "/images/figma/e7447cb384ea6ca3ee8180b98e113766c9c6c6da.webp",
      "/images/figma/1ef614e96a232a1624f0e6e91a35cfb574453fd6.webp"
    ],
    description: "Mọi cuộc hải trình đều bắt đầu từ việc ra khơi. Đưa tinh thần ấy vào đời sống hàng ngày, Tíc Cơ ra mắt sản phẩm lót cốc Ra Khơi, lót bước đệm cho mọi bước đi bạn dám xông pha!",
    variants: [
      "Hoạ tiết sọc",
      "Xanh rêu"
    ],
    specs: [
      "Chất liệu: vải thô chần bông, thấm nước",
      "Màu sắc: xanh rêu, hoạ tiết sọc",
      "Kích thước: 10x10cm (có sai số nhẹ)",
      "Sản phẩm may máy thủ công, có độ hoàn thiện riêng, không tuyệt đối đồng nhất"
    ]
  },
  {
    id: "con-dau-go-han-hoan",
    name: "Con dấu gỗ Hân Hoan",
    category: "Văn phòng phẩm",
    priceFrom: 155000,
    unit: "hộp",
    image: "/images/figma/13a318674676bd64965fed3edcc9ae81e46d1dcc.webp",
    thumbnails: [
      "/images/figma/be071f61853f0450e7cefd81680945e3b04003b3.webp",
      "/images/figma/daa728ad6ba78797a92b35f0f68a41afb7184302.webp",
      "/images/figma/ce452ac1f57c867975b3e6e499deb8e8e1782c9a.webp",
      "/images/figma/4b2628c4dd850a6b17353acfb7e21c26520b1109.webp"
    ],
    description: "Sản phẩm giới hạn Trung Thu 2026\n\nAi cũng từng là con nít! Ai cũng từng nhảy chân sáo líu lo, tròn xoe mắt tò mò với mọi thứ và phấn khích cười tít mắt với những niềm vui rất đỗi nhỏ nhặt.\n\nMột mùa lễ trăng rằm lại đến, chúng tôi quyết định để bạn nhớ lại niềm hân hoan của ngày nhỏ ấy bằng một sản phẩm giới hạn dịp lễ này. Một con dấu gỗ nho nhỏ, nằm trong cái hộp màu mè, vui những niềm hân hoan be bé, chơi Trung thu hoá ra chỉ cần có thế!",
    specs: [
      "Bao gồm:",
      "01 hộp đựng (kích thước 6.5x6.5cm)",
      "01 con dấu gỗ (đường kính 3.2cm)",
      "01 mực đỏ mini"
    ]
  },
  {
    id: "box-set-tim-kiem-dieu-ky-dieu",
    name: "Box set Tìm Kiếm Điều Kỳ Diệu",
    category: "In ấn",
    priceFrom: 200000,
    unit: "box set",
    image: "/images/figma/d5ab3991303c7ce24157da64f26aa375c11121fb.webp",
    thumbnails: [
      "/images/figma/d67f026df7b3950f48c9cbdd3497610b3fda9382.webp",
      "/images/figma/0c78bf6039dd291993366a70a48aaa08ff8b492d.webp",
      "/images/figma/8cdf5b2e4ba8054a06d13b5df0574a74d2e40e96.webp",
      "/images/figma/e1279b05d44aab0dcf3aa2779e4a4e1da3866778.webp",
      "/images/figma/c7e7e111b458cce0d6fbfddac0702046bae39a20.webp",
      "/images/figma/6e4ac41ab95270683be5355cc9b38cdcbcc9ed56.webp"
    ],
    description: "Đời thực kỳ diệu khi mình dành thời gian chú tâm ngó nhìn. Hơn cả một-cái-hộp, box set “TÌM KIẾM ĐIỀU KỲ DIỆU” dẫn bạn đi vào khu phố Tíc Cơ, quan sát đời sống trên mặt phẳng, chúng tôi mong được làm bạn bất giác mỉm cười khi khám phá ra những điều giấu kín trong bản đồ ấy.\n\nMột sản phẩm để bạn thấy hàng ngày chẳng phải bình thường, một sản phẩm để bạn mở ra ngắm nhìn, một sản phẩm để tặng nhau chẳng nhân dịp gì!",
    specs: [
      "Box set gồm:",
      "01 box, chất liệu craft cứng",
      "01 tấm bản đồ",
      "01 set cards (gồm 10 tấm card điều kỳ diệu)",
      "01 tờ hướng dẫn sử dụng"
    ]
  },
  {
    id: "so-can-ban",
    name: "BST Sổ Căn Bản",
    category: "Văn phòng phẩm",
    priceFrom: 255000,
    unit: "box",
    image: "/images/figma/8055ab6c91a7a98ccad3b697d171104fc7532db9.webp",
    thumbnails: [
      "/images/figma/dc14c9de483752a2ad9432120b54637a2c867900.webp",
      "/images/figma/b16d35436c642035e6a504cd49a8495c7debcf5e.webp",
      "/images/figma/d0d9afc8c453941fe4d6c2b8dc9528d9a7caba98.webp",
      "/images/figma/db031c9f3affb098ffdb05bf20a1c3c58ac655e5.webp",
      "/images/figma/16a3bb9ecc7c9830bdb7e9246007feea1aa78ce1.webp",
      "/images/figma/343596e9ef68b3551c42569815163c35eca6c585.webp"
    ],
    description: "Ai cũng bắt đầu từ việc viết tay. Công nghệ khiến trải nghiệm ghi chép đơn giản và tiện lợi, nhưng cảm giác đưa bút trên giấy lại tăng sự tập trung tỉ mẩn và truyền thêm cảm hứng sáng tạo.  Như một bước để đưa bạn thực hành sự chú tâm hàng ngày, bộ sưu tập Sổ Căn Bản là tập hợp 03 cuốn sổ phục vụ cho hoạt động cần thiết trong đời sống - Sổ trống, Sổ nhật ký, Sổ lao động.",
    variants: [
      "Sổ trống",
      "Sổ nhật ký",
      "Sổ lao động",
      "Bộ 3 sổ"
    ],
    specs: [
      "Định lượng giấy ruột sổ: 80gsm",
      "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày",
      "Số trang: 160 trang",
      "Kích thước: 12.6 x 17.8cm"
    ],
    note: "Mua bộ 03 sổ tặng kèm hộp ngoài\nKhông kèm theo hộp khi mua sổ lẻ"
  },
  {
    id: "bst-postcard-triet-ly-song-dan",
    name: "BST Postcard Triết Lý Sống Đần",
    category: "In ấn",
    priceFrom: 120000,
    unit: "tấm",
    image: "/images/figma/8bbe29285991058e0d74a7c4f611ed8ad8da3921.webp",
    thumbnails: [
      "/images/figma/81d38b67dae3dcd3e3270b531bd9f5257295f8eb.webp",
      "/images/figma/76b771e486169c6821c7829e01fa9771cf94c4b3.webp",
      "/images/figma/15be65ff0c36139802fd2c9257b810e0b74797cb.webp",
      "/images/figma/06566725cbd4fa5a87aabd7a4ec2a7af0a7668ad.webp",
      "/images/figma/930f31e2b7d02b18ae186cb2af4fc1b5f8ec1b6f.webp",
      "/images/figma/97a942b72f2994ee4ca043dcc2a0404f018fab5e.webp"
    ],
    description: "Đần là quản gia của Tíc Cơ, Đần yêu tự do, yêu lao động, thích trải nghiệm ưa tận hưởng, sống đời vô tri nhưng không vô nghĩa. Vì có lẽ đến cuối cùng mình chỉ muốn sống “đần” và không phải lo nghĩ gì nhiều, \"Triết lý sống Đần” bởi thế mà ra đời, dành để tặng mình tặng người tặng nhau!",
    variants: [
      "BST 5 tấm",
      "Lối sống 3 không",
      "Cười vì điều nhỏ",
      "Hạnh phúc là tự thân",
      "Lao động",
      "Đời nhỏ tí"
    ],
    specs: [
      "Chất liệu: giấy mỹ thuật cao cấp",
      "Kích thước: 10.5 x 14.8cm",
      "Định lượng giấy: 300gsm"
    ],
    note: "Có bán tấm rời"
  },
  {
    id: "sticker-01-doi-de-ot",
    name: "Set sticker 01: Đời Dễ Ợt",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/7ceaddb22e3c92a9baf2487cfa8c2ba2e6444f77.webp",
    thumbnails: [
      "/images/figma/378d930cd7a55fdc083a5c104263b07dcfdcd2d5.webp",
      "/images/figma/bf9ae0558cdef6240f82c8c5a00b6a971da5a79e.webp"
    ],
    description: "Là set sticker đầu tiên mà Tíc Cơ mở bán, mang tinh thần mà chúng tôi mong muốn lan toả: Đời dễ ợt như là ăn kẹo, bóc stickers dễ ợt như là bóc kẹo, đời dễ ợt khi mà mình dám sống. Sẵn sàng hành trình nhìn lại cuộc đời theo một cách nhìn khác!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-02-nguoi-viet-yeu-nuoc",
    name: "Set sticker 02: Người Việt Yêu Nước",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/1d15b48ee687701a6adb9ea58f72ceb7ef781649.webp",
    thumbnails: [
      "/images/figma/a72f15f1022d6b1fd958a83ea0102b012cf208c1.webp",
      "/images/figma/270d85d994953a5105d3cdf80a428f62f36f1500.webp"
    ],
    description: "Lấy cảm hứng từ cờ Hội Việt Nam với 5 màu sắc đặc trưng rực rỡ, Người Việt Yêu Nước là set sticker nhỏ theo bạn mỗi ngày, cùng bạn mang tinh thần Việt và sống một đời sống Việt.",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-03-hay-ho",
    name: "Set sticker 03: Hay Ho",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/c9e7d736916cd710dc56ee4426a46e1790601fb5.webp",
    thumbnails: [
      "/images/figma/c3dffd64d2a0456e834246ff47297ce494f45d5e.webp",
      "/images/figma/ed7b969f240018f2682178ae2410d6811b30b6cc.webp"
    ],
    description: "Chắc như đinh đóng cột, bạn là người hay ho! Dân chơi chính hiệu, người sống phong cách, tay đua cool cuốn, chính là set sticker dành cho bạn!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-04-ca-hoa",
    name: "Set sticker 04: Cà Hoa",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/f168080ca02513a79fa173f83cc38d0c3326fb71.webp",
    thumbnails: [
      "/images/figma/b42139ae6d750bbb19e813d421337e348c3b46e2.webp",
      "/images/figma/8d7178fc4a2535e2ad2dde67682aa723d7b41a54.webp"
    ],
    description: "Thích đi cà phê, thích ngắm hoa ngắm lá, thích lãng mạn cuộc đời, Cà Hoa dành cho mọi người yêu cuộc đời!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-05-ban-lam-duoc-ma",
    name: "Set sticker 05: Bạn Làm Được Mà",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/14a06cb92813f7658fa9e04fbdfb8ad0a7222a56.webp",
    thumbnails: [
      "/images/figma/9a6a8b45f9003f90b93165206005f8976fbb071e.webp",
      "/images/figma/b422aeba18732fffef5efc6d2107e8a03048f0cc.webp"
    ],
    description: "Chuyện khó thì làm từ từ, chuyện dễ thì làm cẩn thận, chuyện gì rồi cũng sẽ thành. Dán sticker Bạn làm được mà và nhẩm kỹ khẩu hiệu này mỗi ngày mỗi tháng!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-06-doi-moi",
    name: "Set sticker 06: Đời Mới",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/5333f3f45b6ea4951a6951ed1defe223d3853b4f.webp",
    thumbnails: [
      "/images/figma/0ba1d50969a14e00fdd51413a685fa30b41ac8e7.webp",
      "/images/figma/517cec3280659969a6eddbd10b9cd03f9bf3518b.webp"
    ],
    description: "Đời mới khi mình mới. Mọi điều cũ hoá mới, mọi điều mới hoá vui, mang tinh thần phơi phới sẵn sàng đón mọi điều sắp tới!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-07-dan-noi",
    name: "Set sticker 07: Đần Nói",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/2fb862723afe1f7099cfd401f3f48d192f8fa8b1.webp",
    thumbnails: [
      "/images/figma/92e3d21af67ebcfbf0b1161f3fd2b79b753a93f7.webp",
      "/images/figma/02507d74f5a7599da20b1ddf1848138c270ad954.webp"
    ],
    description: "Vô tri nhưng không vô nghĩa, đấy là cách mà Đần chơi với đời. Một set sticker thấm nhuần tinh thần và lối sống Đần - đời dễ ợt nên sống dễ chịu với chính mình thôi!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-08-dan-lao-dong",
    name: "Set sticker 08: Đần Lao Động",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/df9322066e8a757249d819bd9e5afc046936cdf3.webp",
    thumbnails: [
      "/images/figma/03215c94f5a5b7ac87035d5f826050fac0673aec.webp",
      "/images/figma/679049aeaaf10c1aecf137f1c7f69da3aac85db5.webp"
    ],
    description: "Sống và cống hiến, làm và sống chiến, không ngừng lao động. Đần tiếp nối tinh thần lao động của người đồng bào mình và đưa tinh thần ấy vào một set sticker!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "sticker-09-chuc-nhau-that-su",
    name: "Set sticker 09: Chúc Nhau Thật Sự",
    category: "In ấn",
    priceFrom: 65000,
    unit: "set",
    image: "/images/figma/9c336a85ed4630d98983e404c3a7eec75f23d018.webp",
    thumbnails: [
      "/images/figma/3e36e187d0277a033244792062e153372ab1104f.webp",
      "/images/figma/9379c6338f9d0492a3a2401436788d58b0ce8cb5.webp"
    ],
    description: "Thuộc BST “Chúc Tết Nhau Thật Sự\"\n\nThay cho lời chúc bằng lời, một set sticker nhỏ để bạn gửi gián tiếp những lời chúc thành thật, chúc sức khoẻ, chúc bình an, chúc vững bền, chúc mọi điều. Hơn cả một lời nói ngắn, dán câu chúc bên cạnh để nhắc mình nhớ, nhắc ai đừng quên, nhắc nhau cho mọi ngày!",
    specs: [
      "01 set gồm 08 tấm sticker",
      "Chất liệu chống thấm nước",
      "Bóc tháo dễ dàng, nhỏ gọn bỏ túi",
      "Kích thước: 5cm - 7cm/tấm"
    ]
  },
  {
    id: "postcard-nguoi-viet-yeu-nuoc",
    name: "Postcard Người Việt Yêu Nước",
    category: "In ấn",
    priceFrom: 90000,
    unit: "set",
    image: "/images/figma/88f29f16a306dea6b08d5133be10a08738f832c0.webp",
    thumbnails: [
      "/images/figma/e05de8788da83fc6c617180a681d08368716c7b1.webp",
      "/images/figma/0dc79f8d2e646b080f17c79e1559cbe1f802c7bb.webp"
    ],
    description: "Từ đời sống, từ hơi thở, từ chất liệu hàng ngày, tinh thần Việt sống ở trong từng ngóc ngách. Tôn trọng và nương tựa những người chảy chung một dòng máu, người Việt mình chất, người Việt đẳng cấp, người Việt có nhau!",
    specs: [
      "Một set gồm 03 tấm",
      "Kích thước: 10,5x15 cm",
      "Chất liệu: giấy mỹ thuật"
    ],
    note: "Không bán rời từng tấm"
  },
  {
    id: "postcard-gai-dep",
    name: "Postcard Gái Đẹp",
    category: "In ấn",
    priceFrom: 90000,
    unit: "set",
    image: "/images/figma/41ef321334d61a1390988a9d30206be8c3f99e4c.webp",
    thumbnails: [
      "/images/figma/b9d3f057793f0d59609cc77c83613734f852de8e.webp",
      "/images/figma/0dc79f8d2e646b080f17c79e1559cbe1f802c7bb.webp"
    ],
    description: "Đứng trước gái đẹp nên hơi ngại, bỏ ngỏ vài lời nhét postcards gửi tới đây. Dành cho tất cả những bạn gái trên cuộc đời, gái đẹp nhất là khi gái yêu mình, gái yêu người, gái yêu đời!",
    specs: [
      "Một set gồm 03 tấm",
      "Kích thước: 10,5x15 cm",
      "Chất liệu: giấy mỹ thuật"
    ],
    note: "Không bán rời từng tấm"
  },
  {
    id: "postcard-ban-hoi-toi-y-nghia-cuoc-doi",
    name: "Postcard Bạn Hỏi Tôi Ý Nghĩa Cuộc Đời",
    category: "In ấn",
    priceFrom: 90000,
    unit: "set",
    image: "/images/figma/3ac53ee6aa55e0eba5c303bb8a64ae01ee9bda65.webp",
    thumbnails: [
      "/images/figma/f895595af763020f1b764cab50328d61c378746e.webp",
      "/images/figma/0dc79f8d2e646b080f17c79e1559cbe1f802c7bb.webp"
    ],
    description: "Đi đến cuối để vòng lại ban đầu, đi tìm ý nghĩa cuộc đời trong khi chẳng biết cuộc đời có ý nghĩa là gì? Chẳng sao cả, có Tíc Cơ cùng với bạn, tận hưởng hành trình và đi hỏi cuộc đời cho ra lẽ!",
    specs: [
      "Một set gồm 03 tấm",
      "Kích thước: 10,5x15 cm",
      "Chất liệu: giấy mỹ thuật"
    ],
    note: "Không bán rời từng tấm"
  },
  {
    id: "tui-ngu-du",
    name: "Túi Ngủ Đủ",
    category: "Túi xách",
    priceFrom: 350000,
    unit: "túi",
    soldOut: true,
    image: "/images/figma/98dbc52611e65a8d45552d03601a0877cb24494d.webp",
    thumbnails: [
      "/images/figma/11b62f0745419c1fbc71af9b428eb22ca965e705.webp",
      "/images/figma/7f022d097f57663080d4b4a5a1a3e819dc74afad.webp",
      "/images/figma/f74a127be377cf11d3b350c9dcb68d2e6300b5fb.webp",
      "/images/figma/3d18c7af69b3bc3849f31f6927881e52ebaca3db.webp"
    ],
    description: "Lấy cảm hứng từ cái gối đưa bạn vào giấc, làm từ chất vải chần bông và chất liệu êm ru, một chiếc túi êm như gối, trông như gối, nhìn là muốn kê lên nằm, một chiếc túi nhắc bạn ngủ đủ, ngủ đủ và ngủ đủ!",
    specs: [
      "Chất liệu: vải gió chần bông",
      "Quai túi có thể điều chỉnh độ dài nút thắt",
      "Túi tròn nhỏ có thể tháo rời",
      "Đường kính (túi lớn): 23cm",
      "Đường kính (túi bé): 9cm",
      "Dây quai: 120cm (khi chưa thắt nút)"
    ]
  },
  {
    id: "tui-thuyen",
    name: "Túi Thuyền",
    category: "Túi xách",
    priceFrom: 360000,
    unit: "túi",
    soldOut: true,
    image: "/images/figma/a64579317afc82bdf1461d15c67d5cf2574c1371.webp",
    thumbnails: [
      "/images/figma/38b7bae1342ee5f07e4741f95e1d683a6d1e0c6a.webp",
      "/images/figma/41e391dddf04d0fc5eb37dc55251e0b7eff942e5.webp",
      "/images/figma/7ae36d344fe73f4e2fcf419a6d3dd634ce6be2eb.webp",
      "/images/figma/4d1e780b8d606d8113850f2a8c214fe31729da5e.webp"
    ],
    description: "Ra biển để ra khơi, ra khơi để thử điều mới. Lấy cảm hứng từ chiếc thuyền miền biển, Tíc Cơ ra mắt Túi Thuyền, nhắc mình cứ việc ra khơi và xông pha, thử cái này cái kia và dám không ngừng đi lên!",
    specs: [
      "Đứng form dày dặn, hai ngăn nhỏ bên trong, có khoá kéo",
      "Chất liệu: vải gió dù dày, chống thấm nước",
      "Quai túi có thể điều chỉnh độ dài (130cm - 160cm)",
      "Kích thước đáy túi: 13x30cm",
      "Chiều cao túi: (trên: 45cm - dưới: 30cm - cao: 29cm)"
    ]
  },
  {
    id: "li-xi-2026",
    name: "Lì xì 2026",
    category: "In ấn",
    priceFrom: 85000,
    unit: "bộ",
    soldOut: true,
    image: "/images/figma/5d96f6fdc6bd5cbc6273918d544bbfc6bebd69c6.webp",
    thumbnails: [
      "/images/figma/be5207b096d3e8532ced68f8634418237fc91de1.webp",
      "/images/figma/48de7651b838c0216fd6f2281b734780d1d6268d.webp",
      "/images/figma/2a32c31c83140d14818933c838eab95ec6b0e897.webp",
      "/images/figma/a4f872da85513c77d2c6f9242a881cd7b039e553.webp",
      "/images/figma/398188087c24217890d41a0fe2d1197ae78e77a1.webp",
      "/images/figma/5d392821216400c35641f98db0a1d40b66ea38c6.webp"
    ],
    description: "Câu chúc đi trước, lì xì ngay sau. Tết về qua những phong lì xì màu sắc người ta hân hoan gửi nhau, mong muốn chúc nhau sức khoẻ, may mắn, niềm vui và tỉ ti thứ tốt đẹp trên đời. Chúc ngắn gọn mặt trước, thủ thỉ dài dài mặt sau, Tíc Cơ gửi lời chúc Tết qua bộ lì xì 2026, không hề sáo rỗng hay cho có, như một lời thì thầm gửi tới nhau mùa năm mới!",
    specs: [
      "Một bộ gồm 06 lì xì (chỉ bán theo bộ)",
      "Kích thước: 8x16cm",
      "Chất liệu: giấy mỹ thuật",
      "Màu sắc bên ngoài có sự chênh lệch nhẹ"
    ]
  },
  {
    id: "than-chu-nam-moi-2026",
    name: "Thần chú năm mới 2026",
    category: "In ấn",
    priceFrom: 130000,
    unit: "thần chú",
    soldOut: true,
    image: "/images/figma/dd188dc98b9d208a4fc505d57d56485a3ce84cd7.webp",
    thumbnails: [
      "/images/figma/bbcf5444ae1d94a25f0c2a973151e3f767ba3ad2.webp",
      "/images/figma/77f9c25b6392f5394cf510aa3813afd38de32ac2.webp",
      "/images/figma/2f600421539f7a388d9891ebbaa5d900ab200e4a.webp",
      "/images/figma/bb219774a17eb56d3a8e925e1303b35832fd5a5e.webp",
      "/images/figma/1a13b824e4cb2413809acdb514f63e99f3e49f21.webp",
      "/images/figma/d5ea29f4b70c7d9a32f7ef0047b644bc1c5f5a3e.webp"
    ],
    description: "Thần chú năm mới là sản phẩm giới hạn hàng năm, ra mắt duy nhất vào đầu năm mới. Với tinh thần vận động toàn dân chúc Tết nhau thật sự, Thần Chú Năm Mới 2026 dưới hình thức một cuốn lịch cầm tay mini, đan xen với những câu chúc quen thuộc gần gũi, Tíc Cơ đơn giản là muốn nói: mấy câu chúc thuận miệng ấy vốn không hề qua loa, khi người ta nói ra từ sự chân thành và quý mến!",
    specs: [
      "Lịch 12 tháng",
      "Kích thước: 9x9cm",
      "Chất liệu: giấy mỹ thuật ánh ngọc trai"
    ]
  },
  {
    id: "so-nghi-di",
    name: "Sổ Nghỉ Đi",
    category: "Văn phòng phẩm",
    priceFrom: 150000,
    unit: "sổ",
    soldOut: true,
    image: "/images/figma/cd855dd03b918695a0f161a5e550b7502901ef71.webp",
    thumbnails: [
      "/images/figma/e3c5aeb38cd1dea2f1fd2f6b856b0ded0598edea.webp",
      "/images/figma/6a0d86e2c2734d006ce3362dba8e05d63aa56ff7.webp"
    ],
    description: "Tíc Cơ có một cuốn sổ để nhắc bạn Nghỉ đi! Làm nhiều thì dễ mệt, mệt nhiều thì nghỉ đi. Sổ Nghỉ đi nằm trong hộp quà Nghỉ Đi, hợp tác bởi Tíc Cơ và Freezedom trong chiến dịch ‘Thu Rồi Nghỉ Đi’!",
    specs: [
      "Kích thước: size B6 (12,5 x 17,6 cm)",
      "Chất liệu: giấy kraft",
      "Số trang: 196 trang không kể bìa, ruột sổ chấm dot",
      "Khâu chỉ keo gáy",
      "Trong sổ bao gồm 8 trang minh hoạ chủ đề Nghỉ đi"
    ]
  },
  {
    id: "ao-phong-thoai-mai",
    name: "Áo phông Thoải Mái",
    category: "Thời trang",
    priceFrom: 300000,
    unit: "chiếc",
    soldOut: true,
    image: "/images/figma/20f36495411906726aaeb380c47a01bbeb508291.webp",
    thumbnails: [
      "/images/figma/426c0dd115b69c610e8bfc990cf4a02f0a39f54f.webp",
      "/images/figma/dfed301b14e07a08c95cb003fd1ddd6acda720ae.webp",
      "/images/figma/5e2acad4bc3dc6ae2732a94ff2a4128f1314ca04.webp",
      "/images/figma/0bbaa21edd4802c683147fa3e8cb10926e5c6d51.webp"
    ],
    description: "Nghĩ đơn giản, làm thoải mái, sống giản đơn, mặc Thoải Mái! Giống như hoạt động đầu tiên trong ngày là chọn quần chọn áo, ăn mặc thoải mái là bước đầu để giữ cho mình một tinh thần thoải mái!",
    specs: [
      "Chất liệu: cotton 2 chiều",
      "Màu sắc: đen & trắng",
      "Size: M/L/XL"
    ]
  },
  {
    id: "mu-tai-beo-ha-ha",
    name: "Mũ tai bèo Ha Ha",
    category: "Thời trang",
    priceFrom: 320000,
    unit: "chiếc",
    soldOut: true,
    image: "/images/figma/86c21def520ab906b9ea6dba8a01030f3c6f77be.webp",
    thumbnails: [
      "/images/figma/44f8b9fd33ddf61606f8b7d415691296ea72f6b7.webp",
      "/images/figma/2c653a28c511fd498a049a49c20053b94ea7fa3a.webp"
    ],
    description: "Một cú hợp tác bởi Neenee và Tíc Cơ!\nKhông có mũ cũng được, nhưng có thì còn vui hơn. Biến mấy thứ mình đội hàng ngày thêm màu sắc và vào mood! Đầu đội mũ nâng cao tinh thần, chân cứ thế mà hoan hỷ nhảy vào đời!\n\nBạn haha, đời nở hoa, miệng ngân nga, mũ tô điểm vào một ngày âm u!",
    variants: [
      "Mũ tai bèo Ha Ha",
      "Mũ lưỡi trai Chả Sao"
    ],
    specs: [
      "Chất liệu: kaki",
      "Đội được 2 mặt",
      "Kèm 2 màu dây: rêu, kem",
      "Nút bấm ở mặt màu kem",
      "2 size: S (55-57cm), M (58-60cm)"
    ]
  },
  {
    id: "mu-luoi-trai-cha-sao",
    name: "Mũ lưỡi trai Chả Sao",
    category: "Thời trang",
    priceFrom: 320000,
    unit: "chiếc",
    soldOut: true,
    image: "/images/figma/14341c1b98597c12ac27da8ad8e345dbc4a14bb1.webp",
    thumbnails: [
      "/images/figma/c0a8909f075e66af1221028d8e2d84841cf20a32.webp",
      "/images/figma/ad2704a62df40b6896c0c91e7ec9ff2186edcbd4.webp"
    ],
    description: "Một cú hợp tác bởi Neenee và Tíc Cơ!\nKhông có mũ cũng được, nhưng có thì còn vui hơn. Biến mấy thứ mình đội hàng ngày thêm màu sắc và vào mood! Đầu đội mũ nâng cao tinh thần, chân cứ thế mà hoan hỷ nhảy vào đời!\n\nNghĩ sao thì đời vậy, nghĩ chả sao thì chả phải sợ! đội mũ chả sao, mãi tinh thần chả sao!",
    variants: [
      "Mũ tai bèo Ha Ha",
      "Mũ lưỡi trai Chả Sao"
    ],
    specs: [
      "Chất liệu: kaki",
      "Mũi ngắn, vành cứng",
      "Có dây chỉnh size",
      "Hai màu: Xanh navy, Đỏ"
    ]
  },
  {
    id: "keychain-nguoi-viet-yeu-nuoc",
    name: "Keychain Người Việt Yêu Nước",
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    image: "/images/figma/3bb4436099c2f07b4784e1e4c7183f745adf263d.webp",
    thumbnails: [
      "/images/figma/699fe8de8483cedcfad872662e054f70b59ce15a.webp",
      "/images/figma/699fe8de8483cedcfad872662e054f70b59ce15a.webp"
    ],
    description: "Đi cùng bạn trên mọi nẻo đường, yêu nước bắt đầu từ những điều nhỏ. Tiếp nối với set sticker cùng tên, Tíc Cơ ra mắt keychain dành cho người yêu nước Việt, tạo ra tiếng “leng keng” cho đời!",
    specs: [
      "Kích thước: 6-8 cm/piece",
      "Chất liệu: mica cứng",
      "Một set gồm 2 piece"
    ]
  },
  {
    id: "keychain-uoc-duoc-lam-con-cho",
    name: "Keychain Ước Được Làm Con Chó",
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    image: "/images/figma/58822f5d674775867785daec3efe3e3b207428db.webp",
    thumbnails: [
      "/images/figma/65d7f8b7ac26dfd701ee1606630f56da501daa51.webp",
      "/images/figma/65d7f8b7ac26dfd701ee1606630f56da501daa51.webp"
    ],
    description: "Thi thoảng đời nó khó, chẳng sao nếu có ngồi xuống nghỉ tí, làm một con chó nằm dài chỉ việc ngắm nhìn cuộc đời. Nghỉ ngơi, hít thở, lấy đà, vặn ga, phóng vào đời, hôm nay Tíc Cơ cùng bạn ước được làm con chó!",
    specs: [
      "Kích thước: 6-8 cm/piece",
      "Chất liệu: mica cứng",
      "Một set gồm 2 piece"
    ]
  },
  {
    id: "keychain-khong-so-cuoc-doi",
    name: "Keychain Không Sợ Cuộc Đời",
    category: "Phụ kiện đời sống",
    priceFrom: 115000,
    unit: "set",
    soldOut: true,
    image: "/images/figma/60ca156959b79cc724f88c1082a0496887990862.webp",
    thumbnails: [
      "/images/figma/76e00ec5e8bd3e294cecba9c7cfa33ce70fbe139.webp",
      "/images/figma/76e00ec5e8bd3e294cecba9c7cfa33ce70fbe139.webp"
    ],
    description: "Đời toàn chuyện cỏn con, chuyện lớn hóa chuyện nhỏ, chuyện nhỏ hóa ra chẳng có gì. Không sợ hãi và lo nghĩ nhiều, Tíc Cơ có keychain “Không sợ cuộc đời” dành cho mọi trái tim can trường!",
    specs: [
      "Kích thước: 6-8 cm/piece",
      "Chất liệu: mica cứng",
      "Một set gồm 2 piece"
    ]
  },
  {
    id: "so-trong",
    name: "Sổ Trống",
    category: "Văn phòng phẩm",
    priceFrom: 85000,
    unit: "sổ",
    image: "/images/figma/db031c9f3affb098ffdb05bf20a1c3c58ac655e5.webp",
    thumbnails: [
      "/images/figma/fa28ec83f6434ac6cba912ac8dd31c772a409231.webp",
      "/images/figma/6b8c028149912e3128e4d696c00d61e7d0d062a1.webp",
      "/images/figma/5d82cbf9a61fe0a30ebd5bdced58c6504cd4da4a.webp",
      "/images/figma/9e0243ecfd084eb664dd1b875208257bdd0c71bc.webp"
    ],
    description: "Một cuốn sổ trống trơn để bạn làm gì cũng được!\n\nViệc ngược việc xuôi cũng phải dành thời gian cho cả những thứ mình thích. Tíc Cơ quyết định để Sổ Trống là nơi bạn tự làm đầy trang giấy theo bất kỳ cách nào: vẽ ngôi nhà ngay trước mắt, đưa bút trong vô thức, ép khô chiếc lá vừa nhặt bên đường, nháp ý tưởng đầu tiên cho dự án cá nhân,... Cứ lôi Sổ Trống ra khi bạn quá tải, khi bạn cần nghỉ ngơi trong trống rỗng và làm đầy Sổ Trống cho đến khi chính bạn thấy đủ đầy!",
    variants: [
      "Sổ trống",
      "Sổ nhật ký",
      "Sổ lao động",
      "Bộ 3 sổ"
    ],
    specs: [
      "Ruột giấy trơn, định lượng 80gsm",
      "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày",
      "Số trang: 160 trang",
      "Kích thước: 12.6 x 17.8cm"
    ],
    note: "Mua bộ 03 sổ tặng kèm hộp ngoài\nKhông kèm theo hộp khi mua sổ lẻ"
  },
  {
    id: "so-nhat-ky",
    name: "Sổ Nhật Ký",
    category: "Văn phòng phẩm",
    priceFrom: 85000,
    unit: "sổ",
    image: "/images/figma/16a3bb9ecc7c9830bdb7e9246007feea1aa78ce1.webp",
    thumbnails: [
      "/images/figma/0b32a1690f3f29b895f832a731d1532f791d325d.webp",
      "/images/figma/862e3a1bc7986d028b94f9931fdec0d03db9812a.webp",
      "/images/figma/73a81db39a8032d35ca688b454b4c3fb555f27f1.webp",
      "/images/figma/54559b3e4a6ef65808bf6c2655abff4825c87e45.webp",
      "/images/figma/820c30be60fe4ac076bfb2720471baa9a0461f1a.webp",
      "/images/figma/e8fe13726573e27b53890ca70fe8dc8835480f66.webp"
    ],
    description: "Một cuốn sổ để bạn sắp xếp suy nghĩ trong đầu một cách riêng tư!\n\nNgày nào cũng là ngày đáng ghi lại nếu mình biết là mình đang sống! Buồn hay vui, vui hay buồn, viết nhật ký để ghi nhớ, để biết ơn, để trân trọng đời thường. Có một trăm suy nghĩ trong đầu thì viết ra, nghĩ nhiều không thông thì viết ra, yên tâm là Sổ Nhật Ký của bạn không ai được đọc!",
    variants: [
      "Sổ trống",
      "Sổ nhật ký",
      "Sổ lao động",
      "Bộ 3 sổ"
    ],
    specs: [
      "Ruột giấy chấm dot, định lượng 80gsm",
      "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày",
      "Số trang: 160 trang",
      "Kích thước: 12.6 x 17.8cm",
      "Có thêm mood tracker"
    ],
    note: "Mua bộ 03 sổ tặng kèm hộp ngoài\nKhông kèm theo hộp khi mua sổ lẻ"
  },
  {
    id: "so-lao-dong",
    name: "Sổ Lao Động",
    category: "Văn phòng phẩm",
    priceFrom: 85000,
    unit: "sổ",
    image: "/images/figma/343596e9ef68b3551c42569815163c35eca6c585.webp",
    thumbnails: [
      "/images/figma/651921c312a0e6cc5a92491de36b0c6ebcf4776a.webp",
      "/images/figma/58b1853b496ef257427df2dec1bb777c0048fdd3.webp",
      "/images/figma/710bad7b80c44862d69b3bfa2b34e0d6e638e60f.webp",
      "/images/figma/2e67a339680d7f7c8c8099e38bebc08fedfc04e0.webp",
      "/images/figma/09c99ca111896cb61df2caf5153bc63c12397450.webp",
      "/images/figma/6b6b6bd0febe111db5514baf1e8f09f17676b7ee.webp"
    ],
    description: "Một cuốn sổ để bạn lao động vui và trơn tru!\n\nSống không chỉ có lao động, nhưng cần lao động để còn sống. Thực hành lao động quay về với những thứ đơn giản nhất: giấy và bút. Lên kế hoạch, chú thích công việc, sắp xếp nhiệm vụ, mang theo đi họp, tập trung và chuyên chú. Làm đầy sổ với công việc, để khi nhìn lại thấy chi chít những đánh dấu của sự cố gắng và tự hào!",
    variants: [
      "Sổ trống",
      "Sổ nhật ký",
      "Sổ lao động",
      "Bộ 3 sổ"
    ],
    specs: [
      "Ruột giấy chấm dot, định lượng 80gsm",
      "Độ dày vừa phải, gọn nhẹ mang theo hàng ngày",
      "Số trang: 160 trang",
      "Kích thước: 12.6 x 17.8cm",
      "Có thêm lịch năm"
    ],
    note: "Mua bộ 03 sổ tặng kèm hộp ngoài\nKhông kèm theo hộp khi mua sổ lẻ"
  },
  {
    id: "dan-sinh-ton-01",
    name: "Móc khoá 01: Đần Cứ Bình Tĩnh",
    category: "Phụ kiện đời sống",
    priceFrom: 165000,
    unit: "box",
    image: "/images/figma/ef4ef25a6a8f4a710f9fd609c193d5f2f856275e.webp",
    thumbnails: [
      "/images/figma/1828f0dd902e6e171a18989b5fc3dd36ab491e35.webp",
      "/images/figma/368d07ae0a72eaabf2d8258a8251108eb7dd7bdd.webp",
      "/images/figma/1c6ac15f2b5bf7a332b8de702fdf94fee5c745ca.webp",
      "/images/figma/878930d4e4521b79cba3c75fc35954d23d08ef61.webp"
    ],
    description: "Nguyên tắc đầu tiên để sống sót là bình tĩnh trước mọi tình huống. Ngay lúc này, bạn có thể cầm Đần trong tay, bế Đần, treo Đần và lặp đi lặp lại câu nói “Cứ bình tĩnh” ở trong đầu!",
    variants: [
      "01 - Đần cứ bình tình",
      "02 - Đần nuốt nước mắt vào trong",
      "03 - Đần vắt cực khô, sống cực căng",
      "BST 3 box"
    ],
    specs: [
      "Một set gồm: 1 box đựng, 1 gấu bông Đần, 1 piece mica trong suốt",
      "Kích thước: 12cm cả móc treo (có sai số nhẹ)"
    ],
    note: "Mua 2 set giảm 5%, mua 3 set giảm 10%"
  },
  {
    id: "dan-sinh-ton-02",
    name: "Móc khoá 02: Đần Nuốt Nước Mắt Vào Trong",
    category: "Phụ kiện đời sống",
    priceFrom: 165000,
    unit: "box",
    image: "/images/figma/4ce44f4330ae8bc2fef5ac4b56d607aee3dacd70.webp",
    thumbnails: [
      "/images/figma/3192e63386fc8f154aa17a14297f5acb41297bbc.webp",
      "/images/figma/368d07ae0a72eaabf2d8258a8251108eb7dd7bdd.webp",
      "/images/figma/1c6ac15f2b5bf7a332b8de702fdf94fee5c745ca.webp",
      "/images/figma/3192e63386fc8f154aa17a14297f5acb41297bbc.webp"
    ],
    description: "Khó thì khóc, khóc xong rồi thì nuốt nước mắt vào trong, Nước mắt Đần rơi, nỗi buồn kết thúc, sẵn sàng đối diện cuộc đời. Treo Đần theo mình và cùng chúng tôi nuốt trọn mọi khó nhằn trước mắt!",
    variants: [
      "01 - Đần cứ bình tình",
      "02 - Đần nuốt nước mắt vào trong",
      "03 - Đần vắt cực khô, sống cực căng",
      "BST 3 box"
    ],
    specs: [
      "Một set gồm: 1 box đựng, 1 gấu bông Đần, 1 piece mica trong suốt",
      "Kích thước: 12cm cả móc treo (có sai số nhẹ)"
    ],
    note: "Mua 2 set giảm 5%, mua 3 set giảm 10%"
  },
  {
    id: "dan-sinh-ton-03",
    name: "Móc khoá 03: Đần Vắt Cực Khô, Sống Cực Căng",
    category: "Phụ kiện đời sống",
    priceFrom: 165000,
    unit: "box",
    image: "/images/figma/96469be5dfa3d01b37bde51905a0a9d58ef20ec5.webp",
    thumbnails: [
      "/images/figma/c60a39c7d1c58584d602762dffa7935dad47fd86.webp",
      "/images/figma/368d07ae0a72eaabf2d8258a8251108eb7dd7bdd.webp",
      "/images/figma/1c6ac15f2b5bf7a332b8de702fdf94fee5c745ca.webp",
      "/images/figma/adfd08d823ac309eab95fec554c637913a57bd3a.webp"
    ],
    description: "Làm ra làm, chơi ra chơi, người ta vẫn hay bảo thế. Vắt đến khi đủ tròn đủ vững. Dám vắt, dám làm, dám chơi, dám sống, đã sống thì sống cho ra trò!",
    variants: [
      "01 - Đần cứ bình tình",
      "02 - Đần nuốt nước mắt vào trong",
      "03 - Đần vắt cực khô, sống cực căng",
      "BST 3 box"
    ],
    specs: [
      "Một set gồm: 1 box đựng, 1 gấu bông Đần, 1 piece mica trong suốt",
      "Kích thước: 12cm cả móc treo (có sai số nhẹ)"
    ],
    note: "Mua 2 set giảm 5%, mua 3 set giảm 10%"
  },
  {
    id: "bst-dau-doi-mu-chan-vao-doi",
    name: "BST Đầu Đội Mũ, Chân Vào Đời",
    category: "Phụ kiện đời sống",
    priceFrom: 320000,
    unit: "chiếc",
    soldOut: true,
    description: "Một cú hợp tác bởi Neenee và Tíc Cơ! Không có mũ cũng được, nhưng có thì còn vui hơn. Biến mấy thứ mình đội hàng ngày thêm màu sắc và vào mood! Đầu đội mũ nâng cao tinh thần, chân cứ thế mà hoan hỷ nhảy vào đời!",
    variants: [
      "Mũ tai bèo \"Ha Ha\"",
      "Mũ lưỡi trai \"Chả Sao\""
    ],
    specs: [
      "Mũ tai bèo 'Ha Ha': chất liệu kaki, đội được 2 mặt, kèm 2 màu dây (rêu, kem), nút bấm ở mặt màu kem, 2 size S (55-57cm) / M (58-60cm)",
      "Mũ lưỡi trai 'Chả Sao': chất liệu kaki, mũi ngắn, vành cứng, có dây chỉnh size"
    ]
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
    picks: ["BST Sổ Căn Bản", "Móc Khoá Đần", "Combo tự chọn"],
    color: "#F9D9BC",
    seoTag: "quà tặng sinh nhật",
  },
  {
    occasion: "Valentine",
    emoji: "🌸",
    tagline: "Nhỏ thôi, nhưng ngọt lắm.",
    picks: ["Postcard Đần", "Combo sổ tay + móc khoá"],
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
    image: "/images/collab-freezedom.png",
    productHref: "/san-pham",
    articleHref: "/kham-pha/freezedom-thu-roi-nghi-di",
  },
  {
    id: "neenee-dau-doi-mu-chan-vao-doi",
    group: "hop-tac",
    title: "Tíc Cơ x Neenee: Đầu đội mũ, chân vào đời",
    image: "/images/collab/neenee-mu.png",
    productHref: "/san-pham",
    articleHref: "/kham-pha/neenee-dau-doi-mu-chan-vao-doi",
  },
  {
    id: "le-hoi-doc-lap",
    group: "event",
    title: "Tíc Cơ tại Khu vực trải nghiệm Lễ Hội Độc Lập",
    image: "/images/collab/le-hoi-doc-lap.png",
    productHref: "/san-pham",
    // the booth is covered in the Người Việt Vận Động page (Figma has no separate event page)
    articleHref: "/kham-pha/nguoi-viet-van-dong",
  },
  {
    id: "nguoi-viet-van-dong",
    group: "rieng",
    title: "Người Việt Vận Động",
    productHref: "/san-pham",
    articleHref: "/kham-pha/nguoi-viet-van-dong",
  },
  {
    id: "chuc-tet-nhau-that-su",
    group: "rieng",
    title: "Chúc Tết Nhau Thật Sự",
    productHref: "/san-pham",
    articleHref: "/kham-pha/chuc-tet-nhau-that-su",
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
    articleHref: "/kham-pha/lam-moi-doi-di",
  },
  {
    id: "minh-trong-nha-nha-trong-nuoc",
    group: "rieng",
    title: "Mình Trong Nhà, Nhà Trong Nước",
    productHref: "/san-pham",
    articleHref: "/kham-pha/minh-trong-nha-nha-trong-nuoc",
  },
];

export const aboutPage = {
  intro: [
    "Bắt đầu từ việc quan sát đời sống theo những góc nhìn mới, Tíc Cơ ra đời với ý tưởng về một thương hiệu Việt với các sản phẩm tiêu dùng sáng tạo do người trẻ Việt thiết kế.",
    "Lấy cảm hứng từ chất liệu đời thường, chú tâm vào tinh thần và lối sống người Việt: câu chữ mẹ đẻ, tinh thần hào sảng, thái độ xởi lởi, lao động hăng say,..",
    "Những điều bình thường và chân thật được ghi lại với một thái độ khác - vui, nghệ, gần gũi.",
  ],
  mission: [
    "Châm ngôn là làm mọi thứ với niềm vui giản đơn và sự tò mò với đời.",
    "Tíc Cơ mong muốn lan toả lối sống phóng khoáng và tích cực, bước đi cùng bạn trong hành trình phát triển mình và khám phá cuộc sống hàng ngày theo những góc nhìn mới.",
  ],
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
  traits: {
    captions: [
      "không quan tâm\nkhông nghe\nkhông biết",
      "vui, khoẻ,\nvô tư đê",
      "nguyện sống\nmột đời cringe",
      "sống vô tri khi\nđời vô thường",
    ],
    tagline: "kệ đời ngả nghiêng, quyết không nghiêng ngả!",
  },
  introBanner:
    "Đần là quản gia của Tíc Cơ, đại diện thay mặt chúng tôi truyền tải thông tin đến bạn!",
  bio: [
    {
      image: "/images/dan-cheer.png",
      text: "Ra đời vào 6/2024\nĐịa lý: không có địa chỉ thường trú (Tíc Cơ ở đâu thì Đần ở đấy)\nHọc vấn: trường đời",
    },
    {
      image: "/images/dan-lift.png",
      text: "Hướng tới cuộc sống tự do,\nyêu lao động, vui thì làm\nmà không vui thì vui",
    },
    {
      image: "/images/dan-phone.png",
      text: "Nhảy híp hóp, cười khà khà, làm thơ con cóc và kể chuyện này kia\n\nHành vi phương tiện:\nOnline 24/7, gọi là có, đến là đón",
    },
  ],
  closingHeading: "Mấy thứ ngố ngố làm bạn sống vui vui!",
  closingBanner: "Lan toả lối sống Đần qua các sản phẩm Tíc Cơ:",
};

export const ugcPhotos = [
  { id: 1, caption: "@user1 • sổ căn bản trên bàn làm việc 📓", color: "#E3D3F5" },
  { id: 2, caption: "@user2 • mang tote đi cafe ☕", color: "#F9D9BC" },
  { id: 3, caption: "@user3 • móc khoá Đần mới 🔑", color: "#E5FF00" },
  { id: 4, caption: "@user4 • postcard dán tường phòng trọ 🖼️", color: "#F9D9BC" },
  { id: 5, caption: "@user5 • combo quà sinh nhật 🎂", color: "#E3D3F5" },
  { id: 6, caption: "@user6 • lịch bàn Tíc Cơ 🗓️", color: "#E5FF00" },
];
