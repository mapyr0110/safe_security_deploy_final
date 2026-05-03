import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function DeliveryPage() {
  const { t } = usePreferences();

  return (
    <section className="bg-paper px-5 py-16">
      <div className="mx-auto max-w-5xl" data-reveal="fade-up">
        <p className="label">{t("delivery.label")}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
          {t("delivery.title")[0]} <span className="italic">{t("delivery.title")[1]}</span>
        </h1>
        <p className="mt-7 leading-8 text-muted">{t("delivery.copy")}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t("delivery.items").map((item, index) => (
            <div className="rounded-2xl border border-line bg-surface p-7" key={item}>
              <span className="text-xs text-accent">0{index + 1}</span>
              <p className="mt-5">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
