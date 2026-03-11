import { useCallback, useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [currentValue, setCurrentValue] = useState(direction === 'down' ? to : from);

  // Intersection Observer for detecting when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getDecimalPlaces = (num: number) => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback((latest: number) => {
    const hasDecimals = maxDecimals > 0;
    const options: Intl.NumberFormatOptions = {
      useGrouping: !!separator,
      minimumFractionDigits: hasDecimals ? maxDecimals : 0,
      maximumFractionDigits: hasDecimals ? maxDecimals : 0
    };
    const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
    return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
  }, [maxDecimals, separator]);

  // Animation logic
  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') onStart();
      
      const startTime = Date.now() + delay * 1000;
      const endTime = startTime + duration * 1000;
      const startValue = direction === 'down' ? to : from;
      const endValue = direction === 'down' ? from : to;
      
      const animate = () => {
        const now = Date.now();
        
        if (now < startTime) {
          requestAnimationFrame(animate);
          return;
        }
        
        if (now >= endTime) {
          setCurrentValue(endValue);
          if (typeof onEnd === 'function') onEnd();
          return;
        }
        
        const progress = (now - startTime) / (duration * 1000);
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const value = startValue + (endValue - startValue) * easeProgress;
        
        setCurrentValue(value);
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, startWhen, direction, from, to, delay, duration, onStart, onEnd]);

  return <span className={className} ref={ref}>{formatValue(currentValue)}</span>;
}