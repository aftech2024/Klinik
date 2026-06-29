const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export type Branch = {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  photoUrl: string | null;
  facilities: string[];
  operatingHours: { weekday?: { open: string; close: string }; saturday?: { open: string; close: string }; sunday?: { open: string; close: string } };
  latitude: number | null;
  longitude: number | null;
};

export type Doctor = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  photoUrl: string | null;
  experience: number;
  sortOrder: number;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string | null;
  imageUrl: string | null;
  category: string;
  sortOrder: number;
};

export type Promotion = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  category: string | null;
  authorName: string | null;
  publishedAt: string | null;
  viewCount: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  photoUrl: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
};

export const api = {
  branches: () => get<Branch[]>('/api/branches'),
  branch: (slug: string) => get<Branch>(`/api/branches/${slug}`),
  doctors: (params?: string) => get<Doctor[]>(`/api/doctors${params ? `?${params}` : ''}`),
  doctor: (slug: string) => get<Doctor>(`/api/doctors/${slug}`),
  services: () => get<Service[]>('/api/services'),
  service: (slug: string) => get<Service>(`/api/services/${slug}`),
  promotions: () => get<Promotion[]>('/api/promotions'),
  articles: () => get<Article[]>('/api/articles'),
  article: (slug: string) => get<Article>(`/api/articles/${slug}`),
  testimonials: () => get<Testimonial[]>('/api/testimonials'),
  faqs: () => get<Faq[]>('/api/faqs'),
};
