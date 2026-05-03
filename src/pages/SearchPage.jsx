import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../core/api/backendApi.js";
import { ProductCard } from "../shared/components/ProductCard.jsx";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { language, t } = usePreferences();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchProducts(q, language, controller.signal)
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        setResults([]);
        setError(requestError);
        setLoading(false);
      });

    return () => controller.abort();
  }, [language, q]);

  return (
    <section className="bg-paper px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="label">{t("search.label")}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
          {t("search.title")} <span className="italic">"{q}"</span>
        </h1>
        {error && <p className="mt-8 rounded-xl border border-line bg-surface p-4 text-muted">server is not available</p>}
        {loading ? (
          <p className="mt-10 text-muted">{t("server.loadingCopy")}</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => <ProductCard product={product} key={product.slug} />)}
          </div>
        )}
        {!loading && !error && !results.length && <p className="mt-10 text-muted">{t("search.empty")}</p>}
      </div>
    </section>
  );
}
