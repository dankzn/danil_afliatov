(function () {
    var storageKey = 'theme';

    function getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }

    function setTheme(theme, persist) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            try {
                localStorage.setItem(storageKey, theme);
            } catch (e) {
                // ignore storage errors
            }
        }
        updateIcon(theme);
    }

    function updateIcon(theme) {
        var icon = document.getElementById('theme-icon');
        if (!icon) return;
        icon.textContent = theme === 'light' ? '☀' : '☾';
    }

    function init() {
        var saved = null;
        try {
            saved = localStorage.getItem(storageKey);
        } catch (e) {
            saved = null;
        }

        var theme = saved || getPreferredTheme();
        setTheme(theme, false);

        var toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme') || 'dark';
            var next = current === 'dark' ? 'light' : 'dark';
            setTheme(next, true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
