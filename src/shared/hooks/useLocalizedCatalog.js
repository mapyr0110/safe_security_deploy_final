import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCatalogBundle } from "../../core/api/backendApi.js";
import { getLocalizedBlogPosts, getLocalizedCategories, getLocalizedProducts } from "../data/catalog.js";
import { usePreferences } from "../i18n/AppPreferences.jsx";

const BackendDataContext = createContext(null);

export function BackendDataProvider({ children }) {
  const { language } = usePreferences();
  const [state, setState] = useState({
    categories: [],
    brands: [],
    products: [],
    blogPosts: [],
    loading: true,
    error: null
  });

  const load = useCallback((signal) => {
    setState((current) => ({ ...current, loading: true, error: null }));

    return fetchCatalogBundle(language, signal)
      .then((data) => {
        const fallbackData = getFallbackCatalog(language);
        setState({
          categories: data.categories.length ? data.categories : fallbackData.categories,
          brands: data.brands,
          products: data.products.length ? data.products : fallbackData.products,
          blogPosts: data.blogPosts.length ? data.blogPosts : fallbackData.blogPosts,
          loading: false,
          error: null
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        const fallbackData = getFallbackCatalog(language);
        setState({
          categories: fallbackData.categories,
          brands: [],
          products: fallbackData.products,
          blogPosts: fallbackData.blogPosts,
          loading: false,
          error: null
        });
      });
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const value = useMemo(
    () => ({
      ...state,
      refresh: () => load()
    }),
    [load, state]
  );

  return createElement(BackendDataContext.Provider, { value }, children);
}

function getFallbackCatalog(language) {
  return {
    categories: getLocalizedCategories(language),
    products: getLocalizedProducts(language),
    blogPosts: getLocalizedBlogPosts(language)
  };
}

export function useLocalizedCatalog() {
  const context = useContext(BackendDataContext);

  if (!context) {
    throw new Error("useLocalizedCatalog must be used inside BackendDataProvider.");
  }

  return context;
}
