(function () {
    var root = document.documentElement;
    var threshold = 40;

    function update() {
        if (window.scrollY > threshold) {
            root.classList.add('nav-compact');
        } else {
            root.classList.remove('nav-compact');
        }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
})();
