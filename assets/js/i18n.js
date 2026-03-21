function detectLanguage() { 
    const saved = localStorage.getItem("lang"); 
    if (saved) return saved; 
    const browserLang = navigator.language || navigator.userLanguage; 
    if (browserLang.startsWith("ru")) return "ru"; 
    if (browserLang.startsWith("es")) return "es"; 
    return "en"; 
} 

let currentLang = detectLanguage(); 

async function loadLanguage(lang) { 
    try { 
        // ИСПРАВЛЕНО: добавлены обратные кавычки ` `
        const response = await fetch(`./locales/${lang}.json`); 
        const translations = await response.json(); 
        
        document.querySelectorAll("[data-i18n]").forEach(el => { 
            const key = el.getAttribute("data-i18n"); 
            if (translations[key]) { 
                el.textContent = translations[key]; 
            } 
        }); 
        
        localStorage.setItem("lang", lang); 
    } catch (e) { 
        console.error("i18n error:", e); 
    } 
} 

function setLanguage(lang) { 
    currentLang = lang; 
    loadLanguage(lang); 
    const current = document.getElementById("current-lang"); 
    if (current) { 
        current.textContent = lang.toUpperCase(); 
    } 
} 

/* DROPDOWN */
function toggleLangMenu(event) { 
    event.stopPropagation(); 
    const menu = document.getElementById("lang-menu"); 
    // Переключаем видимость
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
} 

function changeLang(lang, event) { 
    event.stopPropagation(); 
    setLanguage(lang); 
    const menu = document.getElementById("lang-menu"); 
    if (menu) menu.style.display = "none"; 
} 

/* закрытие при клике вне */
document.addEventListener("click", () => { 
    const menu = document.getElementById("lang-menu"); 
    if (menu) menu.style.display = "none"; 
}); 

/* загрузка */
document.addEventListener("DOMContentLoaded", () => { 
    loadLanguage(currentLang); 
    const current = document.getElementById("current-lang"); 
    if (current) { 
        current.textContent = currentLang.toUpperCase(); 
    } 
});
