import { useEffect, useMemo, useState } from "react";

export function ProductImage({ product, className = "", imageClassName = "object-contain p-6", fallbackClassName = "text-3xl" }) {
  const source = useMemo(() => {
    const rawSource = product?.main_image?.url || product?.images?.find((image) => image.is_main)?.url || product?.images?.[0]?.url || "";
    return normalizeImageSource(rawSource);
  }, [product]);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [source]);

  return (
    <div className={`relative grid place-items-center overflow-hidden bg-surfaceAlt font-display text-muted ${className}`}>
      {source && !imageFailed ? (
        <img
          src={source}
          alt={product?.name || product?.article || ""}
          className={`absolute inset-0 h-full w-full ${imageClassName}`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={fallbackClassName}>{product?.article || ""}</span>
      )}
    </div>
  );
}

function normalizeImageSource(source) {
  if (!source || typeof window === "undefined") return source;

  try {
    const url = new URL(source, window.location.origin);
    if (url.pathname.startsWith("/media/") && ["localhost", "127.0.0.1"].includes(url.hostname)) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return source;
  }

  return source;
}
