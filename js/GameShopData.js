// GameShopData.js — каталог косметики (Shop.js), награды Daily Gift (DailyGift.js), секторы колеса (Wheel.js).
// Валюта магазина — кристаллы (💎, Shop.coins). Всё только внешний вид: у каждого предмета есть поле look —
// id внешности из NoobLooks (outfit/hat/bat/trail/aura) или Gfx.FACES (face); игра надевает его на нуба.
// Цена: { coins: N } — за кристаллы, { ads: 1..5 } — за просмотры рекламы (чем ценнее, тем больше).
// В каждой вкладке ≈35% предметов за кристаллы и ≈65% за рекламу (Shop.validate проверяет при старте); у мифических
// брейнрот-скинов половина за рекламу (3–7 просмотров, SHOP_ADS_MAX = 7).
// Эксклюзивы (exclusive: 'daily') — скины 7-го дня Daily Gift: не продаются и не выпадают на колесе.

const SHOP_TABS = [
    { id: 'outfit', name: { ru: 'Скины', en: 'Skins' } },
    { id: 'hat', name: { ru: 'Шапки', en: 'Hats' } },
    { id: 'face', name: { ru: 'Лица', en: 'Faces' } },
    { id: 'trail', name: { ru: 'Следы', en: 'Trails' } },
    { id: 'bat', name: { ru: 'Инструменты', en: 'Instruments' } },
    { id: 'aura', name: { ru: 'Ауры', en: 'Auras' } },
];

