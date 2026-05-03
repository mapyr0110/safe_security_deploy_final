const categoryCatalog = [
  {
    slug: "ip-cameras",
    icon: "IP",
    title: { en: "IP cameras", ru: "IP видеокамеры", kk: "IP бейнекамералар" },
    description: {
      en: "Bullet, dome and AI cameras for IP systems",
      ru: "Цилиндрические, купольные и AI-камеры для IP-систем",
      kk: "IP жүйелеріне арналған цилиндрлік, күмбезді және AI камералар"
    }
  },
  {
    slug: "ip-recorders",
    icon: "NVR",
    title: { en: "IP recorders", ru: "IP видеорегистраторы", kk: "IP бейнетіркеушілер" },
    description: {
      en: "Network NVRs for sites from 8 to 256 channels",
      ru: "Сетевые NVR для объектов от 8 до 256 каналов",
      kk: "8-ден 256 арнаға дейінгі нысандарға арналған желілік NVR"
    }
  },
  {
    slug: "network",
    icon: "PoE",
    title: { en: "Network equipment", ru: "Сетевое оборудование", kk: "Желілік жабдық" },
    description: {
      en: "PoE switches and infrastructure",
      ru: "PoE-коммутаторы и инфраструктура",
      kk: "PoE коммутаторлары және инфрақұрылым"
    }
  },
  {
    slug: "hd-cameras",
    icon: "HD",
    title: { en: "HD cameras", ru: "HD видеокамеры", kk: "HD бейнекамералар" },
    description: {
      en: "HD-TVI cameras for analog systems",
      ru: "HD-TVI камеры для аналоговых систем",
      kk: "Аналогтық жүйелерге арналған HD-TVI камералары"
    }
  },
  {
    slug: "hd-recorders",
    icon: "DVR",
    title: { en: "HD recorders", ru: "HD видеорегистраторы", kk: "HD бейнетіркеушілер" },
    description: {
      en: "HD-TVI recorders for archive and remote access",
      ru: "HD-TVI регистраторы для архива и удалённого доступа",
      kk: "Архив пен қашықтан қол жеткізуге арналған HD-TVI тіркеушілер"
    }
  },
  {
    slug: "intercom",
    icon: "IN",
    title: { en: "Intercom", ru: "Домофония", kk: "Домофония" },
    description: {
      en: "IP and analog access panels",
      ru: "IP и аналоговые панели доступа",
      kk: "IP және аналогтық кіру панельдері"
    }
  },
  {
    slug: "accessories",
    icon: "ACC",
    title: { en: "Accessories", ru: "Аксессуары", kk: "Аксессуарлар" },
    description: {
      en: "Cables, brackets and power supplies",
      ru: "Кабели, кронштейны, блоки питания",
      kk: "Кабельдер, кронштейндер және қуат блоктары"
    }
  }
];

