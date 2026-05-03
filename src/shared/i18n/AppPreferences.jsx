import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "kk", label: "KZ", name: "Қазақша" }
];

const dictionary = {
  en: {
    brand: "Safe security",
    topBar: {
      partner: "Official Hikvision partner in Kazakhstan",
      b2b: "B2B portal"
    },
    nav: {
      home: "Home",
      catalog: "Catalog",
      blog: "Blog",
      contacts: "Contacts",
      about: "About",
      delivery: "Delivery"
    },
    controls: {
      language: "Language",
      light: "Light",
      dark: "Dark",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
      menu: "Menu",
      close: "Close"
    },
    search: {
      placeholder: "Search catalog",
      label: "Search",
      title: "Results for",
      empty: "Nothing found. Try another article number or category."
    },
    actions: {
      becomePartner: "Become a partner",
      viewCatalog: "View catalog",
      consultation: "Get consultation",
      leaveRequest: "Leave request",
      requestPrice: "Request price",
      askSpecialist: "Ask a specialist",
      submit: "Submit",
      submitLead: "Send request",
      subscribe: "Subscribe",
      details: "Details",
      viewAll: "View all",
      allCategories: "All categories"
    },
    forms: {
      title: "Send a request",
      partnerTitle: "Application form",
      name: "Name",
      company: "Company",
      phone: "Phone",
      email: "Email",
      message: "Message"
    },
    toast: {
      leadSent: "Thank you for trusting us. We will contact you shortly.",
      leadError: "The request could not be sent. Please check the server and try again."
    },
    server: {
      loadingTitle: "Loading catalog",
      loadingCopy: "The site is getting fresh categories, products and articles from the backend.",
      unavailableTitle: "server is not available",
      unavailableCopy: "server is not available",
      retry: "Try again"
    },
    breadcrumbs: {
      home: "Home"
    },
    footer: {
      tagline: "Security technology for businesses across Kazakhstan.",
      subscribeEmail: "Email for updates",
      catalog: "Catalog",
      company: "Company",
      contacts: "Contacts",
      address: "Almaty, Abay Avenue 52",
      rights: "© 2026 Safe security. All rights reserved.",
      policies: "Privacy policy · Terms of use"
    },
    home: {
      label: "Official distribution",
      heroWords: ["Security", "for your", "business"],
      slides: [
        ["Security for your business", "Official supply of Hikvision equipment for integrators and corporate clients.", "View catalog"],
        ["Video surveillance for real projects", "Selection of cameras, recorders, intercoms and network equipment for real site requirements.", "Get consultation"],
        ["Partner program", "Credit line, technical support, project registration and logistics across Kazakhstan.", "Become a partner"]
      ],
      partnerCounter: "partners across Kazakhstan",
      problemTitle: "Will you know about an intrusion before or after it happens?",
      problems: ["No unified event archive", "Hard to choose compatible devices", "Delivery delays site launch"],
      problemCopy: "We combine technical selection, availability and partner support in one clear process.",
      categoriesLabel: "Popular categories",
      catalogTitle: ["Product", "catalog"],
      productsLabel: "Popular products",
      productsTitle: ["Best", "offers"],
      needHelp: "Need help choosing equipment?",
      partnerTitle: ["Become our", "partner"],
      partnerCopy: "Get project pricing, engineering support and reliable logistics across Kazakhstan.",
      partnerBenefits: ["Credit line", "Technical support", "Personal manager", "Competitive prices", "Project registration", "Logistics", "Marketing", "Training"],
      brands: "Our brands",
      newsletterTitle: ["Subscribe to", "updates"]
    },
    catalog: {
      filters: "Catalog sections",
      sidebarCopy: "Choose a category or send a request, and we will prepare a specification for your site.",
      comingSoon: "Products will appear in this category soon."
    },
    product: {
      priceOnRequest: "Price on request",
      description: "Professional equipment for video surveillance systems. Suitable for commercial sites, warehouses, offices and distributed networks.",
      tabs: ["Specifications", "Description", "Documentation"],
      specs: "Resolution up to 4MP, IR illumination, remote access, housing protection and compatibility with the Hikvision ecosystem."
    },
    about: {
      breadcrumb: "About company",
      label: "Company",
      title: ["Official", "Hikvision partner"],
      copy1: "We supply video surveillance, intercom and network infrastructure equipment for integrators, installers and corporate clients in Kazakhstan.",
      copy2: "The team helps with specification selection, project terms, training and technical support at every stage of implementation.",
      cards: ["Professional level", "Wide catalog", "Official partnership"],
      portfolioTitle: "What is included in the portfolio",
      portfolio: [
        "Cameras, recorders and video archive storage systems.",
        "Intercoms, access control and network equipment.",
        "Accessories, mounting parts and consumables."
      ]
    },
    blog: {
      label: "Blog / News",
      title: ["Expertise and", "news"],
      missingBody: "Full article text is not added yet."
    },
    contact: {
      breadcrumb: "Contacts",
      title: ["Contact", "us"],
      copy: "Leave a request, and a specialist will select equipment for your site.",
      items: ["Address: Almaty, Abay Ave. 52", "Phone: +7 727 311 22 33", "Email: sales@safe-security.kz", "Hours: Mon-Fri 09:00-18:00"],
      map: "Almaty map"
    },
    delivery: {
      label: "Delivery",
      title: ["Delivery", "terms"],
      copy: "We organize equipment delivery across Almaty, Astana, Shymkent and Kazakhstan regions through trusted logistics partners.",
      items: ["Timing: from 1 business day", "Regions: all Kazakhstan", "Cost: according to carrier rates"]
    },
    partner: {
      label: "Partnership",
      title: ["Become our", "partner"],
      copy: "We work with integrators, installation companies and resellers, providing project terms, training and stable supply.",
      benefits: ["Credit line", "Technical support", "Personal manager", "Competitive prices", "Project registration", "Reliable logistics", "Marketing support", "Training and certification"]
    },
    modal: {
      thanks: "Thank you!",
      thanksCopy: "Thank you for trusting us. We will contact you shortly.",
      title: ["Leave a", "request"]
    },
    error: {
      label: "Frontend error",
      title: "React could not render the page"
    }
  },
  ru: {
    brand: "Safe security",
    topBar: {
      partner: "Официальный партнёр Hikvision в Казахстане",
      b2b: "B2B портал"
    },
    nav: {
      home: "Главная",
      catalog: "Каталог",
      blog: "Блог",
      contacts: "Контакты",
      about: "О нас",
      delivery: "Доставка"
    },
    controls: {
      language: "Язык",
      light: "Светлая",
      dark: "Тёмная",
      switchToLight: "Включить светлую тему",
      switchToDark: "Включить тёмную тему",
      menu: "Меню",
      close: "Закрыть"
    },
    search: {
      placeholder: "Поиск по каталогу",
      label: "Поиск",
      title: "Результаты по запросу",
      empty: "Ничего не найдено. Попробуйте другой артикул или категорию."
    },
    actions: {
      becomePartner: "Стать партнёром",
      viewCatalog: "Смотреть каталог",
      consultation: "Получить консультацию",
      leaveRequest: "Оставить заявку",
      requestPrice: "Запросить цену",
      askSpecialist: "Спросить специалиста",
      submit: "Отправить",
      submitLead: "Отправить заявку",
      subscribe: "Подписаться",
      details: "Подробнее",
      viewAll: "Смотреть все",
      allCategories: "Все категории"
    },
    forms: {
      title: "Отправить заявку",
      partnerTitle: "Форма заявки",
      name: "Имя",
      company: "Компания",
      phone: "Телефон",
      email: "Email",
      message: "Сообщение"
    },
    toast: {
      leadSent: "Спасибо, что доверяете нам. Мы скоро свяжемся с вами."
    },
    breadcrumbs: {
      home: "Главная"
    },
    footer: {
      tagline: "Технологии безопасности для бизнеса по всему Казахстану.",
      subscribeEmail: "Email для рассылки",
      catalog: "Каталог",
      company: "Компания",
      contacts: "Контакты",
      address: "Алматы, проспект Абая 52",
      rights: "© 2026 Safe security. Все права защищены.",
      policies: "Политика конфиденциальности · Условия использования"
    },
    home: {
      label: "Официальная дистрибуция",
      heroWords: ["Безопасность", "вашего", "бизнеса"],
      slides: [
        ["Безопасность вашего бизнеса", "Официальная поставка оборудования Hikvision для интеграторов и корпоративных клиентов.", "Смотреть каталог"],
        ["Видеонаблюдение под проект", "Подбор камер, регистраторов, домофонии и сетевого оборудования под реальные задачи объекта.", "Получить консультацию"],
        ["Партнёрская программа", "Кредитная линия, техническая поддержка, регистрация проектов и логистика по Казахстану.", "Стать партнёром"]
      ],
      partnerCounter: "партнёров по Казахстану",
      problemTitle: "Как вы узнаете о взломе: до или после?",
      problems: ["Нет единого архива событий", "Сложно подобрать совместимые устройства", "Поставка задерживает запуск объекта"],
      problemCopy: "Мы закрываем технический подбор, наличие и партнёрскую поддержку в одном понятном процессе.",
      categoriesLabel: "Популярные категории",
      catalogTitle: ["Каталог", "продукции"],
      productsLabel: "Популярные товары",
      productsTitle: ["Лучшие", "предложения"],
      needHelp: "Нужна помощь с подбором?",
      partnerTitle: ["Станьте нашим", "партнёром"],
      partnerCopy: "Получайте проектные цены, поддержку инженеров и стабильную логистику по Казахстану.",
      partnerBenefits: ["Кредитная линия", "Техподдержка", "Персональный менеджер", "Выгодные цены", "Регистрация проектов", "Логистика", "Маркетинг", "Обучение"],
      brands: "Наши бренды",
      newsletterTitle: ["Подписка на", "рассылку"]
    },
    catalog: {
      filters: "Разделы каталога",
      sidebarCopy: "Выберите категорию или отправьте заявку, и мы подготовим спецификацию под ваш объект.",
      comingSoon: "Товары скоро появятся в этой категории."
    },
    product: {
      description: "Профессиональное оборудование для систем видеонаблюдения. Подходит для коммерческих объектов, складов, офисов и распределённых сетей.",
      tabs: ["Характеристики", "Описание", "Документация"],
      specs: "Разрешение до 4MP, ИК-подсветка, удалённый доступ, защита корпуса и совместимость с экосистемой Hikvision."
    },
    about: {
      breadcrumb: "О компании",
      label: "Компания",
      title: ["Официальный", "партнёр Hikvision"],
      copy1: "Мы поставляем оборудование видеонаблюдения, домофонии и сетевой инфраструктуры для интеграторов, монтажных организаций и корпоративных заказчиков в Казахстане.",
      copy2: "Команда помогает с подбором спецификаций, проектными условиями, обучением и технической поддержкой на всех этапах внедрения.",
      cards: ["Профессиональный уровень", "Широкий каталог", "Официальное партнёрство"],
      portfolioTitle: "Что представлено в портфолио",
      portfolio: [
        "Камеры, регистраторы и системы хранения видеоархива.",
        "Домофония, контроль доступа и сетевое оборудование.",
        "Аксессуары, монтажные элементы и расходные материалы."
      ]
    },
    blog: {
      label: "Блог / Новости",
      title: ["Экспертиза и", "новости"],
      missingBody: "Полный текст статьи пока не добавлен."
    },
    contact: {
      breadcrumb: "Контакты",
      title: ["Свяжитесь", "с нами"],
      copy: "Оставьте заявку, и специалист подберёт оборудование под ваш объект.",
      items: ["Адрес: Алматы, пр. Абая 52", "Телефон: +7 727 311 22 33", "Email: sales@safe-security.kz", "Режим: Пн-Пт 09:00-18:00"],
      map: "Карта Алматы"
    },
    delivery: {
      label: "Доставка",
      title: ["Условия", "доставки"],
      copy: "Мы организуем доставку оборудования по Алматы, Астане, Шымкенту и регионам Казахстана через проверенные логистические службы.",
      items: ["Сроки: от 1 рабочего дня", "Регионы: весь Казахстан", "Стоимость: по тарифам перевозчика"]
    },
    partner: {
      label: "Партнёрство",
      title: ["Станьте нашим", "партнёром"],
      copy: "Мы работаем с интеграторами, монтажными компаниями и реселлерами, предоставляя проектные условия, обучение и стабильные поставки.",
      benefits: ["Кредитная линия", "Техническая поддержка", "Персональный менеджер", "Выгодные цены", "Регистрация проектов", "Отлаженная логистика", "Маркетинговая поддержка", "Обучение и сертификация"]
    },
    modal: {
      thanks: "Спасибо!",
      thanksCopy: "Спасибо, что доверяете нам. Мы скоро свяжемся с вами.",
      title: ["Оставить", "заявку"]
    },
    error: {
      label: "Frontend error",
      title: "React не смог отрисовать страницу"
    }
  },
  kk: {
    brand: "Safe security",
    topBar: {
      partner: "Қазақстандағы ресми Hikvision серіктесі",
      b2b: "B2B портал"
    },
    nav: {
      home: "Басты бет",
      catalog: "Каталог",
      blog: "Блог",
      contacts: "Байланыс",
      about: "Біз туралы",
      delivery: "Жеткізу"
    },
    controls: {
      language: "Тіл",
      light: "Жарық",
      dark: "Қараңғы",
      switchToLight: "Жарық тақырыпқа ауысу",
      switchToDark: "Қараңғы тақырыпқа ауысу",
      menu: "Мәзір",
      close: "Жабу"
    },
    search: {
      placeholder: "Каталогтан іздеу",
      label: "Іздеу",
      title: "Іздеу нәтижесі",
      empty: "Ештеңе табылмады. Басқа артикулды немесе санатты көріңіз."
    },
    actions: {
      becomePartner: "Серіктес болу",
      viewCatalog: "Каталогты қарау",
      consultation: "Кеңес алу",
      leaveRequest: "Өтінім қалдыру",
      requestPrice: "Бағаны сұрау",
      askSpecialist: "Маманнан сұрау",
      submit: "Жіберу",
      submitLead: "Өтінім жіберу",
      subscribe: "Жазылу",
      details: "Толығырақ",
      viewAll: "Барлығын көру",
      allCategories: "Барлық санаттар"
    },
    forms: {
      title: "Өтінім жіберу",
      partnerTitle: "Өтінім формасы",
      name: "Аты-жөні",
      company: "Компания",
      phone: "Телефон",
      email: "Email",
      message: "Хабарлама"
    },
    toast: {
      leadSent: "Бізге сенім білдіргеніңіз үшін рақмет. Жақын уақытта байланысамыз."
    },
    breadcrumbs: {
      home: "Басты бет"
    },
    footer: {
      tagline: "Қазақстан бойынша бизнеске арналған қауіпсіздік технологиялары.",
      subscribeEmail: "Жаңалықтар үшін Email",
      catalog: "Каталог",
      company: "Компания",
      contacts: "Байланыс",
      address: "Алматы, Абай даңғылы 52",
      rights: "© 2026 Safe security. Барлық құқықтар қорғалған.",
      policies: "Құпиялылық саясаты · Пайдалану шарттары"
    },
    home: {
      label: "Ресми дистрибуция",
      heroWords: ["Бизнесіңізге", "арналған", "қауіпсіздік"],
      slides: [
        ["Бизнесіңізге арналған қауіпсіздік", "Интеграторлар мен корпоративтік клиенттер үшін Hikvision жабдықтарын ресми жеткізу.", "Каталогты қарау"],
        ["Жобаға сай бейнебақылау", "Нысан талаптарына сай камералар, тіркеушілер, домофония және желілік жабдық таңдау.", "Кеңес алу"],
        ["Серіктестік бағдарлама", "Несие желісі, техникалық қолдау, жобаларды тіркеу және Қазақстан бойынша логистика.", "Серіктес болу"]
      ],
      partnerCounter: "Қазақстан бойынша серіктес",
      problemTitle: "Бұзушылық туралы қашан білесіз: дейін бе, кейін бе?",
      problems: ["Оқиғалардың бірыңғай архиві жоқ", "Үйлесімді құрылғыларды таңдау қиын", "Жеткізу нысанды іске қосуды кешіктіреді"],
      problemCopy: "Біз техникалық таңдауды, қолжетімділікті және серіктестік қолдауды бір түсінікті процеске біріктіреміз.",
      categoriesLabel: "Танымал санаттар",
      catalogTitle: ["Өнім", "каталогы"],
      productsLabel: "Танымал тауарлар",
      productsTitle: ["Үздік", "ұсыныстар"],
      needHelp: "Жабдық таңдауға көмек керек пе?",
      partnerTitle: ["Біздің", "серіктес болыңыз"],
      partnerCopy: "Жобалық бағалар, инженерлік қолдау және Қазақстан бойынша тұрақты логистика алыңыз.",
      partnerBenefits: ["Несие желісі", "Техникалық қолдау", "Жеке менеджер", "Тиімді бағалар", "Жобаларды тіркеу", "Логистика", "Маркетинг", "Оқыту"],
      brands: "Біздің брендтер",
      newsletterTitle: ["Жаңалықтарға", "жазылу"]
    },
    catalog: {
      filters: "Каталог бөлімдері",
      sidebarCopy: "Санатты таңдаңыз немесе өтінім жіберіңіз, біз нысаныңызға спецификация дайындаймыз.",
      comingSoon: "Бұл санаттағы тауарлар жақында қосылады."
    },
    product: {
      description: "Бейнебақылау жүйелеріне арналған кәсіби жабдық. Коммерциялық нысандарға, қоймаларға, кеңселерге және таралған желілерге сай келеді.",
      tabs: ["Сипаттамалар", "Сипаттама", "Құжаттама"],
      specs: "4MP дейінгі ажыратымдылық, ИҚ жарықтандыру, қашықтан қол жеткізу, корпус қорғанысы және Hikvision экожүйесімен үйлесімділік."
    },
    about: {
      breadcrumb: "Компания туралы",
      label: "Компания",
      title: ["Ресми", "Hikvision серіктесі"],
      copy1: "Біз Қазақстандағы интеграторларға, монтаж ұйымдарына және корпоративтік клиенттерге бейнебақылау, домофония және желілік инфрақұрылым жабдықтарын жеткіземіз.",
      copy2: "Команда спецификация таңдауға, жобалық шарттарға, оқытуға және енгізудің барлық кезеңіндегі техникалық қолдауға көмектеседі.",
      cards: ["Кәсіби деңгей", "Кең каталог", "Ресми серіктестік"],
      portfolioTitle: "Портфолиода не бар",
      portfolio: [
        "Камералар, тіркеушілер және бейнеархив сақтау жүйелері.",
        "Домофония, кіруді бақылау және желілік жабдық.",
        "Аксессуарлар, монтаж элементтері және шығын материалдары."
      ]
    },
    blog: {
      label: "Блог / Жаңалықтар",
      title: ["Сараптама және", "жаңалықтар"],
      missingBody: "Мақаланың толық мәтіні әлі қосылмаған."
    },
    contact: {
      breadcrumb: "Байланыс",
      title: ["Бізбен", "байланысыңыз"],
      copy: "Өтінім қалдырыңыз, маман нысаныңызға сай жабдық таңдайды.",
      items: ["Мекенжай: Алматы, Абай даңғылы 52", "Телефон: +7 727 311 22 33", "Email: sales@safe-security.kz", "Жұмыс уақыты: Дс-Жм 09:00-18:00"],
      map: "Алматы картасы"
    },
    delivery: {
      label: "Жеткізу",
      title: ["Жеткізу", "шарттары"],
      copy: "Біз Алматы, Астана, Шымкент және Қазақстан өңірлері бойынша жабдық жеткізуді сенімді логистикалық серіктестер арқылы ұйымдастырамыз.",
      items: ["Мерзімі: 1 жұмыс күнінен бастап", "Өңірлер: бүкіл Қазақстан", "Құны: тасымалдаушы тарифтері бойынша"]
    },
    partner: {
      label: "Серіктестік",
      title: ["Біздің", "серіктес болыңыз"],
      copy: "Біз интеграторлармен, монтаж компанияларымен және реселлерлермен жұмыс істеп, жобалық шарттар, оқыту және тұрақты жеткізу ұсынамыз.",
      benefits: ["Несие желісі", "Техникалық қолдау", "Жеке менеджер", "Тиімді бағалар", "Жобаларды тіркеу", "Жүйелі логистика", "Маркетингтік қолдау", "Оқыту және сертификаттау"]
    },
    modal: {
      thanks: "Рақмет!",
      thanksCopy: "Бізге сенім білдіргеніңіз үшін рақмет. Жақын уақытта байланысамыз.",
      title: ["Өтінім", "қалдыру"]
    },
    error: {
      label: "Frontend error",
      title: "React бетті көрсете алмады"
    }
  }
};

