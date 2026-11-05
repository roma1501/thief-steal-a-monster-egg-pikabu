// GameActors.js — персонажи: Actor (игрок и боты-нубы: движение, прыжок, удары, переноска яйца
// или монстра, оглушение), Guardian (страж зоны — гигантский монстр: бродит, гонится за несущим,
// бьёт), BotBrain (ИИ ботов: яйца, доставка, воровство, защита базы; щит базы игрока их не пускает).
// Позиция и высота — логика (Nav), меши — вид.

class Actor {
    constructor(opts) {
        const scene = World.app.location.view.scene;
        this.id = opts.id;
        this.name = opts.name;
        this.isPlayer = !!opts.isPlayer;
        /** @type {Base} */
        this.base = opts.base;
        this.x = opts.x; this.y = opts.y; this.h = 0; this.vh = 0;
        this.heading = opts.heading || 0;
        this.vx = 0; this.vy = 0; this.kx = 0; this.ky = 0;
        this.r = 30;
        this.speedStat = opts.speed || GameData.BASE_SPEED;
        this.pick = opts.pick || 0;
        this.tool = 'pickaxe';
        this.swingT = -1;
        this.swingDone = false;
        this.stun = 0;
        this.fall = 0;
        this.moving = 0;
        this.invuln = 0;
        /** @type {any} */
        this.carry = null;
        /** @type {BotBrain | null} */
        this.brain = null;
        this.gh = 0;
        this.carryT = 0;
        this.forceRun = 0;   // бег на месте (беговая дорожка)
        this.boost = 1;
        this.stepT = 0;
        this.noob = new Noob(scene, opts.look || {}, { name: 'noob-' + this.id });
        World3D.addObject(World.app.location.view, this.noob.root, 'actor', { ink: false, outline: false });
        this.noob.setTool('pickaxe', this.pick);
        this.label = this.isPlayer ? null : UI.labels.add({ kind: 'name', actor: this, h: 240 });
        this.sync();
    }

    get grounded() { return this.h <= 0.5; }

    // Скорость в px/с: стат × стад, минус ноша, плюс бусты; вода замедляет.
    speedPx() {
        let s = this.speedStat * GameData.STUD * this.boost;
        if (this.carry) s *= 1 - Math.min(GameData.CARRY_SLOW_MAX, this.carry.pet.kg * GameData.CARRY_SLOW);
        if (World.inPool(this.x, this.y)) s *= 0.6;
        return s;
    }

    setTool(kind) {
        if (this.carry) return;
        this.tool = kind;
        this.noob.setTool(kind, this.pick);
    }
    setPick(tier) { this.pick = tier; if (this.tool === 'pickaxe' && !this.carry) this.noob.setTool('pickaxe', tier, true); }

