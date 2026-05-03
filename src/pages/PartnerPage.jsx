import { ContactForm } from "../shared/components/Forms.jsx";
import { submitPartnerApplication } from "../core/api/backendApi.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export function PartnerPage({ showToast }) {
  const { t } = usePreferences();

  const submitPartner = async (payload) => {
    try {
      await submitPartnerApplication({
        contact_name: payload.name,
        company_name: payload.company,
        phone: payload.phone,
        email: payload.email,
        message: payload.message,
        city: payload.city || "",
        bin_or_iin: payload.bin_or_iin || "",
        website: payload.website || ""
      });
      return showToast();
    } catch {
      return showToast({ toastError: true });
    }
  };

  return (
    <section className="bg-paper px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl" data-reveal="fade-up">
          <p className="label">{t("partner.label")}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            {t("partner.title")[0]} <span className="italic">{t("partner.title")[1]}</span>
          </h1>
          <p className="mt-7 leading-8 text-muted">{t("partner.copy")}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t("partner.benefits").map((item, index) => (
            <div className="rounded-2xl border border-line bg-surface p-7" data-reveal="scale-in" style={{ transitionDelay: `${index * 0.08}s` }} key={item}>
              <span className="text-xs text-accent">0{index + 1}</span>
              <p className="mt-5 font-medium">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 max-w-2xl">
          <ContactForm
            title={t("forms.partnerTitle")}
            onSubmit={submitPartner}
            fields={[
              "name",
              "company",
              "phone",
              { key: "email", label: t("forms.email"), required: true, type: "email" },
              "message"
            ]}
          />
        </div>
      </div>
    </section>
  );
}
