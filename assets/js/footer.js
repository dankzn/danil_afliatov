document.addEventListener('DOMContentLoaded', function () {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-footer-year]').forEach(function (el) {
        el.textContent = year;
    });
});
