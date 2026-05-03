import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let active = false;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    const over = (event) => {
      active = Boolean(event.target.closest("a, button, input, textarea, select"));
      cursor.classList.toggle("cursor-active", active);
    };
    const tick = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) ${active ? "scale(3)" : "scale(1)"}`;
      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    tick();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return <div id="cursor" ref={ref} />;
}
