import moonlitCollarWornImg from './assets/images/moonlit_collar_worn_1790492324343.jpg';
import moonlitCollarClaspImg from './assets/images/moonlit_collar_clasp_1790492337474.jpg';
import moonlitCollarFullImg from './assets/images/moonlit_collar_full_1790492350225.jpg';

export interface Product {
  id: string;
  name: string;
  category: 'Necklaces' | 'Pendants' | 'Earrings' | 'Rings' | 'Bracelets';
  material: 'Pearls' | '925 Silver' | 'Champagne Gold';
  price: number;
  tag: string;
  description: string;
  details: string;
  image: string;
  images: string[];
  alt: string;
}

export interface CraftStory {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  images: string[];
}

export interface CampaignImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export const BRAND_LOGO = 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/1pcibk65_image.png';

export const HERO_PORTRAIT = 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/sj9panj4_image.png';

export const PHILOSOPHY_PORTRAIT = 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/9blwded6_image.png';

export const PRODUCTS: Product[] = [
  {
    id: 'moonlit-pearl-collar',
    name: 'Moonlit Pearl Collar',
    category: 'Necklaces',
    material: 'Pearls',
    price: 14800,
    tag: 'New chapter',
    description: 'A soft strand of freshwater pearls held in a sculptural silver embrace.',
    details: 'Freshwater pearls · 925 silver clasp · 16–18 in adjustable chain',
    image: moonlitCollarWornImg,
    images: [
      moonlitCollarWornImg,
      moonlitCollarClaspImg,
      moonlitCollarFullImg
    ],
    alt: 'Moonlit Pearl Collar necklace with sculptural silver crescent clasp'
  },
  {
    id: 'thewa-sun-pendant',
    name: 'Thewa Sun Pendant',
    category: 'Pendants',
    material: 'Champagne Gold',
    price: 17600,
    tag: 'Crafted in India',
    description: 'A small golden sun inspired by Thewa glasswork from Pratapgarh.',
    details: '18k champagne gold vermeil · hand-set glass · 20 in chain',
    image: 'https://images.pexels.com/photos/38909347/pexels-photo-38909347.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/38909347/pexels-photo-38909347.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/13325937/pexels-photo-13325937.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.unsplash.com/photo-1705206548360-04e6982a7a42?auto=format&fit=crop&w=1200&q=85'
    ],
    alt: 'Warm gold pendant arranged on a neutral surface'
  },
  {
    id: 'quiet-arc-hoops',
    name: 'Quiet Arc Hoops',
    category: 'Earrings',
    material: '925 Silver',
    price: 7200,
    tag: 'Everyday icon',
    description: 'A weightless, hand-finished arc that catches light with every turn.',
    details: 'Hallmarked 925 silver · hypoallergenic posts · 28 mm drop',
    image: 'https://images.pexels.com/photos/15799252/pexels-photo-15799252.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/15799252/pexels-photo-15799252.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/34372589/pexels-photo-34372589.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.unsplash.com/photo-1654868683503-20371fea64e8?auto=format&fit=crop&w=1200&q=85'
    ],
    alt: 'Minimal silver hoop earrings'
  },
  {
    id: 'gulabi-bloom-ring',
    name: 'Gulabi Bloom Ring',
    category: 'Rings',
    material: 'Champagne Gold',
    price: 9800,
    tag: 'Limited edit',
    description: 'A blush enamel bloom that nods to the colour and precision of Varanasi.',
    details: 'Champagne gold finish · hand-enamelled detail · adjustable band',
    image: 'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/11567607/pexels-photo-11567607.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.unsplash.com/photo-1549048799-bf3b582ee17b?auto=format&fit=crop&w=1200&q=85',
      'https://images.pexels.com/photos/12486667/pexels-photo-12486667.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    alt: 'Pink gemstone and gold bloom ring'
  },
  {
    id: 'silver-tide-cuff',
    name: 'Silver Tide Cuff',
    category: 'Bracelets',
    material: '925 Silver',
    price: 11200,
    tag: 'Navidha Silver',
    description: 'An architectural cuff with a quiet strength, shaped to sit close to the wrist.',
    details: 'Tarnish-resistant 925 silver · hand-polished · open fit',
    image: 'https://images.pexels.com/photos/33858027/pexels-photo-33858027.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      'https://images.pexels.com/photos/33858027/pexels-photo-33858027.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/9145353/pexels-photo-9145353.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/pgz3deky_image.png'
    ],
    alt: 'Modern silver cuff bracelet'
  },
  {
    id: 'river-pearl-drop',
    name: 'River Pearl Drop',
    category: 'Earrings',
    material: 'Pearls',
    price: 8600,
    tag: 'Soft luster',
    description: 'One imperfectly beautiful pearl, suspended from a slender silver line.',
    details: 'Freshwater pearl · sterling silver hook · 42 mm drop',
    image: 'https://images.unsplash.com/photo-1654868683503-20371fea64e8?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1654868683503-20371fea64e8?auto=format&fit=crop&w=1200&q=85',
      'https://images.pexels.com/photos/7406059/pexels-photo-7406059.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.unsplash.com/photo-1654699991494-892326ee8171?auto=format&fit=crop&w=1200&q=85'
    ],
    alt: 'Freshwater pearl drop earrings'
  },
  {
    id: 'filigree-heirloom-ring',
    name: 'Filigree Heirloom Ring',
    category: 'Rings',
    material: '925 Silver',
    price: 6400,
    tag: 'Heritage form',
    description: 'Fine silver filigree translated into a ring that feels both old and new.',
    details: 'Hallmarked 925 silver · Karimnagar-inspired filigree · sizes 6–10',
    image: 'https://images.unsplash.com/photo-1586008604829-a16f775eec81?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1586008604829-a16f775eec81?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1594847267676-688b0579d562?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584581-2e0372975b46?auto=format&fit=crop&w=1200&q=85'
    ],
    alt: 'Ornate silver filigree ring'
  },
  {
    id: 'golden-hour-chain',
    name: 'Golden Hour Chain',
    category: 'Necklaces',
    material: 'Champagne Gold',
    price: 13400,
    tag: 'Layering piece',
    description: 'A fluid chain with a low, warm shine made for layering or standing alone.',
    details: '18k champagne gold vermeil · lobster clasp · 18 in length',
    image: 'https://images.unsplash.com/photo-1665194107347-09adc17c92a7?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1665194107347-09adc17c92a7?auto=format&fit=crop&w=1200&q=85',
      'https://images.pexels.com/photos/32480611/pexels-photo-32480611.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/13660667/pexels-photo-13660667.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    alt: 'Minimal champagne gold chain necklace'
  }
];

