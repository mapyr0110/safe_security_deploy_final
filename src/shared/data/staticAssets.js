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

export function publicAssetPath(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function resolveStaticProductImage(product) {
  const keys = [product?.image, product?.slug, product?.id, product?.article].filter(Boolean).map(String);
  const filename = keys.map((key) => PRODUCT_IMAGE_BY_KEY[key]).find(Boolean);
  return filename ? publicAssetPath(`images/${filename}`) : "";
}
