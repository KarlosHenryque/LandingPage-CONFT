import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

interface Options {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  threshold = 0.18,
  rootMargin = '0px 0px -40px 0px',
}: Options = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, inView];
}
