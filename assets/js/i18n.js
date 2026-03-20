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

function setLanguage(lang) {
  currentLang = lang;
  loadLanguage(lang);
}

document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
});
