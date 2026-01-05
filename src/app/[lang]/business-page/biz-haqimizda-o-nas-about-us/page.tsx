import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const content = aboutUsContent[lang as keyof typeof aboutUsContent] || aboutUsContent.uz;

  return generateSEOMetadata({
    title: content.title,
    description: content.description,
    url: `/${lang}/business-page/biz-haqimizda-o-nas-about-us`,
    type: "website",
    locale: lang,
    keywords: ["venu", "biz haqimizda", "about us", "onlayn do'kon", "marketplace"],
  });
}

const aboutUsContent = {
  uz: {
    title: "Biz Haqimizda",
    description:
      "Venu.uz – bu O'zbekistondagi zamonaviy onlayn marketplace bo'lib, xaridorlar va sotuvchilarni yagona platformada birlashtiradi. Xaridorlar qulay interfeys orqali kerakli mahsulotlarni tez va ishonchli tarzda topib, onlayn buyurtma berishlari mumkin. Sotuvchilar esa o'z mahsulotlarini keng auditoriyaga taqdim etib, savdo jarayonini avtomatlashtirilgan boshqaruv vositalari yordamida yurita oladilar.",
    advantages: "Venu.uzning asosiy afzalliklari:",
    advantage1: "Qulay va tezkor qidiruv tizimi",
    advantage2: "Mahsulotlar va xizmatlarning keng tanlovi",
    advantage3: "Ishonchli to'lov va yetkazib berish tizimi",
    advantage4: "Mahsulot va sotuvchilar reytingi orqali sifat nazorati",
  },
  ru: {
    title: "О Нас",
    description:
      "Venu.uz – современная онлайн-платформа (маркетплейс) в Узбекистане, объединяющая покупателей и продавцов. Покупатели могут быстро и удобно находить необходимые товары через удобный интерфейс и оформлять заказы онлайн. Продавцы получают возможность представить свою продукцию широкой аудитории и управлять продажами с помощью автоматизированных инструментов.",
    advantages: "Основные преимущества Venu.uz:",
    advantage1: "Удобный и быстрый поиск",
    advantage2: "Широкий выбор товаров и услуг",
    advantage3: "Надежные системы оплаты и доставки",
    advantage4: "Контроль качества через рейтинги товаров и продавцов",
  },
  en: {
    title: "About Us",
    description:
      "Venu.uz is a modern online marketplace in Uzbekistan that connects buyers and sellers on a single platform. Buyers can easily search for and order products through a user-friendly interface, while sellers can showcase their goods to a wide audience and manage their sales with automated tools.",
    advantages: "Key advantages of Venu.uz:",
    advantage1: "Fast and convenient search system",
    advantage2: "Wide selection of products and services",
    advantage3: "Secure payment and delivery options",
    advantage4: "Quality control through product and seller ratings",
  },
};

export default async function AboutUsPage({ params }: Props) {
  const { lang } = await params;
  const content = aboutUsContent[lang as keyof typeof aboutUsContent] || aboutUsContent.uz;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {content.description}
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">
          {content.advantages}
        </h2>

        <ul className="space-y-3 list-disc list-inside text-muted-foreground">
          <li>{content.advantage1}</li>
          <li>{content.advantage2}</li>
          <li>{content.advantage3}</li>
          <li>{content.advantage4}</li>
        </ul>
      </div>
    </div>
  );
}

