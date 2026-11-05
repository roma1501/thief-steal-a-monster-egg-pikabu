// GameMonsters.js — монстры игры (оригинальные персонажи, нарисованный арт — assets/monsters/*.webp).
// В мире монстр — 2D-спрайт на вертикальной плоскости, всегда повёрнутой к камере (MonsterViews.sync перед
// кадром), с мягкой тенью на земле; копии одного вида и мутации — инстансы. Яйца монстров — 3D: яйцо цветов
// монстра с его глазами (один, два или три) и приметами (гребень, кристаллы, листья…): части с цветами вершин +
// лицо-текстура в одном меше (MultiMaterial), копии — инстансы. Высота яйца = 1, низ на 0, лицом в +X.
// Стражи — те же спрайты крупно, анимация кодом (MonsterRig: прыжки, приплющивание, наклон, рывок-удар).

/**
 * @typedef {{ cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, s: number }} MonFrame
 * @typedef {{ eyes?: number, iris?: string, iris2?: string, star?: boolean, mouth?: string, cheeks?: string, small?: number }} MonFace
 */

/** @satisfies {Record<string, any>} */
const Monsters = {
    // Яйца монстров: color — скорлупа, accent — пояс/пятна, pattern — 'band' | 'spots' | 'stripes', face — глаза и рот,
    // acc(K) — приметы монстра в осях яйца (радиус = 1, +X — вперёд, +Y — вверх, ±Z — бока).
    /** @type {Record<string, any>} */
    EGGS: {
        moxlo: { color: '#28d9bf', accent: '#fff1d6', pattern: 'band', face: { eyes: 1, iris: '#ffb02e', mouth: 'grin' }, acc(K) {
            K.cone('#ff8c69', [0.2, 0.86, 0.16], null, 0.5, 0.2, 0, { flat: 0.32, rot: [0.25, 0, -0.35] });
            K.cone('#ff8c69', [-0.02, 0.94, 0.14], null, 0.58, 0.22, 0, { flat: 0.32, rot: [0.2, 0, 0.05] });
            K.cone('#ff8c69', [-0.26, 0.86, 0.12], null, 0.46, 0.19, 0, { flat: 0.32, rot: [0.15, 0, 0.5] });
        } },
        grumplet: { color: '#687fa9', accent: '#bacfee', pattern: 'spots', face: { eyes: 2, iris: '#ffb02e', iris2: '#4fb6ff', mouth: 'smirk' }, acc(K) {
            K.cone('#bacfee', [-0.45, 0.82, 0], [-0.5, 1, 0], 0.5, 0.2, 0, { seg: 4 });
            K.cone('#d6e4fa', [-0.75, 0.45, 0], [-1, 0.6, 0], 0.46, 0.18, 0, { seg: 4 });
            K.cone('#bacfee', [-0.88, 0.02, 0], [-1, 0.15, 0], 0.4, 0.16, 0, { seg: 4 });
        } },
        pudloo: { color: '#ff779c', accent: '#ffc8a7', pattern: 'spots', face: { eyes: 3, iris: '#5a3418', mouth: 'wavy' }, acc(K) {
            for (const z of [-0.55, 0, 0.55]) K.ball('#ffc8a7', [-0.2, -0.82, z], 0.2, { sy: 0.7 });
        } },
        zazzit: { color: '#b1e830', accent: '#d8ff7a', pattern: 'stripes', face: { eyes: 2, iris: '#7e4bda', mouth: 'zigzag', cheeks: '#7e4bda' }, acc(K) {
            const c = '#b1e830';
            K.cone(c, [0, 0.9, 0], [0, 1, 0], 0.5, 0.28);
            for (const z of [1, -1]) { K.cone(c, [0, 0.42, z * 0.88], [0, 0.35, z], 0.42, 0.26); K.cone(c, [0, -0.42, z * 0.85], [0, -0.3, z], 0.38, 0.24); }
        } },
        tumblo: { color: '#bd704c', accent: '#ffd2a1', pattern: 'band', face: { eyes: 2, iris: '#4a2412', mouth: 'fang' }, acc(K) {
            K.ring('#a35a38', [-0.62, 0.85, 0], 0.34, 0.13, [Math.PI / 2, 0, 0]);
            K.ball('#a35a38', [-0.62, 0.85, 0], 0.16);
            K.ring('#c97a52', [-0.66, 1.05, 0], 0.16, 0.08, [Math.PI / 2, 0, 0]);
        } },
        dunzo: { color: '#e8bd78', accent: '#fff0d0', pattern: 'band', face: { eyes: 2, iris: '#5a3418', mouth: 'grin' }, acc(K) {
            for (const z of [1, -1]) {
                K.cone('#f58a52', [0.05, 0.4, z * 0.86], null, 0.42, 0.3, 0, { flat: 0.22, rot: [-z * 1.15, 0, 0.25] });
                K.cone('#f58a52', [0.05, 0.25, z * 0.9], null, 0.36, 0.24, 0, { flat: 0.22, rot: [-z * 1.5, 0, 0.1] });
            }
        } },
        glintok: { color: '#ffc342', accent: '#ffe08a', pattern: 'spots', face: { eyes: 2, iris: '#2a1a10', mouth: 'smile' }, acc(K) {
            K.cone('#ff793f', [-0.4, 0.82, 0], [-0.45, 1, 0], 0.55, 0.17, 0, { seg: 6 });
            K.cone('#ff9a5a', [-0.72, 0.48, 0.12], [-1, 0.7, 0.15], 0.46, 0.15, 0, { seg: 6 });
            K.cone('#ff793f', [-0.85, 0.05, -0.1], [-1, 0.3, -0.12], 0.4, 0.14, 0, { seg: 6 });
            for (const z of [1, -1]) K.cone('#ffc342', [0, 0.7, z * 0.6], [0, 0.6, z], 0.3, 0.12, 0, { seg: 4 });
        } },
        whisplo: { color: '#e9e6ff', accent: '#ad91f1', pattern: 'stripes', face: { eyes: 1, iris: '#7a3dd8', mouth: 'o' }, acc(K) {
            K.cone('#e9e6ff', [-0.05, 0.86, 0], [-0.7, 1, 0], 0.62, 0.26);
            K.ball('#ad91f1', [-0.52, 1.1, 0], 0.1);
            for (const z of [1, -1]) K.ball('#e9e6ff', [0.1, -0.05, z * 0.95], 0.2, { sz: 0.5, sy: 0.8 });
        } },
        bubbloo: { color: '#57c8ed', accent: '#c0f3ff', pattern: 'band', face: { eyes: 2, iris: '#1a4a8a', mouth: 'fang' }, acc(K) {
            K.cone('#57c8ed', [0.05, 0.88, 0], [-0.45, 1, 0], 0.5, 0.24);
            K.ball('#c0f3ff', [-0.18, 1.25, 0], 0.08);
            for (const z of [1, -1]) K.cone('#8fdcf5', [0, 0.1, z * 0.92], null, 0.36, 0.24, 0, { flat: 0.2, rot: [-z * 1.35, 0, 0] });
        } },
        clankit: { color: '#9bb5c8', accent: '#ffb546', pattern: 'stripes', face: { eyes: 2, iris: '#ff9a1f', mouth: 'smile' }, acc(K) {
            K.ball('#7f9ab0', [-0.5, 0.62, 0], 0.62, { sx: 0.45 });
            K.ball('#8aa6bc', [-0.62, 0.15, 0], 0.62, { sx: 0.45 });
            K.ball('#7f9ab0', [-0.55, -0.32, 0], 0.55, { sx: 0.45 });
            for (const z of [1, -1]) K.ball('#ffb546', [0.15, -0.85, z * 0.5], 0.12);
        } },
        plumox: { color: '#a260df', accent: '#e6b2ff', pattern: 'band', face: { eyes: 2, iris: '#3a1a5a', mouth: 'grin' }, acc(K) {
            for (const z of [1, -1]) {
                K.cone('#e6b2ff', [-0.1, 0.0, z * 0.9], null, 0.62, 0.38, 0, { flat: 0.24, rot: [-z * 1.45, 0, 0.3] });
                K.cone('#fff6e8', [0.82, -0.18, z * 0.32], [0.25, -0.15, z], 0.24, 0.07);
            }
        } },
        zippop: { color: '#ffe15a', accent: '#fff3a8', pattern: 'stripes', face: { eyes: 2, iris: '#2a6fe0', mouth: 'buck' }, acc(K) {
            K.box('#ff8f42', [-0.82, 0.62, 0], [0.42, 0.13, 0.08], [0, 0, 0.9]);
            K.box('#ff8f42', [-0.9, 0.3, 0], [0.42, 0.13, 0.08], [0, 0, -0.5]);
            K.box('#ff8f42', [-0.7, 0.92, 0], [0.3, 0.11, 0.08], [0, 0, -0.5]);
        } },
        noctilo: { color: '#344b92', accent: '#9cb3ff', pattern: 'band', face: { eyes: 3, iris: '#b8a8ff', mouth: 'smile' }, acc(K) {
            for (const z of [1, -1]) K.cone('#2a3c78', [-0.05, 0.2, z * 0.92], null, 0.7, 0.42, 0, { flat: 0.2, rot: [-z * 1.3, 0, 0.2] });
            K.cone('#2a3c78', [-0.9, -0.2, 0], [-1, -0.5, 0], 0.5, 0.12);
        } },
        mossumi: { color: '#65ba61', accent: '#d8ee8a', pattern: 'band', face: { eyes: 2, iris: '#e8a020', mouth: 'grin' }, acc(K) {
            K.ball('#a8e05a', [0, 1.18, 0], 0.22, { sx: 0.35, sy: 1.6 });
            K.ball('#8fd04a', [0, 1.08, 0.3], 0.2, { sx: 0.35, sy: 1.5, rot: [-0.7, 0, 0] });
            K.ball('#8fd04a', [0, 1.08, -0.3], 0.2, { sx: 0.35, sy: 1.5, rot: [0.7, 0, 0] });
        } },
        barkumo: { color: '#a56a42', accent: '#f0d8b0', pattern: 'stripes', face: { eyes: 2, iris: '#3fe0b0', mouth: 'smile' }, acc(K) {
            for (const [x, y, z, r] of [[-0.55, 0.78, 0.18, 0.3], [-0.78, 0.35, -0.12, 0.26], [-0.32, 0.98, -0.18, 0.24]]) {
                K.cyl('#f0e0c0', [x, y - 0.12, z], [-0.5, 1, 0], 0.18, r * 0.3);
                K.ball('#a8d96d', [x - 0.06, y + 0.06, z], r, { sy: 0.55 });
            }
        } },
        emberoo: { color: '#f36b43', accent: '#ffd566', pattern: 'band', face: { eyes: 2, iris: '#3a1408', mouth: 'fangs' }, acc(K) {
            K.cone('#ffd566', [0, 0.86, 0], [0.1, 1, 0], 0.72, 0.32);
            K.cone('#ff9a3a', [0.06, 0.84, 0], [0.1, 1, 0], 0.48, 0.22);
            for (const z of [1, -1]) K.cone('#ffd566', [-0.1, 0.72, z * 0.42], [0, 1, z * 0.6], 0.36, 0.15);
        } },
        orbitto: { color: '#a8dce0', accent: '#e6a4e6', pattern: 'spots', face: { eyes: 1, iris: '#e83aa8', mouth: 'buck' }, acc(K) {
            K.ring('#e6a4e6', [0, 0.02, 0], 1.12, 0.09, [0.32, 0, 0.22]);
        } },
        wobblit: { color: '#f2b3dc', accent: '#91e8d5', pattern: 'band', face: { eyes: 2, iris: '#4a2412', mouth: 'grin', small: 0.82 }, acc(K) {
            for (const z of [1, -1]) K.box('#e89ac8', [0, 0.5, z * 0.98], [0.32, 0.14, 0.55], [z * 0.45, 0, 0]);
        } },
        auralume: { color: '#f8cd58', accent: '#f6a9dd', pattern: 'stripes', face: { eyes: 3, iris: '#ff4fa8', star: true, mouth: 'smile' }, acc(K) {
            for (const z of [1, -1]) {
                K.ball('#f6a9dd', [0, 0.35, z * 0.95], 0.24, { sx: 0.25, sy: 1.5, sz: 0.7, rot: [-z * 0.9, 0, 0] });
                K.ball('#ffc8e8', [0, -0.12, z * 0.92], 0.2, { sx: 0.25, sy: 1.3, sz: 0.6, rot: [-z * 1.7, 0, 0] });
            }
            K.ball('#fff3a8', [0, 1.02, 0], 0.12);
        } },
        umbryx: { color: '#453d6c', accent: '#64dfc7', pattern: 'spots', face: { eyes: 1, iris: '#64dfc7', mouth: 'grin' }, acc(K) {
            const pts = [];
            for (let i = 0; i <= 14; i++) { const a = 0.12 * Math.PI + i / 14 * 0.86 * Math.PI; pts.push([-0.18, Math.cos(a) * 1.08, 0.2 + Math.sin(a) * 1.02]); }
            K.tube('#2c2650', pts, 0.2);
            for (const z of [1, -1]) K.cone('#2c2650', [-0.1, -0.2, z * 0.9], null, 0.4, 0.26, 0, { flat: 0.2, rot: [-z * 1.6, 0, 0] });
        } },
        // Золотое яйцо события: большое око, золотой гребень и корона.
        golden: { color: '#ffc81e', accent: '#fff0a0', pattern: 'band', face: { eyes: 1, iris: '#ff8a1f', mouth: 'grin' }, acc(K) {
            K.cone('#ffd84a', [0.16, 0.86, 0.18], null, 0.42, 0.18, 0, { flat: 0.32, rot: [0.25, 0, -0.35] });
            K.cone('#ffd84a', [-0.24, 0.86, 0.14], null, 0.4, 0.17, 0, { flat: 0.32, rot: [0.15, 0, 0.5] });
            K.cyl('#ffd84a', [0, 0.88, -0.05], [0, 1, 0], 0.22, 0.42);
            for (let k = 0; k < 5; k++) {
                const a = k / 5 * Math.PI * 2;
                K.cone('#ffe680', [Math.cos(a) * 0.38, 1.08, -0.05 + Math.sin(a) * 0.38], [Math.cos(a) * 0.15, 1, Math.sin(a) * 0.15], 0.3, 0.11);
                K.ball('#ff4a6a', [Math.cos(a) * 0.43, 0.98, -0.05 + Math.sin(a) * 0.43], 0.06);
            }
        } },
    },

    /** @type {Map<string, BABYLON.StandardMaterial>} */
    _faceMats: new Map(),
    /** @type {Map<string, BABYLON.StandardMaterial>} */
    _bodyMats: new Map(),

    _c4(hex, k) { const c = BABYLON.Color3.FromHexString(hex); const m = k == null ? 1 : k; return [Math.min(1, c.r * m), Math.min(1, c.g * m), Math.min(1, c.b * m), 1]; },
    _mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 1]; },

    // Цвета вершин: постоянный или функцией (x, y, z) -> [r, g, b, a].
    _paint(mesh, c) {
        const n = mesh.getTotalVertices(), col = new Float32Array(n * 4);
        const pos = typeof c === 'function' ? mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind) : null;
        for (let i = 0; i < n; i++) {
            const v = pos ? c(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]) : c;
            col[i * 4] = v[0]; col[i * 4 + 1] = v[1]; col[i * 4 + 2] = v[2]; col[i * 4 + 3] = 1;
        }
        mesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, col);
        if (!mesh.getVerticesData(BABYLON.VertexBuffer.UVKind)) mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, new Float32Array(n * 2));
        return mesh;
    },

    // Материал скорлупы: белый, цвета — вершинами; свой блик (группа '' — константы движка его не перетирают).
    bodyMat(scene) {
        const key = String(scene.uid);
        let m = this._bodyMats.get(key);
        if (m && !m.isDisposed) return m;
        m = new BABYLON.StandardMaterial('mon-egg-body', scene);
        m.diffuseColor = new BABYLON.Color3(1, 1, 1);
        m.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
        m.specularPower = 36;
        m.emissiveColor = new BABYLON.Color3(0.06, 0.06, 0.07);
        m.metadata = { toonGroup: '' };
        this._bodyMats.set(key, m);
        return m;
    },

    // --- Лицо яйца: рисунок на canvas 512×384 ---
    faceMat(scene, id) {
        const key = scene.uid + '|' + id;
        let m = this._faceMats.get(key);
        if (m && !m.isDisposed) return m;
        const def = this.EGGS[id] || this.EGGS.moxlo;
        const W = 512, H = 384;
        const tex = new BABYLON.DynamicTexture('mon-face-' + id, { width: W, height: H }, scene, true);
        tex.hasAlpha = true;
        tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE; tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        const c = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        c.clearRect(0, 0, W, H);
        this.drawFace(c, W, H, def.face || {});
        tex.update(true);
        m = new BABYLON.StandardMaterial('mon-facem-' + id, scene);
        m.diffuseTexture = tex;
        m.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        m.specularPower = 40;
        m.emissiveColor = new BABYLON.Color3(0.08, 0.08, 0.08);
        m.backFaceCulling = false;
        m.metadata = { toonGroup: '' };
        this._faceMats.set(key, m);
        return m;
    },

    /** @param {CanvasRenderingContext2D} c @param {MonFace} f */
    drawFace(c, W, H, f) {
        const ink = '#1a1024';
        const n = f.eyes || 2;
        c.lineJoin = 'round'; c.lineCap = 'round';
        // Глаза монстра: белок с обводкой, цветная радужка, крупный зрачок (у Ауралюма — звезда), блики.
        const eye = (x, y, rx, ry, iris) => {
            c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill();
            c.strokeStyle = ink; c.lineWidth = 9; c.stroke();
            const ir = Math.min(rx, ry) * 0.74, iy = y + ry * 0.08;
            c.fillStyle = iris; c.beginPath(); c.arc(x, iy, ir, 0, Math.PI * 2); c.fill();
            c.fillStyle = 'rgba(255,255,255,0.22)'; c.beginPath(); c.arc(x, iy + ir * 0.3, ir * 0.7, 0, Math.PI); c.fill();
            c.fillStyle = ink;
            if (f.star) {
                c.beginPath();
                for (let i = 0; i < 10; i++) { const r = i % 2 ? ir * 0.22 : ir * 0.55, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, iy + Math.sin(a) * r); }
                c.closePath(); c.fill();
            } else { c.beginPath(); c.arc(x, iy, ir * 0.48, 0, Math.PI * 2); c.fill(); }
            c.fillStyle = '#ffffff';
            c.beginPath(); c.arc(x - ir * 0.32, iy - ir * 0.36, ir * 0.24, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.arc(x + ir * 0.3, iy + ir * 0.22, ir * 0.1, 0, Math.PI * 2); c.fill();
        };
        if (n === 1) eye(W / 2, H * 0.4, W * 0.2, H * 0.3, f.iris || '#ffb02e');
        else if (n === 3) {
            eye(W / 2 - W * 0.19, H * 0.47, W * 0.085, H * 0.14, f.iris || '#5a3418');
            eye(W / 2, H * 0.33, W * 0.09, H * 0.15, f.iris || '#5a3418');
            eye(W / 2 + W * 0.19, H * 0.47, W * 0.085, H * 0.14, f.iris || '#5a3418');
        } else {
            const k = f.small || 1;
            eye(W / 2 - W * 0.15, H * 0.42, W * 0.12, H * 0.21, f.iris || '#5a3418');
            eye(W / 2 + W * 0.15, H * 0.42 + (k < 1 ? H * 0.03 : 0), W * 0.12 * k, H * 0.21 * k, f.iris2 || f.iris || '#5a3418');
        }
        if (f.cheeks) { c.fillStyle = f.cheeks; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(W / 2 + s * (W * 0.3 + i * 10), H * 0.66 + (i % 2) * 8, 5, 0, Math.PI * 2); c.fill(); } }
        const my = H * 0.8, m = f.mouth || 'smile';
        if (m === 'grin' || m === 'fang' || m === 'fangs' || m === 'buck') {
            // Открытая улыбка полумесяцем: тёмный рот, язык, зубки.
            const w = W * (m === 'grin' ? 0.16 : 0.12), y0 = my - H * 0.07;
            c.fillStyle = '#3a1020'; c.beginPath(); c.moveTo(W / 2 - w, y0); c.quadraticCurveTo(W / 2, y0 + H * 0.3, W / 2 + w, y0); c.closePath(); c.fill();
            c.strokeStyle = ink; c.lineWidth = 7; c.stroke();
            c.fillStyle = '#ff6a8a'; c.beginPath(); c.ellipse(W / 2, y0 + H * 0.1, w * 0.45, H * 0.035, 0, 0, Math.PI * 2); c.fill();
            c.fillStyle = '#fff8ec';
            if (m === 'grin') { c.fillRect(W / 2 - w * 0.42, y0 + 1, w * 0.26, H * 0.045); c.fillRect(W / 2 + w * 0.16, y0 + 1, w * 0.26, H * 0.045); }
            else if (m === 'buck') c.fillRect(W / 2 - w * 0.16, y0 + 1, w * 0.32, H * 0.06);
            else {
                const fang = (x) => { c.beginPath(); c.moveTo(x - 9, y0 + 1); c.lineTo(x + 9, y0 + 1); c.lineTo(x, y0 + H * 0.07); c.closePath(); c.fill(); };
                if (m === 'fang') fang(W / 2 + w * 0.35); else { fang(W / 2 - w * 0.42); fang(W / 2 + w * 0.42); }
            }
        } else if (m === 'zigzag') {
            c.strokeStyle = '#7e4bda'; c.lineWidth = 9; c.beginPath();
            for (let i = 0; i <= 6; i++) c.lineTo(W / 2 - 54 + i * 18, my + (i % 2 ? 10 : -6));
            c.stroke();
        } else if (m === 'wavy') {
            c.strokeStyle = ink; c.lineWidth = 8; c.beginPath(); c.moveTo(W / 2 - 34, my); c.quadraticCurveTo(W / 2 - 17, my + 14, W / 2, my); c.quadraticCurveTo(W / 2 + 17, my + 14, W / 2 + 34, my); c.stroke();
        } else if (m === 'o') {
            c.fillStyle = '#3a1020'; c.beginPath(); c.ellipse(W / 2, my, 16, 20, 0, 0, Math.PI * 2); c.fill();
        } else if (m === 'smirk') {
            c.strokeStyle = ink; c.lineWidth = 9; c.beginPath(); c.moveTo(W / 2 - 30, my + 4); c.quadraticCurveTo(W / 2 + 10, my + 16, W / 2 + 34, my - 6); c.stroke();
        } else {
            c.strokeStyle = ink; c.lineWidth = 9; c.beginPath(); c.moveTo(W / 2 - 34, my); c.quadraticCurveTo(W / 2, my + 26, W / 2 + 34, my); c.stroke();
        }
    },

    // --- Яйцо монстра: скорлупа с поясом/пятнами/полосами, лицо, приметы. Высота 1, низ на 0, лицом в +X. ---
    buildEgg(scene, id) {
        const def = this.EGGS[id] || this.EGGS.moxlo;
        const parts = [];
        const prof = (y) => y <= 0 || y >= 1 ? 0 : (y < 0.42 ? 0.37 * Math.sqrt(1 - Math.pow((y - 0.42) / 0.42, 2)) : 0.37 * Math.sqrt(1 - Math.pow((y - 0.42) / 0.58, 2)));
        const pts = [];
        for (let i = 0; i <= 28; i++) { const y = (1 - Math.cos(i / 28 * Math.PI)) / 2; pts.push(new BABYLON.Vector3(Math.max(0.0001, prof(y)), y, 0)); }
        const shell = BABYLON.MeshBuilder.CreateLathe('mon-egg', { shape: pts, tessellation: 32, closed: true }, scene);
        const base = this._c4(def.color), acc = this._c4(def.accent || '#ffffff');
        this._paint(shell, (x, y, z) => {
            const a = Math.atan2(z, x);
            let t = 0;
            if (def.pattern === 'band') t = Math.max(0, Math.min(1, (0.06 - Math.abs(y - 0.2 - Math.sin(a * 3) * 0.025)) * 30));
            else if (def.pattern === 'spots') t = Math.max(0, Math.min(1, (Math.sin(a * 5 + y * 3) * Math.sin(y * 17 + a) - 0.62) * 6));
            else t = Math.max(0, Math.min(1, (Math.sin(y * Math.PI * 5.2 + Math.sin(a * 3) * 0.9 + 0.4) - 0.45) * 3)) * 0.8;
            const shade = 0.84 + 0.16 * Math.min(1, y * 2.2);
            const col = this._mix(base, acc, t);
            return [col[0] * shade, col[1] * shade, col[2] * shade, 1];
        });
        parts.push(shell);
        /** @type {MonFrame} */
        const F = { cx: 0, cy: 0.5, cz: 0, rx: 0.36, ry: 0.46, rz: 0.36, s: 0.36 };
        if (def.acc) def.acc(this._kit(scene, F, parts));
        const merged = BABYLON.Mesh.MergeMeshes(parts, true, true, undefined, false, false);
        merged.material = this.bodyMat(scene);
        const face = this._facePatch(scene, prof, 0.3, 0.74, 0.92);
        face.material = this.faceMat(scene, id);
        const mesh = BABYLON.Mesh.MergeMeshes([merged, face], true, true, undefined, true, true);
        mesh.name = 'monster-egg-' + id;
        mesh.isPickable = false;
        return mesh;
    },

    // Участок поверхности вращения r(y): u — по углу (слева направо для смотрящего с +X), v — снизу вверх.
    _facePatch(scene, rAt, y0, y1, phi) {
        const nx = 26, ny = 18, push = 1.012;
        const pos = [], nrm = [], uv = [], col = [], idx = [];
        for (let j = 0; j <= ny; j++) {
            const v = j / ny, y = y0 + (y1 - y0) * v;
            const r = rAt(y) * push, dr = (rAt(y + 0.002) - rAt(y - 0.002)) / 0.004;
            const nl = Math.hypot(1, dr);
            for (let i = 0; i <= nx; i++) {
                const u = i / nx, a = -phi + 2 * phi * u, ca = Math.cos(a), sa = Math.sin(a);
                pos.push(r * ca, y, -r * sa);
                nrm.push(ca / nl, -dr / nl, -sa / nl);
                uv.push(u, v);
                col.push(1, 1, 1, 1);
            }
        }
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
            const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
            idx.push(a, b, c, b, d, c);
        }
        const m = new BABYLON.Mesh('mon-face', scene);
        const vd = new BABYLON.VertexData();
        vd.positions = pos; vd.normals = nrm; vd.uvs = uv; vd.colors = col; vd.indices = idx;
        vd.applyToMesh(m);
        return m;
    },

    // Набор примитивов в осях яйца: точка p -> модель через рамку F, размеры — в радиусах (× F.s).
    _kit(scene, F, parts) {
        const S = this;
        const at = (p) => new BABYLON.Vector3(F.cx + p[0] * F.rx, F.cy + p[1] * F.ry, F.cz + p[2] * F.rz);
        const up = new BABYLON.Vector3(0, 1, 0);
        const orient = (mesh, dir, rot) => {
            if (dir) {
                const d = new BABYLON.Vector3(dir[0], dir[1], dir[2]).normalize();
                const q = new BABYLON.Quaternion();
                if (BABYLON.Vector3.Dot(d, up) < -0.9999) BABYLON.Quaternion.RotationAxisToRef(new BABYLON.Vector3(1, 0, 0), Math.PI, q);
                else BABYLON.Quaternion.FromUnitVectorsToRef(up, d, q);
                mesh.rotationQuaternion = q;
            } else if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
        };
        const fin = (mesh, hex, p) => {
            const v = at(p);
            mesh.position.set(v.x, v.y, v.z);
            mesh.bakeCurrentTransformIntoVertices();
            parts.push(S._paint(mesh, S._c4(hex)));
            return mesh;
        };
        return {
            ball(hex, p, r, o) {
                const opt = o || {};
                const m = BABYLON.MeshBuilder.CreateSphere('mon-b', { diameter: r * 2 * F.s, segments: opt.seg || 12 }, scene);
                m.scaling.set(opt.sx || 1, opt.sy || 1, opt.sz || 1);
                if (opt.rot) m.rotation.set(opt.rot[0], opt.rot[1], opt.rot[2]);
                return fin(m, hex, p);
            },
            // Конус/усечённый конус от точки p вдоль dir (или с поворотом rot); flat — сплющить по оси X (плавники, гребни).
            cone(hex, p, dir, len, r, rTop, o) {
                const opt = o || {};
                const h = len * F.s;
                const m = BABYLON.MeshBuilder.CreateCylinder('mon-c', { height: h, diameterBottom: r * 2 * F.s, diameterTop: (rTop || 0) * 2 * F.s, tessellation: opt.seg || 14 }, scene);
                m.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, h / 2, 0));
                if (opt.flat) m.scaling.x = opt.flat;
                orient(m, dir, opt.rot);
                return fin(m, hex, p);
            },
            cyl(hex, p, dir, len, r) { return this.cone(hex, p, dir, len, r, r); },
            box(hex, p, s, rot) {
                const m = BABYLON.MeshBuilder.CreateBox('mon-x', { width: s[0] * F.s, height: s[1] * F.s, depth: s[2] * F.s }, scene);
                if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
                return fin(m, hex, p);
            },
            ring(hex, p, r, tube, rot) {
                const m = BABYLON.MeshBuilder.CreateTorus('mon-r', { diameter: r * 2 * F.s, thickness: tube * 2 * F.s, tessellation: 28 }, scene);
                if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
                return fin(m, hex, p);
            },
            tube(hex, pts, r) {
                const m = BABYLON.MeshBuilder.CreateTube('mon-t', { path: pts.map(at), radius: r * F.s, tessellation: 10, cap: BABYLON.Mesh.CAP_ALL }, scene);
                parts.push(S._paint(m, S._c4(hex)));
                return m;
            },
        };
    },
};

