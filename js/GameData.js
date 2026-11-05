// GameData.js — данные игры: зоны, яйца монстров, монстры, кирки, улучшения базы, перерождение,
// редкости, боты. Числа баланса — здесь (это таблицы данных, а не константы рендера); координаты мира — в Maps.js.
// Питомцы — монстры: в мире — 3D-модель model (Blender GLB; нет файла — спрайт из арта img), яйцо — 3D по id (build).

/** @typedef {{ id: string, build: string, img: string, model?: string, kg: number, zone: number, color: string, box?: number[] }} PetSpecies */
/** @typedef {{ pet: string, w: number, r: string }} EggRoll */
/** @typedef {{ id: string, sp: string, zone: number, hp: number, spawn: number, rolls: EggRoll[], color: string }} EggType */

/** @satisfies {Record<string, any>} */
const GameData = {
    STUD: 40,                 // px мира на один «стад»: скорость в стадах/с

    // Редкости: цвет надписи, множитель дохода, кристаллы за вылупление.
    RARITY: {
        common:    { color: '#e9edf2', mult: 1,   gems: 1,   order: 0 },
        uncommon:  { color: '#5fe36a', mult: 1.8, gems: 2,   order: 1 },
        rare:      { color: '#47a8ff', mult: 3.5, gems: 4,   order: 2 },
        epic:      { color: '#c45cff', mult: 7,   gems: 8,   order: 3 },
        legendary: { color: '#ff4d4d', mult: 15,  gems: 15,  order: 4 },
        mythic:    { color: '#ff9a1f', mult: 32,  gems: 30,  order: 5 },
        secret:    { color: '#ff5fd8', mult: 80,  gems: 100, order: 6 },   // в интерфейсе — радужный перелив (UI.rar)
    },

    // Зоны каньона по порядку от хаба. income — базовый $/с питомца зоны, guard — скорость стража (стадов/с).
    ZONES: [
        { id: 'easy',       face: '😀', color: '#3bd45b', income: 1,      guard: 14, floor: 'grass'  },
        { id: 'medium',     face: '😟', color: '#ffc21a', income: 12,     guard: 21, floor: 'sand'   },
        { id: 'hard',       face: '😨', color: '#47a8ff', income: 150,    guard: 30, floor: 'snow'   },
        { id: 'extrahard',  face: '😠', color: '#c45cff', income: 2000,   guard: 41, floor: 'candy'  },
        { id: 'insane',     face: '😱', color: '#ff4d4d', income: 25000,  guard: 54, floor: 'jungle' },
        { id: 'impossible', face: '💀', color: '#ff9a1f', income: 350000, guard: 70, floor: 'beach'  },
    ],

    // Стражи зон — гигантские монстры (GameMonsters.js, MonsterRig). size — высота в px, run — px/с на один цикл прыжков.
    GUARDIANS: [
        { id: 'emberoo',   build: 'emberoo',   size: 430, run: 620, walk: 260 },
        { id: 'glintok', build: 'glintok', size: 400, run: 620, walk: 260 },
        { id: 'clankit',   build: 'clankit',   size: 440, run: 620, walk: 260 },
        { id: 'plumox',  build: 'plumox',  size: 440, run: 620, walk: 260 },
        { id: 'barkumo', build: 'barkumo', size: 470, run: 620, walk: 260 },
        { id: 'noctilo',   build: 'noctilo',   size: 420, run: 620, walk: 260 },
    ],

    // Монстры. zone — где лежат их яйца (-1 — только из Золотого яйца); kg — средний вес (ноша замедляет); color — цвет
    // вида (частицы, рамки); img — арт, box — рамка рисунка в px [лево, верх, право, низ] (ноги — по низу). Порядок — Коллекции.
    /** @type {Record<string, PetSpecies>} */
    PETS: {
        moxlo:    { id: 'moxlo', build: 'moxlo',     img: 'assets/monsters/moxlo.webp', model: 'assets/models/monsters/moxlo.glb',    kg: 30,  zone: 0,  color: '#28d9bf', box: [62, 24, 330, 359] },
        grumplet: { id: 'grumplet', build: 'grumplet',  img: 'assets/monsters/grumplet.webp', model: 'assets/models/monsters/grumplet.glb', kg: 40,  zone: 0,  color: '#687fa9', box: [27, 34, 357, 348] },
        pudloo:   { id: 'pudloo', build: 'pudloo',    img: 'assets/monsters/pudloo.webp', model: 'assets/models/monsters/pudloo.glb',   kg: 25,  zone: 0,  color: '#ff779c', box: [30, 56, 360, 342] },
        zazzit:   { id: 'zazzit', build: 'zazzit',    img: 'assets/monsters/zazzit.webp', model: 'assets/models/monsters/zazzit.glb',   kg: 45,  zone: 0,  color: '#b1e830', box: [39, 35, 349, 351] },
        tumblo:   { id: 'tumblo', build: 'tumblo',    img: 'assets/monsters/tumblo.webp', model: 'assets/models/monsters/tumblo.glb',   kg: 110, zone: 1,  color: '#bd704c', box: [55, 31, 338, 358] },
        dunzo:    { id: 'dunzo', build: 'dunzo',     img: 'assets/monsters/dunzo.webp', model: 'assets/models/monsters/dunzo.glb',    kg: 150, zone: 1,  color: '#e8bd78', box: [24, 50, 359, 316] },
        glintok:  { id: 'glintok', build: 'glintok',   img: 'assets/monsters/glintok.webp', model: 'assets/models/monsters/glintok.glb',  kg: 210, zone: 1,  color: '#ffc342', box: [44, 25, 354, 360] },
        whisplo:  { id: 'whisplo', build: 'whisplo',   img: 'assets/monsters/whisplo.webp', model: 'assets/models/monsters/whisplo.glb',  kg: 35,  zone: 2,  color: '#e9e6ff', box: [73, 32, 348, 339] },
        bubbloo:  { id: 'bubbloo', build: 'bubbloo',   img: 'assets/monsters/bubbloo.webp', model: 'assets/models/monsters/bubbloo.glb',  kg: 120, zone: 2,  color: '#57c8ed', box: [40, 31, 351, 345] },
        clankit:  { id: 'clankit', build: 'clankit',   img: 'assets/monsters/clankit.webp', model: 'assets/models/monsters/clankit.glb',  kg: 260, zone: 2,  color: '#9bb5c8', box: [35, 59, 355, 299] },
        plumox:   { id: 'plumox', build: 'plumox',    img: 'assets/monsters/plumox.webp', model: 'assets/models/monsters/plumox.glb',   kg: 60,  zone: 3,  color: '#a260df', box: [60, 28, 357, 356] },
        zippop:   { id: 'zippop', build: 'zippop',    img: 'assets/monsters/zippop.webp', model: 'assets/models/monsters/zippop.glb',   kg: 40,  zone: 3,  color: '#ffe15a', box: [29, 25, 356, 359] },
        noctilo:  { id: 'noctilo', build: 'noctilo',   img: 'assets/monsters/noctilo.webp', model: 'assets/models/monsters/noctilo.glb',  kg: 150, zone: 3,  color: '#344b92', box: [26, 38, 359, 323] },
        mossumi:  { id: 'mossumi', build: 'mossumi',   img: 'assets/monsters/mossumi.webp', model: 'assets/models/monsters/mossumi.glb',  kg: 45,  zone: 4,  color: '#65ba61', box: [61, 25, 331, 359] },
        barkumo:  { id: 'barkumo', build: 'barkumo',   img: 'assets/monsters/barkumo.webp', model: 'assets/models/monsters/barkumo.glb',  kg: 190, zone: 4,  color: '#a56a42', box: [41, 24, 355, 357] },
        emberoo:  { id: 'emberoo', build: 'emberoo',   img: 'assets/monsters/emberoo.webp', model: 'assets/models/monsters/emberoo.glb',  kg: 130, zone: 4,  color: '#f36b43', box: [60, 25, 337, 359] },
        orbitto:  { id: 'orbitto', build: 'orbitto',   img: 'assets/monsters/orbitto.webp', model: 'assets/models/monsters/orbitto.glb',  kg: 70,  zone: 5,  color: '#a8dce0', box: [39, 44, 357, 329] },
        wobblit:  { id: 'wobblit', build: 'wobblit',   img: 'assets/monsters/wobblit.webp', model: 'assets/models/monsters/wobblit.glb',  kg: 150, zone: 5,  color: '#f2b3dc', box: [33, 61, 359, 309] },
        auralume: { id: 'auralume', build: 'auralume',  img: 'assets/monsters/auralume.webp', model: 'assets/models/monsters/auralume.glb', kg: 90,  zone: -1, color: '#f8cd58', box: [42, 24, 355, 360] },
        umbryx:   { id: 'umbryx', build: 'umbryx',    img: 'assets/monsters/umbryx.webp', model: 'assets/models/monsters/umbryx.glb',   kg: 120, zone: -1, color: '#453d6c', box: [40, 30, 355, 355] },
    },

    // Яйца монстров: id яйца = id монстра (из яйца вылупляется он), зона, HP «защиты», spawn — доля появления
    // в своей зоне, таблица редкостей (w — вес шанса, r — редкость; удача сдвигает к редким).
    /** @type {EggType[]} */
    EGGS: [
        { id: 'moxlo', sp: 'moxlo', zone: 0, hp: 12, spawn: 0.4, color: '#ff8a24', rolls: [
            { pet: 'moxlo', w: 82, r: 'common' }, { pet: 'moxlo', w: 13, r: 'uncommon' }, { pet: 'moxlo', w: 4.5, r: 'rare' }, { pet: 'moxlo', w: 0.5, r: 'epic' }] },
        { id: 'grumplet', sp: 'grumplet', zone: 0, hp: 18, spawn: 0.27, color: '#8e9298', rolls: [
            { pet: 'grumplet', w: 75, r: 'common' }, { pet: 'grumplet', w: 18, r: 'uncommon' }, { pet: 'grumplet', w: 6, r: 'rare' }, { pet: 'grumplet', w: 1, r: 'epic' }] },
        { id: 'pudloo', sp: 'pudloo', zone: 0, hp: 26, spawn: 0.2, color: '#ff7cc6', rolls: [
            { pet: 'pudloo', w: 40, r: 'common' }, { pet: 'pudloo', w: 52, r: 'uncommon' }, { pet: 'pudloo', w: 7, r: 'rare' }, { pet: 'pudloo', w: 1, r: 'legendary' }] },
        { id: 'zazzit', sp: 'zazzit', zone: 0, hp: 34, spawn: 0.13, color: '#9ce02a', rolls: [
            { pet: 'zazzit', w: 60, r: 'uncommon' }, { pet: 'zazzit', w: 30, r: 'rare' }, { pet: 'zazzit', w: 9, r: 'epic' }, { pet: 'zazzit', w: 1, r: 'legendary' }] },

        { id: 'tumblo', sp: 'tumblo', zone: 1, hp: 160, spawn: 0.5, color: '#7a4a28', rolls: [
            { pet: 'tumblo', w: 48, r: 'common' }, { pet: 'tumblo', w: 34, r: 'uncommon' }, { pet: 'tumblo', w: 13, r: 'rare' }, { pet: 'tumblo', w: 4.5, r: 'epic' }, { pet: 'tumblo', w: 0.5, r: 'legendary' }] },
        { id: 'dunzo', sp: 'dunzo', zone: 1, hp: 230, spawn: 0.32, color: '#e2b27c', rolls: [
            { pet: 'dunzo', w: 45, r: 'common' }, { pet: 'dunzo', w: 48, r: 'uncommon' }, { pet: 'dunzo', w: 6, r: 'rare' }, { pet: 'dunzo', w: 1, r: 'epic' }] },
        { id: 'glintok', sp: 'glintok', zone: 1, hp: 320, spawn: 0.18, color: '#f2b21c', rolls: [
            { pet: 'glintok', w: 70, r: 'uncommon' }, { pet: 'glintok', w: 22, r: 'rare' }, { pet: 'glintok', w: 7, r: 'epic' }, { pet: 'glintok', w: 1, r: 'legendary' }] },

        { id: 'whisplo', sp: 'whisplo', zone: 2, hp: 2100, spawn: 0.5, color: '#f2f3f6', rolls: [
            { pet: 'whisplo', w: 50, r: 'common' }, { pet: 'whisplo', w: 30, r: 'uncommon' }, { pet: 'whisplo', w: 15, r: 'rare' }, { pet: 'whisplo', w: 4.5, r: 'epic' }, { pet: 'whisplo', w: 0.5, r: 'legendary' }] },
        { id: 'bubbloo', sp: 'bubbloo', zone: 2, hp: 3000, spawn: 0.32, color: '#62c8ff', rolls: [
            { pet: 'bubbloo', w: 44, r: 'common' }, { pet: 'bubbloo', w: 48, r: 'uncommon' }, { pet: 'bubbloo', w: 7, r: 'rare' }, { pet: 'bubbloo', w: 1, r: 'epic' }] },
        { id: 'clankit', sp: 'clankit', zone: 2, hp: 4200, spawn: 0.18, color: '#b9c0c9', rolls: [
            { pet: 'clankit', w: 40, r: 'uncommon' }, { pet: 'clankit', w: 52, r: 'rare' }, { pet: 'clankit', w: 7, r: 'epic' }, { pet: 'clankit', w: 1, r: 'legendary' }] },

        { id: 'plumox', sp: 'plumox', zone: 3, hp: 32000, spawn: 0.5, color: '#9a3fe0', rolls: [
            { pet: 'plumox', w: 48, r: 'common' }, { pet: 'plumox', w: 32, r: 'uncommon' }, { pet: 'plumox', w: 14, r: 'rare' }, { pet: 'plumox', w: 5.5, r: 'epic' }, { pet: 'plumox', w: 0.5, r: 'legendary' }] },
        { id: 'zippop', sp: 'zippop', zone: 3, hp: 46000, spawn: 0.32, color: '#ffd21a', rolls: [
            { pet: 'zippop', w: 44, r: 'common' }, { pet: 'zippop', w: 30, r: 'uncommon' }, { pet: 'zippop', w: 18, r: 'rare' }, { pet: 'zippop', w: 7, r: 'epic' }, { pet: 'zippop', w: 1, r: 'legendary' }] },
        { id: 'noctilo', sp: 'noctilo', zone: 3, hp: 62000, spawn: 0.18, color: '#2a40c8', rolls: [
            { pet: 'noctilo', w: 42, r: 'uncommon' }, { pet: 'noctilo', w: 50, r: 'rare' }, { pet: 'noctilo', w: 7, r: 'epic' }, { pet: 'noctilo', w: 1, r: 'legendary' }] },

        { id: 'mossumi', sp: 'mossumi', zone: 4, hp: 420000, spawn: 0.5, color: '#7cd43a', rolls: [
            { pet: 'mossumi', w: 46, r: 'common' }, { pet: 'mossumi', w: 30, r: 'uncommon' }, { pet: 'mossumi', w: 16, r: 'rare' }, { pet: 'mossumi', w: 7.5, r: 'epic' }, { pet: 'mossumi', w: 0.5, r: 'legendary' }] },
        { id: 'barkumo', sp: 'barkumo', zone: 4, hp: 610000, spawn: 0.32, color: '#3cb83a', rolls: [
            { pet: 'barkumo', w: 44, r: 'common' }, { pet: 'barkumo', w: 30, r: 'uncommon' }, { pet: 'barkumo', w: 18, r: 'rare' }, { pet: 'barkumo', w: 7, r: 'epic' }, { pet: 'barkumo', w: 1, r: 'legendary' }] },
        { id: 'emberoo', sp: 'emberoo', zone: 4, hp: 820000, spawn: 0.18, color: '#e8261e', rolls: [
            { pet: 'emberoo', w: 40, r: 'uncommon' }, { pet: 'emberoo', w: 52, r: 'rare' }, { pet: 'emberoo', w: 7, r: 'epic' }, { pet: 'emberoo', w: 1, r: 'legendary' }] },

        { id: 'orbitto', sp: 'orbitto', zone: 5, hp: 6200000, spawn: 0.6, color: '#cfd5dc', rolls: [
            { pet: 'orbitto', w: 46, r: 'common' }, { pet: 'orbitto', w: 30, r: 'uncommon' }, { pet: 'orbitto', w: 16, r: 'rare' }, { pet: 'orbitto', w: 7.5, r: 'epic' }, { pet: 'orbitto', w: 0.5, r: 'mythic' }] },
        { id: 'wobblit', sp: 'wobblit', zone: 5, hp: 9000000, spawn: 0.4, color: '#efe2c4', rolls: [
            { pet: 'wobblit', w: 30, r: 'common' }, { pet: 'wobblit', w: 34, r: 'uncommon' }, { pet: 'wobblit', w: 22, r: 'rare' }, { pet: 'wobblit', w: 12, r: 'epic' }, { pet: 'wobblit', w: 2, r: 'mythic' }] },
    ],

    // Золотое яйцо события (в коде — titanic). hpPerPower — HP на единицу силы лучшей кирки игрока.
    TITANIC: { id: 'titanic', sp: 'golden', zone: 0, spawn: 0, scale: 3.4, hpPerPower: 260, hpMin: 600, color: '#ffd23a',
        rolls: [{ pet: 'auralume', w: 60, r: 'secret' }, { pet: 'umbryx', w: 40, r: 'secret' }] },
    TITANIC_FIRST_SEC: 240,     // первое появление после старта
    TITANIC_EVERY_SEC: 600,     // затем каждые
    TITANIC_ZONE_MULT: 2.5,     // доход Secret-питомца = доход зоны игрока × это × множитель редкости

    // Мутации (машина слияния): 3 одинаковых -> следующая ступень.
    // Питомцы с собой (до FOLLOW_MAX): идут за игроком строем и дают бонус своего вида — урон киркой (power),
    // скорость (speed), доход (cash) или удачу (luck). Сила — по редкости, мутация умножает; сумма с потолком.
    FOLLOW_MAX: 4,
    FOLLOW_SCALE: 0.7,
    FOLLOW_SLOTS: [[120, -85], [120, 85], [215, -45], [215, 45]],   // [назад, вбок] от игрока
    PET_BUFF: {
        moxlo: 'speed', grumplet: 'luck', pudloo: 'cash', zazzit: 'power', tumblo: 'power', dunzo: 'luck', glintok: 'cash',
        whisplo: 'luck', bubbloo: 'speed', clankit: 'power', plumox: 'power', zippop: 'cash', noctilo: 'speed', mossumi: 'luck',
        barkumo: 'cash', emberoo: 'power', orbitto: 'speed', wobblit: 'cash', auralume: 'luck', umbryx: 'power',
    },
    BUFF_PCT: {   // % по порядку редкости: common … secret
        power: [5, 8, 12, 18, 25, 35, 50], cash: [5, 8, 12, 18, 25, 35, 50], luck: [5, 8, 12, 18, 25, 35, 50],
        speed: [3, 4, 6, 8, 11, 15, 20],
    },
    BUFF_CAP: { power: 3, cash: 2, luck: 2, speed: 0.5 },
    MUT_BUFF: { normal: 1, golden: 1.5, diamond: 2, rainbow: 3 },
    /** @param {any} p @returns {{ type: string, v: number }} */
    petBuff(p) {
        const type = this.PET_BUFF[p.sp] || 'power';
        const order = (this.RARITY[p.r] || this.RARITY.common).order;
        return { type, v: (this.BUFF_PCT[type][order] || 0) * (this.MUT_BUFF[p.mut] || 1) / 100 };
    },

    MUTATIONS: [
        { id: 'normal',  mult: 1,   tint: null },
        { id: 'golden',  mult: 3.5, tint: [1.25, 0.95, 0.35] },
        { id: 'diamond', mult: 12,  tint: [0.6, 1.05, 1.35] },
        { id: 'rainbow', mult: 40,  tint: 'rainbow' },
    ],

    // Кирки: power — урон за удар; price — $; цвета головы/рукояти для модели в коде.
    PICKAXES: [
        { id: 'wooden',    power: 1,       price: 0,          head: '#a0703f', handle: '#6b4423' },
        { id: 'stone',     power: 3,       price: 150,        head: '#8d939b', handle: '#6b4423' },
        { id: 'iron',      power: 8,       price: 1200,       head: '#d6dbe0', handle: '#6b4423' },
        { id: 'gold',      power: 20,      price: 6000,       head: '#ffcf33', handle: '#6b4423' },
        { id: 'diamond',   power: 60,      price: 35000,      head: '#62e9ff', handle: '#4a3020' },
        { id: 'emerald',   power: 180,     price: 220000,     head: '#2fe07a', handle: '#4a3020' },
        { id: 'ruby',      power: 550,     price: 1400000,    head: '#ff3b5c', handle: '#2b2b2b' },
        { id: 'obsidian',  power: 1800,    price: 9000000,    head: '#3a2457', handle: '#1b1b1b' },
        { id: 'lava',      power: 6000,    price: 65000000,   head: '#ff6a00', handle: '#2b1408', glow: '#ffb000' },
        { id: 'frost',     power: 20000,   price: 480000000,  head: '#a8ecff', handle: '#2c4f7a', glow: '#d8f8ff' },
        { id: 'candy',     power: 70000,   price: 3600000000, head: '#ff7ad9', handle: '#ffffff', glow: '#ffc8f0' },
        { id: 'cool',      power: 250000,  price: 3.2e10,     head: '#ff5a1f', handle: '#222222', glow: '#ff9a5a' },
        { id: 'galaxy',    power: 1000000, price: 2.6e11,     head: '#8a3dff', handle: '#1a1033', glow: '#d8a8ff' },
        { id: 'celestial', power: 5000000, price: 2.2e12,     head: '#ffd23a', handle: '#7a3dff', glow: '#fff3a8' },
    ],

    // База: гнёзд на уровне (уровень 1 — PEN_BASE гнёзд), цена следующего уровня; перерождения дают ещё гнёзда,
    // всего на участке не больше SLOTS_MAX (сетка 4×4).
    PEN_BASE: 4,
    PEN_MAX_LEVEL: 9,
    SLOTS_MAX: 16,
    penPrice(level) { return Math.round(400 * Math.pow(4.2, level - 1)); },

    // Яйцо в гнезде вылупляется за HATCH_SEC; монеты монстров копятся в «банке» базы — их забирают с плиты СОБРАТЬ.
    HATCH_SEC: 2.4,

    // Улучшения базы (окно «Улучшения»): защита — секунды щита на уровне, доход — множитель на уровне.
    SHIELD: { base: 45, step: 15, max: 6, cooldown: 25, price(l) { return Math.round(8000 * Math.pow(4.5, l)); } },
    INCOME_UP: { step: 0.25, max: 8, price(l) { return Math.round(12000 * Math.pow(5.5, l)); } },
    shieldSec(l) { return this.SHIELD.base + this.SHIELD.step * Math.max(0, l || 0); },
    incomeUpMult(l) { return 1 + this.INCOME_UP.step * Math.max(0, l || 0); },

    // Перерождение: нужно price(l) монет; сбрасываются монеты, кирка, гнёзда и монстры на базе.
    // Награда навсегда: доход ×mult за каждое перерождение и +slots гнёзд (до SLOTS_MAX).
    REBIRTH: { base: 150000, grow: 14, mult: 2, slots: 2, max: 12 },
    rebirthPrice(l) { return Math.round(this.REBIRTH.base * Math.pow(this.REBIRTH.grow, Math.max(0, l || 0))); },
    rebirthMult(l) { return Math.pow(this.REBIRTH.mult, Math.max(0, l || 0)); },
    rebirthSlots(l) { return this.REBIRTH.slots * Math.max(0, l || 0); },

    // Рывок (Shift / кнопка «Рывок»): скорость ×mult на dur секунд, заряд — за cd секунд.
    DASH: { mult: 1.75, dur: 0.9, cd: 5 },
    // Аккорд (R / кнопка «Аккорд»): гитарная звуковая волна радиусом radius оглушает стражей на stun секунд,
    // ботов рядом (в 0.7 радиуса) сбивает с ног — краденое у них выпадает. Заряд — cd секунд.
    CHORD: { cd: 18, radius: 650, stun: 2.6 },
    // Ансамбль: каждый новый вид монстров в гнёздах базы (сверх первого) — +step к доходу.
    BAND_STEP: 0.06,
    // Конвейер яиц в хабе: яйцо каждые every с, едет со скоростью speed px/с; цена — priceSec секунд дохода
    // монстра его зоны (× перерождения); раз в rareEvery с — редкое яйцо (редкость от «Редкого»), цена × rareMult.
    CONVEYOR: { every: 3.4, speed: 95, priceSec: 300, rareEvery: 45, rareMult: 8 },
    // Беговая дорожка: прирост скорости за секунду и потолок скорости на уровне.
    TREADMILL: [
        { rate: 1,   cap: 30,  price: 0 },
        { rate: 1.5, cap: 45,  price: 2500 },
        { rate: 2,   cap: 62,  price: 60000 },
        { rate: 3,   cap: 82,  price: 1500000 },
        { rate: 4,   cap: 105, price: 40000000 },
        { rate: 5,   cap: 130, price: 1.2e9 },
    ],
    BASE_SPEED: 16,
    SWING_RATE: 3,            // ударов в секунду
    REACH: 150,               // px: дальность удара от центра персонажа
    CARRY_SLOW: 0.0011,       // доля скорости, теряемая на каждый кг ноши
    CARRY_SLOW_MAX: 0.32,
    DROP_SECONDS: 30,         // упавший питомец лежит столько секунд
    EGG_RESPAWN: [6, 12],     // сек: новое яйцо на месте разбитого

    // Цена продажи питомца — столько секунд его дохода.
    SELL_SECONDS: 25,
    OFFLINE_MAX_SEC: 7200,
    OFFLINE_SHARE: 0.35,

    // Боты-нубы: ники (язык сборки), цвета и характер.
    BOT_NAMES: {
        ru: ['Нубик_2013', 'КирюхаПро', 'Мася_Котик', 'ДимонЛегенда', 'Лиза_Звёздочка', 'ВаняКрут', 'Тёма_228', 'Соня_Луна', 'МакснубГейм', 'Рома_Ракета'],
        en: ['NoobMaster99', 'EggSmasher', 'xXBuilderXx', 'PetHunter_7', 'LilyStar', 'Robo_Tom', 'CoolKid2013', 'MaxTheNoob', 'SunnyBloxx', 'Speedy_Sam'],
    },
    NOOB_SKIN: '#f2c39b',
    NOOB_TORSO: '#2b2946',
    NOOB_LEGS: '#3a6fd8',
    // Вариации ботов: [торс, ноги, кожа] — разные тона кожи, не жёлтый «нуб».
    BOT_LOOKS: [
        ['#e8343a', '#2d3a8c', '#f2c39b'], ['#ff5fa2', '#3a3a3a', '#d9a066'], ['#ffd23a', '#2b2946', '#ffdbac'],
        ['#8a3dff', '#1d1d24', '#c68642'], ['#3cc24a', '#2d3a8c', '#f2c39b'], ['#ffffff', '#e8343a', '#8d5524'],
        ['#ff8a24', '#3a3a3a', '#ffdbac'], ['#62c8ff', '#ffffff', '#d9a066'], ['#2b2b2b', '#9a3fe0', '#f2c39b'],
    ],

    // --- Помощники ---
    zoneOf(i) { return this.ZONES[Math.max(0, Math.min(this.ZONES.length - 1, i))]; },
    egg(id) { return id === 'titanic' ? /** @type {EggType} */ (/** @type {any} */ (this.TITANIC)) : this.EGGS.find(e => e.id === id) || this.EGGS[0]; },
    eggsOfZone(z) { return this.EGGS.filter(e => e.zone === z); },
    mutation(id) { return this.MUTATIONS.find(m => m.id === id) || this.MUTATIONS[0]; },
    pickaxe(i) { return this.PICKAXES[Math.max(0, Math.min(this.PICKAXES.length - 1, i))]; },
    penSlots(level, extra) { return Math.min(this.SLOTS_MAX, this.PEN_BASE + Math.max(0, level - 1) + (extra || 0)); },
    // Монстры по порядку Коллекции и их «класс» для вкладок: обычные (зоны 1–2), редкие (3–4), легенды (5–6 и Золотое яйцо).
    monsterIds() { return Object.keys(this.PETS); },
    tierOf(sp) { const z = (this.PETS[sp] || this.PETS.moxlo).zone; return z < 0 || z >= 4 ? 'legend' : z >= 2 ? 'rare' : 'normal'; },
    // Редкости, которые могут выпасть из яйца этого монстра (для отметок в Коллекции).
    raritiesOf(sp) {
        const e = this.EGGS.find(x => x.sp === sp) || (this.PETS[sp] && this.PETS[sp].zone < 0 ? this.TITANIC : null);
        return e ? [...new Set(e.rolls.filter(r => r.pet === sp).map(r => r.r))] : [];
    },

    // Выбор из таблицы яйца с удачей: удача сдвигает веса к редким.
    roll(egg, luck, rnd) {
        const r = rnd || Math.random;
        const L = Math.max(1, luck || 1);
        const ws = egg.rolls.map(x => x.w * Math.pow(L, this.RARITY[x.r].order * 0.6));
        let t = r() * ws.reduce((a, b) => a + b, 0);
        for (let i = 0; i < ws.length; i++) { t -= ws[i]; if (t <= 0) return egg.rolls[i]; }
        return egg.rolls[egg.rolls.length - 1];
    },

    // Новый питомец из яйца: вес, доход.
    // tz — зона игрока для Titanic Egg: доход Секретного питомца растёт вместе с прогрессом.
    makePet(egg, rollEntry, rnd, tz) {
        const r = rnd || Math.random;
        const sp = this.PETS[rollEntry.pet] || this.PETS.moxlo;
        const k = 0.55 + Math.pow(r(), 1.7) * 1.25;               // чаще лёгкие, иногда тяжёлые
        const kg = Math.max(1, Math.round(sp.kg * k));
        const base = egg.id === 'titanic' ? this.zoneOf(tz || 0).income * this.TITANIC_ZONE_MULT : this.zoneOf(egg.zone).income;
        const income = base * this.RARITY[rollEntry.r].mult * (0.75 + 0.5 * k);
        return {
            uid: 'p' + Date.now().toString(36) + Math.floor(r() * 1e6).toString(36),
            sp: sp.id, egg: egg.id, r: rollEntry.r, kg, mut: 'normal',
            inc: Math.max(1, Math.round(income)),
            h: false,   // ещё яйцо: вылупится в гнезде базы (редкость открывается тогда же)
        };
    },

    // Редкость-подпись яйца — по зоне (как в оригинале: Common, Uncommon, Rare…).
    eggRarity(egg) { return egg.id === 'titanic' ? 'secret' : ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][egg.zone] || 'common'; },

    incomeOf(pet) { return pet ? pet.inc * this.mutation(pet.mut).mult : 0; },

    // $ -> «$1.2K», «$45M» … (короткие суффиксы как в Roblox).
    SUFFIX: ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'],
    fmt(n) {
        n = Number(n) || 0;
        const neg = n < 0; n = Math.abs(n);
        if (n < 1000) return (neg ? '-' : '') + (n < 10 && n % 1 ? n.toFixed(1) : Math.floor(n));
        let i = 0;
        while (n >= 1000 && i < this.SUFFIX.length - 1) { n /= 1000; i++; }
        const s = n >= 100 ? Math.floor(n) : n >= 10 ? (Math.floor(n * 10) / 10) : (Math.floor(n * 100) / 100);
        return (neg ? '-' : '') + s + this.SUFFIX[i];
    },
    money(n) { return '$' + this.fmt(n); },
};
