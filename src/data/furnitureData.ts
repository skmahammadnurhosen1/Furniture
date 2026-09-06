import { Product, Category } from '../types';

export const HERO_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85';

export const HERO_SOFA_THUMBNAIL =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Living Room',
    items: 'Sofas, Chairs, Tables',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80',
    slug: 'living-room',
  },
  {
    id: 'cat-2',
    name: 'Bedroom',
    items: 'Beds, Wardrobes',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80',
    slug: 'bedroom',
  },
  {
    id: 'cat-3',
    name: 'Dining Room',
    items: 'Tables, Chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80',
    slug: 'dining-room',
  },
  {
    id: 'cat-4',
    name: 'Office',
    items: 'Desks, Chairs',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=700&q=80',
    slug: 'office',
  },
  {
    id: 'cat-5',
    name: 'Outdoor',
    items: 'Chairs, Loungers',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=700&q=80',
    slug: 'outdoor',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Modern Lounge Chair',
    category: 'Chairs',
    room: 'Living Room',
    price: 199,
    originalPrice: 249,
    rating: 5.0,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    description:
      'Curved ergonomic lounge armchair upholstered in textured woven bouclé with solid ash wood tapered legs. Designed for supreme relaxation with high-density memory foam padding.',
    dimensions: '32"W x 34"D x 31"H',
    materials: ['Solid Ash Wood', 'Bouclé Weave', 'High-Resilience Foam'],
    colors: [
      { name: 'Warm Oatmeal', hex: '#E6DFC9' },
      { name: 'Charcoal Wool', hex: '#373A3C' },
      { name: 'Terracotta', hex: '#B85D43' },
    ],
    isBestSeller: true,
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Wooden Dining Set',
    category: 'Tables',
    room: 'Dining Room',
    price: 499,
    originalPrice: 599,
    rating: 5.0,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    description:
      'Solid natural oak dining table paired with four Scandinavian contoured curved dining chairs. Hand-finished with organic matte wax oil preserving natural grain beauty.',
    dimensions: '63"L x 35"W x 30"H',
    materials: ['Solid White Oak', 'Mortise & Tenon Joinery', 'Organic Oil Finish'],
    colors: [
      { name: 'Natural Oak', hex: '#D7BC95' },
      { name: 'Walnut Finish', hex: '#5A3D28' },
      { name: 'Smoked Oak', hex: '#2C2520' },
    ],
    isBestSeller: true,
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Minimalist Bed',
    category: 'Beds',
    room: 'Bedroom',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    description:
      'Clean low-profile wooden platform bed with floating aesthetic and integrated supportive headboard. Engineered with reinforced sprung slats for mattress longevity.',
    dimensions: 'Queen: 64"W x 84"L x 38"H',
    materials: ['Solid Solid Walnut', 'Multi-Layer Birch Slats', 'Matte Lacquer'],
    colors: [
      { name: 'Honey Wood', hex: '#C69C6D' },
      { name: 'Deep Walnut', hex: '#4A3525' },
      { name: 'Nordic Birch', hex: '#EAD7BA' },
    ],
    isBestSeller: true,
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Coffee Table',
    category: 'Tables',
    room: 'Living Room',
    price: 149,
    originalPrice: 199,
    rating: 5.0,
    reviewsCount: 87,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80',
    description:
      'Sculptural circular low coffee table crafted from solid turned timber. Soft organic beveled rim and sturdy monolithic base add understated luxury to any living area.',
    dimensions: '36"Dia x 16"H',
    materials: ['Sustainably Harvested Oak', 'Water-Resistant Sealant'],
    colors: [
      { name: 'Warm Oak', hex: '#D2B48C' },
      { name: 'Ebony Stain', hex: '#1C1917' },
    ],
    isBestSeller: true,
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Modern Curved Sofa',
    category: 'Sofas',
    room: 'Living Room',
    price: 399,
    originalPrice: 489,
    rating: 5.0,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description:
      'Architectural curved modular sectional couch upholstered in premium stain-resistant textured fabric. Sits comfortably with extra-deep seating and plush feather-blend cushions.',
    dimensions: '104"W x 62"D x 30"H',
    materials: ['Solid Hardwood Frame', 'Performance Linen Blend', 'Pocket Spring Core'],
    colors: [
      { name: 'Cream Linen', hex: '#F3EFE6' },
      { name: 'Stone Grey', hex: '#8F8B82' },
      { name: 'Caramel', hex: '#B87A44' },
    ],
    isBestSeller: true,
    isNew: true,
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Scandi Ergonomic Desk',
    category: 'Tables',
    room: 'Office',
    price: 279,
    originalPrice: 329,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    description:
      'Spacious minimalist workspace desk with concealed wire-management channels, solid oak legs, and scratch-resistant matte satin worktop.',
    dimensions: '48"W x 24"D x 30"H',
    materials: ['Solid Oak', 'Satin Laminate', 'Powder-Coated Steel'],
    colors: [
      { name: 'Natural Oak', hex: '#DFCBAC' },
      { name: 'Midnight Black', hex: '#212121' },
    ],
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Teak Patio Lounger',
    category: 'Chairs',
    room: 'Outdoor',
    price: 229,
    originalPrice: 289,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    description:
      'Grade-A solid teak outdoor armchair with quick-dry reticulated foam cushion covered in weather-resistant Sunbrella fabric.',
    dimensions: '30"W x 34"D x 28"H',
    materials: ['Grade A Teak', 'Sunbrella Fabric', 'Stainless Steel Hardware'],
    colors: [
      { name: 'Natural Teak', hex: '#C29864' },
      { name: 'Weathered Grey', hex: '#8C857B' },
    ],
    inStock: true,
  },
  {
    id: 'prod-8',
    name: 'Velvet Cloud Modular Sofa',
    category: 'Sofas',
    room: 'Living Room',
    price: 549,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    description:
      'Ultra-deep lounging sofa featuring plush ribbed Italian velvet and modular configurations that effortlessly adapt to your living space.',
    dimensions: '96"W x 40"D x 32"H',
    materials: ['Italian Performance Velvet', 'Kiln-Dried Birch', 'Goose Feather Fill'],
    colors: [
      { name: 'Alabaster', hex: '#EFECE6' },
      { name: 'Forest Moss', hex: '#3E4D3E' },
      { name: 'Amber Cognac', hex: '#A35D29' },
    ],
    inStock: true,
  },
];

export const PROMO_BANNER_1 = {
  subtitle: 'LIMITED TIME OFFER',
  title: 'Get Up To\n30% Off',
  description: 'On Selected Items',
  buttonText: 'Shop Now',
  image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
};

export const PROMO_BANNER_2 = {
  subtitle: 'New Collection',
  title: 'Modern Sofas',
  startingPrice: '$299',
  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
};

export const NEWSLETTER_IMAGE =
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80';