    // Ввод: dirX, dirY — желаемое направление (длина 0..1), jump, attack (держит удар).
    step(dt, dirX, dirY, jump, attack) {
        this.invuln = Math.max(0, this.invuln - dt);
        this.carryT += dt;
        if (this.stun > 0) {
            this.stun -= dt;
            this.fall = Math.min(1, this.fall + dt * 6);
            dirX = 0; dirY = 0; jump = false; attack = false;
        } else this.fall = Math.max(0, this.fall - dt * 4);
        const len = Math.hypot(dirX, dirY);
        const sp = this.speedPx();
        const tvx = len > 0.01 ? dirX * sp : 0, tvy = len > 0.01 ? dirY * sp : 0;
        const acc = Math.min(1, dt * 14);
        this.vx += (tvx - this.vx) * acc; this.vy += (tvy - this.vy) * acc;
        if (len > 0.05) {
            const want = Math.atan2(dirY, dirX);
            let d = want - this.heading; d = Math.atan2(Math.sin(d), Math.cos(d));
            this.heading += d * Math.min(1, dt * 16);
        }
        // Отброс от ударов.
        const kd = Math.pow(0.02, dt);
        const mx = (this.vx + this.kx) * dt, my = (this.vy + this.ky) * dt;
        this.kx *= kd; this.ky *= kd;
        if (Math.abs(mx) + Math.abs(my) > 0.01) {
            const p = Nav.move(this.x, this.y, mx, my, this.r);
            this.x = p.x; this.y = p.y;
        }
        // Прыжок и гравитация.
        if (jump && this.grounded && this.stun <= 0) { this.vh = 1050; if (this.isPlayer) Sfx.play('jump', 0.5); }
        if (!this.grounded || this.vh > 0) {
            this.vh -= 3000 * dt;
            this.h = Math.max(0, this.h + this.vh * dt);
            if (this.h <= 0) this.vh = 0;
        }
        this.moving = Math.min(1, Math.hypot(this.vx, this.vy) / Math.max(200, GameData.BASE_SPEED * GameData.STUD));
        // Удар.
        if (this.swingT >= 0) {
            this.swingT += dt * GameData.SWING_RATE;
            if (!this.swingDone && this.swingT >= 0.45) { this.swingDone = true; Game.onSwingHit(this); }
            if (this.swingT >= 1) this.swingT = -1;
        }
        if (attack && this.swingT < 0 && !this.carry && this.stun <= 0) this.startSwing();
        // Вода: всплеск на входе.
        const wet = World.inPool(this.x, this.y);
        if (wet && !this._wet && this.isPlayer) { Sfx.play('splash', 0.5); if (World.app.fx) World.app.fx.create({ position: new BABYLON.Vector3(this.x, 12, this.y), burst: 18, capacity: 20, life: [0.3, 0.7], size: [6, 12], speed: [120, 260], gravity: [0, -900, 0], direction: [[-0.6, 1, -0.6], [0.6, 1.4, 0.6]], color: '#bfe9ff', color2: '#ffffff', blend: 'standard', duration: 0.05 }); }
        this._wet = wet;
        // Шаги.
        if (this.isPlayer && this.grounded && this.moving > 0.3 && !wet) {
            this.stepT -= dt * (1 + this.moving * 2);
            if (this.stepT <= 0) { this.stepT = 0.42; Sfx.play('step', 0.18, 0.9 + Math.random() * 0.2); }
        }
        this.sync(dt);
    }

    startSwing() {
        this.swingT = 0;
        this.swingDone = false;
        if (this.isPlayer) Sfx.play('swing', 0.35, 0.9 + Math.random() * 0.25);
    }

    // Меши по логике.
    sync(dt) {
        const g = World.ground(this.x, this.y);
        this.gh = g;
        const n = this.noob;
        n.root.position.set(this.x, g + this.h, this.y);
        n.root.rotation.y = -this.heading;
        n.animate(dt || 0, { moving: Math.max(this.moving, this.forceRun), air: !this.grounded, swing: this.swingT >= 0 ? this.swingT : -1, carry: !!this.carry, fall: this.fall });
        if (this.carry && this.carry.view && this.carry.view.mesh) {
            const v = this.carry.view;
            const bob = Math.sin(performance.now() / 160) * 4 * this.moving;
            // Яйцо — в руках над головой, монстр сидит на голове (как в референсах).
            v.mesh.position.set(this.x, g + this.h + (v.egg ? 214 : 222) + bob, this.y);
            v.mesh.rotation.y = -this.heading;
            v.x = this.x; v.y = this.y;
        }
    }

    // Взять питомца на руки.
    takeCarry(pet, view, info) {
        this.carry = Object.assign({ pet, view, stolenFrom: null, slot: -1, zone: World.zoneAt(this.x, this.y) }, info || {});
        this.carryT = 0;   // фора: страж реагирует не сразу
        view.showLabel(false);
        this.swingT = -1;
        this.noob.setTool(null, 0);
    }
    // Отдать ношу (вернуть объект ноши), руки — снова к инструменту.
    releaseCarry() {
        const c = this.carry;
        this.carry = null;
        this.noob.setTool(this.tool, this.pick, true);
        return c;
    }

    knock(fromX, fromY, power, stunSec) {
        if (this.invuln > 0) return false;
        const dx = this.x - fromX, dy = this.y - fromY, d = Math.max(1, Math.hypot(dx, dy));
        this.kx += dx / d * power; this.ky += dy / d * power;
        this.stun = Math.max(this.stun, stunSec);
        this.vh = 500;
        this.h = Math.max(this.h, 1);
        this.invuln = stunSec + 0.8;
        this.swingT = -1;
        return true;
    }

    dispose() {
        UI.labels.remove(this.label);
        this.noob.dispose();
    }
}

