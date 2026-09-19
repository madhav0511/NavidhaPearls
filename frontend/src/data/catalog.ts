export type Category = "Pendants" | "Necklaces" | "Earrings" | "Rings" | "Bracelets";
export type Material = "925 Silver" | "Pearls" | "Champagne Gold";

export interface Product {
  id: string;
  name: string;
  category: Category;
  material: Material;
  price: number;
  description: string;
  details: string;
  image: string;
  alt: string;
  tag: string;
}

export interface CraftStory {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

const imageUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=84`;

export const logoUrl =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_f568da87-ee7b-4158-a441-dd43970bd712/artifacts/6x45f0ay_image.png";

export const heroImage = imageUrl("photo-1613966561243-c6959a886009");

export const products: Product[] = [
  {
    id: "moonlit-pearl-collar",
    name: "Moonlit Pearl Collar",
    category: "Necklaces",
    material: "Pearls",
    price: 14800,
    tag: "New chapter",
    description: "A soft strand of freshwater pearls held in a sculptural silver embrace.",
    details: "Freshwater pearls · 925 silver clasp · 16–18 in adjustable chain",
    image: imageUrl("photo-1611652032931-10fc009c980a"),
    alt: "Luminous pearl necklace on ivory silk",
  },
  {
    id: "thewa-sun-pendant",
    name: "Thewa Sun Pendant",
    category: "Pendants",
    material: "Champagne Gold",
    price: 17600,
    tag: "Crafted in India",
    description: "A small golden sun inspired by Thewa glasswork from Pratapgarh.",
    details: "18k champagne gold vermeil · hand-set glass · 20 in chain",
    image: imageUrl("photo-1720093601709-66ce9c0068a1"),
    alt: "Warm gold pendant arranged on a neutral surface",
  },
  {
    id: "quiet-arc-hoops",
    name: "Quiet Arc Hoops",
    category: "Earrings",
    material: "925 Silver",
    price: 7200,
    tag: "Everyday icon",
    description: "A weightless, hand-finished arc that catches light with every turn.",
    details: "Hallmarked 925 silver · hypoallergenic posts · 28 mm drop",
    image: imageUrl("photo-1611087388916-b6c97e01735b"),
    alt: "Gold-toned hoop earrings resting on folded ivory fabric",
  },
  {
    id: "gulabi-bloom-ring",
    name: "Gulabi Bloom Ring",
    category: "Rings",
    material: "Champagne Gold",
    price: 9800,
    tag: "Limited edit",
    description: "A blush enamel bloom that nods to the colour and precision of Varanasi.",
    details: "Champagne gold finish · hand-enamelled detail · adjustable band",
    image: imageUrl("photo-1702476320482-0736c4b962f5"),
    alt: "Delicate gold ring on a pale surface",
  },
  {
    id: "silver-tide-cuff",
    name: "Silver Tide Cuff",
    category: "Bracelets",
    material: "925 Silver",
    price: 11200,
    tag: "Navidha Silver",
    description: "An architectural cuff with a quiet strength, shaped to sit close to the wrist.",
    details: "Tarnish-resistant 925 silver · hand-polished · open fit",
    image: imageUrl("photo-1543294001-f7cd5d7fb516"),
    alt: "Silver jewelry detail in a soft blue-gray setting",
  },
  {
    id: "river-pearl-drop",
    name: "River Pearl Drop",
    category: "Earrings",
    material: "Pearls",
    price: 8600,
    tag: "Soft luster",
    description: "One imperfectly beautiful pearl, suspended from a slender silver line.",
    details: "Freshwater pearl · sterling silver hook · 42 mm drop",
    image: imageUrl("photo-1594823204889-68bcbb0e549e"),
    alt: "Pearl and gold earrings in morning light",
  },
  {
    id: "filigree-heirloom-ring",
    name: "Filigree Heirloom Ring",
    category: "Rings",
    material: "925 Silver",
    price: 6400,
    tag: "Heritage form",
    description: "Fine silver filigree translated into a ring that feels both old and new.",
    details: "Hallmarked 925 silver · Karimnagar-inspired filigree · sizes 6–10",
    image: imageUrl("photo-1599643478518-a784e5dc4c8f"),
    alt: "Fine silver ring with a sculptural surface",
  },
  {
    id: "golden-hour-chain",
    name: "Golden Hour Chain",
    category: "Necklaces",
    material: "Champagne Gold",
    price: 13400,
    tag: "Layering piece",
    description: "A fluid chain with a low, warm shine made for layering or standing alone.",
    details: "18k champagne gold vermeil · lobster clasp · 18 in length",
    image: imageUrl("photo-1515562141207-7a88fb7ce338"),
    alt: "Minimal gold chain jewelry on a neutral background",
  },
];

export const craftStories: CraftStory[] = [
  {
    id: "thewa",
    name: "Thewa",
    location: "Pratapgarh, Rajasthan",
    description: "Gold craftsmanship meets richly coloured glass in a tradition born in the royal workshops of Rajasthan.",
    image: imageUrl("photo-1611955167811-4711904bb9f8"),
  },
  {
    id: "hupari",
    name: "Hupari Silver",
    location: "Kolhapur, Maharashtra",
    description: "Handcrafted silver forms carry the enduring character of Maharashtra, made to be lived in.",
    image: imageUrl("photo-1543294001-f7cd5d7fb516"),
  },
  {
    id: "meenakari",
    name: "Gulabi Meenakari",
    location: "Varanasi, Uttar Pradesh",
    description: "Delicate pink enamel brings a gentle, joyful note to intricate traditional ornamentation.",
    image: imageUrl("photo-1674465992629-f8f81a8fb6d9"),
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);