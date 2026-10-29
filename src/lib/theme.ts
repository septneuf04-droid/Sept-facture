export function initTheme() {
  if (typeof window === "undefined") return;

  const storedTheme = localStorage.getItem("septfacture-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function toggleTheme(): boolean {
  if (typeof window === "undefined") return false;

  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("septfacture-theme", "light");
    return false;
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("septfacture-theme", "dark");
    return true;
  }
}

export function isDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}
