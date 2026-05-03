import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header, TopBar } from "../shared/components/Header.jsx";
import { LeadModal } from "../shared/components/LeadModal.jsx";
import { Toast } from "../shared/components/Toast.jsx";
import { useReveal } from "../shared/hooks/useReveal.js";
import { Footer } from "../shared/components/Footer.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { AboutPage } from "../pages/AboutPage.jsx";
import { CatalogPage } from "../pages/CatalogPage.jsx";
import { ProductPage } from "../pages/ProductPage.jsx";
import { PartnerPage } from "../pages/PartnerPage.jsx";
import { ContactPage } from "../pages/ContactPage.jsx";
import { DeliveryPage } from "../pages/DeliveryPage.jsx";
import { SearchPage } from "../pages/SearchPage.jsx";
import { submitClient, submitLead } from "../core/api/backendApi.js";
import { ErrorBoundary } from "../shared/components/ErrorBoundary.jsx";
import { useLocalizedCatalog } from "../shared/hooks/useLocalizedCatalog.js";
import { usePreferences } from "../shared/i18n/AppPreferences.jsx";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const { language, t } = usePreferences();
  const { error, loading } = useLocalizedCatalog();
  useReveal(`${location.pathname}:${loading ? "loading" : "ready"}:${error ? "error" : "ok"}`);

  const showToast = async (payload = null) => {
    try {
      if (payload?.toastError) {
        throw new Error("Toast-only error");
      }
      if (payload?.name && payload?.phone && payload?.message) {
        await submitLead({
          ...payload,
          language,
          source_page: location.pathname
        });
      } else if (payload?.email) {
        await submitClient({
          email: payload.email
        });
      }
      setToast(t("toast.leadSent"));
      window.setTimeout(() => setToast(""), 3500);
      return true;
    } catch {
      setToast(t("toast.leadError"));
      window.setTimeout(() => setToast(""), 3500);
      return false;
    }
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return <BackendStatus title={t("server.loadingTitle")} copy={t("server.loadingCopy")} />;
  }

  if (error) {
    return <BackendStatus title="server is not available" />;
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-[10001] h-0.5 bg-accent" style={{ width: `${progress}%` }} />
      <ErrorBoundary>
        <TopBar />
        <Header />
        <main className="bg-paper text-text">
          <Routes>
            <Route path="/" element={<HomePage openLead={() => setModalOpen(true)} showToast={showToast} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage openLead={() => setModalOpen(true)} />} />
            <Route path="/partner" element={<PartnerPage showToast={showToast} />} />
            <Route path="/contact" element={<ContactPage showToast={showToast} />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<HomePage openLead={() => setModalOpen(true)} showToast={showToast} />} />
          </Routes>
        </main>
        <Footer showToast={showToast} />
        <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={showToast} />
        <Toast message={toast} />
      </ErrorBoundary>
    </>
  );
}

function BackendStatus({ title, copy, action, onAction }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-text">
      <section className="max-w-xl text-center">
        <h1 className="font-display text-4xl leading-tight md:text-6xl">{title}</h1>
        {copy && <p className="mt-6 leading-8 text-muted">{copy}</p>}
        {action && (
          <button className="mt-8 rounded-full bg-accent px-6 py-4 text-xs uppercase tracking-[0.1em] text-white" onClick={onAction}>
            {action}
          </button>
        )}
      </section>
    </main>
  );
}
