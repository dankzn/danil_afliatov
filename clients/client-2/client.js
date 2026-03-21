let clientData = null;

// Загрузка данных клиента
async function loadClientData() {
    try {
        const response = await fetch('data.json');
        clientData = await response.json();
        renderClient();
    } catch (error) {
        console.error('Error loading client ', error);
    }
}

// Отображение данных
function renderClient() {
    if (!clientData) return;
    
    // ✅ Используем currentLang из i18n.js
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const data = clientData[lang];
    
    if (!data) {
        console.error('No translations for language:', lang);
        return;
    }
    
    // Логотип
    const logoImg = document.getElementById('client-logo');
    const logoFallback = document.getElementById('client-logo-fallback');
    
    if (logoImg && clientData.logo) {
        logoImg.src = clientData.logo;
        logoImg.onload = function() {
            if (this.naturalWidth === 0) {
                this.style.display = 'none';
                if (logoFallback) {
                    logoFallback.style.display = 'flex';
                    logoFallback.textContent = clientData.logoFallback || 'CL';
                }
            } else {
                this.style.display = 'block';
                if (logoFallback) logoFallback.style.display = 'none';
            }
        };
        logoImg.onerror = function() {
            this.style.display = 'none';
            if (logoFallback) {
                logoFallback.style.display = 'flex';
                logoFallback.textContent = clientData.logoFallback || 'CL';
            }
        };
    }
    
    // Основная информация
    const nameEl = document.getElementById('client-name');
    if (nameEl) nameEl.textContent = data.name;
    
    const durationEl = document.getElementById('client-duration');
    if (durationEl) durationEl.textContent = clientData.duration;
    
    const challengeEl = document.getElementById('client-challenge');
    if (challengeEl) challengeEl.textContent = data.challenge;
    
    // Теги
    const tagsContainer = document.getElementById('client-tags');
    if (tagsContainer && clientData.tags) {
        tagsContainer.innerHTML = clientData.tags.map(tag => `<span>${tag}</span>`).join('');
    }
    
    // Решения
    const solutionsContainer = document.getElementById('client-solutions');
    if (solutionsContainer && data.solutions) {
        solutionsContainer.innerHTML = data.solutions.map(solution => `
            <div class="solution-item">
                <div class="solution-icon">${solution.icon}</div>
                <h3>${solution.title}</h3>
                <p>${solution.desc}</p>
            </div>
        `).join('');
    }
    
    // Результаты
    const resultsContainer = document.getElementById('client-results');
    if (resultsContainer && clientData.results) {
        resultsContainer.innerHTML = clientData.results.map(result => `
            <div class="result-card">
                <div class="result-number">${result.number}</div>
                <div class="result-label">${data[result.labelKey] || ''}</div>
            </div>
        `).join('');
    }
    
    // Отзыв
    const testimonialEl = document.getElementById('client-testimonial');
    if (testimonialEl) testimonialEl.textContent = data.testimonial ? `"${data.testimonial}"` : '';
    
    const testimonialAuthorEl = document.getElementById('client-testimonial-author');
    if (testimonialAuthorEl) testimonialAuthorEl.textContent = data.testimonialAuthor || '';
    
    const testimonialPositionEl = document.getElementById('client-testimonial-position');
    if (testimonialPositionEl) testimonialPositionEl.textContent = data.testimonialPosition || '';
    
    // CTA
    const ctaTitleEl = document.getElementById('client-cta-title');
    if (ctaTitleEl) ctaTitleEl.textContent = data.ctaTitle || '';
}

// Переключение языка
function switchLang(lang) {
    // ✅ Обновляем глобальную переменную в i18n.js
    if (typeof currentLang !== 'undefined') {
        currentLang = lang;
    }
    localStorage.setItem('lang', lang);
    
    // Обновляем индикатор
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
    
    // Закрываем меню
    const menu = document.getElementById('lang-menu');
    if (menu) menu.style.display = 'none';
    
    // ✅ Переводим статические элементы (навигация, заголовки)
    if (typeof loadLanguage === 'function') {
        loadLanguage(lang);
    }
    
    // ✅ Перерисовываем динамический контент клиента
    if (clientData) {
        renderClient();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // ✅ Сначала загружаем переводы интерфейса
    const savedLang = localStorage.getItem('lang') || 'en';
    
    if (typeof loadLanguage === 'function') {
        loadLanguage(savedLang);
    }
    
    // Обновляем индикатор
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = savedLang.toUpperCase();
    
    // ✅ Потом загружаем данные клиента
    loadClientData();
});
