import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Dispositivo com mouse/trackpad de verdade (sem toque como entrada principal). */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}
