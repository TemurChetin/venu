import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// ================================
// Authenticated Axios Instance
// ================================

// Bu instance `Authorization` header bilan protected API requestlarini yuborish uchun ishlatiladi
export const instanceAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API + "/api", // API endpoint
});

// ================================
// Request Interceptor
// ================================
// Har bir requestdan oldin sessionni tekshiradi va tokenni headerga qo'yadi
instanceAuth.interceptors.request.use(
  async (config) => {
    // Foydalanuvchi sessiyasini olish
    const session = await getSession();

    // TODO: Access tokenni sessiondan olish kerak
    // Agar sessiya mavjud bo'lsa, access tokenni headerga qo'yish
    // use => session
    const access = "";
    if (access) {
      config.headers["Authorization"] = `Bearer ${access}`;
    }

    return config;
  },
  (error: any) => {
    // Request yuborishda xato bo'lsa, uni reject qiladi
    return Promise.reject(error);
  }
);

// ================================
// Response Interceptor
// ================================
// Responseni qabul qilganda 401 xatolarni qayta urinib ko'radi
instanceAuth.interceptors.response.use(
  (response) => response, // Successful responseni shunchaki return qiladi
  async (error) => {
    const prevRequest = error?.config;
    const session = await getSession();

    // Agar status 401 va oldin resend qilinmagan bo'lsa, requestni qayta yuborish
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;

      // TODO: Bu yerga api tokeni yangilash logikasini qo'shish kerak
      // await refreshTokenFunction();

      // Tokenni yangilab, requestni qayta yuborish
      // prevRequest.headers["Authorization"] = `Bearer ${}`; // yangilangan token bilan request ketishi kerak

      return instanceAuth(prevRequest);
    }

    // Agar user autentifikatsiyadan o'tmagan bo'lsa, logout qilish mumkin
    // TODO: Environmentga qarab userni logut qilishni sozlash kerak
    // productionda bo'lsa logout qilish kerak
    // developmentda esa logout qilmaslik kerak
    if (process.env.NODE_ENV === "production") {
      await signOut();
    }

    return Promise.reject(error);
  }
);

// ================================
// Plain Axios Instance
// ================================
// Public API requestlar uchun token talab qilinmaydigan instance
export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