const productCatalog = [
  {
    id: "ipcam1",
    article: "DS-2CD1041G2-LIU",
    category: "ip-cameras",
    image: "ipcam1",
    name: {
      en: "DS-2CD1041G2-LIU (2.8mm), bullet IP camera",
      ru: "DS-2CD1041G2-LIU (2.8mm), IP камера, цилиндрическая",
      kk: "DS-2CD1041G2-LIU (2.8mm), цилиндрлік IP камера"
    }
  },
  {
    id: "ipcam2",
    article: "DH-IPC-HFW1230TC1-A",
    category: "ip-cameras",
    image: "ipcam2",
    name: {
      en: "Dahua DH-IPC-HFW1230TC1-A IP camera",
      ru: "IP видеокамера Dahua DH-IPC-HFW1230TC1-A",
      kk: "Dahua DH-IPC-HFW1230TC1-A IP бейнекамерасы"
    }
  },
  {
    id: "ipcam3",
    article: "DS-I650M(C)",
    category: "ip-cameras",
    image: "ipcam3",
    name: {
      en: "DS-I650M(C) (2.8mm), HiWatch bullet IP camera",
      ru: "DS-I650M(C) (2.8mm), IP камера, цилиндрическая, HiWatch",
      kk: "DS-I650M(C) (2.8mm), HiWatch цилиндрлік IP камерасы"
    }
  },
  {
    id: "ipcam4",
    article: "UVC-AI-PRO",
    category: "ip-cameras",
    image: "ipcam4",
    name: {
      en: "Ubiquiti UniFi Protect AI Professional 4K IP camera",
      ru: "IP-камера Ubiquiti UniFi Protect AI Professional 4K",
      kk: "Ubiquiti UniFi Protect AI Professional 4K IP камерасы"
    }
  },
  {
    id: "ipreg1",
    article: "DS-N308",
    category: "ip-recorders",
    image: "ipreg1",
    name: {
      en: "HiWatch DS-N308 8-channel IP video recorder",
      ru: "8-канальный IP видеорегистратор HiWatch DS-N308",
      kk: "HiWatch DS-N308 8 арналы IP бейнетіркеуші"
    }
  },
  {
    id: "ipreg2",
    article: "DS-96128NI-M8/R",
    category: "ip-recorders",
    image: "ipreg2",
    name: {
      en: "DS-96128NI-M8/R 128-channel network video recorder",
      ru: "128-канальный сетевой видеорегистратор DS-96128NI-M8/R",
      kk: "DS-96128NI-M8/R 128 арналы желілік бейнетіркеуші"
    }
  },
  {
    id: "ipreg3",
    article: "DS-7716NI-M4(STD)",
    category: "ip-recorders",
    image: "ipreg3",
    name: {
      en: "DS-7716NI-M4(STD) 16-channel network video recorder",
      ru: "16-канальный сетевой видеорегистратор DS-7716NI-M4(STD)",
      kk: "DS-7716NI-M4(STD) 16 арналы желілік бейнетіркеуші"
    }
  },
  {
    id: "ipreg4",
    article: "DS-96256NI-I24(STD)",
    category: "ip-recorders",
    image: "ipreg4",
    name: {
      en: "DS-96256NI-I24(STD) 256-channel network video recorder",
      ru: "256-канальный сетевой видеорегистратор DS-96256NI-I24(STD)",
      kk: "DS-96256NI-I24(STD) 256 арналы желілік бейнетіркеуші"
    }
  },
  {
    id: "hdcam1",
    article: "DS-2CE10DF0T-F",
    category: "hd-cameras",
    image: "hdcam1",
    name: {
      en: "DS-2CE10DF0T-F (2.8mm), bullet HD-TVI camera",
      ru: "DS-2CE10DF0T-F (2.8mm), цилиндрическая HD-TVI камера",
      kk: "DS-2CE10DF0T-F (2.8mm), цилиндрлік HD-TVI камера"
    }
  },
  {
    id: "hdcam2",
    article: "DS-2CE10DF3T-F",
    category: "hd-cameras",
    image: "hdcam2",
    name: {
      en: "DS-2CE10DF3T-F (2.8mm), fixed mini bullet camera",
      ru: "DS-2CE10DF3T-F (2.8mm), фиксированная мини-цилиндрическая камера",
      kk: "DS-2CE10DF3T-F (2.8mm), шағын цилиндрлік бекітілген камера"
    }
  },
  {
    id: "hdcam3",
    article: "DS-2CE10DF8T-F",
    category: "hd-cameras",
    image: "hdcam3",
    name: {
      en: "DS-2CE10DF8T-F (2.8mm), fixed mini bullet camera",
      ru: "DS-2CE10DF8T-F (2.8mm), фиксированная мини-цилиндрическая камера",
      kk: "DS-2CE10DF8T-F (2.8mm), шағын цилиндрлік бекітілген камера"
    }
  },
  {
    id: "hdcam4",
    article: "DS-2CE10HFT-E",
    category: "hd-cameras",
    image: "hdcam4",
    name: {
      en: "DS-2CE10HFT-E (3.6mm), fixed mini bullet camera",
      ru: "DS-2CE10HFT-E (3.6mm), фиксированная мини-цилиндрическая камера",
      kk: "DS-2CE10HFT-E (3.6mm), шағын цилиндрлік бекітілген камера"
    }
  },
  {
    id: "hdreg1",
    article: "iDS-7204HUHI-M1/FA(C)",
    category: "hd-recorders",
    image: "hdreg1",
    name: {
      en: "Hikvision iDS-7204HUHI-M1/FA(C), 4-channel HD-TVI recorder",
      ru: "Hikvision iDS-7204HUHI-M1/FA(C), HD-TVI видеорегистратор 4 канала",
      kk: "Hikvision iDS-7204HUHI-M1/FA(C), 4 арналы HD-TVI бейнетіркеуші"
    }
  },
  {
    id: "hdreg2",
    article: "iDS-7208HQHI-M1/FA(C)8A+8/4ALM",
    category: "hd-recorders",
    image: "hdreg2",
    name: {
      en: "Hikvision iDS-7208HQHI-M1/FA(C)8A+8/4ALM, 8-channel HD-TVI recorder",
      ru: "Hikvision iDS-7208HQHI-M1/FA(C)8A+8/4ALM, HD-TVI видеорегистратор 8 каналов",
      kk: "Hikvision iDS-7208HQHI-M1/FA(C)8A+8/4ALM, 8 арналы HD-TVI бейнетіркеуші"
    }
  },
  {
    id: "hdreg3",
    article: "iDS-7208HQHI-M2/S(C)",
    category: "hd-recorders",
    image: "hdreg3",
    name: {
      en: "Hikvision iDS-7208HQHI-M2/S(C), 8-channel HD-TVI recorder",
      ru: "Hikvision iDS-7208HQHI-M2/S(C), HD-TVI видеорегистратор 8 каналов",
      kk: "Hikvision iDS-7208HQHI-M2/S(C), 8 арналы HD-TVI бейнетіркеуші"
    }
  },
  {
    id: "hdreg4",
    article: "DS-7116HGHI-K1",
    category: "hd-recorders",
    image: "hdreg4",
    name: {
      en: "Hikvision DS-7116HGHI-K1 16-channel HD video recorder",
      ru: "16-канальный HD видеорегистратор Hikvision DS-7116HGHI-K1",
      kk: "Hikvision DS-7116HGHI-K1 16 арналы HD бейнетіркеуші"
    }
  },
  {
    id: "net1",
    article: "DS-3E0318P-E/M",
    category: "network",
    image: "net1",
    name: {
      en: "Hikvision DS-3E0318P-E/M PoE switch",
      ru: "PoE-коммутатор Hikvision DS-3E0318P-E/M",
      kk: "Hikvision DS-3E0318P-E/M PoE коммутаторы"
    }
  },
  {
    id: "net2",
    article: "DS-3E0109P-E/M",
    category: "network",
    image: "net2",
    name: {
      en: "Hikvision DS-3E0109P-E/M PoE switch",
      ru: "PoE-коммутатор Hikvision DS-3E0109P-E/M",
      kk: "Hikvision DS-3E0109P-E/M PoE коммутаторы"
    }
  },
  {
    id: "intercom1",
    article: "DS-KV6113-WPE1",
    category: "intercom",
    image: "intercom1",
    name: {
      en: "Hikvision DS-KV6113-WPE1 IP door station",
      ru: "IP вызывная панель Hikvision DS-KV6113-WPE1",
      kk: "Hikvision DS-KV6113-WPE1 IP шақыру панелі"
    }
  },
  {
    id: "accessory1",
    article: "DS-1272ZJ-110",
    category: "accessories",
    image: "accessory1",
    name: {
      en: "Hikvision DS-1272ZJ-110 camera bracket",
      ru: "Кронштейн для камер Hikvision DS-1272ZJ-110",
      kk: "Hikvision DS-1272ZJ-110 камера кронштейні"
    }
  }
];

