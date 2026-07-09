import { useEffect, useState } from "react";

function format(n: number, w = 2) {
  return n.toString().padStart(w, "0");
}

export function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const h = Math.floor(elapsed / 3600) % 100;
      const m = Math.floor(elapsed / 60) % 60;
      const s = Math.floor(elapsed) % 60;
      const f = Math.floor((elapsed % 1) * 24);
      setTc(`${format(h)}:${format(m)}:${format(s)}:${format(f)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <span className="tabular-nums">{tc}</span>;
}
