let currentLang = localStorage.getItem("lang") || "en";

async function loadLanguage(lang) {
  const response = await fetch(`locales/${lang}.json`);
  const translations = await response.json();

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[key];
  });

  localStorage.setItem("lang", lang);
}

function detectLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;

  const browserLang = navigator.language || navigator.userLanguage;

  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("es")) return "es";

  return "en";
}

let currentLang = detectLanguage();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loadLanguage(currentLang);
  }, 50);
});
function toggleLangMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById("lang-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function changeLang(lang, event) {
  event.stopPropagation();

  setLanguage(lang);

  document.getElementById("current-lang").textContent = lang.toUpperCase();

  document.getElementById("lang-menu").style.display = "none";
}

/* закрытие при клике вне */
document.addEventListener("click", () => {
  const menu = document.getElementById("lang-menu");
  if (menu) menu.style.display = "none";
});

function changeLang(lang) {
  setLanguage(lang);

  document.getElementById("current-lang").textContent = lang.toUpperCase();

  document.getElementById("lang-menu").style.display = "none";
}

/* при загрузке */
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);

  const current = document.getElementById("current-lang");
  if (current) {
    current.textContent = currentLang.toUpperCase();
  }
});
