# React loyihasida Subcategoryalarni olish va ishlatish

Bu qo'llanmada React loyihasida subcategoryalarni API'dan qanday olish va ishlatish haqida batafsil ma'lumot berilgan.

## 📋 Mündarija

1. [API Endpoint'lar](#api-endpoints)
2. [Request Formatlari](#request-formats)
3. [Response Strukturalari](#response-structures)
4. [React Misollari](#react-examples)
5. [TypeScript Type'lar](#typescript-types)

---

## 🔗 API Endpoints

### Base URL

https://venu.uz

### 1. Barcha kategoriyalar (subcategoryalar bilan)

**Endpoint:**

```
GET /api/v1/categories
```

**Query Parametrlar:**

- `guest_id` (required): Mehmon ID (odatda 1)
- `include_children` (optional): Subkategoriyalarni qaytarish (default: true)
- `seller_id` (optional): Sotuvchi ID (seller bo'yicha filtrlash uchun)
- `limit` (optional): Limit
- `offset` (optional): Offset

**To'liq URL misollari:**

```
GET https://theantique.uz/api/v1/categories?guest_id=1&include_children=true
GET https://theantique.uz/api/v1/categories?guest_id=1&include_children=true&seller_id=10
```

---

## 📤 Request Formatlari

### 1. Barcha kategoriyalar (subcategoryalar bilan)

**Request:**

```http
GET /api/v1/categories?guest_id=1&include_children=true HTTP/1.1
Host: theantique.uz
Content-Type: application/json
Accept: application/json
lang: uz
```

**cURL misoli:**

```bash
curl -X GET "https://theantique.uz/api/v1/categories?guest_id=1&include_children=true" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "lang: uz"
```

### 2. Seller bo'yicha kategoriyalar

**Request:**

```http
GET /api/v1/categories?guest_id=1&include_children=true&seller_id=10 HTTP/1.1
Host: theantique.uz
Content-Type: application/json
Accept: application/json
lang: uz
```

---

## 📥 Response Strukturalari

### Muvaffaqiyatli Response (200 OK)

**Response Body:**

```json
[
  {
    "id": 1,
    "name": "Elektronika",
    "slug": "elektronika",
    "icon": "https://theantique.uz/storage/category/icon1.png",
    "parent_id": null,
    "position": 1,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "icon_full_url": {
      "full_url": "https://theantique.uz/storage/category/icon1.png"
    },
    "childes": [
      {
        "id": 5,
        "name": "Telefonlar",
        "slug": "telefonlar",
        "icon": "https://theantique.uz/storage/category/icon5.png",
        "parent_id": 1,
        "position": 1,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z",
        "childes": [
          {
            "id": 10,
            "name": "Smartfonlar",
            "slug": "smartfonlar",
            "icon": "https://theantique.uz/storage/category/icon10.png",
            "parent_id": 5,
            "position": 1,
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
          },
          {
            "id": 11,
            "name": "Quloqchinlar",
            "slug": "quloqchinlar",
            "icon": "https://theantique.uz/storage/category/icon11.png",
            "parent_id": 5,
            "position": 2,
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
          }
        ]
      },
      {
        "id": 6,
        "name": "Noutbuklar",
        "slug": "noutbuklar",
        "icon": "https://theantique.uz/storage/category/icon6.png",
        "parent_id": 1,
        "position": 2,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z",
        "childes": []
      }
    ]
  },
  {
    "id": 2,
    "name": "Kiyim-kechak",
    "slug": "kiyim-kechak",
    "icon": "https://theantique.uz/storage/category/icon2.png",
    "parent_id": null,
    "position": 2,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "icon_full_url": {
      "full_url": "https://theantique.uz/storage/category/icon2.png"
    },
    "childes": [
      {
        "id": 7,
        "name": "Erkaklar kiyimi",
        "slug": "erkaklar-kiyimi",
        "icon": "https://theantique.uz/storage/category/icon7.png",
        "parent_id": 2,
        "position": 1,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z",
        "childes": []
      }
    ]
  }
]
```

**Response Struktura:**

- Response **array** ko'rinishida keladi (obyekt emas!)
- Har bir kategoriya ichida `childes` array'i bor (subcategoryalar)
- Har bir subcategorya ichida ham `childes` array'i bo'lishi mumkin (sub-subcategoryalar)

---

## ⚛️ React Misollari

### 1. Axios Instance yaratish

```javascript
// api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://theantique.uz", // yoki process.env.REACT_APP_API_URL
  timeout: 60000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json",
    lang: "uz", // Til kodi: uz, en, ru, Cyrl
  },
});

// Request interceptor - token qo'shish
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user_login_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xatoliklarni boshqarish
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xatolikni boshqarish
    if (error.response?.status === 401) {
      // Unauthorized - token yangilash yoki login sahifasiga yo'naltirish
      localStorage.removeItem("user_login_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. API Service yaratish

```javascript
// services/categoryService.js
import apiClient from "../api/client";

export const categoryService = {
  /**
   * Barcha kategoriyalarni olish (subcategoryalar bilan)
   * @param {Object} params - Query parametrlar
   * @param {number} params.guestId - Mehmon ID (default: 1)
   * @param {boolean} params.includeChildren - Subkategoriyalarni qaytarish (default: true)
   * @param {number} params.sellerId - Sotuvchi ID (ixtiyoriy)
   * @returns {Promise} API response
   */
  getAllCategories: async (params = {}) => {
    const { guestId = 1, includeChildren = true, sellerId = null } = params;

    const queryParams = new URLSearchParams({
      guest_id: guestId.toString(),
      include_children: includeChildren.toString(),
    });

    if (sellerId) {
      queryParams.append("seller_id", sellerId.toString());
    }

    const response = await apiClient.get(`/api/v1/categories?${queryParams}`);
    return response.data; // Array ko'rinishida kategoriyalar
  },

  /**
   * Kategoriya ID bo'yicha subcategoryalarni olish
   * @param {number} categoryId - Kategoriya ID
   * @param {number} guestId - Mehmon ID (default: 1)
   * @returns {Promise<Array>} Subcategoryalar ro'yxati
   */
  getSubCategoriesByCategoryId: async (categoryId, guestId = 1) => {
    const response = await apiClient.get(
      `/api/v1/categories?guest_id=${guestId}&include_children=true`
    );

    // Kategoriyalar ichidan kerakli kategoriyani topish
    const categories = response.data;
    const category = categories.find((cat) => cat.id === categoryId);

    return category?.childes || [];
  },

  /**
   * Barcha subcategoryalarni olish (barcha kategoriyalardan)
   * @param {Object} params - Query parametrlar
   * @returns {Promise<Array>} Barcha subcategoryalar
   */
  getAllSubCategories: async (params = {}) => {
    const { guestId = 1, sellerId = null } = params;

    const queryParams = new URLSearchParams({
      guest_id: guestId.toString(),
      include_children: "true",
    });

    if (sellerId) {
      queryParams.append("seller_id", sellerId.toString());
    }

    const response = await apiClient.get(`/api/v1/categories?${queryParams}`);
    const categories = response.data;

    // Barcha kategoriyalardan subcategoryalarni yig'ish
    const allSubCategories = [];
    categories.forEach((category) => {
      if (category.childes && category.childes.length > 0) {
        allSubCategories.push(...category.childes);
      }
    });

    return allSubCategories;
  },
};
```

### 3. React Hook yaratish (Custom Hook)

```javascript
// hooks/useCategories.js
import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";

export const useCategories = (params = {}) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories(params);
      setCategories(data);

      // Barcha subcategoryalarni yig'ish
      const allSubCategories = [];
      data.forEach((category) => {
        if (category.childes && category.childes.length > 0) {
          allSubCategories.push(...category.childes);
        }
      });
      setSubCategories(allSubCategories);
    } catch (err) {
      setError(err.message || "Kategoriyalarni yuklashda xatolik");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [JSON.stringify(params)]);

  return {
    categories,
    subCategories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

export const useSubCategories = (categoryId, guestId = 1) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getSubCategoriesByCategoryId(
        categoryId,
        guestId
      );
      setSubCategories(data);
    } catch (err) {
      setError(err.message || "Subcategoryalarni yuklashda xatolik");
      console.error("Error fetching subcategories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId, guestId]);

  return {
    subCategories,
    loading,
    error,
    refetch: fetchSubCategories,
  };
};
```

### 4. React Component misollari

#### 4.1. Barcha kategoriyalar va subcategoryalarni ko'rsatish

```javascript
// components/CategoryList.jsx
import React from "react";
import { useCategories } from "../hooks/useCategories";

const CategoryList = () => {
  const { categories, subCategories, loading, error } = useCategories({
    guestId: 1,
    includeChildren: true,
  });

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div>Xatolik: {error}</div>;
  }

  return (
    <div>
      <h2>Kategoriyalar</h2>
      {categories.map((category) => (
        <div key={category.id} style={{ marginBottom: "20px" }}>
          <h3>{category.name}</h3>
          {category.childes && category.childes.length > 0 && (
            <div style={{ marginLeft: "20px" }}>
              <h4>Subcategoryalar:</h4>
              {category.childes.map((subCategory) => (
                <div key={subCategory.id} style={{ marginLeft: "20px" }}>
                  <p>- {subCategory.name}</p>
                  {subCategory.childes && subCategory.childes.length > 0 && (
                    <div style={{ marginLeft: "20px" }}>
                      {subCategory.childes.map((subSubCategory) => (
                        <p key={subSubCategory.id}>-- {subSubCategory.name}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <h2>Barcha Subcategoryalar ({subCategories.length})</h2>
      <ul>
        {subCategories.map((subCategory) => (
          <li key={subCategory.id}>{subCategory.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
```

#### 4.2. Kategoriya ID bo'yicha subcategoryalarni ko'rsatish

```javascript
// components/SubCategoryList.jsx
import React from "react";
import { useSubCategories } from "../hooks/useCategories";

const SubCategoryList = ({ categoryId }) => {
  const { subCategories, loading, error } = useSubCategories(categoryId);

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div>Xatolik: {error}</div>;
  }

  if (subCategories.length === 0) {
    return <div>Subcategoryalar topilmadi</div>;
  }

  return (
    <div>
      <h3>Subcategoryalar ({subCategories.length})</h3>
      <ul>
        {subCategories.map((subCategory) => (
          <li key={subCategory.id}>
            <strong>{subCategory.name}</strong>
            {subCategory.childes && subCategory.childes.length > 0 && (
              <ul>
                {subCategory.childes.map((subSubCategory) => (
                  <li key={subSubCategory.id}>{subSubCategory.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubCategoryList;
```

#### 4.3. Seller bo'yicha kategoriyalar

```javascript
// components/SellerCategories.jsx
import React from "react";
import { useCategories } from "../hooks/useCategories";

const SellerCategories = ({ sellerId }) => {
  const { categories, loading, error } = useCategories({
    guestId: 1,
    includeChildren: true,
    sellerId: sellerId,
  });

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div>Xatolik: {error}</div>;
  }

  return (
    <div>
      <h2>Seller Kategoriyalari</h2>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.childes && category.childes.length > 0 && (
            <ul>
              {category.childes.map((subCategory) => (
                <li key={subCategory.id}>{subCategory.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default SellerCategories;
```

### 5. React Query bilan ishlatish (Tanlangan yondashuv)

```javascript
// hooks/useCategoriesQuery.js
import { useQuery } from "react-query";
import { categoryService } from "../services/categoryService";

export const useCategoriesQuery = (params = {}) => {
  return useQuery(
    ["categories", params],
    () => categoryService.getAllCategories(params),
    {
      staleTime: 5 * 60 * 1000, // 5 daqiqa
      cacheTime: 10 * 60 * 1000, // 10 daqiqa
    }
  );
};

export const useSubCategoriesQuery = (categoryId, guestId = 1) => {
  return useQuery(
    ["subCategories", categoryId, guestId],
    () => categoryService.getSubCategoriesByCategoryId(categoryId, guestId),
    {
      enabled: !!categoryId, // Faqat categoryId bo'lsa ishlaydi
      staleTime: 5 * 60 * 1000,
    }
  );
};
```

**React Query bilan ishlatish:**

```javascript
// components/CategoryListWithReactQuery.jsx
import React from "react";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";

const CategoryListWithReactQuery = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useCategoriesQuery({
    guestId: 1,
    includeChildren: true,
  });

  if (isLoading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (error) {
    return <div>Xatolik: {error.message}</div>;
  }

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          {category.childes?.map((subCategory) => (
            <div key={subCategory.id}>{subCategory.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoryListWithReactQuery;
```

---

## 📘 TypeScript Type'lar

```typescript
// types/category.ts

export interface IconFullUrl {
  full_url: string;
}

export interface SubSubCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  childes?: never; // Sub-subcategoryalarda childes bo'lmaydi
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  childes?: SubSubCategory[]; // Sub-subcategoryalar
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
  icon_full_url?: IconFullUrl;
  childes?: SubCategory[]; // Subcategoryalar
}

// API Response type
export type CategoriesResponse = Category[];
```

**TypeScript bilan Service:**

```typescript
// services/categoryService.ts
import apiClient from "../api/client";
import { Category, SubCategory } from "../types/category";

export const categoryService = {
  getAllCategories: async (
    params: {
      guestId?: number;
      includeChildren?: boolean;
      sellerId?: number;
    } = {}
  ): Promise<Category[]> => {
    const { guestId = 1, includeChildren = true, sellerId = null } = params;

    const queryParams = new URLSearchParams({
      guest_id: guestId.toString(),
      include_children: includeChildren.toString(),
    });

    if (sellerId) {
      queryParams.append("seller_id", sellerId.toString());
    }

    const response = await apiClient.get<Category[]>(
      `/api/v1/categories?${queryParams}`
    );
    return response.data;
  },

  getSubCategoriesByCategoryId: async (
    categoryId: number,
    guestId: number = 1
  ): Promise<SubCategory[]> => {
    const response = await apiClient.get<Category[]>(
      `/api/v1/categories?guest_id=${guestId}&include_children=true`
    );

    const categories = response.data;
    const category = categories.find((cat) => cat.id === categoryId);

    return category?.childes || [];
  },
};
```

---

## 🔍 Xatoliklar bilan ishlash

```javascript
// services/categoryService.js (xatoliklar bilan)
import apiClient from "../api/client";

export const categoryService = {
  getAllCategories: async (params = {}) => {
    try {
      const { guestId = 1, includeChildren = true, sellerId = null } = params;

      const queryParams = new URLSearchParams({
        guest_id: guestId.toString(),
        include_children: includeChildren.toString(),
      });

      if (sellerId) {
        queryParams.append("seller_id", sellerId.toString());
      }

      const response = await apiClient.get(`/api/v1/categories?${queryParams}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Noma'lum xatolik",
        status: error.response?.status,
      };
    }
  },
};
```

---

## 📝 Eslatmalar

1. **Response Format**: API response **array** ko'rinishida keladi, obyekt emas!
2. **Subcategoryalar**: `childes` maydoni ichida subcategoryalar bor
3. **Sub-Subcategoryalar**: Subcategoryalar ichida ham `childes` bo'lishi mumkin
4. **Guest ID**: Har doim `guest_id` parametri kerak (odatda 1)
5. **include_children**: Subcategoryalarni olish uchun `include_children=true` bo'lishi kerak
6. **Seller ID**: Seller bo'yicha filtrlash uchun `seller_id` parametri qo'shish mumkin

---

## 🚀 Tezkor boshlash

1. Axios o'rnatish:

```bash
npm install axios
```

2. API client yaratish (`api/client.js`)

3. Service yaratish (`services/categoryService.js`)

4. Hook yaratish (`hooks/useCategories.js`)

5. Component'da ishlatish:

```javascript
import { useCategories } from "./hooks/useCategories";

function App() {
  const { categories, loading } = useCategories();
  // ...
}
```

---

## 📞 Qo'shimcha ma'lumot

- Base URL: `https://theantique.uz` yoki `https://venu.uz`
- API Version: `v1`
- Response Format: JSON
- Authentication: Bearer token (ixtiyoriy, guest_id kifoya)
