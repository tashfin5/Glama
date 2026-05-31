const products = [
  // Skincare
  {
    name: "Advanced Snail 96 Mucin Power Essence 100ml",
    brand: "COSRX",
    description: "Lightweight essence which absorbed into the skin fast and gives skin natural glow from inside. This essence is created from nutritious, low-stimulation filtered snail mucin.",
    price: 1850,
    discountPrice: 1450,
    stock: 45,
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Dry"],
    categoryName: "Skincare"
  },
  {
    name: "Relief Sun: Rice + Probiotics SPF50+ PA++++",
    brand: "Beauty of Joseon",
    description: "Relief Sun is a lightweight and creamy type organic sunscreen that's comfortable on skin. Even if you apply a large amount several times, it is not sticky and gives a moist finish like that of a light moisturizing cream.",
    price: 1600,
    discountPrice: 1250,
    stock: 82,
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Sensitive"],
    categoryName: "Skincare"
  },
  {
    name: "Lip Sleeping Mask EX - Berry 20g",
    brand: "LANEIGE",
    description: "A leave-on lip mask that soothes and moisturizes for smoother, more supple lips overnight. Contains Berry Mix Complex with Vitamin C and antioxidant-packed berry ingredients.",
    price: 2100,
    discountPrice: 1890,
    stock: 34,
    images: ["https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All"],
    categoryName: "Skincare"
  },
  {
    name: "Heartleaf 77% Soothing Toner 250ml",
    brand: "Anua",
    description: "A highly moisturizing, mildly acidic toner infused with 77% heartleaf extract to soothe troubled skin and maintain a healthy water-oil balance.",
    price: 2200,
    discountPrice: 0,
    stock: 120,
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["Acne Prone", "Sensitive"],
    categoryName: "Skincare"
  },
  {
    name: "Watermelon Glow Niacinamide Dew Drops",
    brand: "Glow Recipe",
    description: "A breakthrough, multi-use highlighting serum that hydrates and visibly reduces the look of hyperpigmentation for a dewy, reflective glow.",
    price: 3500,
    discountPrice: 3200,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Combination"],
    categoryName: "Skincare"
  },
  {
    name: "Centella Ampoule 100ml",
    brand: "SKIN1004",
    description: "Made with 100% Centella Asiatica Extract to calm and soothe irritated skin, providing intensive care and deep hydration.",
    price: 1950,
    discountPrice: 1650,
    stock: 50,
    images: ["https://images.unsplash.com/photo-1615397323719-2f22b7c0ceeb?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["Sensitive", "Dry"],
    categoryName: "Skincare"
  },
  
  // Makeup
  {
    name: "Mask Fit Red Cushion Foundation",
    brand: "TIRTIR",
    description: "A high-coverage cushion foundation that offers long-lasting, flawless wear for up to 72 hours. Provides a radiant, glass-skin finish without feeling heavy.",
    price: 2450,
    discountPrice: 2100,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Combination"],
    categoryName: "Makeup"
  },
  {
    name: "Glasting Water Tint - Vintage Ocean",
    brand: "rom&nd",
    description: "A lip tint that creates a glossy, glass-like film over the lips, keeping the vivid color intact for hours. Vintage Ocean is a beautiful muted brick red.",
    price: 1200,
    discountPrice: 0,
    stock: 104,
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All"],
    categoryName: "Makeup"
  },
  {
    name: "Kill Cover The New Founwear Cushion",
    brand: "CLIO",
    description: "Achieve a flawless, semi-matte complexion with this cult-favorite cushion. Superior coverage that lasts all day without oxidizing.",
    price: 2800,
    discountPrice: 2500,
    stock: 42,
    images: ["https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Oily"],
    categoryName: "Makeup"
  },
  {
    name: "Pro Eye Palette - Walking On The Cosy Alley",
    brand: "CLIO",
    description: "An everyday eye shadow palette featuring 10 versatile shades ranging from matte to glitter finishes.",
    price: 2600,
    discountPrice: 2200,
    stock: 0, // Out of stock
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All"],
    categoryName: "Makeup"
  },
  
  // Haircare
  {
    name: "Perfect Serum Original 80ml",
    brand: "Mise En Scene",
    description: "Korea's No.1 hair serum! Enriched with 7 naturally derived oils to repair damaged hair, control frizz, and add an incredible shine.",
    price: 1100,
    discountPrice: 950,
    stock: 65,
    images: ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All"], // Can just use All for non-skincare
    categoryName: "Haircare"
  },
  {
    name: "Water Treatment Miracle 10",
    brand: "Moremo",
    description: "A liquid hair treatment that delivers intense moisture and repairs damaged cuticles in just 10 seconds.",
    price: 1850,
    discountPrice: 0,
    stock: 23,
    images: ["https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All"],
    categoryName: "Haircare"
  },
  
  // Bath & Body
  {
    name: "Green Tea Pure Body Lotion",
    brand: "Innisfree",
    description: "A refreshing body lotion infused with Jeju green tea extract that deeply hydrates the skin without leaving a sticky residue.",
    price: 1450,
    discountPrice: 1200,
    stock: 31,
    images: ["https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["All", "Dry"],
    categoryName: "Bath & Body"
  },
  {
    name: "Snail Bee High Content Lotion",
    brand: "Benton",
    description: "Formulated with Snail Secretion Filtrate and Bee Venom, this lotion improves skin tone and texture while providing soothing hydration.",
    price: 1650,
    discountPrice: 1400,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1615397323719-2f22b7c0ceeb?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: true,
    skinType: ["Acne Prone", "Sensitive"],
    categoryName: "Bath & Body"
  },
  
  // Fragrances (New Category)
  {
    name: "Blackberry & Bay Cologne 30ml",
    brand: "Jo Malone",
    description: "Childhood memories of blackberry picking. A burst of deep, tart blackberry juice, blending with the freshness of just-gathered bay and brambly woods.",
    price: 8500,
    discountPrice: 7900,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: false,
    skinType: ["All"],
    categoryName: "Fragrances"
  },
  {
    name: "Miss Dior Blooming Bouquet 50ml",
    brand: "Dior",
    description: "A fresh and sparkling eau de toilette fashioned like a dress embroidered with flowers.",
    price: 11500,
    discountPrice: 0,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: false,
    skinType: ["All"],
    categoryName: "Fragrances"
  },
  
  // Tools & Accessories (New Category)
  {
    name: "Pro Foundation Brush #47",
    brand: "Sephora",
    description: "A uniquely tapered brush for a foolproof finish that applies liquid and cream foundations evenly.",
    price: 2500,
    discountPrice: 1900,
    stock: 45,
    images: ["https://images.unsplash.com/photo-1590159763121-7c91350a4552?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: false,
    skinType: ["All"],
    categoryName: "Tools & Accessories"
  },
  {
    name: "Rose Quartz Facial Roller",
    brand: "Herbivore",
    description: "A facial roller built to have a cooling, soothing effect on the skin, promote drainage from the face, and reduce facial tension.",
    price: 3200,
    discountPrice: 2800,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1615397323719-2f22b7c0ceeb?auto=format&fit=crop&w=600&q=80"],
    isKBeauty: false,
    skinType: ["All"],
    categoryName: "Tools & Accessories"
  }
];

module.exports = products;