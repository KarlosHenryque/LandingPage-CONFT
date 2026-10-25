let cached: boolean | undefined;

/** true se o navegador consegue criar um contexto WebGL. */
export function hasWebGL(): boolean {
  if (cached !== undefined) return cached;
  try {
    const canvas = document.createElement('canvas');
    cached = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    cached = false;
  }
  return cached;
}
