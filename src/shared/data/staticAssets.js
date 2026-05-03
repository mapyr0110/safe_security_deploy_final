const PRODUCT_IMAGE_BY_KEY = {
  ipcam1: "ipcam1.jpeg",
  ipcam2: "ipcam2.jpg",
  ipcam3: "ipcam3.jpeg",
  ipcam4: "ipcam4.webp",
  ipreg1: "ipreg1.jpg",
  ipreg2: "ipreg2.webp",
  ipreg3: "ipreg3.webp",
  ipreg4: "ipreg4.webp",
  hdcam1: "hdcam1.webp",
  hdcam2: "hdcam2.webp",
  hdcam3: "hdcam3.webp",
  hdcam4: "hdcam4.webp",
  hdreg1: "hdreg1.webp",
  hdreg2: "hdreg2.webp",
  hdreg3: "hdreg3.webp",
  hdreg4: "hdreg4.webp",
  net1: "switchds-3e031.png",
  net2: "switchds-3e031.png",
  intercom1: "doorstation.jpg",
  accessory1: "bracket.jpeg",
  "DS-2CD1041G2-LIU": "ipcam1.jpeg",
  "DH-IPC-HFW1230TC1-A": "ipcam2.jpg",
  "DS-I650M(C)": "ipcam3.jpeg",
  "UVC-AI-PRO": "ipcam4.webp",
  "DS-N308": "ipreg1.jpg",
  "DS-96128NI-M8/R": "ipreg2.webp",
  "DS-7716NI-M4(STD)": "ipreg3.webp",
  "DS-96256NI-I24(STD)": "ipreg4.webp",
  "DS-2CE10DF0T-F": "hdcam1.webp",
  "DS-2CE10DF3T-F": "hdcam2.webp",
  "DS-2CE10DF8T-F": "hdcam3.webp",
  "DS-2CE10HFT-E": "hdcam4.webp",
  "iDS-7204HUHI-M1/FA(C)": "hdreg1.webp",
  "iDS-7208HQHI-M1/FA(C)8A+8/4ALM": "hdreg2.webp",
  "iDS-7208HQHI-M2/S(C)": "hdreg3.webp",
  "DS-7116HGHI-K1": "hdreg4.webp",
  "DS-3E0318P-E/M": "switchds-3e031.png",
  "DS-3E0109P-E/M": "switchds-3e031.png",
  "DS-KV6113-WPE1": "doorstation.jpg",
  "DS-1272ZJ-110": "bracket.jpeg"
};

const PRODUCT_IMAGE_RULES = [
  [/2cd1041g2|ipcam1/, "ipcam1.jpeg"],
  [/hfw1230tc1|ipcam2/, "ipcam2.jpg"],
  [/i650m|ipcam3/, "ipcam3.jpeg"],
  [/uvc-ai-pro|unifi protect ai|ipcam4/, "ipcam4.webp"],
  [/ds-n308|ipreg1/, "ipreg1.jpg"],
  [/96128ni|ipreg2/, "ipreg2.webp"],
  [/7716ni|ipreg3/, "ipreg3.webp"],
  [/96256ni|ipreg4/, "ipreg4.webp"],
  [/2ce10df0t|hdcam1/, "hdcam1.webp"],
  [/2ce10df3t|hdcam2/, "hdcam2.webp"],
  [/2ce10df8t|hdcam3/, "hdcam3.webp"],
  [/2ce10hft|hdcam4/, "hdcam4.webp"],
  [/7204huhi|hdreg1/, "hdreg1.webp"],
  [/7208hqhi-m1|hdreg2/, "hdreg2.webp"],
  [/7208hqhi-m2|hdreg3/, "hdreg3.webp"],
  [/7116hghi|hdreg4/, "hdreg4.webp"],
  [/3e0318p|3e0109p|poe switch|net1|net2/, "switchds-3e031.png"],
  [/kv6113|door station|intercom1/, "doorstation.jpg"],
  [/1272zj|bracket|accessory1/, "bracket.jpeg"]
];

export function publicAssetPath(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function resolveStaticProductImage(product) {
  const keys = [product?.image, product?.slug, product?.id, product?.article].filter(Boolean).map(String);
  const exactFilename = keys.map((key) => PRODUCT_IMAGE_BY_KEY[key]).find(Boolean);
  const haystack = [
    product?.image,
    product?.slug,
    product?.id,
    product?.article,
    product?.name,
    product?.main_image?.url,
    product?.images?.find((image) => image.is_main)?.url,
    product?.images?.[0]?.url
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const ruleFilename = PRODUCT_IMAGE_RULES.find(([pattern]) => pattern.test(haystack))?.[1];
  const filename = exactFilename || ruleFilename;
  return filename ? publicAssetPath(`images/${filename}`) : "";
}
