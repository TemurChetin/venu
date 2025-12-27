interface Props {
  params: Promise<{ lang: string }>;
}

const privacyPolicyContent = {
  uz: {
    title: "Maxfiylik Siyosati",
    section1: {
      title: "1. Umumiy qoidalar",
      item1:
        "1.1. Ushbu Maxfiylik siyosati Venu.uz foydalanuvchilari haqidagi ma'lumotlarni yig'ish, saqlash va ulardan foydalanish tartibini belgilaydi.",
      item2:
        "1.2. Platformadan foydalangan holda, siz ushbu siyosatga rozilik bildirgan bo'lasiz.",
    },
    section2: {
      title: "2. Yig'iladigan ma'lumotlar",
      item1: "Ro'yxatdan o'tishda ko'rsatilgan ism, telefon raqami, elektron pochta manzili.",
      item2: "Buyurtmalar, to'lovlar va yetkazib berish ma'lumotlari.",
      item3:
        "Foydalanuvchining qurilmasi va platformadan foydalanish statistikasi (cookie va log fayllar).",
    },
    section3: {
      title: "3. Ma'lumotlardan foydalanish",
      item1: "Xizmatlarni ko'rsatish va buyurtmalarni bajarish.",
      item2: "To'lovlar xavfsizligini ta'minlash.",
      item3:
        "Foydalanuvchi tajribasini yaxshilash va shaxsiylashtirilgan takliflar yuborish.",
    },
    section4: {
      title: "4. Uchinchi tomonlar bilan bo'lishish",
      item1:
        "Ma'lumotlar faqat xizmat ko'rsatish uchun zarur bo'lgan hamkorlarga berilishi mumkin (masalan, to'lov tizimlari, kuryerlik xizmati).",
      item2: "Venu.uz foydalanuvchilarning shaxsiy ma'lumotlarini sotmaydi.",
    },
    section5: {
      title: "5. Ma'lumotlarni himoya qilish",
      item1:
        "Venu.uz foydalanuvchi ma'lumotlarini maxfiy saqlash va ularni ruxsatsiz kirishdan himoya qilish choralarini ko'radi.",
    },
    section6: {
      title: "6. Foydalanuvchi huquqlari",
      item1:
        "O'z ma'lumotlarini ko'rish, o'zgartirish yoki o'chirishni talab qilish huquqiga ega.",
    },
    section7: {
      title: "7. Amaldagi qonunchilik",
      item1:
        "Ushbu siyosat O'zbekiston Respublikasining amaldagi qonunlariga muvofiq tartibga solinadi.",
    },
  },
  ru: {
    title: "Политика Конфиденциальности",
    section1: {
      title: "1. Общие положения",
      item1:
        "1.1. Настоящая Политика конфиденциальности регулирует порядок сбора, хранения и использования информации о пользователях Venu.uz.",
      item2: "1.2. Используя платформу, вы соглашаетесь с данной Политикой.",
    },
    section2: {
      title: "2. Сбор информации",
      item1: "Имя, номер телефона, адрес электронной почты при регистрации.",
      item2: "Данные о заказах, оплатах и доставке.",
      item3:
        "Информация об устройстве пользователя и статистика использования (cookie и лог-файлы).",
    },
    section3: {
      title: "3. Использование данных",
      item1: "Для предоставления услуг и выполнения заказов.",
      item2: "Для обеспечения безопасности платежей.",
      item3:
        "Для улучшения работы платформы и персонализированных предложений.",
    },
    section4: {
      title: "4. Передача третьим лицам",
      item1:
        "Данные могут быть переданы только партнерам, необходимым для оказания услуг (платежные системы, службы доставки).",
      item2: "Venu.uz не продает личные данные пользователей.",
    },
    section5: {
      title: "5. Защита информации",
      item1:
        "Venu.uz принимает меры по защите данных от несанкционированного доступа.",
    },
    section6: {
      title: "6. Права пользователей",
      item1:
        "Пользователь имеет право просматривать, изменять или удалять свои данные.",
    },
    section7: {
      title: "7. Применимое право",
      item1:
        "Политика регулируется законодательством Республики Узбекистан.",
    },
  },
  en: {
    title: "Privacy Policy",
    section1: {
      title: "1. General Provisions",
      item1:
        "1.1. This Privacy Policy defines the rules for collecting, storing, and using information about Venu.uz users.",
      item2: "1.2. By using the platform, you agree to this Policy.",
    },
    section2: {
      title: "2. Data Collected",
      item1: "Name, phone number, and email address during registration.",
      item2: "Order, payment, and delivery information.",
      item3:
        "User device information and usage statistics (cookies and log files).",
    },
    section3: {
      title: "3. Use of Data",
      item1: "To provide services and fulfill orders.",
      item2: "To ensure secure payments.",
      item3:
        "To improve user experience and deliver personalized offers.",
    },
    section4: {
      title: "4. Sharing with Third Parties",
      item1:
        "Data may be shared only with partners required to provide services (e.g., payment systems, delivery services).",
      item2: "Venu.uz does not sell users' personal data.",
    },
    section5: {
      title: "5. Data Protection",
      item1:
        "Venu.uz takes measures to protect user data from unauthorized access.",
    },
    section6: {
      title: "6. User Rights",
      item1:
        "Users have the right to access, modify, or request deletion of their personal data.",
    },
    section7: {
      title: "7. Governing Law",
      item1:
        "This Policy is governed by the laws of the Republic of Uzbekistan.",
    },
  },
};

export default async function PrivacyPolicyPage({ params }: Props) {
  const { lang } = await params;
  const content =
    privacyPolicyContent[lang as keyof typeof privacyPolicyContent] ||
    privacyPolicyContent.uz;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section1.title}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>{content.section1.item1}</li>
            <li>{content.section1.item2}</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section2.title}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>{content.section2.item1}</li>
            <li>{content.section2.item2}</li>
            <li>{content.section2.item3}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section3.title}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>{content.section3.item1}</li>
            <li>{content.section3.item2}</li>
            <li>{content.section3.item3}</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section4.title}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>{content.section4.item1}</li>
            <li>{content.section4.item2}</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section5.title}</h2>
          <p className="text-muted-foreground">{content.section5.item1}</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section6.title}</h2>
          <p className="text-muted-foreground">{content.section6.item1}</p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.section7.title}</h2>
          <p className="text-muted-foreground">{content.section7.item1}</p>
        </section>
      </div>
    </div>
  );
}

