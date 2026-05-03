import { Breadcrumbs } from "../shared/components/Breadcrumbs.jsx";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function AboutPage() {
  const { t } = usePreferences();

  return (
    <section className="bg-paper px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: t("about.breadcrumb") }]} />
        <div className="grid gap-12 md:grid-cols-2">
          <div data-reveal="fade-up">
            <p className="label">{t("about.label")}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              {t("about.title")[0]} <span className="italic">{t("about.title")[1]}</span>
            </h1>
            <p className="mt-7 leading-8 text-muted">{t("about.copy1")}</p>
            <p className="mt-5 leading-8 text-muted">{t("about.copy2")}</p>
          </div>
          {/* <div className="grid min-h-[360px] place-items-center rounded-2xl border border-line bg-surfaceAlt overflow-hidden" data-reveal="scale-in">
            <img
              src="/images/about.jpg"
              alt="Safe Security"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div> */}
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t("about.cards").map((item, index) => (
            <div className="rounded-2xl border border-line bg-surface p-7" data-reveal="fade-up" style={{ transitionDelay: `${index * 0.08}s` }} key={item}>
              <span className="text-xs text-accent">0{index + 1}</span>
              <h3 className="mt-5 text-2xl">{item}</h3>
            </div>
          ))}
        </div>
        <div className="mt-14 max-w-3xl" data-reveal="fade-up">
          <h2 className="font-display text-4xl">{t("about.portfolioTitle")}</h2>
          <ol className="mt-8 space-y-5 text-lg text-muted">
            {t("about.portfolio").map((item, index) => (
              <li key={item}>{String(index + 1).padStart(2, "0")}. {item}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