class Guardian {
    constructor(world, zone, marker) {
        this.world = world;
        this.zone = zone;
        this.def = GameData.GUARDIANS[zone] || GameData.GUARDIANS[0];
        this.homeX = marker.x; this.homeY = marker.y;
        this.x = marker.x; this.y = marker.y;
        this.heading = ((marker.rot && marker.rot[1]) || 90) * Math.PI / 180;
        this.state = 'roam';
        /** @type {Actor | null} */
        this.target = null;
        this.goal = null;
        this.wait = 1 + Math.random() * 2;
        this.attackCd = 0;
        this.rig = null;
        this.mesh = null;
        this.r = 70;
        this.anim = '';
        this.roarCd = 0;
        this.stunT = 0;   // оглушение аккордом, с
        this._walkSpeed = 300;
    }

    get z() { return this.world.zones[this.zone]; }
    speed() { return GameData.zoneOf(this.zone).guard * GameData.STUD; }

    async load() {
        this.rig = await Models.guardian(this.def);
        if (!this.rig) {
            // Нет модели — простая фигура (игра не падает).
            const s = this.def.size;
            const m = BABYLON.MeshBuilder.CreateBox('guard', { width: s * 0.9, height: s, depth: s * 0.7 }, World.app.location.view.scene);
            m.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, s / 2, 0));
            m.material = Gfx.mat(GameData.zoneOf(this.zone).color);
            World3D.addObject(World.app.location.view, m, 'actor', { ink: false, outline: false });
            this.mesh = m;
        } else this.mesh = this.rig.root;
        this.label = UI.labels.add({ kind: 'guard', guard: this, h: this.def.size + 70 });
        this.play('idle');
        this.sync();
    }

    // Клип; бег и шаг — со скоростью под фактическую скорость стража (ноги не скользят).
    play(name, opts) {
        if (!this.rig) return;
        if (opts) { this.rig.play(name, opts); return; }
        const k = 1;   // у MonsterRig run/walk — px/с на один цикл прыжков
        let speed = 1;
        if (name === 'run') speed = Math.max(0.6, Math.min(3, this.speed() / ((this.def.run || 700) * k)));
        else if (name === 'walk') speed = Math.max(0.5, Math.min(3, this._walkSpeed / ((this.def.walk || 160) * k)));
        this.anim = name;
        this.rig.play(name, { speed });
    }

    inZone(x, y) { return this.world.inZoneRect(this.zone, x, y, 60); }

    // Цель погони: несущий питомца внутри зоны стража (ближайший).
    pickTarget() {
        let best = null, bd = Infinity;
        for (const a of Game.actors) {
            if (!a.carry || a.stun > 0 || a.carryT < 1 || !this.inZone(a.x, a.y)) continue;
            const d = Math.hypot(a.x - this.x, a.y - this.y);
            if (d < bd) { bd = d; best = a; }
        }
        return best;
    }

    moveTo(tx, ty, speed, dt) {
        const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
        if (d < 4) return true;
        const st = Math.min(d, speed * dt);
        const p = Nav.move(this.x, this.y, dx / d * st, dy / d * st, 40);
        this.x = p.x; this.y = p.y;
        // Держаться своей зоны.
        const z = this.z;
        if (z) { this.x = Math.max(z.x0 + 40, Math.min(z.x1 - 40, this.x)); this.y = Math.max(z.y0 + 40, Math.min(z.y1 - 40, this.y)); }
        let da = Math.atan2(dy, dx) - this.heading; da = Math.atan2(Math.sin(da), Math.cos(da));
        this.heading += da * Math.min(1, dt * 7);
        return false;
    }

    update(dt) {
        if (!this.mesh) return;
        this.attackCd = Math.max(0, this.attackCd - dt);
        this.roarCd = Math.max(0, this.roarCd - dt);
        // Оглушён аккордом: кружится на месте, не гонится и не бьёт.
        if (this.stunT > 0) {
            this.stunT -= dt;
            this.heading += dt * 6;
            if (this.state !== 'attack') this.play('idle');
            if (this.state === 'chase') { this.state = 'roam'; this.target = null; }
            this.sync();
            return;
        }
        const tgt = this.pickTarget();
        if (tgt && this.state !== 'attack') {
            if (this.state !== 'chase') {
                this.state = 'chase';
                if (this.roarCd <= 0 && Math.hypot(tgt.x - this.x, tgt.y - this.y) < 2600) { Game.onGuardianAngry(this, tgt); this.roarCd = 6; }
            }
            this.target = tgt;
        } else if (this.state === 'chase') { this.state = 'return'; this.target = null; }

        if (this.state === 'chase' && this.target) {
            const t = this.target;
            const d = Math.hypot(t.x - this.x, t.y - this.y);
            const easy = t.isPlayer && Tutorial.active;
            if (!easy && d < this.r + 85 && this.attackCd <= 0) {
                this.state = 'attack';
                this.attackCd = 1.2;
                const fire = () => {
                    if (Math.hypot(t.x - this.x, t.y - this.y) < this.r + 150 && t.carry) Game.onGuardianHit(this, t);
                };
                if (this.rig && this.rig.has('attack')) {
                    this.anim = 'attack';
                    this.rig.play('attack', { loop: false, fade: 0.08, events: [{ frac: 0.5, fn: fire }], onEnd: () => { this.state = this.target ? 'chase' : 'return'; this.anim = ''; } });
                } else { fire(); setTimeout(() => { this.state = 'return'; }, 500); }
            } else {
                this.moveTo(t.x, t.y, this.speed() * (easy ? 0.55 : 1), dt);
                this.play('run');
            }
            if (this.state === 'chase' && Game.player) {
                this._stompT = (this._stompT || 0) - dt;
                const dp = Math.hypot(Game.player.x - this.x, Game.player.y - this.y);
                if (this._stompT <= 0 && dp < 1600) { this._stompT = 0.34; Sfx.play('stomp', 0.55 * (1 - dp / 1600), 0.8 + this.zone * 0.03); }
            }
        } else if (this.state === 'attack') {
            // ждёт конца клипа
        } else if (this.state === 'return') {
            this._walkSpeed = this.speed() * 0.5;
            if (this.moveTo(this.homeX, this.homeY, this._walkSpeed, dt)) { this.state = 'roam'; this.wait = 1; }
            this.play('walk');
        } else {
            // Бродит по зоне.
            if (!this.goal || this.wait > 0) {
                this.wait -= dt;
                this.play('idle');
                if (this.wait <= 0) {
                    const z = this.z;
                    this.goal = z ? { x: z.x + (Math.random() * 2 - 1) * Math.max(0, z.hx - 350), y: z.y + (Math.random() * 2 - 1) * Math.max(0, z.hy - 350) } : { x: this.homeX, y: this.homeY };
                }
            } else if ((this._walkSpeed = this.speed() * 0.3) && this.moveTo(this.goal.x, this.goal.y, this._walkSpeed, dt)) { this.goal = null; this.wait = 1.5 + Math.random() * 3; }
            else this.play('walk');
        }
        this.sync();
    }

    sync() {
        this.mesh.position.set(this.x, World.ground(this.x, this.y), this.y);
        this.mesh.rotation.y = -this.heading;
    }
}

