(() => {
    const canvas = document.getElementById('three-bg');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.2, 9);

    const lineCount = 22;
    const points = 220;
    const width = 14;
    const depth = 7;

    const lines = [];
    const color = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#006400');

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
            opacity: 0.22,
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
        const t = performance.now() * 0.0006;

        lines.forEach(({ line, positions, z }) => {
            for (let j = 0; j < points; j += 1) {
                const idx = j * 3;
                const x = positions[idx];
                const wave = Math.sin(x * 0.8 + t * 2 + z) * 0.6 + Math.cos(x * 1.6 - t * 1.4 + z * 0.7) * 0.25;
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