const blogPostCatalog = [
  {
    date: "12.04.2026",
    image: "GUIDE",
    title: { en: "How to choose a camera for a warehouse", ru: "Как выбрать камеру для склада", kk: "Қоймаға камераны қалай таңдау керек" },
    excerpt: {
      en: "Viewing angles, IR illumination and archive requirements for warehouse projects.",
      ru: "Разбираем углы обзора, ИК-подсветку и требования к архиву.",
      kk: "Көру бұрыштары, ИҚ жарықтандыру және архив талаптарын қарастырамыз."
    }
  },
  {
    date: "28.03.2026",
    image: "PoE",
    title: { en: "PoE infrastructure without extra cost", ru: "PoE-инфраструктура без лишних затрат", kk: "Артық шығынсыз PoE инфрақұрылымы" },
    excerpt: {
      en: "What matters when planning a video surveillance network.",
      ru: "Что важно учитывать при проектировании сети видеонаблюдения.",
      kk: "Бейнебақылау желісін жобалауда нені ескеру керек."
    }
  },
  {
    date: "17.03.2026",
    image: "AI",
    title: { en: "New Hikvision AcuSense solutions", ru: "Новые решения Hikvision AcuSense", kk: "Жаңа Hikvision AcuSense шешімдері" },
    excerpt: {
      en: "Smart analytics reduce false alarms.",
      ru: "Умная аналитика снижает количество ложных тревог.",
      kk: "Ақылды аналитика жалған дабыл санын азайтады."
    }
  },
  {
    date: "02.03.2026",
    image: "ACCESS",
    title: { en: "Intercom for business centers", ru: "Домофония для бизнес-центров", kk: "Бизнес орталықтарға арналған домофония" },
    excerpt: {
      en: "Unified access for tenants and security teams.",
      ru: "Единая система доступа для арендаторов и службы охраны.",
      kk: "Жалға алушылар мен күзет қызметіне арналған бірыңғай кіру жүйесі."
    }
  },
  {
    date: "19.02.2026",
    image: "STORAGE",
    title: { en: "Video archive: how long to store records", ru: "Архив видеозаписей: сколько нужно хранить", kk: "Бейнеархив: жазбаларды қанша сақтау керек" },
    excerpt: {
      en: "Practical scenarios for retail, warehouses and offices.",
      ru: "Практические сценарии для розницы, складов и офисов.",
      kk: "Бөлшек сауда, қойма және кеңселерге арналған практикалық сценарийлер."
    }
  },
  {
    date: "01.02.2026",
    image: "B2B",
    title: { en: "Partner program for integrators", ru: "Партнёрская программа для интеграторов", kk: "Интеграторларға арналған серіктестік бағдарлама" },
    excerpt: {
      en: "Project support, training and logistics across Kazakhstan.",
      ru: "Поддержка проектов, обучение и логистика по Казахстану.",
      kk: "Жобаларды қолдау, оқыту және Қазақстан бойынша логистика."
    }
  }
];

function pickLocalized(value, language) {
  if (!value || typeof value !== "object") return value;
  return value[language] || value.ru || value.en || "";
}

function localizeItem(item, language) {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, pickLocalized(value, language)])
  );
}

export function getLocalizedCategories(language) {
  return categoryCatalog.map((category) => localizeItem(category, language));
}

export function getLocalizedProducts(language) {
  const price = {
    en: "On request",
    ru: "По запросу",
    kk: "Сұраныс бойынша"
  }[language] || "По запросу";

  return productCatalog.map((product) => ({ ...localizeItem(product, language), price }));
}

export function getLocalizedBlogPosts(language) {
  return blogPostCatalog.map((post) => localizeItem(post, language));
}

export const categories = getLocalizedCategories("ru");
export const products = getLocalizedProducts("ru");
export const blogPosts = getLocalizedBlogPosts("ru");
