// GameWorld.js — мир по маркерам карты: зоны, базы (гнёзда на постаментах, вылупление яиц, плита
// «Собрать», кнопка и лазерная дверь защиты, дорожка, табличка улучшений), яйца монстров и их появление,
// Золотое яйцо (titanic), упавшие яйца и монстры, стражи зон, портал перерождения, линия Safe Zone, вода,
// табло лидеров, стрелки-шевроны пути. Логика — в своих полях (x, y), Babylon — только вид.

// Свои типы покраски земли (до загрузки первой карты: скрипт выполняется раньше main.js).
if (typeof Terrain3D !== 'undefined') {
    Object.assign(Terrain3D.PAINT_COLORS, { candy: 0xf7a3ea, jungle: 0x3a9e3c, beach: 0xf2d9a0 });
    Object.assign(Terrain3D.PAINT_COLORS, { sand: 0xf0cf72, snow: 0xf3f8ff });
}

// Фигуры столкновений моделей карты (px модели; Nav.register).
if (typeof Nav !== 'undefined') {
    const P = 'assets/models/props/', N = 'assets/models/nature/';
    const blockShape = [{ t: 'box', x: 0, y: 0, w: 100, d: 100 }];
    const reg = {};
    // block_brick и block_caramel — тонкие полоски на границах зон (по ним ходят), не стены.
    for (const b of ['block_top_grass', 'block_top_sand', 'block_top_snow', 'block_top_pink', 'block_top_jungle', 'block_top_beach', 'block_blue']) reg[P + b + '.glb'] = blockShape;
    reg[P + 'plot.glb'] = [
        { t: 'box', x: 0, y: -444, w: 1200, d: 14, los: false }, { t: 'box', x: 0, y: 444, w: 1200, d: 14, los: false },
        { t: 'box', x: -594, y: 0, w: 14, d: 900, los: false },
        { t: 'box', x: 594, y: -300, w: 14, d: 300, los: false }, { t: 'box', x: 594, y: 300, w: 14, d: 300, los: false },
    ];
    reg[P + 'stall_pickaxe.glb'] = [{ t: 'box', x: 0, y: 0, w: 190, d: 370 }];
    reg[P + 'stall_trails.glb'] = [{ t: 'box', x: 0, y: 0, w: 190, d: 370 }];
    reg[P + 'merge_machine.glb'] = [{ t: 'box', x: 0, y: 0, w: 260, d: 430 }];
    reg[P + 'wheel_kiosk.glb'] = [{ t: 'box', x: 0, y: 0, w: 140, d: 240 }];
    reg[P + 'gift_box.glb'] = [{ t: 'box', x: 0, y: 0, w: 130, d: 130 }];
    for (const c of ['green', 'blue', 'pink']) reg[P + 'leaderboard_' + c + '.glb'] = [{ t: 'box', x: 0, y: 0, w: 60, d: 440 }];
    reg[P + 'lava_altar.glb'] = [{ t: 'circle', x: 0, y: 0, r: 140 }];
    // Портал перерождения: арка с диском и два фонаря у ступеней (по ступеням ходят).
    reg[P + 'rebirth_portal.glb'] = [{ t: 'box', x: 0, y: 0, w: 260, d: 640 }, { t: 'circle', x: 235, y: -245, r: 25 }, { t: 'circle', x: 235, y: 245, r: 25 }];
    reg[P + 'lamp_post.glb'] = [{ t: 'circle', x: 0, y: 0, r: 18 }];
    for (const t of ['tree_round', 'tree_tall', 'tree_dead', 'candy_tree', 'jungle_tree', 'palm_tree', 'pine_snow']) reg[N + t + '.glb'] = [{ t: 'circle', x: 0, y: 0, r: 40 }];
    for (const t of ['lollipop_red', 'lollipop_blue', 'lollipop_pink', 'candy_cane', 'bamboo']) reg[N + t + '.glb'] = [{ t: 'circle', x: 0, y: 0, r: 22 }];
    reg[N + 'cactus.glb'] = [{ t: 'circle', x: 0, y: 0, r: 34 }];
    reg[N + 'rock_big.glb'] = [{ t: 'circle', x: 0, y: 0, r: 120 }];
    reg[N + 'rock_slab.glb'] = [{ t: 'box', x: 0, y: 0, w: 240, d: 160, los: false }];
    reg[N + 'pyramid.glb'] = [{ t: 'box', x: 0, y: 0, w: 900, d: 900 }];
    reg[N + 'sphinx.glb'] = [{ t: 'box', x: 0, y: 0, w: 700, d: 300 }];
    reg[N + 'igloo.glb'] = [{ t: 'circle', x: 0, y: 0, r: 200 }];
    reg[N + 'jungle_ruin.glb'] = [{ t: 'box', x: 0, y: 0, w: 300, d: 500 }];
    reg[N + 'tiki.glb'] = [{ t: 'circle', x: 0, y: 0, r: 70 }];
    reg[N + 'shipwreck.glb'] = [{ t: 'box', x: 0, y: 0, w: 640, d: 260 }];
    reg[N + 'ice_crystal.glb'] = [{ t: 'circle', x: 0, y: 0, r: 60 }];
    reg[N + 'choco_block.glb'] = [{ t: 'box', x: 0, y: 0, w: 240, d: 140, los: false }];
    reg[N + 'coral_pink.glb'] = [{ t: 'circle', x: 0, y: 0, r: 60 }];
    reg[N + 'coral_purple.glb'] = [{ t: 'circle', x: 0, y: 0, r: 50 }];
    Nav.register(reg);
}

// Локальная точка базы -> мир (yaw — курс базы, градусы).
function baseToWorld(b, lx, ly) {
    const a = b.yaw * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    return { x: b.x + lx * c - ly * s, y: b.y + lx * s + ly * c };
}

class Base {
    constructor(world, def, index) {
        this.world = world;
        this.index = index;
        this.x = def.x; this.y = def.y; this.yaw = (def.rot && def.rot[1]) || 0;
        /** @type {any} */
        this.owner = null;
        this.level = 1;
        this.extra = 0;   // гнёзда за перерождения
        this.tread = 0;
        // Гнёзда — сетка 4×4; заполняются от входа вглубь (первые — ближе к плите «Собрать»).
        /** @type {{ x: number, y: number, pet: any, view: any, label: any, hatchT: number }[]} */
        this.slots = [];
        const grid = [];
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) grid.push([-470 + c * 200, -330 + r * 220]);
        grid.sort((u, v) => Math.hypot(u[0] - 260, u[1]) - Math.hypot(v[0] - 260, v[1]) || u[1] - v[1]);
        for (const [lx, ly] of grid) {
            const p = baseToWorld(this, lx, ly);
            this.slots.push({ x: p.x, y: p.y, pet: null, view: null, label: null, hatchT: 0 });
        }
        this.entry = baseToWorld(this, 640, 0);
        this.signPos = baseToWorld(this, 470, 300);
        this.treadPos = baseToWorld(this, 420, -290);
        this.padPos = baseToWorld(this, 400, 0);
        this.shieldPos = baseToWorld(this, 480, -175);
        this.heading = this.yaw * Math.PI / 180;
    }
    get slotCount() { return GameData.penSlots(this.level, this.extra); }
    // Внутри участка (локальные координаты с запасом).
    contains(x, y, pad) {
        const a = -this.heading, dx = x - this.x, dy = y - this.y;
        const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
        const p = pad || 0;
        return lx > -600 - p && lx < 600 + p && ly > -450 - p && ly < 450 + p;
    }
    onTreadmill(x, y) {
        const a = -this.heading, dx = x - this.treadPos.x, dy = y - this.treadPos.y;
        const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
        return Math.abs(lx) < 130 && Math.abs(ly) < 70;
    }
    freeSlot() {
        for (let i = 0; i < this.slotCount; i++) if (!this.slots[i].pet) return i;
        return -1;
    }
    pets() { return this.slots.filter(s => s.pet).map(s => s.pet); }
    income() {
        let sum = 0;
        for (let i = 0; i < this.slotCount; i++) if (this.slots[i].pet) sum += GameData.incomeOf(this.slots[i].pet);
        return sum;
    }
}

