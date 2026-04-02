(() => {
    const container = document.querySelector('.scene-bg');
    if (!container || !window.THREE) return;

    let canvas = container.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'three-bg';
        container.prepend(canvas);
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.1, 8);

    const lineCount = 52;
    const points = 260;
    const width = 20;
    const depth = 10;

    const lines = [];
    const color = new THREE.Color('#0b7a42');

    for (let i = 0; i < lineCount; i += 1) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(points * 3);
        const z = (i / (lineCount - 1) - 0.5) * depth;

        for (let j = 0; j < points; j += 1) {
            const x = (j / (points - 1) - 0.5) * width;
            const idx = j * 3;
            positions[idx] = x;
            positions[idx + 1] = 0;
            positions[idx + 2] = z;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push({ line, positions, z });
    }

    function resize() {
        const { innerWidth: w, innerHeight: h } = window;
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function updateColors() {
        const nextColor = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#006400');
        lines.forEach(({ line }) => line.material.color.copy(nextColor));
    }

    let lastTheme = document.documentElement.getAttribute('data-theme');

    function animate() {
        const t = performance.now() * 0.0005;

        lines.forEach(({ line, positions, z }) => {
            for (let j = 0; j < points; j += 1) {
                const idx = j * 3;
                const x = positions[idx];
                const wave = Math.sin(x * 0.6 + t * 2.2 + z) * 1.2 + Math.cos(x * 1.05 - t * 1.3 + z * 0.95) * 0.6;
                positions[idx + 1] = wave;
            }
            line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);

        const theme = document.documentElement.getAttribute('data-theme');
        if (theme !== lastTheme) {
            lastTheme = theme;
            updateColors();
        }

        requestAnimationFrame(animate);
    }

    resize();
    updateColors();
    window.addEventListener('resize', resize, { passive: true });
    animate();
})();