// Монстры-спрайты: вертикальная плоскость с артом (обрезка по рамке рисунка, ноги на земле), всегда лицом к камере,
// мягкая тень на земле. Вид = TransformNode (позиция, курс, масштаб, крен — как у меша), внутри — инстанс плоскости
// вида и мутации. Курс вида игра пишет как обычно; перед кадром sync поворачивает его к камере.
/** @satisfies {Record<string, any>} */
const MonsterViews = {
    /** @type {Set<any>} */
    all: new Set(),
    /** @type {Map<string, BABYLON.Mesh>} */
    _tpl: new Map(),
    /** @type {Map<string, BABYLON.Texture>} */
    _tex: new Map(),
    /** @type {BABYLON.StandardMaterial[]} */
    _rainbow: [],
    /** @type {BABYLON.Mesh | null} */
    _shadowTpl: null,
    /** @type {((x: number, z: number) => number) | null} */
    ground: null,
    _scene: null,
    ART_PX: 300,   // столько px рисунка = size px мира (монстры сохраняют относительный размер, как нарисованы)

    init(scene, ground) {
        this.ground = ground || null;
        if (this._scene === scene) return;
        this._scene = scene;
        this._tpl = new Map(); this._tex = new Map(); this._rainbow = []; this._shadowTpl = null;
        this.all = new Set();
        scene.onBeforeRenderObservable.add(() => this.sync(scene));
    },

    // Шаблон плоскости вида + мутации (источник инстансов, сам не рисуется). Плоскость 1 px рисунка = 1 ед.
    template(scene, sp, mut) {
        const key = sp + '|' + (mut || 'normal');
        let t = this._tpl.get(key);
        if (t && !t.isDisposed()) return t;
        const d = GameData.PETS[sp] || GameData.PETS.moxlo;
        const [l, tp, r, b] = d.box || [0, 0, 384, 384];
        const w = r - l, h = b - tp;
        t = BABYLON.MeshBuilder.CreatePlane('mon-' + key, { width: w, height: h, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        t.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, h / 2, 0));
        // Нормали вверх: рисунок освещён как земля под ним (одинаково с любой стороны камеры), без тёмной «изнанки».
        const nrm = t.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        for (let i = 0; i < nrm.length; i += 3) { nrm[i] = 0; nrm[i + 1] = 1; nrm[i + 2] = 0; }
        t.setVerticesData(BABYLON.VertexBuffer.NormalKind, nrm);
        let tex = this._tex.get(sp);
        if (!tex) {
            tex = new BABYLON.Texture(d.img, scene, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
            tex.hasAlpha = true;
            tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE; tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
            this._tex.set(sp, tex);
        }
        // Своя копия текстуры на вид: смещение и масштаб UV под рамку рисунка (в сцене правой руки — зеркально по U).
        const own = tex.clone();
        own.uOffset = r / 384; own.uScale = -w / 384;
        own.vOffset = 1 - b / 384; own.vScale = h / 384;
        const m = new BABYLON.StandardMaterial('mon-mat-' + key, scene);
        m.diffuseTexture = own;
        m.backFaceCulling = false;
        m.specularColor = new BABYLON.Color3(0, 0, 0);
        m.emissiveColor = new BABYLON.Color3(0.12, 0.12, 0.12);
        m.metadata = { toonGroup: '', toon: false };
        const mu = mut && mut !== 'normal' ? GameData.mutation(mut) : null;
        if (mu && Array.isArray(mu.tint)) { m.diffuseColor = new BABYLON.Color3(mu.tint[0], mu.tint[1], mu.tint[2]); m.emissiveColor = new BABYLON.Color3(mu.tint[0] * 0.12, mu.tint[1] * 0.12, mu.tint[2] * 0.12); }
        else if (mu) this._rainbow.push(m);
        t.material = m;
        World3D.addObject(Models.view, t, 'actor', { castShadow: false, receiveShadows: false, ink: false, outline: false });
        t.isVisible = false; t.isPickable = false;
        this._tpl.set(key, t);
        return t;
    },

    _shadow(scene) {
        if (this._shadowTpl && !this._shadowTpl.isDisposed()) return this._shadowTpl;
        const tex = new BABYLON.DynamicTexture('mon-shadow-tex', { width: 64, height: 64 }, scene, true);
        const c = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        const g = c.createRadialGradient(32, 32, 2, 32, 32, 32);
        g.addColorStop(0, 'rgba(0,0,0,0.45)'); g.addColorStop(0.6, 'rgba(0,0,0,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = g; c.fillRect(0, 0, 64, 64); tex.update(true); tex.hasAlpha = true;
        const d = BABYLON.MeshBuilder.CreateGround('mon-shadow', { width: 1, height: 1 }, scene);
        const m = new BABYLON.StandardMaterial('mon-shadow-m', scene);
        m.diffuseTexture = tex; m.useAlphaFromDiffuseTexture = true; m.disableLighting = true; m.specularColor = new BABYLON.Color3(0, 0, 0);
        m.emissiveColor = new BABYLON.Color3(0, 0, 0); m.metadata = { toon: false };
        d.material = m; d.isVisible = false; d.isPickable = false;
        this._shadowTpl = d;
        return d;
    },

    // Вид монстра высотой ~size px (по ART_PX): { root, height, width }.
    create(scene, sp, mut, size) {
        const d = GameData.PETS[sp] || GameData.PETS.moxlo;
        const [l, tp, r, b] = d.box || [0, 0, 384, 384];
        const k = size / this.ART_PX;
        const root = new BABYLON.TransformNode('monster-' + sp, scene);
        const inst = this.template(scene, sp, mut).createInstance('mon-i-' + sp);
        inst.parent = root; inst.scaling.set(k, k, k); inst.isPickable = false;
        const sh = this._shadow(scene).createInstance('mon-sh-' + sp);
        sh.isPickable = false;
        const v = { root, inst, sh, foot: (r - l) * k * 0.8, yaw: NaN };
        this.all.add(v);
        root.onDisposeObservable.add(() => { sh.dispose(); this.all.delete(v); });
        return { root, height: (b - tp) * k, width: (r - l) * k };
    },

    // Перед кадром: каждый вид лицом к камере (курс игры не важен — рисунок фронтальный), тень — на землю под видом.
    sync(scene) {
        const cam = scene.activeCamera;
        if (!cam) return;
        const cp = cam.globalPosition;
        if (this._rainbow.length) { const c = BABYLON.Color3.FromHSV((performance.now() / 1000 * 90) % 360, 0.55, 1); for (const m of this._rainbow) m.diffuseColor = c; }
        for (const v of this.all) {
            const r = v.root;
            const p = r.position;
            r.rotation.y = -Math.atan2(cp.z - p.z, cp.x - p.x) - Math.PI / 2;
            const g = this.ground ? this.ground(p.x, p.z) : 0;
            const low = p.y - g < 160 && r.isEnabled();
            v.sh.setEnabled(low);
            if (low) { v.sh.position.set(p.x, g + 1.5, p.z); const s = v.foot * Math.abs(r.scaling.x); v.sh.scaling.set(s, 1, s * 0.6); }
        }
    },
};

// Страж — гигантский монстр (3D-модель или спрайт) с анимацией кодом. Повторяет то, что Guardian берёт у Rig:
// root (позиция, курс), play(имя, { speed, loop, fade, events, onEnd }), has(имя). body — узел внутри root,
// который подпрыгивает, сжимается и кренится (его масштаб в покое — базовый).
class MonsterRig {
    /** @param {BABYLON.TransformNode} root @param {BABYLON.TransformNode} body @param {number} size */
    constructor(root, body, size) {
        this.root = root;
        this.inst = body;
        this.k = body.scaling.x;
        this.size = size;
        this.clip = 'idle'; this.speed = 1; this.t = 0; this.once = null;
        MonsterRig.all.add(this);
        this.root.onDisposeObservable.add(() => MonsterRig.all.delete(this));
    }
    has(name) { return name === 'idle' || name === 'walk' || name === 'run' || name === 'attack'; }
    play(name, opts) {
        const o = opts || {};
        if (o.loop === false) { this.once = { name, t: 0, dur: 0.62, events: (o.events || []).map(e => Object.assign({ done: false }, e)), onEnd: o.onEnd || null }; return; }
        if (this.clip !== name) this.t = 0;
        this.clip = name; this.speed = o.speed || 1;
    }
    update(dt) {
        const b = this.inst;
        if (!b || b.isDisposed()) return;
        this.t += dt * this.speed;
        let hop = 0, sq = 1, lean = 0;
        if (this.once) {
            const a = this.once; a.t += dt;
            const f = Math.min(1, a.t / a.dur);
            // замах назад -> прыжок-рывок вперёд с приплющиванием -> возврат
            lean = f < 0.4 ? 0.18 * (f / 0.4) : f < 0.6 ? 0.18 - 0.5 * ((f - 0.4) / 0.2) : -0.32 * (1 - (f - 0.6) / 0.4);
            sq = f < 0.4 ? 1 + 0.12 * (f / 0.4) : f < 0.6 ? 0.8 : 0.8 + 0.2 * ((f - 0.6) / 0.4);
            hop = f < 0.5 ? Math.sin(f / 0.5 * Math.PI) * 0.22 : 0;
            for (const e of a.events) if (!e.done && f >= e.frac) { e.done = true; try { e.fn(); } catch (err) { console.warn(err); } }
            if (f >= 1) { this.once = null; if (a.onEnd) a.onEnd(); }
        } else if (this.clip === 'run') {
            const p = (this.t * 2.4) % 1;
            hop = Math.sin(p * Math.PI) * 0.16;
            sq = p < 0.12 || p > 0.9 ? 0.84 : 1.06;
            lean = Math.sin(this.t * 2.4 * Math.PI) * 0.09;
        } else if (this.clip === 'walk') {
            const p = (this.t * 1.6) % 1;
            hop = Math.sin(p * Math.PI) * 0.06;
            sq = 1 + Math.sin(p * Math.PI * 2) * 0.03;
            lean = Math.sin(this.t * 1.6 * Math.PI) * 0.06;
        } else {
            sq = 1 + Math.sin(this.t * 2.2) * 0.035;
            lean = Math.sin(this.t * 0.9) * 0.04;
        }
        b.position.y = hop * this.size;   // доля высоты стража
        b.scaling.set(this.k / Math.sqrt(sq), this.k * sq, this.k / Math.sqrt(sq));
        b.rotation.z = lean;
    }
    dispose() { if (this.root) this.root.dispose(false, false); }
    static updateAll(dt) { for (const r of MonsterRig.all) r.update(dt); }
}
/** @type {Set<MonsterRig>} */
MonsterRig.all = new Set();