const SHOP_ITEMS = (() => {
    const g = (n) => ({ coins: n });
    const a = (n) => ({ ads: n });
    const RANK = { mythic: -2, common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
    // Строка: [look, ru, en, редкость, цена, доп. поля]. Слот предмета = id вкладки (Shop.slotOf).
    const TABLE = {
        outfit: [
            // Мифические костюмы монстров: первые во вкладке, в этом порядке (половина — за рекламу, 3–7 просмотров).
            ['mon_moxlo', 'Костюм Моксло', 'Moxlo Suit', 'mythic', g(2500)],
            ['mon_pudloo', 'Костюм Пудлу', 'Pudloo Suit', 'mythic', a(3)],
            ['mon_emberoo', 'Костюм Эмберу', 'Emberoo Suit', 'mythic', g(3500)],
            ['mon_zazzit', 'Костюм Заззита', 'Zazzit Suit', 'mythic', a(4)],
            ['mon_plumox', 'Костюм Плюмокса', 'Plumox Suit', 'mythic', a(5)],
            ['mon_barkumo', 'Костюм Баркумо', 'Barkumo Suit', 'mythic', g(4000)],
            ['mon_mossumi', 'Костюм Моссуми', 'Mossumi Suit', 'mythic', g(3000)],
            ['mon_auralume', 'Костюм Ауралюма', 'Auralume Suit', 'mythic', a(7), { unique: true }],
            ['classic', 'Охотник за яйцами', 'Egg Hunter', 'common', null],
            ['red', 'Алый герой', 'Red Hero', 'common', g(40)],
            ['pinky', 'Розочка', 'Pinky', 'common', g(70)],
            ['sporty', 'Спортсмен', 'Sporty', 'common', a(1)],
            ['ocean', 'Сёрфер', 'Surfer', 'common', a(1)],
            ['farmer', 'Фермер', 'Farmer', 'common', a(1)],
            ['lime', 'Яйцеголовый', 'Egghead', 'common', a(1)],
            ['snowman', 'Снеговик', 'Snowman', 'uncommon', g(130)],
            ['ninja', 'Ниндзя', 'Ninja', 'uncommon', a(2)],
            ['doctor', 'Доктор', 'Doctor', 'uncommon', a(2)],
            ['firefighter', 'Пожарный', 'Firefighter', 'uncommon', a(2)],
            ['banana', 'Банан', 'Banana', 'uncommon', a(2)],
            ['candy', 'Конфетка', 'Candy Kid', 'rare', g(350)],
            ['royal', 'Принц', 'Prince', 'rare', g(450)],
            ['hacker', 'Хакер', 'Hacker', 'rare', a(3)],
            ['pirate', 'Пират', 'Pirate', 'rare', a(3)],
            ['zombie', 'Зомби', 'Zombie', 'rare', a(3)],
            ['astronaut', 'Космонавт', 'Astronaut', 'epic', g(700)],
            ['lava', 'Лавовый', 'Lava Lord', 'epic', g(1000)],
            ['robot', 'Робот', 'Robot', 'epic', a(4)],
            ['ice', 'Ледяной', 'Frostbite', 'epic', a(4)],
            ['galaxy', 'Галактика', 'Galaxy', 'legendary', g(1800)],
            ['diamond', 'Алмазный', 'Diamond', 'legendary', a(5)],
            ['rainbow', 'Радуга', 'Rainbow', 'legendary', a(5)],
            // Эксклюзивы 7-го дня подарка: очередь выдачи — в этом порядке.
            ['golden', 'Золотой чемпион', 'Golden Champ', 'legendary', 'daily'],
            ['mon_umbryx', 'Костюм Умбрикса', 'Umbryx Suit', 'legendary', 'daily'],
            ['shadow', 'Тень', 'Shadow', 'legendary', 'daily'],
        ],
        hat: [
            ['hair', 'Причёска', 'Messy Hair', 'common', null],
            ['none', 'Без шапки', 'No hat', 'common', g(10)],
            ['cap_red', 'Красная кепка', 'Red Cap', 'common', g(40)],
            ['beanie', 'Шапочка', 'Beanie', 'common', g(50)],
            ['party', 'Колпак', 'Party Hat', 'common', g(60)],
            ['cap_blue', 'Синяя кепка', 'Blue Cap', 'common', a(1)],
            ['cone', 'Конус', 'Traffic Cone', 'common', a(1)],
            ['flower', 'Цветочек', 'Flower', 'common', a(1)],
            ['ninja_band', 'Повязка', 'Headband', 'common', a(1)],
            ['antenna', 'Антенна', 'Antenna', 'common', a(1)],
            ['egg_shell', 'Скорлупа', 'Egg Shell', 'common', a(1)],
            ['cowboy', 'Ковбойская', 'Cowboy Hat', 'uncommon', g(120)],
            ['chef', 'Колпак повара', 'Chef Hat', 'uncommon', g(140)],
            ['headphones', 'Наушники', 'Headphones', 'uncommon', a(2)],
            ['propeller', 'Пропеллер', 'Propeller Cap', 'uncommon', a(2)],
            ['bunny_ears', 'Зайка', 'Bunny Ears', 'uncommon', a(2)],
            ['cat_ears', 'Котик', 'Cat Ears', 'uncommon', a(2)],
            ['sombrero', 'Сомбреро', 'Sombrero', 'uncommon', a(2)],
            ['top_hat', 'Цилиндр', 'Top Hat', 'rare', g(300)],
            ['viking', 'Шлем викинга', 'Viking Helm', 'rare', g(400)],
            ['pirate', 'Пиратская', 'Pirate Hat', 'rare', a(3)],
            ['horns', 'Рожки', 'Devil Horns', 'rare', a(3)],
            ['santa', 'Дед Мороз', 'Santa Hat', 'rare', a(3)],
            ['duck', 'Утёнок', 'Duckling', 'rare', a(3)],
            ['pumpkin', 'Тыква', 'Pumpkin', 'rare', a(3)],
            ['wizard', 'Волшебник', 'Wizard Hat', 'epic', g(800)],
            ['halo', 'Нимб', 'Halo', 'epic', g(1000)],
            ['dino', 'Динозавр', 'Dino', 'epic', a(4)],
            ['crown', 'Корона', 'Crown', 'legendary', g(2000)],
            ['ufo', 'НЛО', 'UFO', 'legendary', a(5)],
        ],
        face: [
            ['smile', 'Улыбка', 'Smile', 'common', null],
            ['grin', 'Оскал', 'Big Grin', 'common', g(40)],
            ['tongue', 'Дразнилка', 'Tongue', 'common', g(50)],
            ['happy', 'Радость', 'Happy', 'common', a(1)],
            ['wink', 'Подмиг', 'Wink', 'common', a(1)],
            ['surprised', 'Ого!', 'Wow!', 'common', a(1)],
            ['angry', 'Злюка', 'Grumpy', 'common', a(1)],
            ['derp', 'Чудик', 'Derp', 'common', a(1)],
            ['cool', 'Крутой', 'Cool', 'uncommon', g(130)],
            ['uwu', 'Милаш', 'UwU', 'uncommon', a(2)],
            ['sleepy', 'Соня', 'Sleepy', 'uncommon', a(2)],
            ['nerd', 'Умник', 'Nerd', 'uncommon', a(2)],
            ['shy', 'Скромник', 'Shy', 'uncommon', a(2)],
            ['dizzy', 'Вертушка', 'Dizzy', 'uncommon', a(2)],
            ['star', 'Звёздочки', 'Star Eyes', 'rare', g(320)],
            ['heart', 'Влюблённый', 'Heart Eyes', 'rare', a(3)],
            ['evil', 'Злодей', 'Evil', 'rare', a(3)],
            ['money', 'Богач', 'Rich', 'epic', g(700)],
            ['robot', 'Робо-лицо', 'Robo Face', 'epic', a(4)],
            ['beast', 'Монстр', 'Beast', 'legendary', g(1500)],
            ['golden', 'Золотая улыбка', 'Golden Grin', 'legendary', g(2000)],
        ],
        trail: [
            ['none', 'Без следа', 'No trail', 'common', null],
            ['white', 'Белый', 'White', 'common', g(40)],
            ['red', 'Алый', 'Red', 'common', g(50)],
            ['blue', 'Синий', 'Blue', 'common', a(1)],
            ['green', 'Зелёный', 'Green', 'common', a(1)],
            ['yellow', 'Жёлтый', 'Yellow', 'common', a(1)],
            ['purple', 'Фиолетовый', 'Purple', 'common', a(1)],
            ['pink', 'Розовый', 'Pink', 'common', a(1)],
            ['cyan', 'Бирюзовый', 'Cyan', 'common', a(1)],
            ['orange', 'Оранжевый', 'Orange', 'common', a(1)],
            ['black', 'Чёрный', 'Black', 'uncommon', g(120)],
            ['fire', 'Огненный', 'Fire', 'rare', g(380)],
            ['ice', 'Ледяной', 'Ice', 'rare', a(3)],
            ['toxic', 'Токсичный', 'Toxic', 'rare', a(3)],
            ['sunset', 'Закат', 'Sunset', 'epic', g(800)],
            ['ocean', 'Океан', 'Ocean', 'epic', a(4)],
            ['candy', 'Сладкий', 'Candy', 'epic', a(4)],
            ['gold', 'Золотой', 'Gold', 'legendary', g(1400)],
            ['rainbow', 'Радужный', 'Rainbow', 'legendary', g(2000)],
            ['galaxy', 'Галактика', 'Galaxy', 'legendary', a(5)],
            ['shadow', 'Теневой', 'Shadow', 'legendary', a(5)],
        ],
        // Инструменты (в коде слот 'bat'): ключи look — прежние, вид — в NoobLooks.BATS.
        bat: [
            ['wood', 'Электрогитара', 'Electric Guitar', 'common', null],
            ['carrot', 'Укулеле', 'Ukulele', 'common', g(40)],
            ['plunger', 'Маракас', 'Maraca', 'common', g(50)],
            ['bone', 'Барабанная палочка', 'Drumstick', 'common', a(1)],
            ['noodle', 'Флейта', 'Flute', 'common', a(1)],
            ['banana', 'Бубен', 'Tambourine', 'common', a(1)],
            ['pan', 'Тарелка', 'Cymbal', 'uncommon', g(110)],
            ['baguette', 'Бас-гитара', 'Bass Guitar', 'uncommon', g(130)],
            ['metal', 'Хромовая гитара', 'Chrome Guitar', 'uncommon', a(2)],
            ['fish', 'Кейтар', 'Keytar', 'uncommon', a(2)],
            ['ice_pop', 'Микрофон', 'Microphone', 'uncommon', a(2)],
            ['spiked', 'Рок-гитара', 'Rock Guitar', 'rare', g(350)],
            ['hammer', 'Колотушка', 'Drum Mallet', 'rare', a(3)],
            ['lollipop', 'Труба', 'Trumpet', 'rare', a(3)],
            ['candy_cane', 'Саксофон', 'Saxophone', 'rare', a(3)],
            ['guitar', 'Акустика', 'Acoustic Guitar', 'rare', a(3)],
            ['sword', 'Скрипка', 'Violin', 'epic', g(800)],
            ['wand', 'Дирижёрская палочка', 'Conductor Baton', 'epic', a(4)],
            ['rubber_chicken', 'Резиновая курица', 'Rubber Chicken', 'epic', a(4)],
            ['diamond', 'Алмазная гитара', 'Diamond Guitar', 'legendary', g(1800)],
            ['gold', 'Золотая гитара', 'Golden Guitar', 'legendary', a(5)],
        ],
        aura: [
            ['none', 'Без ауры', 'No aura', 'common', null],
            ['sparkle', 'Искры', 'Sparkles', 'common', g(60)],
            ['leaves', 'Листва', 'Leaves', 'common', g(70)],
            ['bubble', 'Пузырьки', 'Bubbles', 'common', a(1)],
            ['love', 'Любовь', 'Love', 'uncommon', g(150)],
            ['snow', 'Снегопад', 'Snowfall', 'uncommon', g(160)],
            ['candy', 'Сладости', 'Sweets', 'uncommon', a(2)],
            ['star', 'Звёзды', 'Stars', 'uncommon', a(2)],
            ['emerald', 'Изумруд', 'Emerald', 'rare', g(400)],
            ['ice', 'Стужа', 'Frost', 'rare', a(3)],
            ['toxic', 'Яд', 'Toxic', 'rare', a(3)],
            ['ocean', 'Волны', 'Waves', 'rare', a(3)],
            ['ruby', 'Рубин', 'Ruby', 'rare', a(3)],
            ['gold', 'Золотая', 'Golden', 'rare', a(3)],
            ['thunder', 'Гроза', 'Thunder', 'epic', g(900)],
            ['fire', 'Пламя', 'Flames', 'epic', a(4)],
            ['shadow', 'Мрак', 'Darkness', 'epic', a(4)],
            ['sun', 'Солнце', 'Sunshine', 'epic', a(4)],
            ['galaxy', 'Космос', 'Cosmos', 'legendary', g(1900)],
            ['rainbow', 'Радуга', 'Rainbow', 'legendary', a(5)],
            ['void', 'Бездна', 'Void', 'legendary', a(5)],
        ],
    };
    const out = [];
    for (const tab of Object.keys(TABLE)) {
        const rows = TABLE[tab].map((r, i) => ({ r, i }));
        // Порядок на витрине: свой по умолчанию, затем по редкости, эксклюзивы в конце.
        const rank = (x) => (x.r[3] === 'mythic' ? -2 : x.r[4] === null ? -1 : x.r[4] === 'daily' ? 9 : RANK[x.r[3]]);
        rows.sort((p, q) => rank(p) - rank(q) || p.i - q.i);
        for (const { r } of rows) {
            const [look, ru, en, rarity, price, more] = r;
            /** @type {Record<string, any>} */
            const it = Object.assign({ id: tab + '_' + look, tab, name: { ru, en }, rarity, look }, more);
            if (price === null) it.default = true;
            else if (price === 'daily') it.exclusive = 'daily';
            else it.price = price;
            out.push(it);
        }
    }
    return out;
})();

// Daily Gift, дни 1–6 (7-й — эксклюзивный скин из очереди SHOP_ITEMS, exclusive: 'daily'). Кристаллы по нарастающей;
// «x2 за рекламу» удваивает кристаллы и случайные предметы. День 5 добавляет предмет магазина (до «Необычного»).
const DAILY_REWARDS = [
    { coins: 25 },
    { coins: 40 },
    { coins: 60 },
    { coins: 80 },
    { coins: 120, randomItems: 1, maxRarity: 'uncommon' },
    { coins: 160 },
];

// Колесо фортуны: 8 секторов равного угла, веса — чем меньше приз, тем чаще. randomItem — случайный предмет
// магазина на сутки (не эксклюзив и не имеющийся у игрока; иначе вместо него кристаллы).
const WHEEL_SECTORS = [
    { coins: 20, weight: 22 },
    { coins: 60, weight: 14 },
    { randomItem: true, maxRarity: 'uncommon', weight: 7 },
    { coins: 40, weight: 18 },
    { coins: 150, weight: 4 },
    { coins: 100, weight: 8 },
    { randomItem: true, maxRarity: 'rare', weight: 3 },
    { coins: 300, weight: 1.5 },
];

// Предел просмотров рекламы на предмет для этой игры (мифические скины — до 7): поверх правила Shop.js.
if (typeof Shop !== 'undefined' && Shop._limits) {
    const shopLimits = Shop._limits;
    Shop._limits = function () { return Object.assign(shopLimits.call(Shop), { adsMax: typeof GAME_SHOP_ADS_MAX !== 'undefined' ? GAME_SHOP_ADS_MAX : 5 }); };
}
