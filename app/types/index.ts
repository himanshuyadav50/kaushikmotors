export interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  mileage: number;
  description: string;
  status: 'available' | 'sold' | 'reserved';
  featured: boolean;
  images: string[];
  specs: {
    engine?: string;
    power?: string;
    seats?: number;
    color?: string;
    owners?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  vehicleId?: string;
  vehicleTitle?: string;
  status: 'new' | 'contacted' | 'follow-up' | 'converted' | 'lost';
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface PageContent {
  slug: string;
  title: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}
