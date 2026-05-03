import { Link } from "react-router-dom";
import { ProductImage } from "./ProductImage.jsx";
import { usePreferences } from "../i18n/AppPreferences.jsx";

export function ProductCard({ product }) {
  const { t } = usePreferences();
  const price = product.price ? product.price : t("product.priceOnRequest");

  return (
    <article className="group min-w-[280px] rounded-2xl border border-line bg-surface p-4 transition duration-300 hover:-translate-y-1 hover:shadow-editorial">
      <ProductImage product={product} className="aspect-square rounded-xl" />
      <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted">{product.article}</p>
      <h3 className="mt-2 min-h-20 text-lg font-semibold leading-6">{product.name}</h3>
      <p className="mt-2 font-semibold text-accent">{price}</p>
      <Link to={`/product/${product.slug}`} className="mt-4 inline-flex rounded-full border border-ink px-4 py-3 text-xs uppercase tracking-[0.1em] transition hover:border-accent hover:text-accent">
        {t("actions.details")}
      </Link>
    </article>
  );
}