// Продавец-NPC у киоска: стоит за прилавком, поворачивается к подошедшему игроку, машет рукой и
// говорит реплику в пузыре; когда игрок уходит — прощается и возвращается к прилавку.
class ShopNpc {
    constructor(world, marker, role) {
        const scene = world.app.location.view.scene;
        this.role = role;
        this.x = marker.x; this.y = marker.y;
        this.home = ((marker.rot && marker.rot[1]) || 0) * Math.PI / 180;
        this.heading = this.home;
        this.near = false;
        this.sayT = 0; this.waveT = 0; this.text = ''; this.t = Math.random() * 10;
        /** @type {(() => string) | null} */
        this.textFn = null;   // живая реплика (таймер колеса)
        const look = ShopNpc.LOOKS[role] || ShopNpc.LOOKS.pickaxe;
        this.noob = new Noob(scene, look, { name: 'npc-' + role });
        World3D.addObject(world.app.location.view, this.noob.root, 'actor', { ink: false, outline: false });
        if (role === 'pickaxe') this.noob.setTool('pickaxe', 4);
        this.label = UI.labels.add({ kind: 'say', npc: this, x: this.x, y: this.y, h: 300 });
        this.sync(0);
    }

    // Реплика: ключи npc.<роль>.hi1..3 / bye1..2.
    say(kind) {
        const n = kind === 'hi' ? 3 : 2;
        this.textFn = null;
        // Колесо: про бесплатное вращение — только когда оно реально есть, иначе — сколько ждать (таймер идёт).
        const w = this.role === 'wheel' && kind === 'hi' && typeof Wheel !== 'undefined' ? Wheel.status() : null;
        if (w && !w.freeAvailable) {
            const key = w.adLeft + w.banked > 0 ? 'npc.wheel.waitAd' : 'npc.wheel.wait';
            this.textFn = () => Lang.t(key, { t: Wheel.formatTime(Wheel.msToNextDay()) });
            this.text = this.textFn();
        } else if (w) this.text = Lang.t('npc.wheel.free' + (1 + Math.floor(Math.random() * 2)));
        else this.text = Lang.t('npc.' + this.role + '.' + kind + (1 + Math.floor(Math.random() * n)));
        this.sayT = kind === 'hi' ? 3.6 : 2.2;
        this.waveT = kind === 'hi' ? 1.8 : 1.1;
    }

