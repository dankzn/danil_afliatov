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
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 2;

    const lineCount = 80;
    const points = 220;
    const width = 16;
    const height = 9;
    const amplitude = 0.6;

    const baseColor = new THREE.Color('#0b7a42');
    const lines = [];

    function noise(x, y, t) {
        return (
            Math.sin(x * 0.35 + t * 1.2) * 0.5 +
            Math.cos(y * 0.45 - t * 0.9) * 0.35 +
            Math.sin((x + y) * 0.18 + t * 0.6) * 0.25
        );
    }

    for (let i = 0; i < lineCount; i += 1) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(points * 3);
        const baseY = (i / (lineCount - 1) - 0.5) * height;

        for (let j = 0; j < points; j += 1) {
            const x = (j / (points - 1) - 0.5) * width;
            const idx = j * 3;
            positions[idx] = x;
            positions[idx + 1] = baseY;
            positions[idx + 2] = 0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.LineBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.35 + (i / lineCount) * 0.35,
            blending: THREE.AdditiveBlending
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push({ line, positions, baseY, phase: i * 0.2 });
    }

    function resize() {
        const { innerWidth: w, innerHeight: h } = window;
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const aspect = w / h;
        camera.left = -width * 0.5 * aspect;
        camera.right = width * 0.5 * aspect;
        camera.top = height * 0.5;
        camera.bottom = -height * 0.5;
        camera.updateProjectionMatrix();
    }

    function updateColors() {
        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-2')
            .trim();
        const nextColor = new THREE.Color(accent || '#0b7a42');
        lines.forEach(({ line }) => line.material.color.copy(nextColor));
    }

    let lastTheme = document.documentElement.getAttribute('data-theme');

    function animate() {
        const t = performance.now() * 0.0007;

        lines.forEach(({ line, positions, baseY, phase }) => {
            for (let j = 0; j < points; j += 1) {
                const idx = j * 3;
                const x = positions[idx];
                const yOffset = noise(x * 0.55, baseY * 0.75, t + phase) * amplitude;
                positions[idx + 1] = baseY + yOffset;
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
