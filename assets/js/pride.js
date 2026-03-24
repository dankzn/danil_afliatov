(function () {
    var root = document.documentElement;
    root.setAttribute('data-pride', 'off');
    root.setAttribute('data-pride-allowed', 'unknown');

    function isPrideMonth() {
        var now = new Date();
        return now.getMonth() === 5; // June
    }
    var storageKey = 'pride_mode';

    function getBasePath() {
        var path = window.location.pathname || '';
        if (path.indexOf('/clients/client-') !== -1) {
            return '../../';
        }
        if (path.indexOf('/clients/') !== -1) {
            return '../';
        }
        return './';
    }

    function normalizeName(name) {
        if (!name) return '';
        var normalized = String(name).toLowerCase();
        normalized = normalized.replace(/\(.*?\)/g, '');
        normalized = normalized.replace(/&/g, 'and');
        normalized = normalized.replace(/[^a-z0-9\s]/g, '');
        normalized = normalized.replace(/\bthe\b/g, '');
        normalized = normalized.replace(/\s+/g, ' ').trim();
        return normalized;
    }

    var aliasList = [
        'brunei darussalam',
        'burma',
        'swaziland',
        'uae',
        'u a e',
        'st lucia',
        'st vincent and the grenadines',
        'saint vincent and the grenadines',
        'syrian arab republic',
        'iran islamic republic of',
        'palestine',
        'palestinian territory',
        'occupied palestinian territory',
        'gaza strip',
        'the gambia'
    ];

    function buildBlockSet(data) {
        var set = new Set();
        if (data && Array.isArray(data.countries)) {
            data.countries.forEach(function (country) {
                set.add(normalizeName(country));
            });
        }
        if (data && Array.isArray(data.supplementalCountries)) {
            data.supplementalCountries.forEach(function (country) {
                set.add(normalizeName(country));
            });
        }
        aliasList.forEach(function (alias) {
            set.add(normalizeName(alias));
        });
        return set;
    }

    function shouldEnablePride(blockedSet, countryName) {
        if (!countryName) {
            return false;
        }
        var normalized = normalizeName(countryName);
        if (!normalized) {
            return false;
        }
        return !blockedSet.has(normalized);
    }

    function fetchJson(url) {
        return fetch(url, { cache: 'no-store' }).then(function (res) {
            if (!res.ok) {
                throw new Error('Request failed: ' + res.status);
            }
            return res.json();
        });
    }

    function getStoredMode() {
        try {
            var saved = localStorage.getItem(storageKey);
            if (saved === 'on' || saved === 'off' || saved === 'auto') {
                return saved;
            }
        } catch (e) {
            return 'auto';
        }
        return 'auto';
    }

    function setStoredMode(mode) {
        try {
            localStorage.setItem(storageKey, mode);
        } catch (e) {
            // ignore
        }
    }

    function getModeFromUrl() {
        try {
            var params = new URLSearchParams(window.location.search);
            var value = params.get('pride');
            if (!value) return null;
            value = value.toLowerCase();
            if (value === 'on' || value === 'off' || value === 'auto') {
                return value;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function applyPrideMode(allowed, mode) {
        if (!allowed) {
            root.setAttribute('data-pride', 'off');
            root.setAttribute('data-pride-allowed', 'false');
            return;
        }

        root.setAttribute('data-pride-allowed', 'true');

        if (mode === 'on') {
            root.setAttribute('data-pride', 'on');
            return;
        }
        if (mode === 'off') {
            root.setAttribute('data-pride', 'off');
            return;
        }
        root.setAttribute('data-pride', isPrideMonth() ? 'on' : 'off');
    }

    function updateToggle(allowed, mode) {
        var toggle = document.getElementById('pride-toggle');
        var label = document.getElementById('pride-toggle-label');
        if (!toggle || !label) {
            return;
        }
        if (!allowed) {
            toggle.style.display = 'none';
            return;
        }
        toggle.style.display = 'inline-flex';
        var labelText = 'Pride: ';
        if (mode === 'on') {
            labelText += 'On';
        } else if (mode === 'off') {
            labelText += 'Off';
        } else {
            labelText += 'Auto';
        }
        label.textContent = labelText;
    }

    function wireToggle(allowed) {
        var toggle = document.getElementById('pride-toggle');
        if (!toggle) {
            return;
        }
        if (!allowed) {
            toggle.style.display = 'none';
            return;
        }
        toggle.addEventListener('click', function () {
            var mode = getStoredMode();
            var next = mode === 'auto' ? 'on' : mode === 'on' ? 'off' : 'auto';
            setStoredMode(next);
            applyPrideMode(true, next);
            updateToggle(true, next);
        });
    }

    var blocklistUrl = getBasePath() + 'assets/data/pride-blocklist.json';
    var urlMode = getModeFromUrl();
    if (urlMode) {
        setStoredMode(urlMode);
    }

    Promise.all([
        fetchJson(blocklistUrl),
        fetchJson('https://ipapi.co/json/')
    ])
        .then(function (results) {
            var blocklist = results[0];
            var geo = results[1] || {};
            var blockedSet = buildBlockSet(blocklist);
            var countryName = geo.country_name || geo.country || '';
            var allowed = shouldEnablePride(blockedSet, countryName);
            var mode = getStoredMode();
            applyPrideMode(allowed, mode);
            updateToggle(allowed, mode);
            wireToggle(allowed);
        })
        .catch(function () {
            root.setAttribute('data-pride', 'off');
            root.setAttribute('data-pride-allowed', 'false');
            updateToggle(false, 'auto');
        });
})();
