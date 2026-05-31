const offers = [
  {
    title: "Buy 1 Get 1 Free on Sunscreens",
    slug: "bogo-sunscreens",
    description: "Stock up for the summer! Buy any sunscreen and get another one absolutely free. Keep your skin protected.",
    image: "/images/offers/sunscreen_offer_banner.png",
    offerType: ["BOGO"],
    isActive: true,
    bogoBuyProductNames: ["Relief Sun: Rice + Probiotics SPF50+ PA++++"],
    bogoGetProductNames: ["Relief Sun: Rice + Probiotics SPF50+ PA++++"]
  },
  {
    title: "Glow Essentials Bundle",
    slug: "glow-essentials-bundle",
    description: "Get the ultimate glow with our curated essentials bundle. Features a toner, essence, and lip mask at a heavily discounted price.",
    image: "/images/offers/glow_bundle_banner.png",
    offerType: ["BUNDLE"],
    isActive: true,
    bundles: [
      {
        bundleName: "Ultimate Glow Kit",
        productNames: ["Advanced Snail 96 Mucin Power Essence 100ml", "Heartleaf 77% Soothing Toner 250ml", "Lip Sleeping Mask EX - Berry 20g"],
        bundlePrice: 4500
      }
    ]
  },
  {
    title: "Luxury Fragrance Discovery",
    slug: "fragrance-discovery",
    description: "Discover our new fragrance collection. Enjoy a flat 20% discount on all luxury perfumes this week.",
    image: "/images/offers/fragrance_offer_banner.png",
    offerType: ["PERCENTAGE"],
    discountValue: 20,
    isActive: true,
    productNames: ["Blackberry & Bay Cologne 30ml", "Miss Dior Blooming Bouquet 50ml"]
  }
];

module.exports = offers;
