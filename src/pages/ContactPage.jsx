import { Breadcrumbs } from "../shared/components/Breadcrumbs.jsx";
import { ContactForm } from "../shared/components/Forms.jsx";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function ContactPage({ showToast }) {
  const { t } = usePreferences();

  return (
    <section className="bg-paper px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: t("contact.breadcrumb") }]} />
        <div className="grid gap-12 lg:grid-cols-2">
          <div data-reveal="fade-up">
            <h1 className="font-display text-4xl leading-tight md:text-6xl">
              {t("contact.title")[0]} <span className="italic">{t("contact.title")[1]}</span>
            </h1>
            <p className="mt-6 leading-8 text-muted">{t("contact.copy")}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {t("contact.items").map((item, index) => (
                <div className="rounded-2xl border border-line bg-surface p-6" key={item}>
                  <span className="text-xs text-accent">0{index + 1}</span>
                  <p className="mt-4">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <ContactForm onSubmit={showToast} />
        </div>
      </div>
    </section>
  );
}
