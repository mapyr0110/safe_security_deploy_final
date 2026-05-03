import { Link } from "react-router-dom";
import { useLocalizedCatalog } from "../hooks/useLocalizedCatalog.js";
import { usePreferences } from "../i18n/AppPreferences.jsx";

export function Footer({ showToast }) {
  const { categories } = useLocalizedCatalog();
  const { t } = usePreferences();

  const subscribe = async (event) => {
    event.preventDefault();
    const sent = await showToast(Object.fromEntries(new FormData(event.currentTarget).entries()));
    if (sent) event.currentTarget.reset();
  };

  return (
    <footer className="bg-contrast px-5 py-14 text-contrastText">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)]">
        <div>
          <Link to="/" className="font-display text-3xl uppercase tracking-[0.08em]">{t("brand")}</Link>
          <p className="mt-4 max-w-md text-xl leading-8 text-contrastText/62">{t("footer.tagline")}</p>
          <form onSubmit={subscribe} className="mt-8 max-w-md">
            <label className="floating-field dark">
              <input
                name="email"
                type="email"
                pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
                title="Use only latin letters, numbers, dots, underscores, percent, plus and hyphen, for example client@example.com."
                required
                placeholder=" "
              />
              <span>{t("footer.subscribeEmail")}</span>
            </label>
            <button className="mt-4 rounded-full border border-contrastText px-5 py-3 text-sm transition hover:bg-contrastText hover:text-contrast">
              {t("actions.submit")}
            </button>
          </form>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 lg:justify-items-end lg:text-right">
          <FooterColumn title={t("footer.catalog")} links={categories.slice(0, 6).map((cat) => ({ label: cat.name, href: `/catalog/${cat.slug}` }))} />
          <FooterColumn
            title={t("footer.company")}
            links={[
              { label: t("nav.about"), href: "/about" },
              { label: t("nav.delivery"), href: "/delivery" },
              { label: t("nav.contacts"), href: "/contact" }
            ]}
          />
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.16em] text-contrastText/52">{t("footer.contacts")}</h4>
            <p className="leading-8 text-contrastText/75">
              +7 727 311 22 33<br />
              sales@safe-security.kz<br />
              {t("footer.address")}
            </p>
          </div>
        </div>

        <div className="border-t border-contrastText/16 pt-6 text-sm text-contrastText/50 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 md:flex-row">
            <span>{t("footer.rights")}</span>
            <span>{t("footer.policies")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.16em] text-contrastText/52">{title}</h4>
      <div className="space-y-3">
        {links.map((link) => (
          <Link className="block text-contrastText/75 transition hover:text-contrastText" to={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
