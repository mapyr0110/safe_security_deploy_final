import { useEffect } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { Breadcrumbs } from "../shared/components/Breadcrumbs.jsx";
import { ProductCard } from "../shared/components/ProductCard.jsx";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function CatalogPage() {
  const { categorySlug } = useParams();
  const location = useLocation();
  const { categories, products } = useLocalizedCatalog();
  const { t } = usePreferences();
  const category = categories.find((item) => item.slug === categorySlug) || categories[0];
  const items = category ? products.filter((product) => product.category?.slug === category.slug) : [];

  useEffect(() => {
    if (location.hash !== "#products") return undefined;

    const timeout = window.setTimeout(() => {
      const target = document.getElementById("products");
      if (!target) return;

      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [categorySlug, items.length, location.hash]);

  if (!category) {
    return (
      <section className="bg-paper px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-muted">{t("catalog.comingSoon")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: t("nav.catalog"), href: "/catalog/ip-cameras#products" }, { label: category.name }]} />
        <div className="max-w-4xl" data-reveal="fade-up">
          <p className="label">{t("nav.catalog")}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-muted">{category.description}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-line bg-surface p-6" data-reveal="fade-up">
            <h3 className="font-semibold">{t("catalog.filters")}</h3>
            <div className="mt-5 space-y-2 text-sm">
              {categories.map((item) => (
                <NavLink
                  className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? "bg-accent text-white" : "text-text hover:bg-surfaceAlt"}`}
                  to={`/catalog/${item.slug}#products`}
                  key={item.slug}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            <p className="mt-6 border-t border-line pt-5 text-sm leading-6 text-muted">{t("catalog.sidebarCopy")}</p>
          </aside>

          <div id="products">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.length ? items.map((product) => <ProductCard product={product} key={product.slug} />) : <p className="text-muted">{t("catalog.comingSoon")}</p>}
            </div>
            <Link className="mt-8 inline-flex text-accent" to="/catalog/ip-cameras#products">← {t("actions.allCategories")}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
