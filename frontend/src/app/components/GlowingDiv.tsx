import { useEffect, useRef } from "react";

export const GlowingDiv = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateRef = (e) => {
      const { x, y, height, width } = ref.current?.getBoundingClientRect();
      const middleX = x + width / 2;
      const middleY = y + height / 2;
      let angle = (Math.atan2(e.y - middleY, e.x - middleX) * 180) / Math.PI;
      angle = (angle < 0 ? angle + 360 : angle) + 90;

      ref.current?.style.setProperty("--angle", angle);
      ref.current?.style.setProperty("--bg", `red`);
    };
    window.addEventListener("mousemove", calculateRef);
    return () => window.removeEventListener("mousemove", calculateRef);
  }, []);
  return (
    <div ref={ref} className="card h-full cursor-wait w-full flex items-center">
      {children}
    </div>
  );
};
