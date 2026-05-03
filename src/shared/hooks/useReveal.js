import { useEffect } from "react";

export function useReveal(trigger) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [trigger]);
}