    update(dt, player) {
        this.t += dt;
        this.sayT = Math.max(0, this.sayT - dt);
        if (this.textFn && this.sayT > 0) this.text = this.textFn();
        this.waveT = Math.max(0, this.waveT - dt);
        if (player && Game.state === 'play') {
            const d = Math.hypot(player.x - this.x, player.y - this.y);
            if (!this.near && d < 430) { this.near = true; this.say('hi'); if (d < 600) Sfx.play('pickup', 0.25, 1.25); }
            else if (this.near && d > 560) { this.near = false; this.say('bye'); }
        }
        // Повернуться к игроку, пока он рядом; иначе — к прилавку.
        const want = this.near && player ? Math.atan2(player.y - this.y, player.x - this.x) : this.home;
        let da = want - this.heading; da = Math.atan2(Math.sin(da), Math.cos(da));
        this.heading += da * Math.min(1, dt * 6);
        this.sync(dt);
    }

    sync(dt) {
        const n = this.noob;
        n.root.position.set(this.x, World.ground(this.x, this.y) + Math.max(0, Math.sin(this.t * 3)) * (this.waveT > 0 ? 6 : 0), this.y);
        n.root.rotation.y = -this.heading;
        n.animate(dt, { moving: 0, air: false, swing: -1, carry: false, fall: 0, wave: this.waveT > 0 ? Math.min(1, this.waveT * 2) : 0 });
    }
}
ShopNpc.LOOKS = {
    pickaxe:  { custom: { torso: '#6b4423', arms: 'skin', legs: '#2c4f7a', skin: '#f5cd30', shoes: '#3a2414', decal: 'stripe' }, hat: 'cap_blue', face: 'grin' },
    cosmetic: { outfit: 'rainbow', hat: 'party', face: 'happy' },
    merge:    { outfit: 'doctor', hat: 'none', face: 'nerd' },
    wheel:    { outfit: 'royal', hat: 'top_hat', face: 'wink' },
};

// ИИ бота: цели по приоритету, путь через Nav.path, удары, доставка, воровство, защита.
class BotBrain {
    /** @param {Actor} actor */
    constructor(actor, skill) {
        this.a = actor;
        this.skill = skill;          // 0..1: насколько быстро растёт и как часто ворует
        this.goal = null;
        this.path = null;
        this.think = 0;
        this.state = 'idle';
        this.target = null;
        this.stealCd = 60 + Math.random() * 90;
        this.stuck = 0;
        this.lastPos = { x: actor.x, y: actor.y };
        this.money = 0;
        this.attackCd = 0;
        this.stealT = 0;
        this.trainT = 0;
        // Характер скорости: у каждого бота свой предел и темп тренировки.
        this.speedCap = 20 + skill * 25;
        this.trainRate = 0.12 + Math.random() * 0.25;
    }

    preferredZone() {
        const power = GameData.pickaxe(this.a.pick).power;
        let best = 0;
        for (let z = 0; z < GameData.ZONES.length; z++) {
            const e = GameData.eggsOfZone(z)[0];
            const hits = e.hp / power;
            const fastEnough = this.a.speedStat * 0.94 >= GameData.zoneOf(z).guard * 0.85;
            if (hits <= 40 && fastEnough) best = z;
        }
        return Math.max(0, best - (Math.random() < 0.3 ? 1 : 0));
    }

    setGoal(x, y) {
        if (this.goal && Math.hypot(this.goal.x - x, this.goal.y - y) < 40 && this.path) return;
        this.goal = { x, y };
        this.path = Nav.path(this.a.x, this.a.y, x, y, 30, { partial: true }) || [{ x, y }];
    }

