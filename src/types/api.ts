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

export interface ProductListResponse {
  total_size: number;
  limit: number;
  offset: number;
  products: Product[];
  min_price: number;
  max_price: number;
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

// Wishlist Types
export type WishlistProduct = {
  id: number;
  customer_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  productFullInfo?: ProductFullInfo;
  product_full_info?: ProductFullInfo;
};

export type ProductFullInfo = {
  id: number;
  added_by: string;
  user_id: number;
  name: string;
  slug: string;
  product_type: string;
  category_ids?: Array<{ id: string; position: number }> | string;
  category_id: number;
  sub_category_id: number;
  sub_sub_category_id: number;
  brand_id: number;
  unit: string;
  min_qty: number;
  refundable: number;
  digital_product_type: string | null;
  digital_file_ready: string | null;
  digital_file_ready_storage_type: string;
  images: string;
  color_image: string;
  thumbnail: string;
  thumbnail_storage_type: string;
  preview_file: string | null;
  preview_file_storage_type: string;
  featured: number | null;
  flash_deal: number | null;
  video_provider: string;
  video_url: string | null;
  colors?: any[] | string;
  variant_product: number;
  attributes?: any[] | string;
  choice_options?: any[] | string;
  variation?: any[] | string;
  digital_product_file_types: any[];
  digital_product_extensions: any[];
  published: number;
  unit_price: number;
  purchase_price: number;
  tax: number;
  tax_type: string;
  tax_model: string;
  discount: number;
  discount_type: string;
  current_stock: number;
  minimum_order_qty: number;
  details: string;
  free_shipping: number;
  attachment: string | null;
  created_at: string;
  updated_at: string;
  status: number;
  featured_status: number;
  meta_title: string;
  meta_description: string;
  meta_image?: string;
  request_status?: number;
  denied_note?: string | null;
  shipping_cost?: number;
  multiply_qty?: number;
  temp_shipping_cost?: number | null;
  is_shipping_cost_updated?: number | null;
  code?: string;
  mxik?: string;
  weight?: string;
  height?: string;
  width?: string;
  length?: string;
  package_code?: string;
  is_install?: number;
  is_seasonal?: number;
  is_discount?: number;
  is_shop_temporary_close?: number;
  thumbnail_full_url?: {
    key: string;
    path: string;
    status: number;
  };
  preview_file_full_url?: {
    key: string | null;
    path: string | null;
    status: number;
  };
  color_images_full_url?: Array<any>;
  meta_image_full_url?: {
    key: string;
    path: string;
    status: number;
  };
  images_full_url?: Array<{
    key: string;
    path: string;
    status: number;
  }>;
  digital_file_ready_full_url?: {
    key: string | null;
    path: string | null;
    status: number;
  };
  clearance_sale?: number | null;
  translations?: any[];
  reviews?: any[];
  colors_formatted?: any[];
};

export type WishlistResponse = WishlistProduct[];

// Cart Types
export interface CartItem {
  id: number;
  customer_id?: number;
  cart_group_id?: string;
  product_id: number;
  product_type?: string;
  digital_product_type?: string | null;
  color?: string | null;
  choices?: any[];
  variations?: any[];
  variant?: string;
  quantity: number;
  price: number;
  tax: number;
  discount: number;
  tax_model?: string;
  is_checked?: number;
  slug?: string;
  name?: string;
  thumbnail?: string;
  seller_id?: number;
  seller_is?: string;
  created_at?: string;
  updated_at?: string;
  shop_info?: string;
  shipping_cost?: number;
  shipping_type?: string;
  is_guest?: number;
  is_product_available?: number;
  minimum_order_amount_info?: number;
  free_delivery_order_amount?: any;
  product?: ProductFullInfo;
  product_full_info?: ProductFullInfo;
  shop?: Shop;
  size?: string;
}

export interface CartResponse extends Array<CartItem> {}

export interface AddToCartRequest {
  id: number;
  quantity: number;
  variant?: string;
  color?: string;
}

export interface RemoveFromCartRequest {
  key: number;
}

export interface UpdateCartRequest {
  key: number;
  quantity: number;
}

// Order Types
export interface Order {
  id: number;
  order_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
  delivery_address?: string;
  recipient?: string;
  phone?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  price: number;
  image?: string;
  variant?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total_size?: number;
  limit?: number;
  offset?: number;
}

// Address Types
export interface Address {
  id: number;
  customer_id: string;
  is_guest: boolean;
  contact_person_name: string;
  email: string | null;
  address_type: "home" | "office" | "other";
  address: string;
  city: string;
  zip: string;
  phone: string;
  created_at: string;
  updated_at: string;
  state: string | null;
  country: string;
  latitude: string;
  longitude: string;
  is_billing: boolean;
  region_id: number;
  delivery_method: string;
  district_id: number;
}

export interface AddressesResponse extends Array<Address> {}

// Delivery Method Types
export interface DeliveryMethod {
  title: string;
  code: "yandex" | "bts" | "free";
}

export interface DeliveryMethodsResponse extends Array<DeliveryMethod> {}

// Shipping Method Types
export interface ChooseShippingMethodRequest {
  id: number;
  guest_id: string;
  cart_group_id: string;
}

// Calculate Types
export interface CalculateDeliveryRequest {
  delivery_method: string;
  customer_id: number;
  long: number;
  lat: number;
  district: string;
}

export interface CalculateDeliveryResponse {
  detail: string;
  price: number;
}

// Order Create Types
export interface CreateOrderRequest {
  order_note?: string;
  customer_id: string;
  address_id: string;
  billing_address_id: string;
  coupon_code?: string;
  coupon_discount?: string;
  payment_platform?: string;
  payment_method: "click" | "payme";
  callback?: string | null;
  payment_request_from?: string;
  guest_id: string;
  is_guest: boolean;
  is_check_create_account?: string;
  password?: string;
  delivery_method: string;
}

export interface CreateOrderResponse {
  redirect_link: string;
  new_user: number;
}
