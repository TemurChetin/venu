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

export interface SellerImageFullUrl {
  key: string;
  path: string;
  status: number;
}

export interface ShopImageFullUrl {
  key: string | null;
  path: string | null;
  status: number;
}

export interface Shop {
  id: number;
  seller_id: number;
  name: string;
  slug: string;
  address: string;
  contact: string;
  image: string;
  image_storage_type: string;
  bottom_banner: string;
  bottom_banner_storage_type: string;
  offer_banner: string | null;
  offer_banner_storage_type: string;
  vacation_start_date: string | null;
  vacation_end_date: string | null;
  vacation_note: string | null;
  vacation_status: boolean;
  temporary_close: boolean;
  created_at: string;
  updated_at: string;
  banner: string;
  banner_storage_type: string;
  long: string;
  lat: string;
  region_id: number;
  district_id: number;
  image_full_url: ShopImageFullUrl;
  bottom_banner_full_url: ShopImageFullUrl;
  offer_banner_full_url: ShopImageFullUrl;
  banner_full_url: ShopImageFullUrl;
}

export interface SellerStorage {
  id: number;
  data_type: string;
  data_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Seller {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  image: string;
  email: string;
  password: string;
  status: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  bank_name: string;
  branch: string;
  account_no: string;
  holder_name: string;
  auth_token: string | null;
  sales_commission_percentage: number | null;
  gst: number | null;
  cm_firebase_token: string | null;
  pos_status: number;
  minimum_order_amount: number;
  free_delivery_status: number;
  free_delivery_over_amount: number;
  app_language: string;
  vat_percent: number;
  inn: number;
  image_full_url: SellerImageFullUrl;
  shop: Shop;
  storage: SellerStorage[];
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

// Product Detail Types
export type ProductDetailResponse = Product & {
  details?: string;
  short_description?: string;
  seller?: Seller;

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