const PreferenceContext = createContext(null);

function getStoredValue(key, fallback) {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) || fallback;
}

function getTranslation(language, path) {
  const source = dictionary[language] || dictionary.ru;
  const fallback = dictionary.ru;
  const english = dictionary.en;
  const value = path.split(".").reduce((result, key) => result?.[key], source);
  if (value !== undefined) return value;
  const fallbackValue = path.split(".").reduce((result, key) => result?.[key], fallback);
  if (fallbackValue !== undefined) return fallbackValue;
  return path.split(".").reduce((result, key) => result?.[key], english) ?? path;
}

export function AppPreferencesProvider({ children }) {
  const [language, setLanguageState] = useState(() => getStoredValue("safe-security-language", "ru"));
  const [theme, setThemeState] = useState(() => getStoredValue("safe-security-theme", "light"));

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("safe-security-language", language);
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("safe-security-theme", theme);
  }, [theme]);

  const setLanguage = useCallback((value) => {
    setLanguageState(languages.some((item) => item.code === value) ? value : "ru");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((value) => (value === "dark" ? "light" : "dark"));
  }, []);

  const t = useCallback((path) => getTranslation(language, path), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, theme, toggleTheme, t }),
    [language, setLanguage, theme, toggleTheme, t]
  );

  return <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) throw new Error("usePreferences must be used inside AppPreferencesProvider");
  return context;
}
