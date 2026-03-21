let clientData = null;

// Загрузка данных клиента
async function loadClientData() {
    try {
        const response = await fetch('data.json');
        clientData = await response.json();
        renderClient();
    } catch (error) {
        console.error('Error loading client data:', error);
    }
}

// Отображение данных
function renderClient() {
    if (!clientData) return;
    
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const data = clientData[lang];
    
    // Логотип
    const logoImg = document.getElementById('client-logo');
    const logoFallback = document.getElementById('client-logo-fallback');
    if (logoImg && clientData.logo) {
        logoImg.src = clientData.logo;
        logoImg.onerror = function() {
            this.style.display = 'none';
            if (logoFallback) logoFallback.style.display = 'flex';
        };
    }
    if (logoFallback) {
        logoFallback.textContent = clientData.logoFallback || 'CL';
        logoFallback.style.display = 'flex';
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
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
    
    // Закрываем меню
    const menu = document.getElementById('lang-menu');
    if (menu) menu.style.display = 'none';
    
    // Перерисовываем
    if (clientData) {
        renderClient();
    }
    
    // Обновляем статические переводы
    if (typeof loadLanguage === 'function') {
        loadLanguage(lang);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadClientData();
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = currentLang.toUpperCase();
});
