'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 50000, suffix: '+', label: 'Tasks Completed' },
  { value: 5000, suffix: '+', label: 'Verified Professionals' },
  { value: 4.8, suffix: '★', label: 'Average Rating', isDecimal: true },
];

function useCountUp(target: number, duration = 1500, isDecimal = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  function start() {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  return { count, start };
}

function StatItem({
  value,
  suffix,
  label,
  isDecimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}) {
  const { count, start } = useCountUp(value, 1400, isDecimal);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start(); }, {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-3xl font-extrabold text-primary sm:text-4xl">
        {isDecimal ? count.toFixed(1) : count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="border-y bg-accent/30 py-10">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
