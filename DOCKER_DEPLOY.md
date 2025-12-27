# Docker Deployment Guide

## .env fayl bilan ishlash

### 1. .env fayl yaratish

Loyiha ildizida `.env` fayl yarating:

```bash
cp env.example .env
```

### 2. .env faylni to'ldirish

`.env` faylni ochib, quyidagi o'zgaruvchilarni to'ldiring:

```env
# API Configuration
NEXT_PUBLIC_API=https://venu.uz/api/v1

# NextAuth Configuration
# Xavfsiz secret yaratish uchun: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=production
```

### 3. NEXTAUTH_SECRET yaratish

Production uchun xavfsiz secret yaratish:

```bash
openssl rand -base64 32
```

Yoki:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Docker Compose bilan ishga tushirish

```bash
# Image build qilish
docker-compose build

# Container'ni ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f

# Container'ni to'xtatish
docker-compose down
```

### 5. .env fayl o'zgarishlarini qo'llash

**MUHIM:** `NEXT_PUBLIC_*` prefiksli o'zgaruvchilar build vaqtida qo'shiladi. `.env` faylda `NEXT_PUBLIC_API` ni o'zgartirgandan keyin, image'ni qayta build qilish kerak:

```bash
# Container'ni to'xtatish
docker-compose down

# Image'ni qayta build qilish (NEXT_PUBLIC_API o'zgargan bo'lsa)
docker-compose build --no-cache

# Container'ni qayta ishga tushirish
docker-compose up -d
```

**Eslatma:** Faqat `NEXTAUTH_SECRET` yoki `NEXTAUTH_URL` o'zgarganda qayta build qilish shart emas, lekin `NEXT_PUBLIC_API` o'zgarganda mutlaqo qayta build qilish kerak!

### 6. Production deployment

Production uchun:

1. `.env` faylda `NEXTAUTH_URL` ni to'g'ri domain'ga o'zgartiring:

   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

2. `NEXT_PUBLIC_API` ni production API URL'iga o'zgartiring:

   ```env
   NEXT_PUBLIC_API=https://api.yourdomain.com/api/v1
   ```

3. Xavfsiz `NEXTAUTH_SECRET` yarating va o'rnating

### 7. Xavfsizlik

- `.env` faylni Git'ga commit qilmang (`.gitignore` da bor)
- Production'da `.env` fayl permissions'ni cheklang:
  ```bash
  chmod 600 .env
  ```
