import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "../shared/components/ProductCard.jsx";
import { CounterUp } from "../shared/components/CounterUp.jsx";
import { ProductImage } from "../shared/components/ProductImage.jsx";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

const HERO_PRODUCT_ARTICLES = [
  "DS-2CD1041G2-LIU",
  "DS-7716NI-M4(STD)",
  "DS-3E0318P-E/M"
];

export function HomePage({ openLead, showToast }) {
  const [slide, setSlide] = useState(0);
  const scroller = useRef(null);
  const { brands, categories, products } = useLocalizedCatalog();
  const { t } = usePreferences();
  const slides = t("home.slides");
  const heroWords = t("home.heroWords");
  const activeSlide = slides[slide] || slides[0];
  const heroProducts = useMemo(
    () => HERO_PRODUCT_ARTICLES.map((article) => products.find((product) => product.article === article)),
    [products]
  );
  const activeHeroProduct = heroProducts[slide] || products[slide] || products[0];
  const brandLoop = Array.from({ length: 3 }, () => brands.map((brand) => brand.name)).flat();

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 4200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return undefined;

    let startX = 0;
    let left = 0;
    let down = false;
    const mouseDown = (event) => {
      down = true;
      startX = event.pageX;
      left = el.scrollLeft;
    };
    const mouseMove = (event) => {
      if (down) el.scrollLeft = left - (event.pageX - startX);
    };
    const stop = () => {
      down = false;
    };

    el.addEventListener("mousedown", mouseDown);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", stop);
    return () => {
      el.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", stop);
    };
  }, []);

  const primaryAction = slide === 2 ? (
    <Link to="/partner" className="rounded-full bg-contrast px-6 py-4 text-xs uppercase tracking-[0.1em] text-contrastText">
      {activeSlide[2]}
    </Link>
  ) : slide === 1 ? (
    <button onClick={openLead} className="rounded-full bg-contrast px-6 py-4 text-xs uppercase tracking-[0.1em] text-contrastText">
      {activeSlide[2]}
    </button>
  ) : (
    <Link to="/catalog/ip-cameras#products" className="rounded-full bg-contrast px-6 py-4 text-xs uppercase tracking-[0.1em] text-contrastText">
      {activeSlide[2]}
    </Link>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-paper px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-12 md:gap-16">
          <div className="hero-copy md:col-span-5" data-reveal="fade-up">
            <p className="label">{t("home.label")}</p>
            <h1 className="clip-title mt-5 max-w-[620px] font-display text-[38px] leading-[1.02] sm:text-[48px] md:text-[64px] lg:text-[74px]">
              {heroWords.map((word, index) => (
                <span className={`word ${index > 0 ? "italic" : ""}`} key={word}>
                  <span className="inner" style={{ transitionDelay: `${index * 0.12}s` }}>{word}</span>
                </span>
              ))}
            </h1>
            <p key={`hero-copy-${slide}`} className="hero-slide-copy mt-7 max-w-md text-lg leading-8 text-muted">{activeSlide[1]}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              {primaryAction}
              <button onClick={openLead} className="rounded-full border border-ink px-6 py-4 text-xs uppercase tracking-[0.1em] text-text">
                {t("actions.consultation")}
              </button>
            </div>
          </div>
          <div className="hero-camera md:col-span-7" data-reveal="scale-in">
            <ProductImage
              key={activeHeroProduct?.slug || activeHeroProduct?.article || slide}
              product={activeHeroProduct}
              className="hero-product-frame hero-slide-media"
              imageClassName="object-contain p-8 md:p-12"
              fallbackClassName="text-2xl"
            />
            <span>{t("brand")}</span>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <div><CounterUp target={1500} suffix="+" /> {t("home.partnerCounter")}</div>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${index === slide ? "w-7 bg-accent" : "w-2.5 bg-muted/40"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-contrast px-5 py-20 text-contrastText">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-display text-4xl leading-tight md:text-6xl" data-reveal="fade-up">{t("home.problemTitle")}</h2>
          <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
            {t("home.problems").map((item, index) => (
              <article className="border-t border-contrastText/20 pt-6" data-reveal="fade-up" style={{ transitionDelay: `${index * 0.12}s` }} key={item}>
                <span className="text-sm text-accent">0{index + 1}</span>
                <h3 className="mt-5 text-2xl">{item}</h3>
                <p className="mt-4 text-contrastText/60">{t("home.problemCopy")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="label" data-reveal="fade-up">{t("home.categoriesLabel")}</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl" data-reveal="fade-up">
            {t("home.catalogTitle")[0]} <span className="italic">{t("home.catalogTitle")[1]}</span>
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, index) => <CategoryCard category={cat} index={index} key={cat.slug} />)}
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="label" data-reveal="fade-up">{t("home.productsLabel")}</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl" data-reveal="fade-up">
            {t("home.productsTitle")[0]} <span className="italic">{t("home.productsTitle")[1]}</span>
          </h2>
          <div ref={scroller} className="mt-12 flex cursor-grab gap-5 overflow-x-auto pb-6 [scrollbar-width:none]">
            {products.slice(0, 8).map((product) => <ProductCard product={product} key={product.slug} />)}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-accent px-5 py-16 text-center text-white">
        <div data-reveal="fade-up">
          <h2 className="font-display text-4xl leading-tight md:text-5xl">{t("home.needHelp")}</h2>
          <button onClick={openLead} className="mt-8 rounded-full bg-white px-7 py-4 text-xs uppercase tracking-[0.1em] text-accent">
            {t("actions.leaveRequest")}
          </button>
        </div>
      </section>

      <section className="bg-paper px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-5">
          <div className="md:col-span-2" data-reveal="fade-up">
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              {t("home.partnerTitle")[0]} <span className="italic">{t("home.partnerTitle")[1]}</span>
            </h2>
            <p className="mt-6 leading-8 text-muted">{t("home.partnerCopy")}</p>
            <Link to="/partner" className="mt-8 inline-flex rounded-full border border-ink px-6 py-4 text-xs uppercase tracking-[0.1em] text-text">
              {t("actions.becomePartner")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-4">
            {t("home.partnerBenefits").map((item, index) => (
              <div className="rounded-2xl border border-line bg-surface p-6" data-reveal="scale-in" style={{ transitionDelay: `${index * 0.08}s` }} key={item}>
                <span className="text-xs text-accent">0{index + 1}</span>
                <p className="mt-5 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-paper px-5 py-16">
        <p className="label mx-auto max-w-7xl">{t("home.brands")}</p>
        <div className="marquee mt-8" aria-label={t("home.brands")}>
          <div className="marquee-track">
            {[0, 1].map((group) => (
              <div className="marquee-group" aria-hidden={group === 1} key={group}>
                {brandLoop.map((brand, index) => <span key={`${group}-${brand}-${index}`}>{brand}</span>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-5 py-20 text-center">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const sent = await showToast(Object.fromEntries(new FormData(event.currentTarget).entries()));
            if (sent) event.currentTarget.reset();
          }}
          className="mx-auto max-w-xl"
          data-reveal="fade-up"
        >
          <h2 className="font-display text-4xl">
            {t("home.newsletterTitle")[0]} <span className="italic">{t("home.newsletterTitle")[1]}</span>
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              className="min-w-0 flex-1 border-b border-line bg-transparent px-2 py-4 text-text outline-none focus:border-accent"
              name="email"
              type="email"
              pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
              title="Use only latin letters, numbers, dots, underscores, percent, plus and hyphen, for example client@example.com."
              required
              placeholder="Email"
            />
            <button className="rounded-full bg-contrast px-5 py-4 text-xs uppercase tracking-[0.1em] text-contrastText">
              {t("actions.subscribe")}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

function CategoryCard({ category, index }) {
  const { t } = usePreferences();
  const icon = category.slug.split("-").map((part) => part[0]).join("").slice(0, 3).toUpperCase();

  return (
    <Link to={`/catalog/${category.slug}#products`} className="rounded-2xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:shadow-editorial" data-reveal="scale-in" style={{ transitionDelay: `${index * 0.08}s` }}>
      <div className="inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-accent px-3 text-sm text-accent">{icon}</div>
      <h3 className="mt-7 text-xl font-semibold">{category.name}</h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-muted">{category.description}</p>
      <span className="mt-6 inline-flex text-sm text-accent">→ {t("actions.viewAll")}</span>
    </Link>
  );
}
