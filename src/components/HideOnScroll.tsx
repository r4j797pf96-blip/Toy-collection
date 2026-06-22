"use client";

import { useEffect, useRef, useState } from "react";

export default function HideOnScroll({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 80) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-16 z-10 transition-transform duration-300 ${
        hidden ? "-translate-y-[calc(100%+4rem)]" : "translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
