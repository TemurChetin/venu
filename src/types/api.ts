// API Response Types

export interface ImageUrl {
  key: string;
  path: string;
  status: number;
}

export interface ThumbnailUrl {
  key: string;
  path: string;
  status: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  product_type: string;
  unit_price: number;
  discount: number;
  discount_type: string;
  current_stock: number;
  thumbnail?: string;
  thumbnail_full_url?: ThumbnailUrl;
  rating?: number[];
  review_count?: number;
  reviews_count?: number;
  wish_list?: number;
  wish_list_count?: number;
  images_full_url?: ImageUrl[];
}

export interface ProductListResponse {
  total_size: number;
  limit: number;
  offset: number;
  products: Product[];
  min_price: number;
  max_price: number;
}

export interface BannerPhotoUrl {
  key: string;
  path: string;
  status: number;
}

export interface BannersResponse {
  id: number;
  photo: string;
  photo_full_url?: BannerPhotoUrl;
  banner_type: string;
  theme: string;
  published: number;
  url?: string;
  resource_type?: string;
  resource_id?: number;
  title?: string | null;
  sub_title?: string | null;
  button_text?: string | null;
  background_color?: string | null;
  product?: Product;
}

export interface GuestIdResponse {
  guest_id: number;
}

// Product Detail Types
export type ProductDetailResponse = Product & {
  description?: string;
  short_description?: string;
  seller?: {
    id: number;
    name: string;
    logo?: string;
    rating?: number;
    review_count?: number;
    product_count?: number;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    image?: string;
  };
  colors?: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  sizes?: Array<{
    id: number;
    name: string;
    value: string;
  }>;
  shipping_methods?: Array<{
    id: number;
    name: string;
    price: number;
    estimated_days: number;
  }>;
};

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
  user_avatar?: string;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  total_count?: number;
  average_rating?: number;
}

// Category Types
export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  icon_storage_type: string;
  parent_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  home_status: number;
  priority: number;
  products: any[];
  icon_full_url: {
    key: string;
    path: string;
    status: number;
  };
  translations: any[];
};

export interface CategoriesResponse extends Array<Category> {}
