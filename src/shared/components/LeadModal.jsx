import { useEffect, useState } from "react";
import { usePreferences } from "../i18n/AppPreferences.jsx";

const phonePattern = "\\+?[0-9 ]*";

export function LeadModal({ open, onClose, onSubmit }) {
  const [sent, setSent] = useState(false);
  const { t } = usePreferences();

  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sentSuccessfully = await onSubmit(Object.fromEntries(formData.entries()));
    if (sentSuccessfully) {
      setSent(true);
      event.currentTarget.reset();
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-black/60 p-4 backdrop-blur" onMouseDown={onClose}>
      <div className="animate-modal w-full max-w-[520px] rounded-[24px] border border-line bg-surface p-8 shadow-editorial md:p-10" onMouseDown={(event) => event.stopPropagation()}>
        <button className="float-right text-3xl leading-none text-muted" onClick={onClose} aria-label={t("controls.close")}>×</button>
        {sent ? (
          <div className="clear-both py-14 text-center">
            <h3 className="font-display text-4xl text-text">{t("modal.thanks")}</h3>
            <p className="mt-4 text-muted">{t("modal.thanksCopy")}</p>
          </div>
        ) : (
          <form className="clear-both space-y-7" onSubmit={submit}>
            <h3 className="font-display text-4xl text-text">
              {t("modal.title")[0]} <span className="italic">{t("modal.title")[1]}</span>
            </h3>
            {["name", "phone", "message"].map((field) => (
              <label className="floating-field" key={field}>
                {field === "message" ? (
                  <textarea required name={field} placeholder=" " />
                ) : (
                  <input
                    required
                    name={field}
                    pattern={field === "phone" ? phonePattern : undefined}
                    title={field === "phone" ? "Phone must contain 11 digits after ignoring spaces and start with 77 or 87. A leading + is allowed." : undefined}
                    placeholder=" "
                  />
                )}
                <span>{t(`forms.${field}`)}</span>
              </label>
            ))}
            <input className="hidden" name="website" tabIndex="-1" autoComplete="off" />
            <button className="w-full rounded-full bg-contrast px-6 py-4 text-xs uppercase tracking-[0.1em] text-contrastText transition hover:opacity-90">
              {t("actions.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
