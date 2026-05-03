import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocalizedCatalog } from "../hooks/useLocalizedCatalog.js";
import { languages, usePreferences } from "../i18n/AppPreferences.jsx";

export function TopBar() {
  const { t } = usePreferences();

  return (
    <div className="hidden bg-contrast px-6 py-3 text-xs uppercase tracking-[0.14em] text-contrastText md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span>{t("topBar.partner")}</span>
        <div className="flex items-center gap-6">
          <a href="tel:+77273112233">+7 727 311 22 33</a>
          <Link className="rounded-full border border-contrastText/40 px-4 py-2" to="/partner">
            {t("topBar.b2b")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { categories, products } = useLocalizedCatalog();
  const { t } = usePreferences();
  const navigate = useNavigate();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setHidden(window.scrollY > lastY && window.scrollY > 120);
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    const normalized = query.toLowerCase();
    return products
      .filter((item) => item.name.toLowerCase().includes(normalized) || item.article.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [products, query]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => `text-sm transition hover:text-accent ${isActive ? "text-accent" : "text-text"}`;

  return (
    <header className={`sticky top-0 z-50 border-b border-line transition duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} ${scrolled ? "bg-paper/88 shadow-sm backdrop-blur-xl" : "bg-paper"}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
        <Link to="/" className="shrink-0 font-display text-2xl uppercase leading-none tracking-[0.08em] text-text md:text-3xl">
          {t("brand")}
        </Link>

        <nav className={`${menuOpen ? "absolute left-0 top-full flex w-full flex-col border-b border-line bg-paper p-5 shadow-editorial" : "hidden"} flex-1 items-start gap-5 md:static md:flex md:flex-row md:items-center md:justify-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <NavLink to="/" className={navClass} onClick={closeMenu}>{t("nav.home")}</NavLink>
          <div className="group relative">
            <NavLink to="/catalog/ip-cameras#products" className={navClass} onClick={closeMenu}>{t("nav.catalog")}</NavLink>
            <div className="invisible absolute left-0 top-8 z-20 w-72 rounded-2xl border border-line bg-surface p-3 opacity-0 shadow-editorial transition group-hover:visible group-hover:opacity-100 md:left-1/2 md:-translate-x-1/2">
              {categories.map((cat) => (
                <Link className="block rounded-xl px-4 py-3 text-sm text-text hover:bg-surfaceAlt" to={`/catalog/${cat.slug}#products`} key={cat.slug}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <NavLink to="/contact" className={navClass} onClick={closeMenu}>{t("nav.contacts")}</NavLink>
          <div className="flex w-full items-center gap-3 md:hidden">
            <PreferenceControls compact />
          </div>
        </nav>

        <form className="relative hidden max-w-xs flex-1 lg:block" onSubmit={submitSearch}>
          <input
            className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-text outline-none transition focus:border-accent"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 top-12 z-30 w-full rounded-2xl border border-line bg-surface p-2 shadow-editorial">
              {suggestions.map((item) => (
                <Link className="block rounded-xl px-3 py-2 text-sm text-text hover:bg-surfaceAlt" key={item.slug} to={`/product/${item.slug}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </form>

        <div className="hidden items-center gap-3 md:flex">
          <PreferenceControls />
        </div>
        <Link to="/partner" className="hidden rounded-full border border-accent px-4 py-3 text-xs uppercase tracking-[0.1em] text-accent transition hover:bg-accent hover:text-white md:block">
          {t("actions.becomePartner")}
        </Link>
        <button className="ml-auto grid h-10 w-10 place-items-center md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("controls.menu")}>
          <span className="sr-only">{t("controls.menu")}</span>
          <span className="grid w-6 gap-1.5">
            <span className={`h-px bg-ink transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-px bg-ink transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-px bg-ink transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
    </header>
  );
}

function PreferenceControls({ compact = false }) {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  return (
    <>
      <label className="sr-only" htmlFor={compact ? "mobile-language" : "desktop-language"}>{t("controls.language")}</label>
      <select
        id={compact ? "mobile-language" : "desktop-language"}
        className="h-10 rounded-full border border-line bg-surface px-3 text-xs uppercase tracking-[0.08em] text-text outline-none"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languages.map((item) => (
          <option value={item.code} key={item.code}>{item.label}</option>
        ))}
      </select>
      <button
        className="h-10 rounded-full border border-line bg-surface px-4 text-xs uppercase tracking-[0.08em] text-text transition hover:border-accent hover:text-accent"
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t("controls.switchToLight") : t("controls.switchToDark")}
      >
        {theme === "dark" ? t("controls.light") : t("controls.dark")}
      </button>
    </>
  );
}
