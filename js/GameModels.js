// GameModels.js — модели игры: монстры-спрайты (MonsterViews из GameMonsters.js), шаблоны 3D-яиц монстров
// и гнёзд (GLB -> один нормализованный меш), копии — инстансы: один draw call на вид; мутации (золото, алмаз,
// радуга), стражи — гигантские монстры (MonsterRig). Низ модели на земле, центр по X/Z в 0, лицом вдоль +X.

/** @satisfies {Record<string, any>} */
const Models = {
    /** @type {View3D | null} */
    view: null,
    /** @type {Map<string, Promise<any>>} */
    _tpl: new Map(),
    /** @type {BABYLON.StandardMaterial[]} */
    _rainbow: [],
    _t: 0,

    init(view) {
        this.view = view;
        this._tpl = new Map();
        this._rainbow = [];
    },

    // Объединить части модели в один меш, повернуть носом в +X, низ на 0, центр в 0, высота -> size.
    // fit 'visual' — size задаёт видимый размер: большее из высоты и 0.75 ширины/глубины (низкие широкие
    // монстры не вырастают вдвое шире высоких).
    _normalize(root, size, yawDeg, name, fit) {
        const scene = this.view.scene;
        const kids = root.getChildMeshes(false).filter(m => m.getTotalVertices() > 0);
        let mesh;
        if (!kids.length) {
            mesh = BABYLON.MeshBuilder.CreateBox(name, { size: size * 0.8 }, scene);
            mesh.position.y = size * 0.4;
            mesh.material = Gfx.mat('#ff00ff');
            mesh.bakeCurrentTransformIntoVertices();
        } else {
            for (const k of kids) { k.computeWorldMatrix(true); k.bakeCurrentTransformIntoVertices(); k.parent = null; }
            const mats = new Set(kids.map(k => k.material));
            mesh = kids.length === 1 ? kids[0] : BABYLON.Mesh.MergeMeshes(kids, true, true, undefined, false, mats.size > 1);
        }
        root.dispose(false, false);
        mesh.name = name;
        if (yawDeg) mesh.bakeTransformIntoVertices(BABYLON.Matrix.RotationY(-yawDeg * Math.PI / 180));
        mesh.refreshBoundingInfo();
        const bb = mesh.getBoundingInfo().boundingBox;
        const h = Math.max(1, bb.maximum.y - bb.minimum.y);
        const ext = fit === 'visual' ? Math.max(h, 0.75 * Math.max(bb.maximum.x - bb.minimum.x, bb.maximum.z - bb.minimum.z)) : h;
        const k = size / ext;
        const cx = (bb.maximum.x + bb.minimum.x) / 2, cz = (bb.maximum.z + bb.minimum.z) / 2;
        mesh.bakeTransformIntoVertices(BABYLON.Matrix.Translation(-cx, -bb.minimum.y, -cz).multiply(BABYLON.Matrix.Scaling(k, k, k)));
        mesh.refreshBoundingInfo();
        mesh.isPickable = false;
        mesh.alwaysSelectAsActiveMesh = false;
        const bb2 = mesh.getBoundingInfo().boundingBox;
        return { mesh, height: h * k, width: bb2.maximum.x - bb2.minimum.x, depth: bb2.maximum.z - bb2.minimum.z };
    },

    // Шаблон (скрытый меш-источник инстансов). key уникален на модель + вариант. fit — см. _normalize.
    template(key, url, size, yaw, mut, fit) {
        let p = this._tpl.get(key);
        if (p) return p;
        p = (async () => {
            let model = null;
            try { model = await Model3D.load(url); } catch (e) { console.warn('Models: нет модели ' + url, e && e.message); }
            const scene = this.view.scene;
            const root = model ? Model3D.build(model, scene, { name: key }) : new BABYLON.Mesh(key, scene);
            const t = this._normalize(root, size, yaw, key, fit);
            const mesh = t.mesh;
            if (mut && mut !== 'normal') this._tintMesh(mesh, mut);
            World3D.addObject(this.view, mesh, 'actor', { castShadow: false, ink: false, outline: false });
            mesh.setEnabled(true);
            mesh.isVisible = false;   // источник инстансов не рисуется сам
            return t;
        })();
        this._tpl.set(key, p);
        return p;
    },

    // Мутация: свой материал (клон) с оттенком; радуга — переливается в update().
    _tintMesh(mesh, mut) {
        const mu = GameData.mutation(mut);
        const list = mesh.material && mesh.material.subMaterials ? mesh.material.subMaterials : [mesh.material];
        const clones = list.map(m => {
            if (!m) return m;
            const c = /** @type {BABYLON.StandardMaterial} */ (m.clone(m.name + '-' + mut));
            c.metadata = Object.assign({}, m.metadata);
            if (Array.isArray(mu.tint)) {
                c.diffuseColor = new BABYLON.Color3(mu.tint[0], mu.tint[1], mu.tint[2]);
                c.emissiveColor = new BABYLON.Color3(mu.tint[0] * 0.18, mu.tint[1] * 0.18, mu.tint[2] * 0.18);
                c.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
                c.specularPower = 18;
            } else {
                this._rainbow.push(c);
            }
            return c;
        });
        if (mesh.material && mesh.material.subMaterials) {
            const mm = new BABYLON.MultiMaterial(mesh.name + '-mm', mesh.getScene());
            mm.subMaterials = clones; mesh.material = mm;
        } else mesh.material = clones[0];
    },

    update(dt) {
        this._t += dt;
        if (this._rainbow.length) {
            const c = BABYLON.Color3.FromHSV((this._t * 90) % 360, 0.75, 1);
            for (const m of this._rainbow) { m.diffuseColor = c; m.emissiveColor = c.scale(0.25); }
        }
    },

    // Шаблон яйца монстра: процедурная модель высотой size (без примет сверху).
    eggTemplate(id, size) {
        const key = 'egg-' + id;
        let p = this._tpl.get(key);
        if (p) return p;
        p = (async () => {
            const mesh = Monsters.buildEgg(this.view.scene, id);
            mesh.bakeTransformIntoVertices(BABYLON.Matrix.Scaling(size, size, size));
            mesh.refreshBoundingInfo();
            World3D.addObject(this.view, mesh, 'actor', { castShadow: false, ink: false, outline: false });
            mesh.isVisible = false;   // источник инстансов не рисуется сам
            const bb = mesh.getBoundingInfo().boundingBox;
            return { mesh, height: size, width: bb.maximum.x - bb.minimum.x, depth: bb.maximum.z - bb.minimum.z };
        })();
        this._tpl.set(key, p);
        return p;
    },
    async eggInstance(id, size) {
        const t = await this.eggTemplate(id, size);
        const inst = t.mesh.createInstance('egg-' + id + '-i');
        inst.isPickable = false;
        this.view.addShadowCaster(inst, false);
        return { mesh: inst, height: t.height, width: t.width, depth: t.depth };
    },

    // Инстанс шаблона в мир. Возвращает InstancedMesh (позицию и масштаб ставит игра).
    async instance(key, url, size, yaw, mut, fit) {
        const t = await this.template(key, url, size, yaw, mut, fit);
        const inst = t.mesh.createInstance(key + '-i');
        inst.isPickable = false;
        this.view.addShadowCaster(inst, false);
        return { mesh: inst, height: t.height, width: t.width, depth: t.depth };
    },

    // Есть ли 3D-модель монстра (GLB из Blender). Ответ кэшируется: Model3D.load сам хранит загруженное.
    /** @type {Map<string, Promise<boolean>>} */
    _has3d: new Map(),
    has3d(sp) {
        const d = GameData.PETS[sp];
        if (!d || !d.model) return Promise.resolve(false);
        let p = this._has3d.get(sp);
        if (!p) { p = Model3D.load(d.model).then(() => true, () => false); this._has3d.set(sp, p); }
        return p;
    },

    // --- Монстры (pet.h === false — ещё яйцо): 3D-модель (мутация — свой материал), нет модели — спрайт из арта ---
    PET_SIZE: 150,     // спрайт: px мира на MonsterViews.ART_PX px рисунка при весе = средний вес вида
    PET_SIZE_3D: 140,  // 3D: высота модели в px при весе = средний вес вида
    petScale(pet) {
        const sp = GameData.PETS[pet.sp];
        const k = sp ? pet.kg / sp.kg : 1;
        const base = pet.r === 'secret' ? 1.6 : 1;
        return base * Math.max(0.75, Math.min(1.7, 0.65 + 0.4 * k));
    },
    async pet(pet) {
        const sp = GameData.PETS[pet.sp] || GameData.PETS.moxlo;
        if (pet.h === false) {
            const r = await this.eggInstance(sp.build, this.EGG_SIZE);
            const s = pet.r === 'secret' ? 1.35 : 1;
            r.mesh.scaling.set(s, s, s);
            r.height *= s;
            return r;
        }
        const mut = pet.mut || 'normal', s = this.petScale(pet);
        if (await this.has3d(sp.id)) {
            const r = await this.instance('mon3d-' + sp.id + '-' + mut, sp.model, this.PET_SIZE_3D, 0, mut, 'visual');
            r.mesh.scaling.set(s, s, s);
            r.height *= s;
            return r;
        }
        const v = MonsterViews.create(this.view.scene, sp.id, mut, this.PET_SIZE);
        v.root.scaling.set(s, s, s);
        return { mesh: v.root, height: v.height * s, width: v.width * s, depth: 0 };
    },

    // --- Яйца в зонах и гнёзда ---
    EGG_SIZE: 112,
    async egg(eggType, scale) {
        const r = await this.eggInstance(eggType.sp, this.EGG_SIZE);
        const s = scale || 1;
        r.mesh.scaling.set(s, s, s);
        r.height *= s;
        return r;
    },
    async nest(scale) {
        const r = await this.instance('nest', 'assets/models/eggs/nest.glb', 36, 0, 'normal');
        const s = scale || 1;
        r.mesh.scaling.set(s, s, s);
        return r;
    },

    // --- Стражи: гигантские монстры (MonsterRig: прыжки, приплющивание, наклон, рывок-удар); 3D, нет модели — спрайт ---
    async guardian(g) {
        try {
            const scene = this.view.scene;
            if (await this.has3d(g.build)) {
                const r = await this.instance('mon3d-' + g.build + '-normal', GameData.PETS[g.build].model, this.PET_SIZE_3D, 0, 'normal', 'visual');
                const root = new BABYLON.TransformNode('guard-' + g.id, scene);
                const k = g.size / this.PET_SIZE_3D;
                r.mesh.parent = root; r.mesh.scaling.set(k, k, k);
                return new MonsterRig(root, r.mesh, g.size);
            }
            const v = MonsterViews.create(scene, g.build, 'normal', g.size);
            v.root.name = 'guard-' + g.id;
            return new MonsterRig(v.root, /** @type {BABYLON.TransformNode} */ (v.root.getChildren()[0]), g.size);
        } catch (e) {
            console.warn('Models: страж не собрался ' + g.id, e && e.message);
            return null;
        }
    },
};