/** @satisfies {Record<string, any>} */
const World = {
    /** @type {LoryApp | null} */
    app: null,
    /** @type {any[]} */
    zones: [],
    /** @type {Base[]} */
    bases: [],
    /** @type {any[]} */
    spots: [],
    /** @type {any[]} */
    dropped: [],
    /** @type {any[]} */
    guardians: [],
    /** @type {any} */
    titanic: null,
    titanicTimer: 0,
    /** @type {{ x: number, y: number, hx: number, hy: number } | null} */
    hub: null,
    /** @type {Record<string, { x: number, y: number }>} */
    shops: {},
    /** @type {any[]} */
    chevrons: [],
    /** @type {any[]} */
    pools: [],
    /** @type {ShopNpc[]} */
    npcs: [],
    _t: 0,

    async init(app) {
        this.app = app;
        const loc = app.location;
        const scene = loc.view.scene;
        Gfx.init(scene);
        Models.init(loc.view);
        MonsterViews.init(scene, (x, z) => this.ground(x, z));
        // Камера видит дальше (длинный каньон), небо-купол внутри дальности.
        loc.view.camera.maxZ = 40000;
        // «Стады» на блоках и постройках.
        for (const rec of loc.objects) {
            const m = rec.def && rec.def.model || '';
            if (rec.mesh && /props\/(block_|plot|stall_|merge|wheel_kiosk|leaderboard|bridge)/.test(m)) Gfx.studMesh(rec.mesh);
        }
        // Зоны — прямоугольники маркеров zone, zone-2 … по номеру (раскладка карты любая: коридор с поворотами).
        // zone-flat / zone-raise — маркеры рельефа движка, не зоны.
        const num = (m) => { const k = /-(\d+)$/.exec(m.name); return k ? Number(k[1]) : 1; };
        this.zones = loc.markers('zone').filter(m => /^zone(-\d+)?$/.test(m.name)).sort((a, b) => num(a) - num(b)).map((m, i) => {
            const hx = (m.scale[0] || 10) * 100, hy = (m.scale[2] || 14) * 100;
            return { i, x: m.x, y: m.y, hx, hy, x0: m.x - hx, x1: m.x + hx, y0: m.y - hy, y1: m.y + hy, data: GameData.zoneOf(i) };
        });
        // Хаб — маркер hub (прямоугольник); нет маркера — всё, что не зона.
        const hm = loc.marker('hub');
        this.hub = hm ? { x: hm.x, y: hm.y, hx: (hm.scale[0] || 20) * 100, hy: (hm.scale[2] || 20) * 100 } : null;
        this.shops = {};
        for (const n of ['shop-pickaxe', 'shop-cosmetic', 'merge', 'wheel', 'gift', 'rebirth']) { const m = loc.marker(n); if (m) this.shops[n] = { x: m.x, y: m.y }; }
        this.buildPortalFx(scene);
        this.pools = loc.markers('pool').map(m => ({ x: m.x, y: m.y, hx: m.scale[0] * 100, hy: m.scale[2] * 100 }));
        Nav.build(loc);
        this.collectWalls(loc);
        // Базы.
        this.bases = loc.markers('base').slice().sort((a, b) => (a.name === 'base' ? -1 : b.name === 'base' ? 1 : a.name.localeCompare(b.name, 'en', { numeric: true })))
            .map((m, i) => new Base(this, m, i));
        await Promise.all(this.bases.map(b => this.buildBase(b)));
        this.buildSafeLine(scene);
        this.buildConveyor(scene);
        this.buildPools(scene);
        this.buildChevrons(scene);
        this.buildTitanicSign(scene);
        this.buildLeaderboards(scene);
        // Яйца на точках.
        this.spots = loc.markers('egg').map(m => ({ x: m.x, y: m.y, zone: this.zoneAt(m.x, m.y), egg: null, timer: Math.random() * 2 }));
        await Promise.all(this.spots.filter(s => s.zone >= 0).map(s => this.spawnEgg(s)));
        this.titanicTimer = GameData.TITANIC_FIRST_SEC;
        // Стражи.
        this.guardians = [];
        for (const m of loc.markers('guardian')) {
            const z = this.zoneAt(m.x, m.y);
            if (z < 0) continue;
            this.guardians.push(new Guardian(this, z, m));
        }
        await Promise.all(this.guardians.map(g => g.load()));
        // Продавцы-NPC: роль — по ближайшей точке магазина.
        const roles = [['shop-pickaxe', 'pickaxe'], ['shop-cosmetic', 'cosmetic'], ['merge', 'merge'], ['wheel', 'wheel']];
        this.npcs = loc.markers('npc').map(m => {
            let role = 'pickaxe', bd = Infinity;
            for (const [key, r] of roles) { const s = this.shops[key]; if (s) { const d = Math.hypot(s.x - m.x, s.y - m.y); if (d < bd) { bd = d; role = r; } } }
            return new ShopNpc(this, m, role);
        });
    },

    zoneAt(x, y) {
        for (const z of this.zones) if (x >= z.x0 && x < z.x1 && y >= z.y0 && y < z.y1) return z.i;
        return -1;
    },
    inZoneRect(i, x, y, pad) { const z = this.zones[i], p = pad || 0; return !!z && x >= z.x0 - p && x <= z.x1 + p && y >= z.y0 - p && y <= z.y1 + p; },
    inHub(x, y) { return this.zoneAt(x, y) < 0; },
    // Случайная точка пола хаба (боты бродят, камера меню смотрит в центр).
    hubPoint(inset) {
        const h = this.hub, k = inset || 0;
        if (!h) { const b = this.bases[0]; return { x: b.entry.x, y: b.entry.y }; }
        for (let t = 0; t < 12; t++) {
            const x = h.x + (Math.random() * 2 - 1) * Math.max(0, h.hx - k), y = h.y + (Math.random() * 2 - 1) * Math.max(0, h.hy - k);
            if (!Nav.blocked(x, y, 40)) return { x, y };
        }
        return { x: h.x, y: h.y };
    },
    hubCenter() { return this.hub ? { x: this.hub.x, y: this.hub.y } : this.hubPoint(0); },
    // Табло моста над входом в зону 1 (камера не должна в него влезать): прямоугольник по курсу балки.
    inBridge(x, y, h) {
        const br = this._bridge;
        if (!br || h < br.h0 || h > br.h0 + 520) return false;
        const dx = x - br.x, dy = y - br.y;
        const along = dx * Math.cos(br.a) + dy * Math.sin(br.a), across = -dx * Math.sin(br.a) + dy * Math.cos(br.a);
        return Math.abs(across) < 130 && Math.abs(along) < br.half;
    },
    // Открытое пространство (пол, а не стена из блоков и не край карты) — для камеры. Деревья и фонари не мешают.
    isOpen(x, y, pad) {
        const p = pad || 0, map = this.app.map;
        if (x < p || y < p || (map && (x > map.width - p || y > map.height - p))) return false;
        for (const w of this._walls || []) {
            const dx = x - w.x, dy = y - w.y;
            const lx = dx * w.c + dy * w.s, ly = -dx * w.s + dy * w.c;
            if (Math.abs(lx) < w.hx + p && Math.abs(ly) < w.hy + p) return false;
        }
        return true;
    },
    // Стены-блоки карты (высокие block_top_* / block_blue) прямоугольниками для isOpen.
    collectWalls(loc) {
        this._walls = [];
        for (const r of loc.objects) {
            const d = r.def;
            if (!d || !/props\/block_(top_|blue)/.test(d.model || '') || (d.scale[1] || 1) * 100 < 200) continue;
            const a = ((d.rot && d.rot[1]) || 0) * Math.PI / 180;
            this._walls.push({ x: d.x, y: d.y, hx: (d.scale[0] || 1) * 50, hy: (d.scale[2] || 1) * 50, c: Math.cos(a), s: Math.sin(a) });
        }
    },
    inPool(x, y) { return this.pools.some(p => Math.abs(x - p.x) < p.hx && Math.abs(y - p.y) < p.hy); },
    // Высота опоры: земля (Nav) или лента беговой дорожки базы (40 px).
    ground(x, y) {
        for (const b of this.bases) if (b.onTreadmill(x, y)) return Nav.height(x, y) + 40;
        return Nav.height(x, y);
    },

    // --- Базы ---
    async buildBase(b) {
        const scene = this.app.location.view.scene;
        const view = this.app.location.view;
        // Гнёзда: шестигранный каменный постамент + гнездо из веток (как в референсах), табличка, дорожка.
        if (!this._pedTpl) {
            const t = BABYLON.MeshBuilder.CreateCylinder('pedestal', { height: 24, diameter: 156, tessellation: 6 }, scene);
            t.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 12, 0));
            const rim = BABYLON.MeshBuilder.CreateCylinder('pedestal-rim', { height: 6, diameter: 136, tessellation: 6 }, scene);
            rim.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 27, 0));
            Monsters._paint(t, Monsters._c4('#8d939e')); Monsters._paint(rim, Monsters._c4('#a9afb9'));
            const m = BABYLON.Mesh.MergeMeshes([t, rim], true, true);
            m.material = Gfx.mat('#ffffff', { studs: true });
            World3D.addObject(view, m, 'prop', { castShadow: false, ink: false, outline: false });
            m.isVisible = false; m.isPickable = false;
            this._pedTpl = m;
        }
        b.pads = [];
        b.nests = [];
        for (let i = 0; i < b.slots.length; i++) {
            const s = b.slots[i];
            const pad = this._pedTpl.createInstance('ped' + b.index + '-' + i);
            pad.position.set(s.x, 0, s.y);
            pad.rotation.y = -b.heading + Math.PI / 6;
            pad.isPickable = false;
            b.pads.push(pad);
            const n = await Models.nest(0.92);
            n.mesh.position.set(s.x, 28, s.y);
            n.mesh.rotation.y = i * 1.7;
            b.nests.push(n.mesh);
        }
        // Плита «Собрать»: золотая плита у входа, над ней — сколько накопилось в банке.
        const pad = BABYLON.MeshBuilder.CreateBox('collect-pad', { width: 170, height: 12, depth: 170 }, scene);
        pad.position.set(b.padPos.x, 6, b.padPos.y);
        pad.rotation.y = -b.heading;
        pad.material = Gfx.mat('#ffc42a', { emissive: '#4a3000', studs: true });
        pad.receiveShadows = true; pad.isPickable = false;
        const coin = BABYLON.MeshBuilder.CreateCylinder('collect-coin', { height: 8, diameter: 96, tessellation: 28 }, scene);
        coin.position.set(b.padPos.x, 16, b.padPos.y);
        coin.material = Gfx.mat('#ffe066', { emissive: '#6a4a00' });
        coin.isPickable = false;
        b.padMesh = pad; b.padCoin = coin;
        // Кнопка защиты: тумба с синей кнопкой; лазерная дверь в проёме — только пока щит включён.
        const post = BABYLON.MeshBuilder.CreateBox('shield-post', { width: 56, height: 96, depth: 56 }, scene);
        post.position.set(b.shieldPos.x, 48, b.shieldPos.y);
        post.rotation.y = -b.heading;
        post.material = Gfx.mat('#6b737f', { studs: true });
        post.isPickable = false;
        const btn = BABYLON.MeshBuilder.CreateCylinder('shield-btn', { height: 16, diameter: 42, tessellation: 20 }, scene);
        btn.position.set(b.shieldPos.x, 104, b.shieldPos.y);
        const bm = new BABYLON.StandardMaterial('shield-btn-m' + b.index, scene);
        bm.diffuseColor = new BABYLON.Color3(0.15, 0.55, 1); bm.emissiveColor = new BABYLON.Color3(0.05, 0.25, 0.6);
        btn.material = bm; btn.isPickable = false;
        b.shieldBtn = btn;
        World3D.addObject(view, post, 'prop', { ink: false, outline: false });
        const door = BABYLON.MeshBuilder.CreateBox('shield-door', { width: 10, height: 260, depth: 300 }, scene);
        const dp = baseToWorld(b, 594, 0);
        door.position.set(dp.x, 130, dp.y);
        door.rotation.y = -b.heading;
        const dm = new BABYLON.StandardMaterial('shield-door-m' + b.index, scene);
        dm.diffuseColor = new BABYLON.Color3(0.25, 0.85, 1); dm.emissiveColor = new BABYLON.Color3(0.15, 0.6, 0.9);
        dm.alpha = 0.38; dm.backFaceCulling = false; dm.disableLighting = true; dm.metadata = { toon: false };
        door.material = dm; door.isPickable = false; door.setEnabled(false);
        b.shieldDoor = door;
        if (b.index === 0) {
            b.bankText = Gfx.textPlane('bank' + b.index, 300, 120, 1.6, () => {});
            b.bankText.position.set(b.padPos.x, 150, b.padPos.y);
            b.bankText.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
            b.bankShown = -1;
        }
        const load = async (url, x, y, yaw, h) => {
            try {
                const model = await Model3D.load(url);
                const mesh = Model3D.build(model, scene, { name: 'base' + b.index });
                mesh.position.set(x, h || 0, y);
                mesh.rotation.y = -yaw;
                World3D.addObject(view, mesh, 'prop');
                Gfx.studMesh(mesh);
                return mesh;
            } catch (e) { return null; }
        };
        b.signMesh = await load('assets/models/props/sign_board.glb', b.signPos.x, b.signPos.y, b.heading + Math.PI);
        b.treadMesh = await load('assets/models/props/treadmill.glb', b.treadPos.x, b.treadPos.y, b.heading + Math.PI);
        if (b.treadMesh) b.belt = b.treadMesh.getChildMeshes(false).find(m => m.metadata && m.metadata.part === 'Belt') || null;
        // Надпись на табличке — плоскость перед доской (доска смотрит к выходу участка).
        // Надпись с обеих сторон доски: лицевая (к выходу участка) и задняя.
        b.signText = Gfx.textPlane('sign' + b.index, 250, 140, 2, () => {});
        const fp = baseToWorld(b, 470 - 9, 300);
        b.signText.position.set(fp.x, 120 + 75, fp.y);
        b.signText.rotation.y = -b.heading + Math.PI / 2;
        b.signBack = Gfx.textPlane('signb' + b.index, 250, 140, 2, () => {});
        const bp = baseToWorld(b, 470 + 25, 300);
        b.signBack.position.set(bp.x, 120 + 75, bp.y);
        b.signBack.rotation.y = -b.heading - Math.PI / 2;
        this.updateSign(b);
        this.updatePads(b);
    },

    updateSign(b) {
        if (!b.signText) return;
        const draw = (c, w, h) => {
            Gfx.strokeText(c, Lang.t('sign.upgrades'), w / 2, h * 0.24, Math.round(h * 0.2), '#ffd23a', '#1b1250');
            Gfx.strokeText(c, Lang.t('sign.nests', { n: b.slotCount, m: GameData.SLOTS_MAX }), w / 2, h * 0.55, Math.round(h * 0.18), '#ffffff', '#1b1250');
            Gfx.strokeText(c, b.owner && b.owner.isPlayer ? Lang.t('act.open') + ' [E]' : '', w / 2, h * 0.82, Math.round(h * 0.14), '#7dff6a', '#1b1250');
        };
        b.signText.metadata.redraw(draw);
        if (b.signBack) b.signBack.metadata.redraw(draw);
    },

    updatePads(b) {
        for (let i = 0; i < b.pads.length; i++) {
            const open = i < b.slotCount;
            b.pads[i].setEnabled(open);
            if (b.nests && b.nests[i]) b.nests[i].setEnabled(open);
        }
    },

    // Лазерная дверь базы: щит включён — светится в проёме.
    setShield(b, on) {
        if (b.shieldDoor) b.shieldDoor.setEnabled(!!on);
        if (on && this.app.fx) this.app.fx.play('magic', new BABYLON.Vector3(b.entry.x, 120, b.entry.y));
    },

    // Поставить яйцо или монстра в гнездо базы (вид + подпись). Яйцо (pet.h === false) вылупится через HATCH_SEC.
    async placePet(b, slotIdx, pet) {
        const s = b.slots[slotIdx];
        if (!s) return;
        s.pet = pet;
        s.hatchT = pet.h === false ? GameData.HATCH_SEC : 0;
        const v = await PetView.create(pet);
        if (s.pet !== pet) { v.dispose(); return; }
        if (s.view) s.view.dispose();
        s.view = v;
        v.place(s.x, s.y, 34, b.heading);   // в гнезде, мордой ко входу на базу
        v.home = { x: s.x, y: s.y };
        v.showLabel(true);
    },
    clearSlot(b, slotIdx) {
        const s = b.slots[slotIdx];
        if (!s) return null;
        const pet = s.pet;
        s.pet = null;
        s.hatchT = 0;
        if (s.view) { s.view.dispose(); s.view = null; }
        return pet;
    },
    // Яйцо в гнезде раскачивается сильнее и сильнее, потом — вспышка, на его месте монстр.
    async hatchSlot(b, s) {
        const pet = s.pet;
        if (!pet) return;
        pet.h = true;
        const col = (GameData.PETS[pet.sp] || GameData.PETS.moxlo).color;
        const near = typeof Game !== 'undefined' && Game.player && Math.hypot(s.x - Game.player.x, s.y - Game.player.y) < 1600;
        if (near && this.app.fx) {
            this.app.fx.create({ position: new BABYLON.Vector3(s.x, 90, s.y), burst: 34, capacity: 40, life: [0.4, 1.0], size: [12, 26], speed: [160, 380], gravity: [0, -500, 0], color: col, color2: '#ffffff', duration: 0.05 });
            this.app.fx.play('magic', new BABYLON.Vector3(s.x, 70, s.y));
            Sfx.play('crack', 0.55);
        }
        const v = await PetView.create(pet);
        if (s.pet !== pet) { v.dispose(); return; }
        if (s.view) s.view.dispose();
        s.view = v;
        v.place(s.x, s.y, 34, b.heading);
        v.home = { x: s.x, y: s.y };
        v.pop = 0;
        v.showLabel(true);
        if (typeof Game !== 'undefined') Game.onHatch(b, pet);
    },

    // --- Яйца ---
    pickEggType(zone) {
        const list = GameData.eggsOfZone(zone);
        let t = Math.random() * list.reduce((a, e) => a + (e.spawn || 1), 0);
        for (const e of list) { t -= e.spawn || 1; if (t <= 0) return e; }
        return list[0];
    },

    async spawnEgg(spot, type) {
        const et = type || this.pickEggType(spot.zone);
        const egg = { type: et, hp: et.hp, max: et.hp, x: spot.x, y: spot.y, mesh: null, nest: null, shake: 0, spot, titanic: et.id === 'titanic', hits: new Map(), height: 112, r: 60, tz: 0 };
        spot.egg = egg;
        const scale = egg.titanic ? GameData.TITANIC.scale : 1;
        const [e, n] = await Promise.all([Models.egg(et, scale), Models.nest(scale)]);
        if (spot.egg !== egg) { e.mesh.dispose(); n.mesh.dispose(); return; }
        egg.mesh = e.mesh; egg.nest = n.mesh; egg.height = e.height; egg.r = 60 * scale;
        const yaw = Math.random() * Math.PI * 2;
        egg.nest.position.set(spot.x, 0, spot.y); egg.nest.rotation.y = yaw;
        egg.mesh.position.set(spot.x, 9 * scale, spot.y); egg.mesh.rotation.y = yaw;
        egg.pop = 0;
        egg.mesh.scaling.setAll(0.01);
        egg.baseScale = scale;
        egg.label = UI.labels.add({ kind: 'egg', egg, x: spot.x, y: spot.y, h: egg.height + 34 * scale });
        return egg;
    },

    removeEgg(egg) {
        if (egg.mesh) egg.mesh.dispose();
        if (egg.nest) egg.nest.dispose();
        if (egg.label) UI.labels.remove(egg.label);
        egg.mesh = null;
        if (egg.spot && egg.spot.egg === egg) { egg.spot.egg = null; egg.spot.timer = GameData.EGG_RESPAWN[0] + Math.random() * (GameData.EGG_RESPAWN[1] - GameData.EGG_RESPAWN[0]); }
    },

    // Ближайшее яйцо перед точкой (для удара).
    eggNear(x, y, heading, reach) {
        let best = null, bd = Infinity;
        const all = this.spots.map(s => s.egg).concat(this.titanic ? [this.titanic] : []);
        for (const e of all) {
            if (!e || !e.mesh || e.hp <= 0) continue;
            const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy) - e.r;
            if (d > reach) continue;
            if (heading != null && d > 30) {
                let da = Math.atan2(dy, dx) - heading;
                da = Math.atan2(Math.sin(da), Math.cos(da));
                if (Math.abs(da) > 1.3) continue;
            }
            if (d < bd) { bd = d; best = e; }
        }
        return best;
    },

    // --- Titanic Egg ---
    async spawnTitanic(power) {
        if (this.titanic) return;
        // Точное имя: marker('titanic') по префиксу вернул бы и табличку 'titanic-sign'.
        const m = this.app.location.markers('titanic').find(d => d.name === 'titanic');
        if (!m) return;
        const spot = { x: m.x, y: m.y, zone: this.zoneAt(m.x, m.y), egg: null, timer: 0, titanic: true };
        const t = /** @type {any} */ (GameData.TITANIC);
        // Площадка под Титана: обычные яйца рядом убираются и не появляются, пока он жив.
        this._titanicSpot = { x: m.x, y: m.y, r: 560 };
        for (const sp of this.spots) if (sp.egg && Math.hypot(sp.x - m.x, sp.y - m.y) < 560) this.removeEgg(sp.egg);
        const egg = await this.spawnEgg(spot, t);
        if (!egg) return;
        egg.max = egg.hp = Math.max(t.hpMin, Math.round(t.hpPerPower * power));
        // Зона игрока: самая дальняя, где яйцо бьётся не дольше 60 ударов.
        let tz = 0;
        for (let z = 0; z < GameData.ZONES.length; z++) if (GameData.eggsOfZone(z)[0].hp / Math.max(1, power) <= 60) tz = z;
        egg.tz = tz;
        this.titanic = egg;
        spot.egg = null;   // не точка респавна
        egg.spot = null;
    },

    // --- Упавшие питомцы (лежат с таймером, взять может кто угодно) ---
    async dropPet(pet, x, y, h, owner) {
        const v = await PetView.create(pet);
        const d = { pet, view: v, x, y, t: GameData.DROP_SECONDS, owner: owner || null, from: h || 0 };
        v.place(x, y, 0, Math.random() * 6.28);
        v.showLabel(true, d);
        this.dropped.push(d);
        return d;
    },
    removeDropped(d) {
        const i = this.dropped.indexOf(d);
        if (i >= 0) this.dropped.splice(i, 1);
        d.view.dispose();
    },
    droppedNear(x, y, r) {
        let best = null, bd = r;
        for (const d of this.dropped) { const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; best = d; } }
        return best;
    },

    // --- Конвейер яиц (маркер conveyor: центр ленты, rot[1] — куда едет, scale[0]·100 — половина длины) ---
    /** @type {any} */
    conveyor: null,
    buildConveyor(scene) {
        const m = this.app.location.marker('conveyor');
        this.conveyor = null;
        if (!m) return;
        const a = ((m.rot && m.rot[1]) || 0) * Math.PI / 180, half = (m.scale[0] || 8.5) * 100;
        const view = this.app.location.view;
        // Лента: тёмная резина с бегущими жёлтыми шевронами, по краям — жёлтые бортики, в начале — раздатчик яиц.
        const tex = new BABYLON.DynamicTexture('belt-tex', { width: 256, height: 128 }, scene, true);
        const c = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        c.fillStyle = '#2a2d36'; c.fillRect(0, 0, 256, 128);
        c.strokeStyle = '#3a3e4a'; c.lineWidth = 6; for (let x = 0; x < 256; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 128); c.stroke(); }
        c.strokeStyle = '#ffc61a'; c.lineWidth = 10; c.lineCap = 'round';
        for (const x of [64, 192]) { c.beginPath(); c.moveTo(x - 18, 30); c.lineTo(x + 10, 64); c.lineTo(x - 18, 98); c.stroke(); }
        tex.update(true);
        tex.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
        const bm = new BABYLON.StandardMaterial('belt-m', scene);
        bm.diffuseTexture = tex; bm.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); bm.metadata = { toon: false };
        tex.uScale = half * 2 / 256; tex.vScale = 1;
        const belt = BABYLON.MeshBuilder.CreateBox('belt', { width: half * 2, height: 16, depth: 220 }, scene);
        belt.position.set(m.x, 8, m.y); belt.rotation.y = -a;
        belt.material = bm; belt.isPickable = false; belt.receiveShadows = true;
        const parts = [belt];
        for (const s of [-1, 1]) {
            const rail = BABYLON.MeshBuilder.CreateBox('belt-rail', { width: half * 2 + 20, height: 34, depth: 18 }, scene);
            rail.position.set(m.x - Math.sin(a) * s * 119, 17, m.y + Math.cos(a) * s * 119); rail.rotation.y = -a;
            rail.material = Gfx.mat('#ffc61a', { studs: true }); rail.isPickable = false;
            parts.push(rail);
        }
        // Раздатчик в начале ленты: фиолетовая будка с золотой окантовкой и окном-аркой.
        const sx = m.x - Math.cos(a) * (half + 40), sy = m.y - Math.sin(a) * (half + 40);
        const box = BABYLON.MeshBuilder.CreateBox('egg-dispenser', { width: 140, height: 230, depth: 280 }, scene);
        box.position.set(sx, 115, sy); box.rotation.y = -a;
        box.material = Gfx.mat('#5a2ad0', { studs: true }); box.isPickable = false;
        const trim = BABYLON.MeshBuilder.CreateBox('egg-dispenser-top', { width: 160, height: 26, depth: 300 }, scene);
        trim.position.set(sx, 243, sy); trim.rotation.y = -a;
        trim.material = Gfx.mat('#ffd23a', { emissive: '#3a2a00' }); trim.isPickable = false;
        for (const p of [box, trim]) World3D.addObject(view, p, 'prop', { ink: false, outline: false });
        // Точка у ленты: s — путь от начала ленты, lat — вбок (как у бортиков), h — высота.
        const at = (s, h, lat) => new BABYLON.Vector3(m.x + Math.cos(a) * (s - half) - Math.sin(a) * (lat || 0), h, m.y + Math.sin(a) * (s - half) + Math.cos(a) * (lat || 0));
        const deco = (mesh, pos, mat) => {
            mesh.position.copyFrom(pos); mesh.rotation.y = -a; mesh.material = mat; mesh.isPickable = false;
            World3D.addObject(view, mesh, 'prop', { ink: false, outline: false, castShadow: false });
            return mesh;
        };
        // Окно раздатчика (лицо будки — s = 30): тёмный проём в золотой раме, шторка из полос, лампа на крыше.
        const gold = Gfx.mat('#ffd23a', { emissive: '#3a2a00' });
        deco(BABYLON.MeshBuilder.CreateBox('disp-hole', { width: 6, height: 150, depth: 190 }, scene), at(31, 91), Gfx.mat('#160b33', { emissive: '#12062e' }));
        deco(BABYLON.MeshBuilder.CreateBox('disp-frame', { width: 14, height: 22, depth: 232 }, scene), at(34, 177), gold);
        for (const s of [-1, 1]) deco(BABYLON.MeshBuilder.CreateBox('disp-post', { width: 14, height: 172, depth: 20 }, scene), at(34, 102, s * 106), gold);
        const strips = [];
        for (let i = 0; i < 7; i++) {
            const st = BABYLON.MeshBuilder.CreateBox('disp-strip', { width: 3, height: 132, depth: 25 }, scene);
            st.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, -66, 0));   // петля сверху
            const lat = (i - 3) * 27;
            deco(st, at(37, 164, lat), Gfx.mat(i % 2 ? '#2bb3c9' : '#3fd6e8', { emissive: '#06303a' }));
            strips.push({ mesh: st, lat, ang: 0, vel: 0 });
        }
        const lampMat = new BABYLON.StandardMaterial('disp-lamp-m', scene);   // свой: мигает
        lampMat.diffuseColor = Gfx.hex('#ffe680'); lampMat.emissiveColor = Gfx.hex('#806010'); lampMat.metadata = { toon: false };
        deco(BABYLON.MeshBuilder.CreateSphere('disp-lamp', { diameter: 36, segments: 10 }, scene), at(-40, 274), lampMat);
        // Конец ленты: воронка-вихрь на земле — непроданные яйца срываются с края и закручиваются в неё.
        const sink = half * 2 + 150;
        deco(BABYLON.MeshBuilder.CreateCylinder('sink-base', { diameter: 300, height: 14, tessellation: 36 }, scene), at(sink, 7), Gfx.mat('#5a2ad0', { studs: true }));
        deco(BABYLON.MeshBuilder.CreateTorus('sink-rim', { diameter: 252, thickness: 22, tessellation: 40 }, scene), at(sink, 16), gold);
        const vt = new BABYLON.DynamicTexture('sink-tex', { width: 256, height: 256 }, scene, true);
        const g = /** @type {CanvasRenderingContext2D} */ (vt.getContext());
        const rg = g.createRadialGradient(128, 128, 6, 128, 128, 128);
        rg.addColorStop(0, '#0d0326'); rg.addColorStop(0.55, '#3a1590'); rg.addColorStop(1, '#6b3cf0');
        g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
        g.lineCap = 'round';
        for (let k = 0; k < 4; k++) {   // спиральные рукава
            g.strokeStyle = k % 2 ? 'rgba(63,240,255,0.85)' : 'rgba(196,92,255,0.8)'; g.lineWidth = 9;
            g.beginPath();
            for (let j = 0; j <= 40; j++) { const u = j / 40, r = 10 + u * 118, f = k * Math.PI / 2 + u * 4.2; const px = 128 + Math.cos(f) * r, py = 128 + Math.sin(f) * r; if (j) g.lineTo(px, py); else g.moveTo(px, py); }
            g.stroke();
        }
        vt.update(true);
        const vm = new BABYLON.StandardMaterial('sink-m', scene);
        vm.emissiveTexture = vt; vm.disableLighting = true; vm.metadata = { toon: false };
        const disc = BABYLON.MeshBuilder.CreateDisc('sink-disc', { radius: 120, tessellation: 40 }, scene);
        disc.position.copyFrom(at(sink, 15.5)); disc.rotation.x = Math.PI / 2; disc.material = vm; disc.isPickable = false;
        World3D.addObject(view, disc, 'prop', { ink: false, outline: false, castShadow: false });
        // Лента низкая, Nav её не видит — по ней можно пройти; яйца на ней — только вид и точки покупки.
        this.conveyor = { x: m.x, y: m.y, a, half, tex, eggs: [], leaving: [], spawnT: 0.5, rareT: GameData.CONVEYOR.rareEvery, busy: 0,
            at, strips, lampMat, flash: 0, sink, sinkTex: vt, sparkle: null };
    },
    // Яйца, которые уже выехали из окна раздатчика (их можно купить).
    conveyorEggs() { return this.conveyor ? this.conveyor.eggs.filter(e => e.shown) : []; },
    // Яйцо снято с ленты (куплено): вид уходит в руки покупателю, метка цены — прочь.
    takeConveyorEgg(e) {
        const c = this.conveyor;
        if (!c) return;
        const i = c.eggs.indexOf(e);
        if (i >= 0) c.eggs.splice(i, 1);
        if (e.label) { UI.labels.remove(e.label); e.label = null; }
    },
    async spawnConveyorEgg(rare) {
        const c = this.conveyor;
        if (!c || typeof Game === 'undefined' || !Game.save) return;
        c.busy++;
        try {
            const zmax = Game.conveyorZone();
            const zone = rare ? zmax : Math.floor(Math.random() * (zmax + 1));
            const egg = this.pickEggType(zone);
            let roll = GameData.roll(egg, rare ? 3 : 1);
            if (rare) { const hi = egg.rolls.filter(r => GameData.RARITY[r.r].order >= 2); if (hi.length && GameData.RARITY[roll.r].order < 2) roll = hi[Math.floor(Math.random() * hi.length)]; }
            const pet = GameData.makePet(egg, roll);
            const view = await PetView.create(pet);
            if (this.conveyor !== c) { view.dispose(); return; }
            const offer = { sp: pet.sp, price: Game.eggPrice(egg, rare), rare: !!rare, x: c.x, y: c.y, h: view.height + 60 };
            // Яйцо рождается внутри будки и выезжает из окна (s < 0 — ещё внутри); метка цены — когда покажется.
            const e = { pet, view, offer, s: -70, x: c.x, y: c.y, label: null, shown: false, t: 0 };
            c.eggs.push(e);
        } finally { c.busy--; }
    },
    // Звук у конвейера тише с расстоянием до игрока.
    _conveyorSfx(name, x, y, vol) {
        const pl = typeof Game !== 'undefined' ? Game.player : null;
        const k = pl ? 1 - Math.hypot(pl.x - x, pl.y - y) / 1500 : 0;
        if (k > 0.05) Sfx.play(name, vol * k, 0.94 + Math.random() * 0.12);
    },
    // Яйцо показалось из окна: выпрыгивает (PetView.pop), лампа мигает, облачко и искры, метка цены.
    _conveyorShow(c, e) {
        e.shown = true;
        e.view.pop = 0;
        c.flash = e.offer.rare ? 1.6 : 1;
        const p = c.at(e.s, 16, 0);
        e.x = p.x; e.y = p.z; e.offer.x = e.x; e.offer.y = e.y;
        e.label = UI.labels.add({ kind: 'offer', offer: e.offer, x: e.x, y: e.y, h: e.offer.h });
        this._conveyorSfx('convIn', e.x, e.y, e.offer.rare ? 0.7 : 0.45);
        const fx = this.app.fx;
        if (!fx) return;
        const ca = Math.cos(c.a), sa = Math.sin(c.a), o = c.at(40, 80, 0);
        fx.create({ position: o, burst: 9, capacity: 10, life: [0.35, 0.7], size: [16, 30], speed: [40, 110], gravity: [0, 40, 0],
            direction: [[ca * 0.6 - 0.5, 0.2, sa * 0.6 - 0.5], [ca + 0.5, 0.9, sa + 0.5]], color: '#ffffff', color2: '#d9f7ff', alpha: 0.7, blend: 'standard', duration: 0.05 });
        fx.create({ position: o, burst: 12, capacity: 14, life: [0.3, 0.7], size: [6, 12], speed: [120, 260], gravity: [0, -500, 0],
            direction: [[ca - 0.6, 0.5, sa - 0.6], [ca + 0.6, 1.4, sa + 0.6]], color: e.offer.rare ? '#ffd23a' : '#3ff0ff', color2: '#ffffff', duration: 0.05 });
        if (e.offer.rare) fx.play('magic', c.at(40, 120, 0));
    },
    // Непроданное яйцо в воронке: срывается с края ленты, кружит по спирали, уходит вниз и пропадает со вспышкой.
    _conveyorLeave(c, e, dt) {
        e.t += dt;
        const m = e.view.mesh, end = c.half * 2, s0 = e.view.scale0, yaw = c.a + Math.PI / 2;
        if (!m) return true;
        let p, h, k = 1;
        if (e.t < 0.3) {
            const u = e.t / 0.3;
            p = c.at(end + 40 * u, 0, 0);
            h = 16 + 26 * Math.sin(u * Math.PI) * (1 - u * 0.4);
            m.rotation.set(-u * 0.9, -yaw, 0);
        } else {
            const u = Math.min(1, (e.t - 0.3) / 0.95), r = (c.sink - end - 40) * Math.pow(1 - u, 1.25), f = Math.PI + u * Math.PI * 3.5;
            p = c.at(c.sink + Math.cos(f) * r, 0, Math.sin(f) * r);
            h = 20 - 12 * u - 70 * u * u * u;
            k = 1 - 0.75 * u * u;
            m.rotation.set(-0.9 - u * 2, -yaw - u * 9, Math.sin(u * 20) * 0.2 * (1 - u));
            if (u >= 1) {
                const q = c.at(c.sink, 30, 0);
                this._conveyorSfx('convOut', q.x, q.z, 0.5);
                if (this.app.fx) {
                    this.app.fx.create({ position: q, burst: 18, capacity: 20, life: [0.4, 0.9], size: [7, 15], speed: [140, 300], gravity: [0, -380, 0],
                        direction: [[-0.5, 1, -0.5], [0.5, 1.6, 0.5]], color: '#c45cff', color2: '#3ff0ff', duration: 0.05 });
                    this.app.fx.create({ position: q, burst: 1, capacity: 2, life: [0.35, 0.4], size: [170, 200], speed: [0, 0], color: '#9a6bff', alpha: 0.6,
                        sizeGradient: [[0, 0.3], [1, 1.2]], duration: 0.05 });
                }
                return true;
            }
        }
        m.position.set(p.x, h, p.z);
        m.scaling.setAll(s0 * k);
        return false;
    },
    updateConveyor(dt) {
        const c = this.conveyor;
        if (!c) return;
        const C = GameData.CONVEYOR;
        c.tex.uOffset = (c.tex.uOffset - dt * C.speed / 256) % 1;
        c.sinkTex.wAng = (c.sinkTex.wAng - dt * 2.4) % (Math.PI * 2);
        // Тихий гул ленты — только рядом с ней.
        const pl = typeof Game !== 'undefined' ? Game.player : null;
        if (!c.hum) c.hum = Sound.loop('assets/sounds/conveyor-loop.ogg', { volume: 0 });
        c.hum.set(pl ? Math.max(0, 0.22 * (1 - Math.hypot(pl.x - c.x, pl.y - c.y) / 1400)) : 0, null);
        // Над воронкой всегда немного искр (одна непрерывная система).
        if (c.sparkle === null && this.app.fx) {
            const q = c.at(c.sink, 20, 0);
            c.sparkle = this.app.fx.create({ position: q, rate: 6, capacity: 12, life: [0.8, 1.4], size: [5, 11], speed: [40, 80], gravity: [0, 20, 0],
                box: [[-80, 0, -80], [80, 0, 80]], direction: [[-0.15, 1, -0.15], [0.15, 1, 0.15]], color: '#3ff0ff', color2: '#c45cff' }) || false;   // нет бюджета — без искр
        }
        c.spawnT -= dt; c.rareT -= dt;
        if (c.spawnT <= 0 && !c.busy) { c.spawnT = C.every; this.spawnConveyorEgg(false); }
        if (c.rareT <= 0 && !c.busy) { c.rareT = C.rareEvery; this.spawnConveyorEgg(true); }
        const end = c.half * 2;
        for (let i = c.eggs.length - 1; i >= 0; i--) {
            const e = c.eggs[i];
            if (!e.view.mesh) { this.takeConveyorEgg(e); continue; }
            e.s += C.speed * dt;
            if (!e.shown && e.s >= -12) this._conveyorShow(c, e);
            if (e.s >= end) { this.takeConveyorEgg(e); e.t = 0; c.leaving.push(e); continue; }
            const p = c.at(e.s, 16, 0);
            e.x = p.x; e.y = p.z;
            e.view.place(e.x, e.y, 16, c.a + Math.PI / 2);
            e.view.idle(dt);
            e.offer.x = e.x; e.offer.y = e.y;
        }
        for (let i = c.leaving.length - 1; i >= 0; i--) {
            const e = c.leaving[i];
            if (this._conveyorLeave(c, e, dt)) { e.view.dispose(); c.leaving.splice(i, 1); }
        }
        // Шторка окна: яйцо отталкивает полосы вперёд по ленте, дальше они качаются и успокаиваются на пружине.
        const st = Math.min(dt, 0.05);
        for (const s of c.strips) {
            let want = 0;
            for (const e of c.eggs) {
                if (e.s < -25 || e.s > 95) continue;
                const f = Math.min(1, (e.s + 25) / 45) * Math.min(1, (95 - e.s) / 35);
                want = Math.max(want, 1.35 * f * Math.max(0, 1 - Math.abs(s.lat) / 115));
            }
            s.vel += ((want - s.ang) * 90 - s.vel * 8) * st;
            s.ang += s.vel * st;
            s.mesh.rotation.z = s.ang;
        }
        c.flash = Math.max(0, c.flash - dt * 2.5);
        const lf = 0.5 + c.flash * 0.9 + 0.08 * Math.sin(this._t * 3);
        c.lampMat.emissiveColor.set(Math.min(1, lf), Math.min(1, lf * 0.8), Math.min(1, lf * 0.25));
    },

    // --- Аккорд: кольцо звуковой волны расходится от игрока ---
    chordWave(x, y, r) {
        const scene = this.app.location.view.scene;
        const ring = BABYLON.MeshBuilder.CreateTorus('chord-wave', { diameter: 2, thickness: 0.08, tessellation: 48 }, scene);
        const m = new BABYLON.StandardMaterial('chord-wave-m', scene);
        m.emissiveColor = new BABYLON.Color3(0.8, 0.45, 1); m.disableLighting = true; m.alpha = 0.85; m.metadata = { toon: false };
        ring.material = m; ring.isPickable = false;
        ring.position.set(x, 60, y);
        let t = 0;
        const obs = scene.onBeforeRenderObservable.add(() => {
            t += scene.getEngine().getDeltaTime() / 1000;
            const k = Math.min(1, t / 0.55);
            ring.scaling.setAll(Math.max(1, r * k));
            m.alpha = 0.85 * (1 - k);
            if (k >= 1) { scene.onBeforeRenderObservable.remove(obs); ring.dispose(); m.dispose(); }
        });
        if (this.app.fx) {
            this.app.fx.create({ position: new BABYLON.Vector3(x, 80, y), burst: 30, capacity: 34, life: [0.4, 0.8], size: [12, 24], speed: [400, 800], gravity: [0, 0, 0], direction: [[-1, 0.05, -1], [1, 0.25, 1]], color: '#c45cff', color2: '#3ff0ff', duration: 0.05 });
        }
    },

    // Ансамбль: над монстрами базы игрока изредка всплывают «ноты» их цвета.
    updateBandNotes(dt) {
        const b = this.bases[0];
        if (!b || !this.app.fx || typeof Game === 'undefined' || !Game.player || Game.state !== 'play') return;
        this._noteT = (this._noteT || 0) - dt;
        if (this._noteT > 0) return;
        this._noteT = 0.5;
        if (Math.hypot(Game.player.x - b.x, Game.player.y - b.y) > 2200 || Game.bandInfo().count < 2) return;
        const list = b.slots.filter((s, i) => i < b.slotCount && s.pet && s.pet.h !== false && s.view);
        const s = list[Math.floor(Math.random() * list.length)];
        if (!s) return;
        const col = (GameData.PETS[s.pet.sp] || GameData.PETS.moxlo).color;
        this.app.fx.create({ position: new BABYLON.Vector3(s.x, s.view.height + 50, s.y), burst: 3, capacity: 4, life: [0.9, 1.4], size: [12, 18], speed: [40, 80], gravity: [0, 60, 0], direction: [[-0.3, 1, -0.3], [0.3, 1, 0.3]], color: col, color2: '#ffffff', duration: 0.05 });
    },

    // Табличка над плитой «Собрать» своей базы: сколько монет накопилось.
    drawBank() {
        const b = this.bases[0];
        if (!b || !b.bankText || typeof Game === 'undefined' || !Game.save) return;
        const txt = GameData.money(Math.floor(Game.save.bank));
        if (txt === b.bankShown) return;
        b.bankShown = txt;
        b.bankText.metadata.redraw((c, w, h) => {
            c.fillStyle = 'rgba(27,18,80,0.88)'; c.beginPath(); c.roundRect(w * 0.06, h * 0.08, w * 0.88, h * 0.84, h * 0.3); c.fill();
            c.lineWidth = 8; c.strokeStyle = '#7b3cff'; c.stroke();
            Gfx.strokeText(c, Lang.t('pad.collect'), w / 2, h * 0.33, Math.round(h * 0.24), '#ffffff', '#1b1250');
            Gfx.strokeText(c, txt, w / 2, h * 0.66, Math.round(h * 0.3), '#ffd23a', '#1b1250');
        });
    },

    // Воронка портала перерождения: светящийся диск-спираль поверх диска модели (часть Portal), крутится.
    buildPortalFx(scene) {
        this._swirl = null;
        const rec = this.app.location.objects.find(r => r.def && /rebirth_portal\.glb$/.test(r.def.model || ''));
        if (!rec || !rec.mesh) return;
        const part = rec.mesh.getChildMeshes(false).find(m => m.metadata && m.metadata.part === 'Portal');
        const a = ((rec.def.rot && rec.def.rot[1]) || 0) * Math.PI / 180;
        let cx = rec.def.x, cy = rec.def.y, ch = 330, r = 170;
        if (part) {
            part.computeWorldMatrix(true);
            const bb = part.getBoundingInfo().boundingBox;
            cx = bb.centerWorld.x; cy = bb.centerWorld.z; ch = bb.centerWorld.y;
            r = Math.max(60, (bb.maximumWorld.y - bb.minimumWorld.y) / 2);
        }
        const tex = new BABYLON.DynamicTexture('portal-swirl', { width: 512, height: 512 }, scene, true);
        tex.hasAlpha = true;
        const c = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        const g = c.createRadialGradient(256, 256, 10, 256, 256, 256);
        g.addColorStop(0, '#fffbe0'); g.addColorStop(0.35, '#ffd23a'); g.addColorStop(0.8, '#ff9a1f'); g.addColorStop(1, 'rgba(255,140,20,0)');
        c.fillStyle = g; c.beginPath(); c.arc(256, 256, 256, 0, Math.PI * 2); c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineCap = 'round';
        for (let k = 0; k < 5; k++) {   // спиральные рукава
            c.lineWidth = 14 - k;
            c.beginPath();
            for (let t = 0; t < 1; t += 0.02) { const ang = k / 5 * Math.PI * 2 + t * 5.5, rr = 20 + t * 220; c.lineTo(256 + Math.cos(ang) * rr, 256 + Math.sin(ang) * rr); }
            c.stroke();
        }
        tex.update(true);
        const disc = BABYLON.MeshBuilder.CreateDisc('portal-swirl', { radius: r * 0.98, tessellation: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        const m = new BABYLON.StandardMaterial('portal-swirl-m', scene);
        m.diffuseTexture = tex; m.useAlphaFromDiffuseTexture = true; m.emissiveColor = new BABYLON.Color3(1, 1, 1); m.disableLighting = true; m.metadata = { toon: false };
        disc.material = m; disc.isPickable = false;
        const pivot = new BABYLON.TransformNode('portal-swirl-pivot', scene);
        pivot.position.set(cx + Math.cos(a) * 6, ch, cy + Math.sin(a) * 6);
        pivot.rotation.y = -a - Math.PI / 2;
        disc.parent = pivot;
        this._swirl = disc;
    },

    // --- Линия Safe Zone: красная полоса, надписи и щиты на полу ---
    buildSafeLine(scene) {
        const m = this.app.location.marker('safezone');
        if (!m) return;
        // Линия идёт по курсу маркера a; n — нормаль к линии, hubSide — с какой стороны хаб.
        const w = (m.scale[0] || 10) * 200, a = ((m.rot && m.rot[1]) || 0) * Math.PI / 180;
        const ax = Math.cos(a), ay = Math.sin(a), nx = -ay, ny = ax;
        const hc = this.hubCenter();
        const hubSide = (hc.x - m.x) * nx + (hc.y - m.y) * ny < 0 ? -1 : 1;
        const strip = BABYLON.MeshBuilder.CreateBox('safe-line', { width: w, height: 4, depth: 22 }, scene);
        strip.position.set(m.x, 2, m.y);
        strip.rotation.y = -a;
        strip.material = Gfx.mat('#ff2424', { emissive: '#7a0000' });
        strip.receiveShadows = true;
        for (let i = 0; i < 2; i++) {
            const p = Gfx.textPlane('safe-text' + i, 520, 110, 1.4, (c, tw, th) => {
                c.fillStyle = 'rgba(0,0,0,0)'; c.fillRect(0, 0, tw, th);
                Gfx.strokeText(c, Lang.t('hud.safeZone'), tw / 2, th / 2, Math.round(th * 0.62), '#ffffff', '#111111');
            });
            p.rotation.x = Math.PI / 2;
            // i=0 читается из хаба, i=1 — со стороны зоны; надпись на стороне −n — поворот 0, на стороне +n — π (проверено в оригинале при a = 0)
            const side = i ? -hubSide : hubSide;
            p.rotation.y = -a + (side > 0 ? Math.PI : 0);
            const along = i ? 520 : -520;
            p.position.set(m.x + ax * along + nx * side * 80, 3, m.y + ay * along + ny * side * 80);
            /** @type {BABYLON.StandardMaterial} */ (p.material).emissiveColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        }
    },

    // --- Вода: плоские прозрачные «детали» Roblox с бегущими бликами ---
    buildPools(scene) {
        if (!this.pools.length) return;
        const tex = new BABYLON.DynamicTexture('water-tex', { width: 256, height: 256 }, scene, true);
        const c = /** @type {CanvasRenderingContext2D} */ (tex.getContext());
        c.fillStyle = '#2f9cff'; c.fillRect(0, 0, 256, 256);
        c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 5;
        for (let i = 0; i < 9; i++) { c.beginPath(); const y = i * 30 + 10; c.moveTo(0, y); c.bezierCurveTo(64, y - 12, 128, y + 12, 256, y); c.stroke(); }
        tex.update(true);
        const mat = new BABYLON.StandardMaterial('water', scene);
        mat.diffuseTexture = tex; mat.alpha = 0.78; mat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6); mat.specularPower = 64;
        mat.emissiveColor = new BABYLON.Color3(0.12, 0.2, 0.32);
        mat.metadata = { toon: false };
        this._waterTex = tex;
        for (const p of this.pools) {
            const plane = BABYLON.MeshBuilder.CreateGround('pool', { width: p.hx * 2, height: p.hy * 2 }, scene);
            plane.position.set(p.x, 7, p.y);
            plane.material = mat;
            plane.isPickable = false;
            tex.uScale = p.hx / 200; tex.vScale = p.hy / 200;
            const bank = BABYLON.MeshBuilder.CreateBox('bank', { width: p.hx * 2 + 30, height: 5, depth: p.hy * 2 + 30 }, scene);
            bank.position.set(p.x, 2, p.y);
            bank.material = Gfx.mat('#e9d38f', { studs: true });
        }
    },

    // --- Шевроны пути к цели (как в видео): пул белых треугольников по земле ---
    buildChevrons(scene) {
        const t = Gfx.chevronTemplate(scene);
        t.material = Gfx.mat('#ffffff', { emissive: '#5a5a5a' });
        t.isVisible = false;
        World3D.addObject(this.app.location.view, t, 'actor', { castShadow: false, ink: false, outline: false });
        this.chevronTpl = t;
        this.chevrons = [];
        for (let i = 0; i < 26; i++) {
            const c = t.createInstance('chev' + i);
            c.isPickable = false;
            c.setEnabled(false);
            this.chevrons.push(c);
        }
        this._chevPath = null;
        this._chevTarget = null;
    },

    // Путь от (x, y) к цели: шевроны через каждые 120 px, бегут вперёд.
    updateChevrons(dt, from, target) {
        this._t += dt;
        if (!target) { for (const c of this.chevrons) c.setEnabled(false); this._chevPath = null; return; }
        this._chevAge = (this._chevAge || 0) + dt;
        const moved = !this._chevFrom || Math.hypot(from.x - this._chevFrom.x, from.y - this._chevFrom.y) > 120;
        if (!this._chevPath || moved || this._chevAge > 1.2 || !this._chevTarget || this._chevTarget.x !== target.x || this._chevTarget.y !== target.y) {
            const way = Nav.path(from.x, from.y, target.x, target.y, 30, { partial: true }) || [{ x: target.x, y: target.y }];
            this._chevPath = [{ x: from.x, y: from.y }].concat(way);
            this._chevFrom = { x: from.x, y: from.y };
            this._chevTarget = { x: target.x, y: target.y };
            this._chevAge = 0;
        }
        const path = this._chevPath;
        const step = 120, off = (this._t * 140) % step;
        let i = 0, seg = 0, acc = -off + 90;
        let ax = path[0].x, ay = path[0].y;
        for (let k = 1; k < path.length && i < this.chevrons.length; k++) {
            const bx = path[k].x, by = path[k].y, len = Math.hypot(bx - ax, by - ay);
            const hd = Math.atan2(by - ay, bx - ax);
            while (acc <= len && i < this.chevrons.length) {
                if (acc >= 0) {
                    const t = acc / Math.max(1, len), x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
                    const c = this.chevrons[i++];
                    c.setEnabled(true);
                    c.position.set(x, this.ground(x, y) + 8, y);
                    c.rotation.y = -hd;
                    const fade = Math.min(1, (path.length - k) * 0.5 + (len - acc) / 300);
                    c.scaling.setAll(0.75 + 0.25 * Math.min(1, fade));
                }
                acc += step;
            }
            acc -= len; seg++;
            ax = bx; ay = by;
        }
        for (; i < this.chevrons.length; i++) this.chevrons[i].setEnabled(false);
    },

    // --- Табло Titanic Egg на мосту ---
    buildTitanicSign(scene) {
        const m = this.app.location.marker('titanic-sign');
        if (!m) return;
        // rot[1] маркера — курс вдоль балки; надписи — с обеих сторон по нормали n.
        const a = ((m.rot && m.rot[1]) || 0) * Math.PI / 180, nx = -Math.sin(a), ny = Math.cos(a);
        // Меши балки-табло (для полупрозрачности, когда закрывает игрока).
        const rec = this.app.location.objects.find(r => r.def && /bridge_sign\.glb$/.test(r.def.model || ''));
        this._bridgeMeshes = rec && rec.mesh ? [rec.mesh].concat(rec.mesh.getChildMeshes(false)) : [];
        let half = 1100;
        if (rec && rec.mesh) { const bb = rec.mesh.getHierarchyBoundingVectors(true); half = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) / 2 + 60; }
        this._bridge = { x: m.x, y: m.y, a, half, h0: m.h - 150 };
        this._bridgeA = 1;
        this.titanicSigns = [];
        for (let i = 0; i < 2; i++) {
            const p = Gfx.textPlane('titanic-sign' + i, 960, 220, 1, () => {});
            const s = i ? 1 : -1;
            p.position.set(m.x + nx * s * 76, m.h, m.y + ny * s * 76);
            p.rotation.y = -a + (i ? -Math.PI : 0);   // лицом наружу с обеих сторон балки (при a = 0 — 0 и π, проверено в оригинале)
            /** @type {BABYLON.StandardMaterial} */ (p.material).emissiveColor = new BABYLON.Color3(0.85, 0.85, 0.85);
            this.titanicSigns.push(p);
        }
        this._signSec = -1;
    },

    drawTitanicSign() {
        if (!this.titanicSigns) return;
        const sec = this.titanic ? -2 : Math.max(0, Math.ceil(this.titanicTimer));
        if (sec === this._signSec) return;
        this._signSec = sec;
        const cols = ['#ff3b3b', '#ff8a1f', '#ffe14a', '#3bdc5a', '#3b8bff', '#a54dff'];
        const text = this.titanic ? Lang.t('titanic.active') : Lang.t('titanic.in', { t: UI.clock(sec) });
        for (const p of this.titanicSigns) p.metadata.redraw((c, w, h) => {
            const title = '??? ' + Lang.t('titanic.name');
            let fs = Math.round(h * 0.34);
            c.font = '900 ' + fs + 'px Nunito, sans-serif';
            let tw = c.measureText(title).width;
            if (tw > w * 0.92) { fs = Math.floor(fs * w * 0.92 / tw); c.font = '900 ' + fs + 'px Nunito, sans-serif'; tw = c.measureText(title).width; }
            let x = (w - tw) / 2;
            c.textBaseline = 'middle'; c.textAlign = 'left'; c.lineWidth = 9; c.lineJoin = 'round';
            for (let i = 0; i < title.length; i++) {
                const ch = title[i];
                c.strokeStyle = '#111'; c.strokeText(ch, x, h * 0.36);
                c.fillStyle = cols[i % cols.length]; c.fillText(ch, x, h * 0.36);
                x += c.measureText(ch).width;
            }
            Gfx.strokeText(c, text, w / 2, h * 0.76, Math.round(h * 0.2), '#ffffff', '#111111');
        });
    },

    setBridgeFade(target, dt) {
        if (!this._bridgeMeshes) return;
        const a = this._bridgeA + (target - this._bridgeA) * Math.min(1, dt * 8);
        if (Math.abs(a - this._bridgeA) < 0.004 && Math.abs(a - target) < 0.01) return;
        this._bridgeA = a;
        for (const m of this._bridgeMeshes) m.visibility = a;
        // Надписи гаснут целиком: у камеры буквы табло во весь экран даже полупрозрачными.
        const ta = Math.max(0, (a - 0.25) / 0.75);
        for (const p of this.titanicSigns || []) p.visibility = ta;
    },

    // --- Табло лидеров (Top Money / Top Speed / Top Playtime) ---
    buildLeaderboards(scene) {
        this.boards = [];
        const kinds = ['money', 'speed', 'time'];
        this.app.location.markers('leaderboard').sort((a, b) => a.x - b.x).forEach((m, i) => {
            const p = Gfx.textPlane('lb' + i, 380, 440, 1, () => {});
            const a = (m.rot[1] || 0) * Math.PI / 180;
            p.position.set(m.x + Math.cos(a) * 34, 300, m.y + Math.sin(a) * 34);
            p.rotation.y = -a - Math.PI / 2;   // лицом в сторону, куда смотрит табло (проверено: плоскость видна с −Z при повороте 0)
            /** @type {BABYLON.StandardMaterial} */ (p.material).emissiveColor = new BABYLON.Color3(0.95, 0.95, 0.95);
            this.boards.push({ plane: p, kind: kinds[i % 3] });
        });
    },

    drawLeaderboards(rows) {
        if (!this.boards) return;
        const titles = { money: Lang.t('lb.money'), speed: Lang.t('lb.speed'), time: Lang.t('lb.time') };
        const colors = { money: '#3bdc5a', speed: '#3b8bff', time: '#ff5fa2' };
        for (const b of this.boards) {
            const list = rows[b.kind] || [];
            b.plane.metadata.redraw((c, w, h) => {
                c.fillStyle = 'rgba(14,20,36,0.92)'; c.beginPath(); c.roundRect(0, 0, w, h, 18); c.fill();
                c.fillStyle = colors[b.kind]; c.beginPath(); c.roundRect(0, 0, w, 64, [18, 18, 0, 0]); c.fill();
                Gfx.strokeText(c, titles[b.kind], w / 2, 34, 30, '#ffffff', '#111111');
                list.slice(0, 8).forEach((r, i) => {
                    const y = 96 + i * 42;
                    c.fillStyle = r.me ? 'rgba(255,230,80,0.22)' : (i % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)');
                    c.fillRect(10, y - 18, w - 20, 38);
                    c.font = '900 22px Nunito, sans-serif'; c.textBaseline = 'middle';
                    c.textAlign = 'left'; c.fillStyle = i < 3 ? ['#ffd23a', '#d6dbe0', '#e0a060'][i] : '#ffffff';
                    c.fillText('#' + (i + 1), 18, y);
                    c.fillStyle = '#ffffff'; c.font = '800 20px Nunito, sans-serif';
                    c.fillText(UI.clip(r.name, 15), 70, y);
                    c.textAlign = 'right'; c.fillStyle = colors[b.kind]; c.font = '900 21px Nunito, sans-serif';
                    c.fillText(r.value, w - 18, y);
                });
            });
        }
    },

    // --- Кадр мира ---
    update(dt) {
        this._t += dt;
        Models.update(dt);
        if (this._waterTex) this._waterTex.vOffset = (this._waterTex.vOffset + dt * 0.05) % 1;
        // Яйца: появление, тряска от ударов, респавн.
        for (const s of this.spots) {
            if (!s.egg && s.zone >= 0) {
                const ts = this.titanic && this._titanicSpot;
                if (ts && Math.hypot(s.x - ts.x, s.y - ts.y) < ts.r) continue;   // место Титана
                s.timer -= dt;
                if (s.timer <= 0) { s.timer = 99; this.spawnEgg(s); }
            }
        }
        const eggs = this.spots.map(s => s.egg).concat(this.titanic ? [this.titanic] : []);
        for (const e of eggs) {
            if (!e || !e.mesh) continue;
            e.pop = Math.min(1, (e.pop || 0) + dt * 3);
            const pk = e.pop < 1 ? 1 + Math.sin(e.pop * Math.PI) * 0.25 : 1;
            e.shake = Math.max(0, e.shake - dt * 5);
            const sh = e.shake;
            const sq = 1 + sh * 0.12 * Math.sin(this._t * 60);
            e.mesh.scaling.set(e.baseScale * pk * (2 - sq), e.baseScale * pk * sq, e.baseScale * pk * (2 - sq));
            e.mesh.rotation.z = sh * 0.08 * Math.sin(this._t * 47);
        }
        // Упавшие питомцы: таймер.
        for (let i = this.dropped.length - 1; i >= 0; i--) {
            const d = this.dropped[i];
            d.t -= dt;
            d.view.idle(dt);
            if (d.t <= 0) { this.app.fx && this.app.fx.play('magic', new BABYLON.Vector3(d.x, 60, d.y)); this.removeDropped(d); }
        }
        // Монстры и яйца в гнёздах: яйцо раскачивается и вылупляется.
        for (const b of this.bases) {
            for (const s of b.slots) {
                if (!s.view) continue;
                if (s.hatchT > 0 && s.pet && s.pet.h === false) {
                    s.hatchT -= dt;
                    const k = 1 - Math.max(0, s.hatchT) / GameData.HATCH_SEC;
                    const m = s.view.mesh;
                    if (m) { m.rotation.z = Math.sin(this._t * (14 + k * 26)) * (0.05 + k * 0.22); m.position.y = s.view.h + Math.max(0, Math.sin(this._t * 9)) * k * 10; }
                    if (s.hatchT <= 0) { s.hatchT = 0; this.hatchSlot(b, s); }
                } else s.view.idle(dt);
            }
            if (b.belt) b.belt.position.x = 12.5 - ((this._t * (b.running ? 140 : 25)) % 25);   // лента едет к хвосту дорожки
            if (b.padCoin) { b.padCoin.rotation.y = this._t * 1.6; b.padCoin.position.y = 16 + Math.sin(this._t * 3) * 3; }
            if (b.shieldBtn && b.owner && b.owner.isPlayer && typeof Game !== 'undefined') {
                const on = Game.shieldLeft() > 0, ready = Game.shieldCooldown() <= 0;
                const k = on ? 0.5 + 0.5 * Math.sin(this._t * 6) : ready ? 0.6 : 0.1;
                /** @type {BABYLON.StandardMaterial} */ (b.shieldBtn.material).emissiveColor.set(0.05 * k, 0.45 * k, 1.0 * k);
                if (b.shieldDoor && on) /** @type {BABYLON.StandardMaterial} */ (b.shieldDoor.material).alpha = 0.3 + 0.12 * Math.sin(this._t * 5);
            }
        }
        this.drawBank();
        this.updateConveyor(dt);
        this.updateBandNotes(dt);
        if (this._swirl) { this._swirl.rotation.z = this._t * 1.4; const p = 1 + Math.sin(this._t * 2.5) * 0.04; this._swirl.scaling.set(p, p, 1); }
        // Titanic Egg.
        if (!this.titanic) {
            this.titanicTimer -= dt;
            if (this.titanicTimer <= 0) {
                this.titanicTimer = GameData.TITANIC_EVERY_SEC;
                if (typeof Game !== 'undefined') Game.onTitanic();
            }
        }
        this.drawTitanicSign();
        for (const g of this.guardians) g.update(dt);
        const pl = typeof Game !== 'undefined' ? Game.player : null;
        for (const n of this.npcs || []) n.update(dt, pl);
    },
};

