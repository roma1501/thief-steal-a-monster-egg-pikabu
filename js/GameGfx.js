// GameGfx.js — Roblox-вид мира: рисунок «стадов» шейдером по мировым координатам, небо с
// облаками, общие материалы, текстуры-надписи и лица нубов. Рисунки процедурные (canvas/GLSL).

// Плагин StandardMaterial: на гранях рисуется сетка «стадов» (квадраты со скруглёнными углами,
// тёмная кромка и светлый блик) — как пластик Roblox. Плоскость рисунка выбирается по нормали.
class StudsPlugin extends BABYLON.MaterialPluginBase {
    constructor(material) {
        super(material, 'Studs', 220, { STUDS: false }, true, true);
        this.size = GameData.STUD;
        this.strength = 0.16;
    }
    getClassName() { return 'StudsPlugin'; }
    prepareDefines(defines) { defines.STUDS = true; }
    getUniforms() {
        return {
            ubo: [{ name: 'studParams', size: 4, type: 'vec4' }],
            fragment: '#ifdef STUDS\nuniform vec4 studParams;\n#endif',
        };
    }
    bindForSubMesh(ubo) {
        ubo.updateFloat4('studParams', this.size, this.strength, Gfx.studsOn ? 1 : 0, 0);
    }
    getCustomCode(shaderType) {
        if (shaderType !== 'fragment') return null;
        return {
            CUSTOM_FRAGMENT_UPDATE_DIFFUSE: `
#ifdef STUDS
#ifdef NORMAL
if (studParams.z > 0.5) {
    vec3 sn = abs(normalize(vNormalW));
    vec2 sp = sn.y > 0.6 ? vPositionW.xz : (sn.x > sn.z ? vPositionW.zy : vPositionW.xy);
    vec2 sf = fract(sp / studParams.x) - 0.5;
    vec2 sq = abs(sf) - vec2(0.22);
    float sd = length(max(sq, 0.0)) + min(max(sq.x, sq.y), 0.0) - 0.08;
    float aa = fwidth(sd) * 1.2 + 0.004;
    float rim = 1.0 - smoothstep(0.022 - aa, 0.022 + aa, abs(sd));
    float hi = 1.0 - smoothstep(0.012 - aa, 0.012 + aa, abs(sd + 0.045));
    float fade = clamp(1.0 - fwidth(sp.x / studParams.x) * 1.6, 0.0, 1.0);
    diffuseColor *= 1.0 - (rim * studParams.y - hi * studParams.y * 0.55) * fade;
}
#endif
#endif
`,
        };
    }
}

