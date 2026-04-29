type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'ui_theme_mode';

export const useTheme = () => {
  const mode = useState<ThemeMode>('ui_theme_mode', () => 'light');

  const applyTheme = (nextMode: ThemeMode): void => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.setAttribute('data-theme', nextMode);
  };

  const setMode = (nextMode: ThemeMode): void => {
    mode.value = nextMode;
    applyTheme(nextMode);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, nextMode);
    }
  };

  const toggleMode = (): void => {
    setMode(mode.value === 'light' ? 'dark' : 'light');
  };

  const initTheme = (): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedMode = localStorage.getItem(STORAGE_KEY);
    if (storedMode === 'light' || storedMode === 'dark') {
      mode.value = storedMode;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      mode.value = prefersDark ? 'dark' : 'light';
    }

    applyTheme(mode.value);
  };

  return {
    mode,
    initTheme,
    setMode,
    toggleMode,
  };
};