// Вид монстра (спрайт) или его яйца (pet.h === false, 3D) в мире: покачивание в такт, подпись.
class PetView {
    static async create(pet) {
        const r = await Models.pet(pet);
        return new PetView(pet, r);
    }
    constructor(pet, r) {
        this.pet = pet;
        this.mesh = r.mesh;
        this.height = r.height;
        this.egg = pet.h === false;
        this.scale0 = r.mesh.scaling.x;
        this.pop = 1;   // 0 — только что вылупился: выпрыгивает с отскоком
        this.t = Math.random() * 10;
        this.x = 0; this.y = 0; this.h = 0; this.heading = 0;
        this.label = null;
        /** @type {{ x: number, y: number } | null} */
        this.home = null;
    }
    place(x, y, h, heading) {
        this.x = x; this.y = y; this.h = h || 0; this.heading = heading || 0;
        this.mesh.position.set(x, this.h, y);
        this.mesh.rotation.y = -this.heading;
    }
    idle(dt) {
        this.t += dt;
        const m = this.mesh;
        if (!m) return;
        let k = 1;
        if (this.pop < 1) { this.pop = Math.min(1, this.pop + dt * 2.2); k = 1 + Math.sin(this.pop * Math.PI * 2.5) * 0.3 * (1 - this.pop) - 0.6 * Math.pow(1 - this.pop, 3); }
        if (this.egg) {
            m.position.set(this.x, this.h, this.y);
            m.rotation.z = Math.sin(this.t * 1.7) * 0.05;
            m.scaling.setAll(this.scale0 * k);
            return;
        }
        // Монстры пританцовывают в общий такт (120 ударов в минуту): подскок и сжатие на долю.
        const beat = (performance.now() / 1000) * 2 + (this.t % 1) * 0.15;
        const ph = beat % 1, bounce = Math.sin(ph * Math.PI);
        const sq = 1 + (ph < 0.15 ? -0.07 : 0.035 * bounce);
        m.position.set(this.x, this.h + bounce * 7, this.y);
        m.rotation.y = -this.heading + Math.sin(this.t * 0.7) * 0.25;
        m.rotation.z = Math.sin(beat * Math.PI) * 0.05;
        m.scaling.set(this.scale0 * k / Math.sqrt(sq), this.scale0 * k * sq, this.scale0 * k / Math.sqrt(sq));
    }
    showLabel(on, dropped) {
        if (on && !this.label) this.label = UI.labels.add({ kind: dropped ? 'dropped' : 'pet', pet: this.pet, drop: dropped || null, view: this, x: this.x, y: this.y, h: this.height + 40 });
        else if (!on && this.label) { UI.labels.remove(this.label); this.label = null; }
    }
    dispose() {
        this.showLabel(false);
        if (this.mesh) this.mesh.dispose();
        this.mesh = null;
    }
}