export const HERITAGE_CRAFTS: CraftStory[] = [
  {
    id: 'thewa',
    name: 'Colored Glasses Jewelry with Gold & Silver',
    location: 'Thewa, Pratapgarh (Rajasthan)',
    description: 'A luminous meeting of colored glass with gold and silver jewelry, rooted in the celebrated Thewa tradition.',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/qg4zt94l_image.png',
    images: [
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/qg4zt94l_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/h3qdnm85_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/cz9ublf7_image.png'
    ]
  },
  {
    id: 'hupari',
    name: 'Silver Jewelry',
    location: 'Hupari, Kolhapur (Maharastra)',
    description: 'Handcrafted silver forms carry the enduring character of Hupari, made to be lived in.',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/r2f4nzo9_image.png',
    images: [
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/r2f4nzo9_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/e4jkxttn_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/pgz3deky_image.png'
    ]
  },
  {
    id: 'meenakari',
    name: 'Gulabi Meenakari',
    location: 'Varanasi (Uttar Pradesh)',
    description: 'Delicate pink enamel brings a gentle, joyful note to intricate traditional ornamentation.',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/fm9nq9sh_image.png',
    images: [
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/fm9nq9sh_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/ocjluhap_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/jvl1w221_image.png'
    ]
  },
  {
    id: 'karimnagar',
    name: 'Silver Filigree from Karimnagar',
    location: '(Telangana)',
    description: 'Fine silver filigree shaped by patient hands into intricate patterns of remarkable delicacy.',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/sf5fr55d_image.png',
    images: [
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/sf5fr55d_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/hpch98m7_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/f5i8oxz3_image.png'
    ]
  },
  {
    id: 'cuttack',
    name: 'Silver Filigree from Cuttack',
    location: '(Odisa)',
    description: 'An intricate tradition of fine silver work, celebrated for delicate forms and distinctive Odia artistry.',
    image: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/0ifs0b9b_image.png',
    images: [
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/0ifs0b9b_image.png',
      'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/qwq6a4b8_image.png'
    ]
  }
];

export const CAMPAIGN_GALLERY: CampaignImage[] = [
  {
    id: 'luminous-layers',
    src: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/sj9panj4_image.png',
    alt: 'Indian woman wearing layered silver and pearl jewelry',
    title: 'Luminous Layers',
    caption: 'Freshwater pearls and silver, composed with quiet confidence.'
  },
  {
    id: 'pearls-of-permanence',
    src: 'https://customer-assets-jai6qajn.emergentagent.net/job_design-preview-395/artifacts/9blwded6_image.png',
    alt: 'Indian woman wearing an elaborate pearl collar and silver floral brooch',
    title: 'Pearls of Permanence',
    caption: 'A sculptural pearl collar anchored by an intricate silver bloom.'
  },
  {
    id: 'midnight-edit',
    src: 'https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/572101d51f69a3817f33977e910d8b6c39673c0db2c3ee661bc5e125815a32ad.jpeg',
    alt: 'Indian woman in a dark drape wearing silver and pearl jewelry',
    title: 'The Midnight Edit',
    caption: 'Pearl light against midnight silk — an expression of modern India.'
  },
  {
    id: 'quiet-brilliance',
    src: 'https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/82b55458ca83e407bc3cb0c6538522b9e4922f11d53cb8f60eea96fe7284c82b.jpeg',
    alt: 'Close portrait with pearl chandelier earrings and pearl collar',
    title: 'Quiet Brilliance',
    caption: 'Silver, pearl, and presence — nothing more is needed.'
  },
  {
    id: 'objects-of-desire',
    src: 'https://static.prod-images.emergentagent.com/jobs/f568da87-ee7b-4158-a441-dd43970bd712/images/a095091718efdc74f5dc9f654126ee162eadc5c19f4556acdf8ba01da636a633.jpeg',
    alt: 'Pearl strands, earrings, and a silver floral brooch on dark silk',
    title: 'Objects of Desire',
    caption: 'Hand-finished silver and luminous pearls, waiting to gather a story.'
  }
];

export const CATEGORIES = ['All', 'Pendants', 'Necklaces', 'Earrings', 'Rings', 'Bracelets'] as const;

export const MATERIALS = ['All materials', '925 Silver', 'Pearls', 'Champagne Gold'] as const;

export const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};
