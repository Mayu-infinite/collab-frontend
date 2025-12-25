export type Theme = 'light' | 'dark';

export const setTheme = (theme: Theme) => {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

export const initTheme = () => {
  const saved = localStorage.getItem('theme') as Theme | null;
  setTheme(saved ?? 'light');
};

export const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
};
