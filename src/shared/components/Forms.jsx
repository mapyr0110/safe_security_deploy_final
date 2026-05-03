import { usePreferences } from "../i18n/AppPreferences.jsx";

const defaultFields = ["name", "phone", "email", "message"];
const emailPattern = "[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}";
const phonePattern = "\\+?[0-9 ]*";

export function ContactForm({ title, onSubmit, fields = defaultFields }) {
  const { t } = usePreferences();
  const resolvedTitle = title || t("forms.title");

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sent = await onSubmit(Object.fromEntries(formData.entries()));
    if (sent) event.currentTarget.reset();
  };

  return (
    <form className="space-y-6 rounded-2xl border border-line bg-surface p-8 shadow-sm" onSubmit={submit}>
      <h3 className="font-display text-3xl text-text">{resolvedTitle}</h3>
      {fields.map((field) => {
        const key = typeof field === "string" ? field : field.key;
        const label = typeof field === "string" ? t(`forms.${field}`) : field.label;
        const required = typeof field === "string" ? key !== "email" : field.required ?? key !== "email";
        const type = typeof field === "string" ? (key === "email" ? "email" : "text") : field.type || (key === "email" ? "email" : "text");
        const pattern = typeof field === "string" ? validationPattern(key) : field.pattern || validationPattern(key);
        const title = typeof field === "string" ? validationTitle(key) : field.title || validationTitle(key);
        const isMessage = key === "message";

        return (
          <label className="floating-field" key={key}>
            {isMessage ? (
              <textarea required={required} name={key} placeholder=" " />
            ) : (
              <input required={required} name={key} type={type} pattern={pattern} title={title} placeholder=" " />
            )}
            <span>{label}</span>
          </label>
        );
      })}
      <button className="rounded-full bg-accent px-6 py-4 text-xs uppercase tracking-[0.1em] text-white transition hover:opacity-90">
        {t("actions.submitLead")}
      </button>
    </form>
  );
}

function validationPattern(key) {
  if (key === "email") return emailPattern;
  if (key === "phone") return phonePattern;
  return undefined;
}

function validationTitle(key) {
  if (key === "email") return "Use only latin letters, numbers, dots, underscores, percent, plus and hyphen, for example client@example.com.";
  if (key === "phone") return "Phone must contain 11 digits after ignoring spaces and start with 77 or 87. A leading + is allowed.";
  return undefined;
}
