interface Props {
  params: Promise<{ lang: string }>;
}

const promocodeContent = {
  uz: {
    title: "Promokod Haqida",
    whatIs: {
      title: "Promokod nima?",
      description:
        "Promokod - bu Venu.uz platformasida buyurtmalaringizda chegirma olish uchun ishlatiladigan maxsus kod. Har bir promokod ma'lum bir chegirma miqdorini yoki foizini beradi va sizning xaridlaringizni yanada qulayroq qiladi.",
    },
    howToUse: {
      title: "Promokodni qanday ishlatish?",
      steps: [
        {
          step: "1",
          description:
            "Buyurtma berish jarayonida 'Checkout' (Buyurtma berish) sahifasiga o'ting.",
        },
        {
          step: "2",
          description:
            "Buyurtma ma'lumotlarini to'ldirgandan so'ng, promokod kiritish maydonini toping.",
        },
        {
          step: "3",
          description:
            "O'zingizga berilgan promokod kodini maydonga kiriting.",
        },
        {
          step: "4",
          description:
            "Promokodni qo'llash tugmasini bosing. Agar kod to'g'ri bo'lsa, chegirma avtomatik ravishda buyurtma summangizga qo'llanadi.",
        },
        {
          step: "5",
          description:
            "Chegirma qo'llanganidan keyin, yakuniy summani ko'rib chiqing va buyurtmani yakunlang.",
        },
      ],
    },
    rules: {
      title: "Promokod qoidalari",
      items: [
        "Har bir promokod faqat bir marta ishlatilishi mumkin.",
        "Promokodlar ma'lum muddatga ega bo'lishi mumkin - muddati o'tgan kodlar ishlamaydi.",
        "Ba'zi promokodlar minimal buyurtma summasi talab qilishi mumkin.",
        "Promokodlar faqat ma'lum mahsulotlar yoki toifalar uchun qo'llanilishi mumkin.",
        "Bir buyurtmada faqat bitta promokod ishlatilishi mumkin.",
        "Promokodlar boshqa chegirmalar bilan birga qo'llanilmasligi mumkin.",
      ],
    },
    whereToGet: {
      title: "Promokodlarni qayerdan olish mumkin?",
      items: [
        "Venu.uz rasmiy akkauntlaridan (Telegram, Instagram, Facebook)",
        "Maxsus aksiyalar va kampaniyalar davomida",
        "Yangi foydalanuvchilar uchun ro'yxatdan o'tganda",
        "Doimiy mijozlar uchun maxsus takliflar",
        "Email orqali yuborilgan maxsus takliflar",
      ],
    },
    tips: {
      title: "Foydali maslahatlar",
      items: [
        "Promokod kodini to'g'ri kiritganingizga ishonch hosil qiling - katta-kichik harflar muhim.",
        "Promokod ishlamasa, uning muddati o'tgan yoki minimal summa talabiga javob bermayotgan bo'lishi mumkin.",
        "Eng so'nggi promokodlar va aksiyalar haqida xabar olish uchun Venu.uz ijtimoiy tarmoqlarini kuzatib boring.",
        "Har bir promokodning o'ziga xos shartlari bo'lishi mumkin - kodni olishda shartlarni diqqat bilan o'qing.",
      ],
    },
  },
  ru: {
    title: "О Промокодах",
    whatIs: {
      title: "Что такое промокод?",
      description:
        "Промокод - это специальный код, используемый на платформе Venu.uz для получения скидки на ваши заказы. Каждый промокод предоставляет определенную сумму или процент скидки, делая ваши покупки еще более выгодными.",
    },
    howToUse: {
      title: "Как использовать промокод?",
      steps: [
        {
          step: "1",
          description:
            "В процессе оформления заказа перейдите на страницу 'Checkout' (Оформление заказа).",
        },
        {
          step: "2",
          description:
            "После заполнения данных заказа найдите поле для ввода промокода.",
        },
        {
          step: "3",
          description: "Введите полученный промокод в поле.",
        },
        {
          step: "4",
          description:
            "Нажмите кнопку применения промокода. Если код правильный, скидка автоматически будет применена к сумме вашего заказа.",
        },
        {
          step: "5",
          description:
            "После применения скидки проверьте итоговую сумму и завершите оформление заказа.",
        },
      ],
    },
    rules: {
      title: "Правила использования промокодов",
      items: [
        "Каждый промокод может быть использован только один раз.",
        "Промокоды могут иметь ограниченный срок действия - истекшие коды не работают.",
        "Некоторые промокоды могут требовать минимальную сумму заказа.",
        "Промокоды могут применяться только к определенным товарам или категориям.",
        "В одном заказе можно использовать только один промокод.",
        "Промокоды могут не применяться вместе с другими скидками.",
      ],
    },
    whereToGet: {
      title: "Где можно получить промокоды?",
      items: [
        "С официальных аккаунтов Venu.uz (Telegram, Instagram, Facebook)",
        "Во время специальных акций и кампаний",
        "При регистрации новых пользователей",
        "Специальные предложения для постоянных клиентов",
        "Специальные предложения, отправленные по email",
      ],
    },
    tips: {
      title: "Полезные советы",
      items: [
        "Убедитесь, что вы правильно вводите промокод - регистр букв имеет значение.",
        "Если промокод не работает, возможно, истек его срок действия или не выполнено требование минимальной суммы.",
        "Следите за социальными сетями Venu.uz, чтобы быть в курсе последних промокодов и акций.",
        "У каждого промокода могут быть свои особые условия - внимательно читайте условия при получении кода.",
      ],
    },
  },
  en: {
    title: "About Promo Codes",
    whatIs: {
      title: "What is a promo code?",
      description:
        "A promo code is a special code used on the Venu.uz platform to get discounts on your orders. Each promo code provides a specific discount amount or percentage, making your purchases even more affordable.",
    },
    howToUse: {
      title: "How to use a promo code?",
      steps: [
        {
          step: "1",
          description:
            "During the checkout process, go to the 'Checkout' page.",
        },
        {
          step: "2",
          description:
            "After filling in your order details, find the promo code input field.",
        },
        {
          step: "3",
          description: "Enter the promo code you received in the field.",
        },
        {
          step: "4",
          description:
            "Click the apply button. If the code is valid, the discount will be automatically applied to your order total.",
        },
        {
          step: "5",
          description:
            "After the discount is applied, review the final total and complete your order.",
        },
      ],
    },
    rules: {
      title: "Promo code rules",
      items: [
        "Each promo code can only be used once.",
        "Promo codes may have an expiration date - expired codes will not work.",
        "Some promo codes may require a minimum order amount.",
        "Promo codes may only apply to certain products or categories.",
        "Only one promo code can be used per order.",
        "Promo codes may not be combined with other discounts.",
      ],
    },
    whereToGet: {
      title: "Where to get promo codes?",
      items: [
        "From Venu.uz official accounts (Telegram, Instagram, Facebook)",
        "During special promotions and campaigns",
        "When registering as a new user",
        "Special offers for regular customers",
        "Special offers sent via email",
      ],
    },
    tips: {
      title: "Helpful tips",
      items: [
        "Make sure you enter the promo code correctly - letter case matters.",
        "If a promo code doesn't work, it may have expired or the minimum order requirement may not be met.",
        "Follow Venu.uz social media to stay updated on the latest promo codes and promotions.",
        "Each promo code may have specific terms - read the conditions carefully when receiving the code.",
      ],
    },
  },
};

export default async function PromocodePage({ params }: Props) {
  const { lang } = await params;
  const content =
    promocodeContent[lang as keyof typeof promocodeContent] ||
    promocodeContent.uz;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{content.title}</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        {/* What is Promocode */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {content.whatIs.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {content.whatIs.description}
          </p>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {content.howToUse.title}
          </h2>
          <ol className="space-y-4">
            {content.howToUse.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {step.step}
                </span>
                <p className="text-muted-foreground pt-1">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Rules */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.rules.title}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            {content.rules.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Where to Get */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {content.whereToGet.title}
          </h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            {content.whereToGet.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">{content.tips.title}</h2>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            {content.tips.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

