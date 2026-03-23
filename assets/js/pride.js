(function () {
    var root = document.documentElement;
    root.setAttribute('data-pride', 'off');

    function isPrideMonth() {
        var now = new Date();
        return now.getMonth() === 5; // June
    }

    if (!isPrideMonth()) {
        return;
    }

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

    var blocklistUrl = getBasePath() + 'assets/data/pride-blocklist.json';

    Promise.all([
        fetchJson(blocklistUrl),
        fetchJson('https://ipapi.co/json/')
    ])
        .then(function (results) {
            var blocklist = results[0];
            var geo = results[1] || {};
            var blockedSet = buildBlockSet(blocklist);
            var countryName = geo.country_name || geo.country || '';
            if (shouldEnablePride(blockedSet, countryName)) {
                root.setAttribute('data-pride', 'on');
            } else {
                root.setAttribute('data-pride', 'off');
            }
        })
        .catch(function () {
            root.setAttribute('data-pride', 'off');
        });
})();
