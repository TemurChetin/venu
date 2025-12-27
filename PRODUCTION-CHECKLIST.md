# Production Deployment Checklist

Bu fayl productionga chiqarishdan oldin bajarilishi kerak bo'lgan barcha ishlar ro'yxatini o'z ichiga oladi.

## 🔐 Environment Variables (Muhit O'zgaruvchilari)

- [ ] **NEXTAUTH_SECRET** - Xavfsiz secret key yaratish va o'rnatish

  - `openssl rand -base64 32` buyrug'i orqali yaratilishi kerak
  - Development secret'ni production'da ishlatmaslik kerak
  - Dockerfile va docker-compose.yml'da to'g'ri o'rnatilganligini tekshirish

- [ ] **NEXTAUTH_URL** - Production URL'ni o'rnatish

  - Hozirda `http://localhost:3000` - production URL'ga o'zgartirish kerak
  - HTTPS ishlatish kerak (masalan: `https://venu.uz`)

- [ ] **NEXT_PUBLIC_API** - Production API endpoint'ini to'g'rilash

  - Hozirda `https://venu.uz/api/v1` - tekshirish kerak
  - API server production'da tayyor va ishlayotganligini tasdiqlash

- [ ] **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY** - Google Maps API key

  - Production API key yaratish va o'rnatish
  - API key cheklovlarini to'g'ri sozlash (HTTP referrer restrictions)
  - Quota va billing sozlamalarini tekshirish

- [ ] **NODE_ENV** - `production` ga o'rnatilganligini tasdiqlash

  - Dockerfile va docker-compose.yml'da tekshirish

- [ ] Barcha environment variable'lar `.env` faylida mavjud va `.gitignore`'da qo'shilganligini tekshirish

## 🚨 Security (Xavfsizlik)

- [ ] **Token Refresh Logic** - `src/services/api/instance.ts` faylida TODO bor

  - 401 error bo'lganda token refresh logic'ni implement qilish
  - Hozirda faqat signOut qilinmoqda - token refresh qo'shish kerak

- [ ] **Console.log'lar** - Production'da console.log'lar olib tashlanishi kerak

  - 45+ ta console.log/error/warn topilgan
  - Production build'da ularning chiqmasligini ta'minlash
  - Yoki logger library ishlatish (Sentry, LogRocket, va boshqalar)

- [ ] **Security Headers** - `next.config.ts`'da qo'shish

  - Content-Security-Policy (CSP)
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy

- [ ] **HTTPS** - Production'da HTTPS majburiy

  - Certificate sozlash (Let's Encrypt yoki boshqa)
  - HTTP dan HTTPS'ga redirect

- [ ] **API Keys Exposure** - Frontend'da API key'lar public bo'lganligi
  - Google Maps API key'da domain restrictions qo'yish
  - API rate limiting sozlamalarni tekshirish

## 🌐 WebSocket Configuration

- [ ] **WebSocket URL** - `src/wss/web-socket-provider.tsx` faylida
  - Hozirda `"wss://your-websocket-url"` placeholder bor
  - Production WebSocket URL'ni o'rnatish kerak
  - Environment variable'dan olish kerak (masalan: `NEXT_PUBLIC_WS_URL`)

## 🔧 Configuration Files

- [ ] **next.config.ts** - Production optimizations

  - Security headers qo'shish
  - Compression sozlash
  - Image optimization tekshirish
  - Output mode (`standalone`) to'g'ri sozlanganligini tekshirish

- [ ] **Dockerfile** - Build arguments

  - Barcha kerakli environment variable'lar ARG sifatida qo'shilganligini tekshirish
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` Dockerfile'ga qo'shilmagan - qo'shish kerak

- [ ] **docker-compose.yml** - Environment variables
  - Barcha kerakli variable'lar qo'shilganligini tekshirish
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` qo'shilmagan - qo'shish kerak

## 🐛 Error Handling & Monitoring

- [ ] **Error Tracking** - Production error tracking sozlash

  - Sentry, LogRocket, yoki boshqa monitoring tool integratsiya qilish
  - Frontend error'larini track qilish

- [ ] **Error Logging** - Console.error'larni production-friendly logger'ga o'zgartirish

  - Hozirda console.error ishlatilmoqda
  - Production'da logger service'ga yuborish kerak

- [ ] **API Error Handling** - Client-side error handling yaxshilash
  - User-friendly error message'lar
  - Network error'lar uchun retry mechanism

## 🚀 Performance Optimization

- [ ] **Build Optimization** - Production build tekshirish

  - `npm run build` muvaffaqiyatli o'tganligini tasdiqlash
  - Bundle size tekshirish
  - Code splitting tekshirish

- [ ] **Image Optimization** - Next.js Image component

  - Remote image pattern'lar to'g'ri sozlanganligini tekshirish
  - Image domain'lar whitelist'da borligini tasdiqlash

- [ ] **Caching Strategy** - Static assets caching

  - CDN sozlash (ixtiyoriy)
  - Browser caching headers

- [ ] **React Query DevTools** - Production'da o'chirilishi kerak
  - `@tanstack/react-query-devtools` faqat development'da yuklanishi kerak

## 📱 Testing

- [ ] **Production Build Testing** - Production build'ni local'da test qilish

  - `npm run build && npm start` orqali test qilish
  - Barcha sahifalar to'g'ri ishlayotganligini tekshirish

- [ ] **Cross-browser Testing** - Asosiy browser'larda test qilish

  - Chrome, Firefox, Safari, Edge
  - Mobile browser'lar (iOS Safari, Chrome Mobile)

- [ ] **Responsive Design** - Turli screen size'larda test qilish

  - Mobile, tablet, desktop

- [ ] **API Integration** - Production API bilan integration test
  - Barcha API endpoint'lar to'g'ri ishlayotganligini tasdiqlash
  - Authentication flow test qilish

## 📊 Analytics & Monitoring

- [ ] **Analytics Integration** - Web analytics sozlash (ixtiyoriy)

  - Google Analytics, Yandex Metrika, yoki boshqa tool

- [ ] **Performance Monitoring** - Web Vitals tracking

  - Core Web Vitals measurement
  - Real User Monitoring (RUM)

- [ ] **Uptime Monitoring** - Server uptime monitoring
  - Service uptime tracking (UptimeRobot, Pingdom, va boshqalar)

## 🔄 CI/CD & Deployment

- [ ] **CI/CD Pipeline** - Automated deployment pipeline

  - Build automation
  - Automated testing
  - Deployment automation

- [ ] **Environment Management** - Staging va Production environment'lar

  - Staging environment sozlash (recommended)
  - Production deployment process

- [ ] **Rollback Strategy** - Deployment rollback plan

  - Oldingi version'ga qaytish mexanizmi

- [ ] **Backup Strategy** - Database va file backup'lar (agar kerak bo'lsa)

