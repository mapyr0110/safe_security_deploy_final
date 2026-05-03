import { useEffect, useRef, useState } from "react";

export function CounterUp({ target, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const animate = (time) => {
        const progress = Math.min((time - started) / 1500, 1);
        setValue(Math.floor(target * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(node);
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}
