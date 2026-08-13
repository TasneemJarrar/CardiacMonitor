import { getItem, setItem } from "./storage.js";

const THEME_KEY = "theme";

export function initTheme() {
  const isDark = getItem(THEME_KEY) === "dark";
  document.documentElement.classList.toggle("dark", isDark);
}

export function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle("dark");
  setItem(THEME_KEY, html.classList.contains("dark") ? "dark" : "light");
  updateModeIcon();
}

export function getTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function updateModeIcon() {
  const modeicons = document.querySelectorAll(".mode-icon");

  const isDark = document.documentElement.classList.contains("dark");

  modeicons.forEach((icon) => {
    icon.classList.toggle("fa-sun", isDark);
    icon.classList.toggle("fa-moon", !isDark);
  });
}

export function bindThemeToggle() {
  const modebtn = document.querySelector(".mode-toggle");
  if (!modebtn) return;
  modebtn.addEventListener("click", toggleTheme);
  updateModeIcon();
}