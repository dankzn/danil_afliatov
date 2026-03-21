// Глобальная переменная языка
let currentLang = 'en';

// Определяем базовый путь к папке locales в зависимости от текущей страницы
function getLocalesBasePath() {
    const path = window.location.pathname;
    
    // Если мы в папке клиента: /clients/client-1/
    if (path.includes('/clients/client-')) {
        return '../../locales/';
    }
    // Если мы в папке clients: /clients/
    if (path.includes('/clients/')) {
        return '../locales/';
    }
    // Если мы в корне сайта
    return './locales/';
}

function detectLanguage() { 
    const saved = localStorage.getItem("lang"); 
    if (saved) return saved; 
    const browserLang = navigator.language || navigator.userLanguage; 
    if (browserLang.startsWith("ru")) return "ru"; 
    if (browserLang.startsWith("es")) return "es"; 
    return "en"; 
} 

// Инициализируем при загрузке
currentLang = detectLanguage();

async function loadLanguage(lang) { 
    try { 
        // ✅ Используем умный путь вместо ./locales/
        const basePath = getLocalesBasePath();
        const response = await fetch(`${basePath}${lang}.json`); 
        
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json: ${response.status}`);
        }
        
        const translations = await response.json(); 
        
        document.querySelectorAll("[data-i18n]").forEach(el => { 
            const key = el.getAttribute("data-i18n"); 
            if (translations[key]) { 
                el.textContent = translations[key]; 
            } 
        }); 
        
        localStorage.setItem("lang", lang);
        currentLang = lang; // ✅ Обновляем глобальную переменную
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

/* загрузка при старте */
document.addEventListener("DOMContentLoaded", () => { 
    loadLanguage(currentLang); 
    const current = document.getElementById("current-lang"); 
    if (current) { 
        current.textContent = currentLang.toUpperCase(); 
    } 
});
