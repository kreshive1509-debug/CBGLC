import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
  end: string | number;
  start?: number;
  duration?: number;
  formatter?: (value: number) => string;
}

export const Counter: React.FC<CounterProps> = ({ end, start = 0, duration = 1500, formatter }) => {
  const targetNum = typeof end === 'number' ? end : parseInt(String(end).replace(/,/g, ''), 10);
  const initialValue = Number.isFinite(start) ? start : 0;
  const [count, setCount] = useState(initialValue);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const suffix = typeof end === 'string' ? end.replace(/[0-9,]/g, '') : '';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(initialValue + progress * (targetNum - initialValue));
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, targetNum, initialValue, duration]);

  const formatNumber = (num: number) => {
    if (formatter) return formatter(num);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={elementRef} className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
};