## 📝 Documentation

- [ ] **README.md** - Production deployment documentation

  - Deployment instructions
  - Environment variable'lar ro'yxati
  - Troubleshooting guide

- [ ] **API Documentation** - API endpoint'lar dokumentatsiyasi
  - `api.yml` fayli mavjud - tekshirish kerak

## 🔍 Code Quality

- [ ] **Linting** - ESLint error'larni tekshirish

  - `npm run lint` muvaffaqiyatli o'tganligini tasdiqlash

- [ ] **TypeScript Errors** - TypeScript compilation error'lar yo'qligini tasdiqlash

  - `tsc --noEmit` orqali tekshirish

- [ ] **Unused Code** - Ishlatilmayotgan code'lar olib tashlash
  - Yandex Maps related code (deprecated)
  - Unused dependencies

## 🌍 Internationalization

- [ ] **i18n Testing** - Barcha til'lar to'g'ri ishlayotganligini tekshirish
  - `en.json`, `ru.json`, `uz.json`, `jp.json` fayllar to'liqligini tekshirish
  - Missing translation'lar yo'qligini tasdiqlash

## 📦 Dependencies

- [ ] **Dependencies Update** - Security vulnerability'lar tekshirish

  - `npm audit` orqali security vulnerability'larni tekshirish
  - Critical va high severity vulnerability'larni fix qilish

- [ ] **Dependencies Cleanup** - Ishlatilmayotgan dependency'lar
  - Yandex Maps related packages (deprecated)
  - Unused dependencies

## 🔐 Authentication & Authorization

- [ ] **NextAuth Configuration** - Production sozlamalar

  - Secret key xavfsiz saqlanayotganligini tasdiqlash
  - Session strategy to'g'ri sozlanganligini tekshirish
  - JWT token validation

- [ ] **Auth Flow Testing** - Authentication flow to'liq test qilish
  - Login/Register
  - OTP verification
  - Session management
  - Logout

## 🗄️ Storage

- [ ] **LocalStorage/SessionStorage** - Browser storage usage
  - Guest ID storage
  - Error handling localStorage access uchun (private browsing mode)

## 🌐 CORS & API Configuration

- [ ] **CORS Settings** - Backend'da CORS to'g'ri sozlanganligini tasdiqlash

  - Production domain'lar whitelist'da borligini tekshirish

- [ ] **API Rate Limiting** - API rate limit'lar tekshirish
  - Frontend'da retry logic mavjud - to'g'ri ishlayotganligini tekshirish

## 🚦 Pre-Deployment Checklist

- [ ] Barcha environment variable'lar production qiymatlariga o'zgartirilgan
- [ ] `.env` fayli `.gitignore`'da mavjud
- [ ] Production build muvaffaqiyatli o'tgan (`npm run build`)
- [ ] Barcha test'lar muvaffaqiyatli o'tgan
- [ ] Code review bajarilgan
- [ ] Security audit o'tkazilgan (ixtiyoriy, lekin recommended)
- [ ] Performance test bajarilgan
- [ ] Backup strategy tayyor

## 📞 Support & Maintenance

- [ ] **Error Reporting** - User error'larini to'plash mexanizmi
- [ ] **Logging Strategy** - Application log'larini to'plash va saqlash
- [ ] **Monitoring Alerts** - Critical error'lar uchun alert sozlash
- [ ] **Support Contact** - User support uchun contact information

---

## Muhim Eslatmalar

1. **Environment Variables**: Barcha environment variable'lar production'da to'g'ri o'rnatilganligini tasdiqlang
2. **Security**: Xavfsizlik sozlamalarini e'tibor bilan tekshiring
3. **Monitoring**: Production'da monitoring va error tracking sozlash juda muhim
4. **Testing**: Production'ga chiqarishdan oldin to'liq test qilish
5. **Documentation**: Deployment process'ni dokumentatsiya qilish

---

**Last Updated**: 2025-01-27
