import { useEffect, useState } from 'react';
import { readPreference } from './preferences';
export { writePreference } from './preferences';
export type Appearance = { theme: string; textSize: string; reducedMotion: string };
export function useAppearance(): Appearance {
  const [state, setState] = useState<Appearance>({
    theme: 'system',
    textSize: 'normal',
    reducedMotion: 'system',
  });
  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    let alive = true;
    const refresh = async () => {
      const theme = (await readPreference('theme')) ?? 'system';
      const textSize = (await readPreference('textSize')) ?? 'normal';
      const reducedMotion = (await readPreference('reducedMotionOverride')) ?? 'system';
      if (!alive) return;
      document.documentElement.dataset.theme =
        theme === 'system' ? (query.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.textSize = textSize;
      document.documentElement.dataset.motion = reducedMotion;
      setState({ theme, textSize, reducedMotion });
    };
    const handler = () => void refresh();
    handler();
    query.addEventListener('change', handler);
    window.addEventListener('appearance-change', handler);
    return () => {
      alive = false;
      query.removeEventListener('change', handler);
      window.removeEventListener('appearance-change', handler);
    };
  }, []);
  return state;
}
