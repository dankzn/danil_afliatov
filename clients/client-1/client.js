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
    
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const data = clientData[lang];
    
    if (!data) return;
    
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
    
    const requestEl = document.getElementById('client-request');
    if (requestEl) requestEl.textContent = data.request;
    
    const challengeEl = document.getElementById('client-challenge');
    if (challengeEl) challengeEl.textContent = data.challenge;
    
    // Мета-информация (можно добавить в data.json)
    const industryEl = document.getElementById('meta-industry');
    if (industryEl && clientData.industry) industryEl.textContent = clientData.industry;
    
    const solutionEl = document.getElementById('meta-solution');
    if (solutionEl && clientData.solution) solutionEl.textContent = clientData.solution;
    
    const platformEl = document.getElementById('meta-platform');
    if (platformEl && clientData.platform) platformEl.textContent = clientData.platform;
    
    const durationEl = document.getElementById('meta-duration');
    if (durationEl && clientData.duration) durationEl.textContent = clientData.duration;
    
    // Решения
    const solutionsContainer = document.getElementById('client-solutions');
    if (solutionsContainer && data.solutions) {
        solutionsContainer.innerHTML = `
            <h2>${lang === 'ru' ? 'Решение' : lang === 'es' ? 'Solución' : 'Solution'}</h2>
            ${data.solutions.map(solution => `
                <div class="solution-item">
                    <h3>${solution.title}</h3>
                    <p>${solution.desc}</p>
                </div>
            `).join('')}
        `;
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
    const testimonialSection = document.getElementById('testimonial-section');
    if (testimonialSection && data.testimonial) {
        testimonialSection.style.display = 'block';
        
        const authorEl = document.getElementById('testimonial-author');
        if (authorEl && data.testimonialAuthor) {
            authorEl.innerHTML = `
                <strong>${data.testimonialAuthor}</strong>
                <span>${data.testimonialPosition || ''}</span>
            `;
        }
        
        const textEl = document.getElementById('client-testimonial');
        if (textEl) textEl.textContent = `"${data.testimonial}"`;
    }
    
    // CTA
    const ctaTitleEl = document.getElementById('client-cta-title');
    if (ctaTitleEl) ctaTitleEl.textContent = data.ctaTitle || '';
}

// Переключение языка
function switchLang(lang) {
    if (typeof currentLang !== 'undefined') {
        currentLang = lang;
    }
    localStorage.setItem('lang', lang);
    
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
    
    const menu = document.getElementById('lang-menu');
    if (menu) menu.style.display = 'none';
    
    if (typeof loadLanguage === 'function') {
        loadLanguage(lang);
    }
    
    if (clientData) {
        renderClient();
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'en';
    
    if (typeof loadLanguage === 'function') {
        loadLanguage(savedLang);
    }
    
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = savedLang.toUpperCase();
    
    loadClientData();
});
