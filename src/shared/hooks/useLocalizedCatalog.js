import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchCatalogBundle } from "../../core/api/backendApi.js";
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
        setState({
          categories: data.categories,
          brands: data.brands,
          products: data.products,
          blogPosts: data.blogPosts,
          loading: false,
          error: null
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({
          categories: [],
          brands: [],
          products: [],
          blogPosts: [],
          loading: false,
          error
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

export function useLocalizedCatalog() {
  const context = useContext(BackendDataContext);

  if (!context) {
    throw new Error("useLocalizedCatalog must be used inside BackendDataProvider.");
  }

  return context;
}
