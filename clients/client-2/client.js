let clientData = null;

async function loadClientData() {
    try {
        const response = await fetch('data.json');
        clientData = await response.json();
        renderClient();
    } catch (error) {
        console.error('Error loading client data:', error);
    }
}

function renderClient() {
    if (!clientData) return;
    
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const data = clientData[lang];
    
    if (!data) return;
    
    // Logo
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
    
    // Content
    const nameEl = document.getElementById('client-name');
    if (nameEl) nameEl.textContent = data.name || '';
    
    const requestEl = document.getElementById('client-request');
    if (requestEl) requestEl.textContent = data.request || '';
    
    const challengeEl = document.getElementById('client-challenge');
    if (challengeEl) challengeEl.textContent = data.challenge || '';
    
    // Meta
    if (clientData.industry) {
        const industryEl = document.getElementById('meta-industry');
        if (industryEl) industryEl.textContent = clientData.industry;
    }
    if (clientData.solution) {
        const solutionEl = document.getElementById('meta-solution');
        if (solutionEl) solutionEl.textContent = clientData.solution;
    }
    if (clientData.platform) {
        const platformEl = document.getElementById('meta-platform');
        if (platformEl) platformEl.textContent = clientData.platform;
    }
    if (clientData.duration) {
        const durationEl = document.getElementById('meta-duration');
        if (durationEl) durationEl.textContent = clientData.duration;
    }
    
    // Solutions - БЕЗ ШАБЛОННЫХ СТРОК!
    const solutionsContainer = document.getElementById('client-solutions');
    if (solutionsContainer && data.solutions) {
        var solutionTitle = lang === 'ru' ? 'Решение' : lang === 'es' ? 'Solución' : 'Solution';
        var solutionsHTML = '<h2>' + solutionTitle + '</h2>';
        
        for (var i = 0; i < data.solutions.length; i++) {
            var solution = data.solutions[i];
            solutionsHTML += '<div class="solution-item">';
            solutionsHTML += '<h3>' + solution.title + '</h3>';
            solutionsHTML += '<p>' + solution.desc + '</p>';
            solutionsHTML += '</div>';
        }
        
        solutionsContainer.innerHTML = solutionsHTML;
    }
    
    // Results - БЕЗ ШАБЛОННЫХ СТРОК!
    const resultsContainer = document.getElementById('client-results');
    if (resultsContainer && clientData.results) {
        var resultsHTML = '';
        
        for (var j = 0; j < clientData.results.length; j++) {
            var result = clientData.results[j];
            var label = data[result.labelKey] || '';
            resultsHTML += '<div class="result-card">';
            resultsHTML += '<div class="result-number">' + result.number + '</div>';
            resultsHTML += '<div class="result-label">' + label + '</div>';
            resultsHTML += '</div>';
        }
        
        resultsContainer.innerHTML = resultsHTML;
    }
    
    // Testimonial
    const testimonialSection = document.getElementById('testimonial-section');
    if (testimonialSection && data.testimonial) {
        testimonialSection.style.display = 'block';
        const authorEl = document.getElementById('testimonial-author');
        if (authorEl && data.testimonialAuthor) {
            authorEl.innerHTML = '<strong>' + data.testimonialAuthor + '</strong><span>' + (data.testimonialPosition || '') + '</span>';
        }
        const textEl = document.getElementById('client-testimonial');
        if (textEl) textEl.textContent = '"' + data.testimonial + '"';
    }
    
    // CTA
    const ctaTitleEl = document.getElementById('client-cta-title');
    if (ctaTitleEl) ctaTitleEl.textContent = data.ctaTitle || '';
}

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

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('lang') || 'en';
    
    if (typeof loadLanguage === 'function') {
        loadLanguage(savedLang);
    }
    
    const currentLangEl = document.getElementById('current-lang');
    if (currentLangEl) currentLangEl.textContent = savedLang.toUpperCase();
    
    loadClientData();
});