    // Направление по пути.
    follow() {
        const a = this.a;
        if (!this.path || !this.path.length) return { x: 0, y: 0, done: true };
        let p = this.path[0];
        while (p && Math.hypot(p.x - a.x, p.y - a.y) < 50) { this.path.shift(); p = this.path[0]; }
        if (!p) return { x: 0, y: 0, done: true };
        const dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy);
        return { x: dx / d, y: dy / d, done: false };
    }

    update(dt) {
        const a = this.a;
        this.think -= dt;
        this.attackCd = Math.max(0, this.attackCd - dt);
        this.stealCd -= dt;
        // Тренировка: скорость растёт со временем (боты «бегают на дорожке» между вылазками).
        this.trainT += dt;
        if (this.trainT > 6) {
            this.trainT = 0;
            const cap = this.speedCap + Game.playerProgress() * 45;
            if (a.speedStat < cap) a.speedStat = Math.min(cap, a.speedStat + this.trainRate);
        }
        let dir = { x: 0, y: 0 }, attack = false, jump = false;
        if (a.stun > 0) { a.step(dt, 0, 0, false, false); return; }
        if (this.think <= 0) { this.think = 0.35 + Math.random() * 0.3; this.decide(); }
        const st = this.state;
        if (st === 'carryHome') {
            const f = this.follow(); dir = f;
            if (a.base.contains(a.x, a.y, -60)) Game.deliver(a);
        } else if (st === 'egg' && this.target) {
            const e = this.target;
            if (!e.mesh || e.hp <= 0) { this.state = 'idle'; this.think = 0; }
            else {
                const d = Math.hypot(e.x - a.x, e.y - a.y) - e.r;
                if (d > GameData.REACH * 0.8) { dir = this.follow(); }
                else {
                    a.heading = Math.atan2(e.y - a.y, e.x - a.x);
                    attack = true;
                }
            }
        } else if (st === 'pickup' && this.target) {
            const d = this.target;
            if (World.dropped.indexOf(d) < 0) { this.state = 'idle'; this.think = 0; }
            else if (Math.hypot(d.x - a.x, d.y - a.y) < 90) Game.pickupDropped(a, d);
            else dir = this.follow();
        } else if (st === 'hunt' && this.target) {
            const t = this.target;
            const d = Math.hypot(t.x - a.x, t.y - a.y);
            if (d > 2200 || (!t.carry && !this.defending)) { this.state = 'idle'; this.think = 0; }
            else if (d < GameData.REACH) {
                a.heading = Math.atan2(t.y - a.y, t.x - a.x);
                if (a.tool !== 'bat') a.setTool('bat');
                if (this.attackCd <= 0) { attack = true; this.attackCd = 0.9; }
            } else {
                if (this.path && Math.random() < 0.08) this.setGoal(t.x, t.y);
                dir = this.follow();
                if (dir.done) { const dx = t.x - a.x, dy = t.y - a.y, dd = Math.max(1, Math.hypot(dx, dy)); dir = { x: dx / dd, y: dy / dd, done: false }; }
            }
        } else if (st === 'steal' && this.target) {
            const s = this.target;
            if (Game.baseShielded(s.base)) {
                // Щит включился, пока вор шёл: разворот, игрок видит, что защита сработала.
                if (Math.hypot(s.slot.x - a.x, s.slot.y - a.y) < 900) UI.toast(Lang.t('hud.shieldBlock', { n: a.name }), '#5ad1ff');
                this.state = 'idle'; this.think = 0.5; this.stealCd = 40 + Math.random() * 40;
            } else if (!s.slot.pet || s.slot.pet.h === false) { this.state = 'idle'; this.think = 0; }
            else if (Math.hypot(s.slot.x - a.x, s.slot.y - a.y) < 110) {
                this.stealT += dt;
                if (this.stealT === dt) Game.onStealStart(a, s.base, s.slot);
                if (this.stealT > 1.6) { Game.stealPet(a, s.base, s.base.slots.indexOf(s.slot)); this.stealT = 0; }
            } else { this.stealT = 0; dir = this.follow(); }
        } else if (st === 'roam') {
            dir = this.follow();
            if (dir.done) this.state = 'idle';
        }
        // Застрял — новый путь, иногда прыжок.
        const moved = Math.hypot(a.x - this.lastPos.x, a.y - this.lastPos.y);
        if (Math.hypot(dir.x, dir.y) > 0.5 && moved < 20 * dt) {
            this.stuck += dt;
            if (this.stuck > 1.2) { this.stuck = 0; jump = true; if (this.goal) { const g = this.goal; this.goal = null; this.setGoal(g.x, g.y); } }
        } else this.stuck = 0;
        this.lastPos = { x: a.x, y: a.y };
        if ((st === 'egg' || st === 'idle' || st === 'pickup' || st === 'roam') && a.tool !== 'pickaxe' && !a.carry) a.setTool('pickaxe');
        // Спешит только с ношей, в погоне и при краже; иначе идёт спокойнее.
        a.boost = a.carry || st === 'hunt' ? 1 : 0.7;
        a.step(dt, dir.x, dir.y, jump, attack);
    }

    decide() {
        const a = this.a;
        if (a.carry) {
            this.state = 'carryHome';
            const s = a.base.slots[Math.max(0, a.base.freeSlot())] || a.base.slots[0];
            this.setGoal(s.x, s.y);
            return;
        }
        this.defending = false;
        // Защита базы: вор у моей базы.
        for (const o of Game.actors) {
            if (o === a || !o.carry || !o.carry.stolenFrom || o.carry.stolenFrom !== a.base) continue;
            this.state = 'hunt'; this.target = o; this.defending = true; this.setGoal(o.x, o.y); return;
        }
        // Охота на игрока с ценной ношей рядом (агрессия по навыку).
        const p = Game.player;
        if (p && p.carry && !p.carry.stolenFrom && !Tutorial.active && Math.hypot(p.x - a.x, p.y - a.y) < 900 && Math.random() < 0.012 + this.skill * 0.03 && !World.inHub(p.x, p.y)) {
            this.state = 'hunt'; this.target = p; this.setGoal(p.x, p.y); return;
        }
        if (this.state === 'hunt' && this.target && this.target.carry) return;
        // Упавший питомец рядом.
        const d = World.droppedNear(a.x, a.y, 1600);
        if (d) { this.state = 'pickup'; this.target = d; this.setGoal(d.x, d.y); return; }
        // Воровство с чужой базы.
        if (this.stealCd <= 0 && Game.stealEnabled()) {
            this.stealCd = 70 + Math.random() * 110 - this.skill * 40;
            const victims = World.bases.filter(b => b !== a.base && b.owner && b.pets().length && !(b.owner.isPlayer && Tutorial.active) && !Game.baseShielded(b));
            if (victims.length && Math.random() < 0.55 + this.skill * 0.3) {
                const b = victims[Math.floor(Math.random() * victims.length)];
                const slots = b.slots.filter(s => s.pet && s.pet.h !== false);
                slots.sort((u, v) => GameData.incomeOf(v.pet) - GameData.incomeOf(u.pet));
                const slot = slots[Math.floor(Math.random() * Math.min(3, slots.length))];
                if (slot) { this.state = 'steal'; this.target = { base: b, slot }; this.stealT = 0; this.setGoal(slot.x, slot.y); return; }
            }
        }
        if (this.state === 'steal' && this.target && this.target.slot.pet) return;
        // Яйцо: продолжить текущее или выбрать новое в своей зоне.
        if (this.state === 'egg' && this.target && this.target.mesh && this.target.hp > 0) return;
        const zone = World.titanic && Math.random() < 0.7 ? -2 : this.preferredZone();
        let best = null, bd = Infinity;
        const cands = zone === -2 ? [World.titanic] : World.spots.filter(s => s.zone === zone && s.egg && s.egg.mesh).map(s => s.egg);
        for (const e of cands) {
            if (!e) continue;
            const busy = Game.actors.some(o => o !== a && o.brain && o.brain.target === e) && !e.titanic;
            const dd = Math.hypot(e.x - a.x, e.y - a.y) + (busy ? 1500 : 0) + Math.random() * 400;
            if (dd < bd) { bd = dd; best = e; }
        }
        if (best) {
            this.state = 'egg'; this.target = best;
            const ang = Math.random() * Math.PI * 2;
            this.setGoal(best.x + Math.cos(ang) * (best.r + 60), best.y + Math.sin(ang) * (best.r + 60));
            return;
        }
        this.state = 'roam';
        const g = World.hubPoint(450);
        this.setGoal(g.x, g.y);
    }
}
