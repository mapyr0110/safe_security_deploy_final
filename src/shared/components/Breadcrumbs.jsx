import { Link } from "react-router-dom";
import { usePreferences } from "../i18n/AppPreferences.jsx";

export function Breadcrumbs({ items }) {
  const { t } = usePreferences();

  return (
    <nav className="mb-8 pt-8 text-sm text-muted">
      <Link to="/" className="hover:text-accent">{t("breadcrumbs.home")}</Link>
      {items.map((item) => (
        <span key={item.label}> <span className="mx-2">/</span> {item.href ? <Link to={item.href} className="hover:text-accent">{item.label}</Link> : item.label}</span>
      ))}
    </nav>
  );
}
