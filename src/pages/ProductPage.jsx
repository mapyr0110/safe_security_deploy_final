import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../core/api/backendApi.js";
import { Breadcrumbs } from "../shared/components/Breadcrumbs.jsx";
import { ProductImage } from "../shared/components/ProductImage.jsx";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { useReveal } from "../shared/hooks/useReveal.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function ProductPage({ openLead }) {
  const { id } = useParams();
  const { language, t } = usePreferences();
  const [activeTab, setActiveTab] = useState(0);
  const { products } = useLocalizedCatalog();
  const productPreview = useMemo(
    () => products.find((item) => item.slug === id || String(item.id) === id || item.article === id),
    [id, products]
  );
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useReveal(`product:${id}:${loading ? "loading" : "ready"}:${product?.slug || ""}`);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProduct(id, language, controller.signal)
      .then((data) => {
        setProduct(mergeProductData(productPreview, data));
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setProduct(productPreview || null);
        setError(productPreview ? null : requestError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, language, productPreview]);

  if (loading) {
    return <ProductState title={t("server.loadingTitle")} />;
  }

  if (error || !product) {
    return <ProductState title={t("search.empty")} />;
  }

  const category = product.category;
  const brand = product.brand;
  const price = product.price ? product.price : t("product.priceOnRequest");
  const specifications = product.specifications || [];
  const description = product.description || product.short_description || category?.description || t("product.description");
  const documentation = product.documentation || t("product.specs");
  const tabs = t("product.tabs");

  return (
    <section className="bg-paper px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: t("nav.catalog"), href: `/catalog/${category?.slug || "ip-cameras"}#products` }, { label: product.name }]} />
        <div className="grid gap-12 lg:grid-cols-2">
          <div data-reveal="scale-in">
            <ProductImage product={product} className="aspect-square rounded-2xl" fallbackClassName="text-3xl" />
          </div>
          <div data-reveal="fade-up">
            <p className="label">{product.article}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-7 text-2xl font-semibold text-accent">{price}</p>
            <p className="mt-6 leading-8 text-muted">{description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button onClick={openLead} className="rounded-full bg-accent px-6 py-4 text-xs uppercase tracking-[0.1em] text-white">
                {t("actions.requestPrice")}
              </button>
              <button onClick={openLead} className="rounded-full border border-ink px-6 py-4 text-xs uppercase tracking-[0.1em] text-text">
                {t("actions.askSpecialist")}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-line pt-8">
          <div className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.14em]">
            {tabs.map((tab, index) => (
              <button
                className={`rounded-full border px-5 py-3 transition ${activeTab === index ? "border-accent bg-accent text-white" : "border-line text-text hover:border-accent hover:text-accent"}`}
                key={tab}
                onClick={() => setActiveTab(index)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <ProductTabPanel activeTab={activeTab} description={description} documentation={documentation} product={product} specifications={specifications} t={t} />
        </div>
      </div>
    </section>
  );
}

function ProductTabPanel({ activeTab, description, documentation, product, specifications, t }) {
  if (activeTab === 1) {
    return <p className="mt-8 max-w-3xl leading-8 text-muted">{description}</p>;
  }

  if (activeTab === 2) {
    return (
      <div className="mt-8 max-w-3xl rounded-xl border border-line bg-surface p-5 leading-8 text-muted">
        <p>{documentation}</p>
        <p className="mt-3 text-sm uppercase tracking-[0.12em] text-text">{product.article}</p>
      </div>
    );
  }

  return specifications.length > 0 ? (
    <dl className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
      {specifications.map((spec) => (
        <div className="rounded-xl border border-line bg-surface p-4" key={spec.id}>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">{spec.name}</dt>
          <dd className="mt-2 text-text">{spec.value}</dd>
        </div>
      ))}
    </dl>
  ) : (
    <p className="mt-8 max-w-3xl leading-8 text-muted">{t("catalog.comingSoon")}</p>
  );
}

function mergeProductData(preview, detail) {
  if (!preview) return detail;

  return {
    ...preview,
    ...detail,
    category: detail.category || preview.category,
    brand: detail.brand || preview.brand,
    main_image: detail.main_image || preview.main_image,
    images: detail.images?.length ? detail.images : preview.images || [],
    description: detail.description || preview.description || preview.short_description,
    documentation: detail.documentation || preview.documentation,
    short_description: detail.short_description || preview.short_description
  };
}

function ProductState({ title }) {
  return (
    <section className="grid min-h-[55vh] place-items-center bg-paper px-5 text-center">
      <h1 className="font-display text-4xl text-text">{title}</h1>
    </section>
  );
}