/** @satisfies {Record<string, any>} */
const Gfx = {
    studsOn: true,
    /** @type {BABYLON.Scene | null} */
    scene: null,
    _mats: new Map(),
    _studded: new WeakSet(),
    /** @type {BABYLON.Mesh | null} */
    sky: null,

    init(scene) {
        this.scene = scene;
        this._mats = new Map();
        this.makeSky(scene);
    },

    hex(c) { return BABYLON.Color3.FromHexString(c); },

    // Общий матовый материал цвета hex (кэш по цвету, опциям и сцене). opts: { emissive, studs, alpha, unlit, scene }
    mat(hex, opts) {
        const o = opts || {};
        const scene = o.scene || this.scene;
        const key = scene.uid + '|' + hex + '|' + (o.emissive || '') + '|' + (o.studs ? 1 : 0) + '|' + (o.alpha || 1) + '|' + (o.unlit ? 1 : 0) + '|' + (o.spec || 0);
        let m = this._mats.get(key);
        if (m && !m.isDisposed) return m;
        m = new BABYLON.StandardMaterial('gm-' + key, scene);
        m.diffuseColor = this.hex(hex);
        m.specularColor = new BABYLON.Color3(o.spec || 0.08, o.spec || 0.08, o.spec || 0.08);
        m.specularPower = 24;
        if (o.emissive) m.emissiveColor = this.hex(o.emissive);
        if (o.alpha && o.alpha < 1) { m.alpha = o.alpha; m.backFaceCulling = false; }
        if (o.unlit) { m.disableLighting = true; m.emissiveColor = this.hex(hex); }
        if (o.studs) this.studs(m);
        this._mats.set(key, m);
        return m;
    },

    // Добавить материалу рисунок «стадов» (один раз).
    studs(material) {
        if (!material || this._studded.has(material)) return;
        this._studded.add(material);
        const list = material.subMaterials ? material.subMaterials : [material];
        for (const m of list) {
            if (!m || this._studded.has(m) && m !== material) continue;
            this._studded.add(m);
            new StudsPlugin(m);
        }
    },

    // Материалы меша и его детей получают «стады».
    studMesh(root) {
        const parts = [root].concat(root.getChildMeshes ? root.getChildMeshes(false) : []);
        for (const p of parts) if (p.material) this.studs(p.material);
    },

    // --- Небо: купол с градиентом, мягкие облака по кругу. Следует за камерой, без тумана. ---
    makeSky(scene) {
        const R = 17000;
        const dome = BABYLON.MeshBuilder.CreateSphere('sky', { diameter: R * 2, segments: 24, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
        const tex = new BABYLON.DynamicTexture('sky-tex', { width: 16, height: 256 }, scene, false);
        const ctx = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, '#2f7fe6');
        g.addColorStop(0.32, '#5aa6f2');
        g.addColorStop(0.47, '#a9d6fb');
        g.addColorStop(0.5, '#cfe9fc');
        g.addColorStop(1, '#cfe9fc');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 16, 256);
        tex.update(false);
        tex.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE; tex.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        const m = new BABYLON.StandardMaterial('sky-mat', scene);
        m.disableLighting = true;
        m.emissiveTexture = tex;
        m.emissiveColor = new BABYLON.Color3(0, 0, 0);
        m.diffuseColor = new BABYLON.Color3(0, 0, 0);
        m.backFaceCulling = false;
        m.fogEnabled = false;
        m.metadata = { toon: false };
        dome.material = m;
        dome.infiniteDistance = true;
        dome.isPickable = false;
        dome.applyFog = false;
        dome.renderingGroupId = 0;
        // UV сферы: v = 0 внизу. Градиент: верх — синий, к горизонту — светлее.
        tex.vScale = -1;
        this.sky = dome;
        // Облака: плоскости с мягкой текстурой, смотрят на центр, высоко в небе.
        const ct = this.cloudTexture(scene);
        const cm = new BABYLON.StandardMaterial('cloud-mat', scene);
        cm.disableLighting = true; cm.emissiveColor = new BABYLON.Color3(1, 1, 1);
        cm.diffuseTexture = ct; cm.diffuseTexture.hasAlpha = true; cm.useAlphaFromDiffuseTexture = true;
        cm.opacityTexture = ct;
        cm.fogEnabled = false; cm.backFaceCulling = false; cm.metadata = { toon: false };
        let seed = 3;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        for (let i = 0; i < 16; i++) {
            const a = (i / 16) * Math.PI * 2 + rnd() * 0.3;
            const d = R * (0.72 + rnd() * 0.12);
            const w = 3400 + rnd() * 3200;
            const p = BABYLON.MeshBuilder.CreatePlane('cloud' + i, { width: w, height: w * 0.42 }, scene);
            p.material = cm;
            p.parent = dome;
            p.position.set(Math.cos(a) * d, 1800 + rnd() * 2600, Math.sin(a) * d);
            p.lookAt(new BABYLON.Vector3(0, p.position.y * 0.6, 0));
            p.applyFog = false;
            p.isPickable = false;
        }
    },

    cloudTexture(scene) {
        const t = new BABYLON.DynamicTexture('cloud-tex', { width: 512, height: 256 }, scene, true);
        const c = /** @type {CanvasRenderingContext2D} */ (t.getContext());
        c.clearRect(0, 0, 512, 256);
        const blobs = [[140, 150, 80], [230, 120, 105], [330, 140, 90], [400, 165, 60], [90, 175, 55], [270, 175, 85]];
        for (const [x, y, r] of blobs) {
            const g = c.createRadialGradient(x, y, r * 0.2, x, y, r);
            g.addColorStop(0, 'rgba(255,255,255,0.95)');
            g.addColorStop(0.6, 'rgba(255,255,255,0.8)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        }
        t.update(true);
        return t;
    },

    // --- Надписи на табличках: плоскость с DynamicTexture, рисует draw(ctx, w, h). ---
    textPlane(name, w, h, px, draw) {
        const scene = this.scene;
        const tw = Math.round(w * px), th = Math.round(h * px);
        const tex = new BABYLON.DynamicTexture(name + '-tex', { width: tw, height: th }, scene, true);
        tex.hasAlpha = true;
        const plane = BABYLON.MeshBuilder.CreatePlane(name, { width: w, height: h, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);
        const m = new BABYLON.StandardMaterial(name + '-mat', scene);
        m.diffuseTexture = tex; m.useAlphaFromDiffuseTexture = true;
        m.emissiveColor = new BABYLON.Color3(0.55, 0.55, 0.55);
        m.specularColor = new BABYLON.Color3(0, 0, 0);
        m.metadata = { toon: false };
        plane.material = m;
        plane.isPickable = false;
        const redraw = (fn) => {
            const ctx = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
            ctx.clearRect(0, 0, tw, th);
            ctx.save(); ctx.translate(tw, 0); ctx.scale(-1, 1);   // сцена правосторонняя: UV плоскости зеркальны
            (fn || draw)(ctx, tw, th);
            ctx.restore();
            tex.update(true);
        };
        redraw(draw);
        plane.metadata = { redraw };
        return plane;
    },

    // Текст с обводкой (Roblox-надписи). maxW — ширина, в которую текст ужимается (по умолчанию 92% холста).
    strokeText(ctx, text, x, y, size, fill, stroke, weight, maxW) {
        const lim = maxW || ctx.canvas.width * 0.92;
        ctx.font = (weight || 900) + ' ' + size + 'px Nunito, "Arial Black", sans-serif';
        const tw = ctx.measureText(text).width;
        if (tw > lim) { size = Math.max(8, Math.floor(size * lim / tw)); ctx.font = (weight || 900) + ' ' + size + 'px Nunito, "Arial Black", sans-serif'; }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.lineWidth = Math.max(2, size * 0.16);
        ctx.strokeStyle = stroke || '#000';
        ctx.strokeText(text, x, y);
        ctx.fillStyle = fill || '#fff';
        ctx.fillText(text, x, y);
    },

    // --- Лица нубов: процедурные рисунки на прозрачной текстуре 256×256. ---
    FACES: ['smile', 'grin', 'happy', 'cool', 'wink', 'surprised', 'angry', 'tongue', 'uwu', 'sleepy', 'star', 'heart', 'nerd', 'evil', 'shy', 'derp', 'robot', 'dizzy', 'money', 'beast', 'golden'],
    _faceTex: new Map(),
    faceTexture(id) {
        const scene = this.scene;
        const key = id || 'smile';
        let t = this._faceTex.get(key);
        if (t && !t.isDisposed) return t;
        t = new BABYLON.DynamicTexture('face-' + key, { width: 256, height: 256 }, scene, true);
        t.hasAlpha = true;
        const c = /** @type {CanvasRenderingContext2D} */ (t.getContext());
        c.clearRect(0, 0, 256, 256);
        this.drawFace(c, key);
        t.update(true);
        this._faceTex.set(key, t);
        return t;
    },

    drawFace(c, id) {
        const ink = '#111';
        const eye = (x, y, rx, ry) => { c.fillStyle = ink; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); };
        const smile = (y, w, d, lw) => { c.strokeStyle = ink; c.lineWidth = lw || 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(128 - w, y); c.quadraticCurveTo(128, y + d, 128 + w, y); c.stroke(); };
        const eyesStd = () => { eye(100, 108, 9, 16); eye(156, 108, 9, 16); };
        switch (id) {
            case 'grin': eyesStd(); c.fillStyle = ink; c.beginPath(); c.moveTo(84, 150); c.quadraticCurveTo(128, 210, 172, 150); c.closePath(); c.fill();
                c.fillStyle = '#fff'; c.fillRect(98, 152, 60, 12); break;
            case 'happy': c.strokeStyle = ink; c.lineWidth = 9; c.lineCap = 'round';
                c.beginPath(); c.arc(100, 116, 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.beginPath(); c.arc(156, 116, 14, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); smile(150, 40, 40); break;
            case 'cool': c.fillStyle = ink; c.beginPath(); c.roundRect(70, 92, 52, 32, 8); c.roundRect(134, 92, 52, 32, 8); c.fill(); c.fillRect(118, 98, 20, 8);
                c.fillStyle = '#5ad1ff'; c.fillRect(78, 98, 14, 6); c.fillRect(142, 98, 14, 6); smile(156, 30, 22); break;
            case 'wink': eye(100, 108, 9, 16); c.strokeStyle = ink; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(142, 110); c.lineTo(170, 108); c.stroke(); smile(150, 38, 34); break;
            case 'surprised': eye(100, 104, 11, 18); eye(156, 104, 11, 18); c.fillStyle = ink; c.beginPath(); c.ellipse(128, 164, 16, 20, 0, 0, Math.PI * 2); c.fill(); break;
            case 'angry': eyesStd(); c.strokeStyle = ink; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(80, 82); c.lineTo(114, 94); c.moveTo(176, 82); c.lineTo(142, 94); c.stroke(); smile(168, 30, -22); break;
            case 'tongue': eyesStd(); smile(148, 36, 30); c.fillStyle = '#ff5f7e'; c.beginPath(); c.ellipse(140, 172, 14, 18, 0.3, 0, Math.PI * 2); c.fill(); break;
            case 'uwu': c.strokeStyle = ink; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.arc(100, 104, 12, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke(); c.beginPath(); c.arc(156, 104, 12, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke();
                c.beginPath(); c.moveTo(110, 150); c.quadraticCurveTo(119, 162, 128, 150); c.quadraticCurveTo(137, 162, 146, 150); c.stroke();
                c.fillStyle = 'rgba(255,110,140,0.5)'; c.beginPath(); c.ellipse(80, 132, 14, 8, 0, 0, 7); c.ellipse(176, 132, 14, 8, 0, 0, 7); c.fill(); break;
            case 'sleepy': c.strokeStyle = ink; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(86, 110); c.lineTo(114, 110); c.moveTo(142, 110); c.lineTo(170, 110); c.stroke();
                c.beginPath(); c.ellipse(128, 160, 10, 7, 0, 0, 7); c.stroke(); c.font = '900 30px sans-serif'; c.fillStyle = '#3a6fd8'; c.fillText('z', 186, 70); c.fillText('Z', 204, 46); break;
            case 'star': for (const x of [100, 156]) { c.fillStyle = '#ffcc00'; c.strokeStyle = ink; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 9 : 20, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, 108 + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); } smile(152, 36, 34); break;
            case 'heart': for (const x of [100, 156]) { c.fillStyle = '#ff3b6b'; c.beginPath(); c.moveTo(x, 122); c.bezierCurveTo(x - 26, 104, x - 12, 84, x, 98); c.bezierCurveTo(x + 12, 84, x + 26, 104, x, 122); c.fill(); } smile(152, 34, 30); break;
            case 'nerd': c.strokeStyle = ink; c.lineWidth = 6; c.beginPath(); c.arc(98, 108, 22, 0, 7); c.stroke(); c.beginPath(); c.arc(158, 108, 22, 0, 7); c.stroke(); c.beginPath(); c.moveTo(120, 106); c.lineTo(136, 106); c.stroke();
                eye(98, 108, 7, 10); eye(158, 108, 7, 10); smile(156, 26, 20); c.fillStyle = '#fff'; c.fillRect(118, 160, 9, 12); c.fillRect(129, 160, 9, 12); break;
            case 'evil': c.fillStyle = ink; c.beginPath(); c.moveTo(80, 96); c.lineTo(118, 112); c.lineTo(84, 120); c.closePath(); c.moveTo(176, 96); c.lineTo(138, 112); c.lineTo(172, 120); c.closePath(); c.fill();
                c.beginPath(); c.moveTo(76, 146); c.quadraticCurveTo(128, 200, 180, 146); c.quadraticCurveTo(128, 172, 76, 146); c.fill(); break;
            case 'shy': eye(100, 112, 8, 13); eye(156, 112, 8, 13); smile(154, 18, 12, 7); c.fillStyle = 'rgba(255,90,120,0.55)'; c.beginPath(); c.ellipse(78, 138, 18, 10, 0, 0, 7); c.ellipse(178, 138, 18, 10, 0, 0, 7); c.fill(); break;
            case 'derp': eye(96, 100, 14, 14); eye(162, 116, 8, 8); c.fillStyle = '#fff'; c.beginPath(); c.arc(92, 96, 5, 0, 7); c.fill(); smile(160, 34, 18); break;
            case 'robot': c.fillStyle = '#28e0ff'; c.fillRect(82, 96, 34, 22); c.fillRect(140, 96, 34, 22); c.fillStyle = ink; c.fillRect(92, 152, 72, 14); c.fillStyle = '#28e0ff'; for (let i = 0; i < 4; i++) c.fillRect(96 + i * 17, 155, 9, 8); break;
            case 'dizzy': c.strokeStyle = ink; c.lineWidth = 6; for (const x of [100, 156]) { c.beginPath(); for (let a = 0; a < 12; a += 0.2) c.lineTo(x + Math.cos(a) * a * 1.6, 108 + Math.sin(a) * a * 1.6); c.stroke(); } smile(160, 30, 10); break;
            case 'money': c.font = '900 52px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#2bb24c'; c.strokeStyle = ink; c.lineWidth = 5;
                c.strokeText('$', 100, 110); c.fillText('$', 100, 110); c.strokeText('$', 156, 110); c.fillText('$', 156, 110); smile(156, 38, 34); break;
            case 'beast': c.fillStyle = '#ff2b2b'; c.beginPath(); c.ellipse(100, 108, 12, 9, 0.3, 0, 7); c.ellipse(156, 108, 12, 9, -0.3, 0, 7); c.fill();
                c.fillStyle = ink; c.beginPath(); c.moveTo(80, 148); c.lineTo(176, 148); c.lineTo(128, 186); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(96, 148); c.lineTo(104, 162); c.lineTo(112, 148); c.moveTo(144, 148); c.lineTo(152, 162); c.lineTo(160, 148); c.fill(); break;
            case 'golden': {   // золотая улыбка: глаза-звёзды и широкая золотая улыбка с тёмной обводкой
                for (const x of [100, 156]) { c.fillStyle = '#ffd23a'; c.strokeStyle = ink; c.lineWidth = 5; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 17, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, 108 + Math.sin(a) * r); } c.closePath(); c.stroke(); c.fill(); }
                c.fillStyle = ink; c.beginPath(); c.moveTo(80, 146); c.quadraticCurveTo(128, 208, 176, 146); c.closePath(); c.fill();
                c.fillStyle = '#ffd23a'; c.beginPath(); c.moveTo(92, 152); c.quadraticCurveTo(128, 194, 164, 152); c.closePath(); c.fill();
                c.fillStyle = '#fff6b0'; c.fillRect(104, 154, 48, 6); break; }
            default: eyesStd(); smile(150, 38, 34);
        }
    },

    // Шеврон-стрелка пути (белый треугольник с тёмным торцом), как в видео.
    chevronTemplate(scene) {
        // Треугольная призма: одна вершина смотрит вдоль +X (вперёд по пути).
        const m = BABYLON.MeshBuilder.CreateCylinder('chevron', { height: 9, diameter: 58, tessellation: 3 }, scene);
        m.bakeTransformIntoVertices(BABYLON.Matrix.Scaling(1, 1, 0.85));
        m.convertToFlatShadedMesh();
        return m;
    },
};
