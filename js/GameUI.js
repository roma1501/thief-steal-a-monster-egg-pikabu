// GameUI.js — интерфейс «Thief Steal a Monster Egg»: глубокий фиолетово-синий с золотом. HUD (счётчик монет, кнопки-квадраты,
// хотбар, рывок и спринт, задание, событие «Золотое яйцо», плашка погони), метки над объектами мира (монстры с доходом,
// яйца с защитой, базы, метка «БАЗА · N м»), подсказки взаимодействия, всплывашки, окна (каркас из готовых картинок
// assets/ui/sp/*) и главное меню. Окна магазина косметики, подарка дня и колеса — GameUIShop.js (тот же каркас UI.window).
// Раскладка HUD — HudLayout: размеры блоков заданы в «em» (16 px × масштаб режима), внутри всё в em.

// Иконки: старые глянцевые (assets/ui/*) и набор своих (assets/ui/sp/icons/*, 256×256 с прозрачным полем).
// Пути — литералами: сборщик берёт только их.
const UI_ICONS = {
    chest: '<img class="ic" src="assets/ui/chest.webp" alt="">',
    question: '<img class="ic" src="assets/ui/question.webp" alt="">',
    boostcash: '<img class="ic" src="assets/ui/cash-bonus.webp" alt="">',
    cart: '<img class="ic" src="assets/ui/shop.webp" alt="">',
    book: '<img class="ic" src="assets/ui/book.webp" alt="">',
    egg: '<img class="ic" src="assets/ui/sp/icons/monster-egg.webp" alt="">',
    goldenegg: '<img class="ic" src="assets/ui/sp/icons/monster-golden-egg.webp" alt="">',
    monster: '<img class="ic" src="assets/ui/sp/icons/monster.webp" alt="">',
    paw: '<img class="ic" src="assets/ui/paw.webp" alt="">',
    gift: '<img class="ic" src="assets/ui/gift.webp" alt="">',
    wheel: '<img class="ic" src="assets/ui/prize-wheel.webp" alt="">',
    gear: '<img class="ic" src="assets/ui/gear.webp" alt="">',
    menu: '<svg viewBox="0 0 24 24"><g fill="url(#gRun)" stroke="#0c0530" stroke-width="1.5"><rect x="3.5" y="4" width="17" height="4.2" rx="2.1"/><rect x="3.5" y="9.9" width="17" height="4.2" rx="2.1"/><rect x="3.5" y="15.8" width="17" height="4.2" rx="2.1"/></g></svg>',
    speed: '<img class="ic" src="assets/ui/sp/icons/speed.webp" alt="">',
    cash: '<img class="ic" src="assets/ui/banknotes.webp" alt="">',
    gem: '<img class="ic gem" src="assets/ui/sp/icons/gem.webp" alt="">',
    autoswing: '<img class="ic" src="assets/ui/sp/icons/auto-swing.webp" alt="">',
    chord: '<img class="ic" src="assets/ui/sp/icons/chord.webp" alt="">',
    dash: '<img class="ic" src="assets/ui/sp/icons/dash.webp" alt="">',
    upgrade: '<img class="ic" src="assets/ui/sp/icons/upgrade.webp" alt="">',
    band: '<img class="ic" src="assets/ui/sp/icons/band.webp" alt="">',
    conveyor: '<img class="ic" src="assets/ui/sp/icons/conveyor.webp" alt="">',
    hand: '<img class="ic" src="assets/ui/sp/icons/hand.webp" alt="">',
    home: '<img class="ic" src="assets/ui/sp/icons/home.webp" alt="">',
    pick: '<svg viewBox="0 0 24 24"><g transform="rotate(32 12 12)"><path d="M2.6 8.4C7 2.6 17 2.6 21.4 8.4c-1.6-.4-3.2-.2-4.6.6C15.4 7.8 13.8 7.3 12 7.3s-3.4.5-4.8 1.7c-1.4-.8-3-1-4.6-.6z" fill="#e4eaff" stroke="#0c0530" stroke-width="1.7" stroke-linejoin="round"/><rect x="10.7" y="7" width="2.6" height="16" rx="1.1" fill="#d38a4a" stroke="#0c0530" stroke-width="1.5"/></g></svg>',
    trophy: '<img class="ic" src="assets/ui/trophy.webp" alt="">',
    trash: '<svg viewBox="0 0 24 24"><path d="M5 7h14l-1.2 13a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" fill="#fff" stroke="#1a1040" stroke-width="1.2"/><path d="M3 5h18M9 5V3h6v2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M10 10v8M14 10v8" stroke="#e8343a" stroke-width="2"/></svg>',
    trident: '<img class="ic" src="assets/ui/timer.webp" alt="">',
    luck: '<img class="ic" src="assets/ui/clover.webp" alt="">',
    star: '<img class="ic" src="assets/ui/star.webp" alt="">',
    lock: '<img class="ic" src="assets/ui/lock.webp" alt="">',
    ad: '<img class="ic" src="assets/ui/watch-video.webp" alt="">',
    jump: '<img class="ic" src="assets/ui/jump-arrow.webp" alt="">',
    crown: '<img class="ic" src="assets/ui/crown.webp" alt="">',
    shield: '<img class="ic" src="assets/ui/sp/icons/shield.webp" alt="">',
    sparkles: '<img class="ic" src="assets/ui/sparkles.webp" alt="">',
    siren: '<svg viewBox="0 0 48 48"><path d="M10 40h28v-5H10z" fill="#4a4f6a" stroke="#0c0530" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 35c0-9 4-17 11-17s11 8 11 17z" fill="#ff3b30" stroke="#0c0530" stroke-width="2.4" stroke-linejoin="round"/><path d="M18 33c0-6 2-11 6-12" stroke="#ffd0c8" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 4v7M8 12l5 5M40 12l-5 5M3 26h6M45 26h-6" stroke="#ffe45c" stroke-width="3.2" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4l14 8-14 8z" fill="#fff" stroke="#0c0530" stroke-width="2" stroke-linejoin="round"/></svg>',
};

// Готовые картинки интерфейса (assets/ui/sp/*, WebP с прозрачностью). Вокруг рисунка в файлах есть прозрачные поля, поэтому
// картинка кладётся фоном элемента так, чтобы в него попадала только видимая часть: SPB[ключ] = [ширина, высота файла,
// x0, y0, x1, y1 — рамка видимой части]. Пути — литералами (сборщик берёт только их).
const SPI = {
    coin: 'assets/ui/sp/coin-counter.webp', coinic: 'assets/ui/sp/coin-counter.webp', income: 'assets/ui/sp/income-pill.webp',
    shop: 'assets/ui/sp/btn-shop.webp', collection: 'assets/ui/sp/btn-monster-collection.webp', title: 'assets/ui/sp/title-plate.webp',
    plate: 'assets/ui/sp/info-plate.webp', bar: 'assets/ui/sp/progress-bar.webp', gold: 'assets/ui/sp/btn-gold.webp',
    rewCoins: 'assets/ui/sp/reward-coins.webp', rewNest: 'assets/ui/sp/reward-nest.webp', coinsic: 'assets/ui/sp/reward-coins.webp', nestic: 'assets/ui/sp/reward-nest.webp',
    rebirth: 'assets/ui/sp/rebirth.webp', frame: 'assets/ui/sp/window-frame.webp',
};
/** @type {Record<string, number[]>} */
const SPB = {
    coin: [640, 206, 0, 26, 638, 181], coinic: [640, 206, 1, 27, 148, 180], income: [560, 210, 21, 44, 551, 160],
    shop: [256, 254, 24, 21, 233, 227], collection: [256, 256, 23, 21, 234, 229], title: [720, 269, 1, 55, 714, 209],
    plate: [640, 199, 1, 30, 639, 154], bar: [640, 214, 0, 64, 638, 149], gold: [640, 262, 1, 43, 638, 216],
    rewCoins: [256, 268, 1, 0, 254, 250], rewNest: [256, 254, 21, 22, 237, 234], coinsic: [256, 268, 18, 28, 240, 176], nestic: [256, 254, 24, 24, 236, 170],
    rebirth: [256, 238, 17, 5, 242, 228],
};
/** Фон элемента из картинки SPI[key], обрезанной по видимой части (растягивается на весь элемент). */
function uiCrop(key) {
    const [W, H, x0, y0, x1, y1] = SPB[key];
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1, f = (n) => +n.toFixed(3);
    return `background:url('${SPI[key]}') ${W > bw ? f(x0 / (W - bw) * 100) : 0}% ${H > bh ? f(y0 / (H - bh) * 100) : 0}% / ${f(W / bw * 100)}% ${f(H / bh * 100)}% no-repeat;`;
}

const UI_CSS = `
:root { --ui-font: Nunito, 'Arial Black', system-ui, sans-serif; --ink: #0c0530; --navy: #1b1250; --navy2: #2a1a6e; --violet: #7b3cff; --cyan: #3cd2ff; --gold: #ffd23a; --uf: 1;
  --tut-bg: #1b1250; --tut-fg: #fff; --tut-accent: #ffd23a; --tut-border: #7b3cff; --tut-font: Nunito, 'Arial Black', system-ui, sans-serif; --tut-radius: 16px; }
#ui { position: fixed; inset: 0; pointer-events: none; z-index: 20; font-family: var(--ui-font); font-weight: 800; color: #fff; user-select: none; -webkit-tap-highlight-color: transparent; }
#ui *, .win *, #prompt * { box-sizing: border-box; }
/* Жирный белый текст с тёмной обводкой (в em: растёт вместе с кеглем) */
.ui-o, .ui-o1, .ui-o3 { --o: .1em; text-shadow: var(--o) 0 0 var(--ink), calc(var(--o) * -1) 0 0 var(--ink), 0 var(--o) 0 var(--ink), 0 calc(var(--o) * -1) 0 var(--ink),
    var(--o) var(--o) 0 var(--ink), calc(var(--o) * -1) var(--o) 0 var(--ink), var(--o) calc(var(--o) * -1) 0 var(--ink), calc(var(--o) * -1) calc(var(--o) * -1) 0 var(--ink),
    0 calc(var(--o) * 1.6) 0 var(--ink), 0 calc(var(--o) * 2.4) calc(var(--o) * 1.4) rgba(0, 0, 0, .35); }
.ui-o1 { --o: .068em; } .ui-o3 { --o: .13em; }
.hl-blk { font-size: calc(16px * var(--hl-k, 1) * var(--uf, 1)); pointer-events: none; }
img.ic { width: 1.5em; height: 1.5em; object-fit: contain; flex: none; pointer-events: none; -webkit-user-drag: none; filter: drop-shadow(0 .08em 0 rgba(0, 0, 0, .35)); }
.coin { display: inline-block; width: 1.15em; height: 1.15em; flex: none; vertical-align: -.22em; ${uiCrop('coinic')} filter: drop-shadow(0 .06em 0 rgba(0, 0, 0, .4)); }
.gemi { display: inline-flex; width: 1.2em; height: 1.2em; flex: none; vertical-align: -.2em; } .gemi svg { width: 100%; height: 100%; }
.pico { object-fit: contain; pointer-events: none; -webkit-user-drag: none; filter: drop-shadow(0 .06em 0 rgba(0, 0, 0, .3)); }
.pico.m-golden { filter: sepia(1) saturate(3.4) hue-rotate(2deg) brightness(1.18) drop-shadow(0 0 .35em rgba(255, 200, 0, .75)); }
.pico.m-diamond { filter: grayscale(.25) sepia(1) saturate(3.2) hue-rotate(148deg) brightness(1.25) drop-shadow(0 0 .35em rgba(80, 220, 255, .85)); }
.pico.m-rainbow { animation: rbHue 2.6s linear infinite; }
@keyframes rbHue { from { filter: hue-rotate(0deg) saturate(1.5) drop-shadow(0 0 .3em rgba(255, 255, 255, .7)); } to { filter: hue-rotate(360deg) saturate(1.5) drop-shadow(0 0 .3em rgba(255, 255, 255, .7)); } }

/* ---- Кнопки «пластик»: толстый тёмный контур, блик сверху, тень снизу ---- */
.rb { --c1: #9af46a; --c2: #38cf3a; --c3: #17a032; position: relative; pointer-events: auto; cursor: pointer; border: .16em solid var(--ink); border-radius: .75em; color: #fff; font: 900 1em/1 var(--ui-font);
      display: inline-flex; align-items: center; justify-content: center; gap: .35em; padding: .5em .9em; background: linear-gradient(var(--c1), var(--c2) 52%, var(--c3));
      box-shadow: inset 0 .16em 0 rgba(255, 255, 255, .5), inset 0 -.3em 0 rgba(0, 0, 0, .22), 0 .2em 0 rgba(0, 0, 0, .42); transition: transform .08s, filter .1s; -webkit-tap-highlight-color: transparent; }
.rb:hover { filter: brightness(1.07); }
.rb:active, .rb.press { transform: translateY(.14em); box-shadow: inset 0 .12em 0 rgba(255, 255, 255, .35), inset 0 -.15em 0 rgba(0, 0, 0, .22), 0 .05em 0 rgba(0, 0, 0, .42); }
.rb[disabled], .rb.off { filter: grayscale(.8) brightness(.82); cursor: default; }
.rb svg { width: 1.45em; height: 1.45em; flex: none; }
.c-green { --c1: #9af46a; --c2: #38cf3a; --c3: #17a032; } .c-blue { --c1: #7ae4ff; --c2: #2a9cf5; --c3: #1568d4; } .c-red { --c1: #ff8a78; --c2: #ef3b2e; --c3: #bd1612; }
.c-orange { --c1: #ffc374; --c2: #ff8a1f; --c3: #e0620a; } .c-yellow { --c1: #fff27c; --c2: #ffc81f; --c3: #ee9608; } .c-purple { --c1: #c98cff; --c2: #8f4dff; --c3: #6228d6; }
.c-gray { --c1: #b4bdda; --c2: #7c88b2; --c3: #566087; } .c-pink { --c1: #ffa4da; --c2: #ff5fa2; --c3: #df3a82; } .c-dark { --c1: #5c4ec4; --c2: #382b98; --c3: #241a6e; }

/* ---- Левый верх: счётчик монет, доход, кристаллы и скорость ---- */
#hud-money { position: fixed; }
#hud-money .coinbar { position: relative; width: 15.6em; height: 3.8em; ${uiCrop('coin')} filter: drop-shadow(0 .14em 0 rgba(0, 0, 0, .3)); }
#hud-money .amt { position: absolute; left: 26%; right: 4%; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 1.95em; font-weight: 900; line-height: 1; white-space: nowrap; }
#hud-money .incpill { position: absolute; left: 3.3em; top: 3.35em; width: 9.8em; height: 2.15em; ${uiCrop('income')} display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .3)); }
#hud-money .incpill span { font-size: 1.15em; font-weight: 900; color: #5dff6a; white-space: nowrap; }
#hud-stats { display: flex; gap: .45em; align-items: center; }
.chip { display: inline-flex; align-items: center; gap: .3em; height: 2.05em; padding: 0 .35em 0 .3em; border-radius: 1.1em; background: linear-gradient(#35239a, #1b1250); border: .15em solid var(--ink);
        box-shadow: inset 0 0 0 .11em #6a3cf0, 0 .12em 0 rgba(0, 0, 0, .35); font-weight: 900; font-size: 1em; white-space: nowrap; }
.chip img.ic, .chip svg { width: 1.45em; height: 1.45em; }
.chip img.ic { width: 1.8em; height: 1.8em; margin: -.2em -.1em -.2em -.15em; }
.chip span { font-size: 1.05em; padding: 0 .1em; }
#hud-band { display: flex; align-items: center; }
.bandchip { display: inline-flex; align-items: center; gap: .4em; height: 1.95em; padding: 0 .8em 0 .35em; border-radius: 1em; background: linear-gradient(#8a4dff, #5a1cf0 60%, #4610d8); border: .15em solid var(--ink); box-shadow: inset 0 0 0 .1em #b58aff, 0 .12em 0 rgba(0, 0, 0, .35); font-weight: 900; font-size: .92em; white-space: nowrap; }
.bandchip img.ic { width: 1.8em; height: 1.8em; margin: -.25em -.1em -.25em -.25em; } .bandchip b { color: #ffe86a; } .bandchip small { font-size: .85em; color: #d8c8ff; }
#hud-conv { display: flex; justify-content: center; }
.cv { display: flex; align-items: center; gap: .5em; height: 100%; padding: 0 1.1em 0 .45em; border-radius: 1.2em; background: linear-gradient(#2e1f8a, #170f4e); border: .16em solid var(--ink); box-shadow: inset 0 0 0 .11em #6a3cf0, 0 .16em 0 rgba(0, 0, 0, .35); white-space: nowrap; }
.cv img.ic { width: 2.5em; height: 2.5em; margin: -.3em -.1em -.3em -.15em; } .cv .tx { display: flex; flex-direction: column; align-items: center; line-height: 1; } .cv .n { font-size: .82em; font-weight: 900; margin-bottom: .1em; } .cv .tm { font-size: 1.3em; font-weight: 900; color: #ffe86a; }
.plus { pointer-events: auto; cursor: pointer; width: 1.45em; height: 1.45em; border-radius: .5em; background: linear-gradient(#9af46a, #17a032); color: #fff; border: .13em solid var(--ink); display: inline-flex; align-items: center; justify-content: center; font-size: .9em; line-height: 1; font-weight: 900; box-shadow: inset 0 .12em 0 rgba(255, 255, 255, .45), inset 0 -.15em 0 rgba(0, 0, 0, .2); }
.plus svg { width: 70%; height: 70%; }

/* ---- Кнопки-квадраты (слева и справа) ---- */
#hud-left, #hud-right { display: flex; flex-direction: column; gap: .4em; align-items: center; }
#hud-left.row, #hud-right.row { flex-direction: row; }
.sqb { --s: 4.2em; position: relative; width: var(--s); height: var(--s); padding: 0; border: 0; background: none; color: #fff; font: inherit; cursor: pointer; pointer-events: auto; flex: none; -webkit-tap-highlight-color: transparent; transition: transform .08s; }
.sqb:hover { filter: brightness(1.1); } .sqb:active { transform: translateY(.1em) scale(.96); }
.sqb .bg { position: absolute; inset: 0; filter: drop-shadow(0 .14em 0 rgba(0, 0, 0, .35)); }
.sqb.i-shop .bg { ${uiCrop('shop')} } .sqb.i-col .bg { ${uiCrop('collection')} }
.sqb.css .bg { border-radius: 22%; background: radial-gradient(ellipse at 50% 0%, #8e52ff 0%, #5a1cf0 46%, #4610d8 100%); border: .13em solid #12063e; box-shadow: inset 0 0 0 .13em #a56fff, inset 0 -.35em .4em rgba(14, 0, 90, .5); }
.sqb .ico { position: absolute; left: 50%; top: 7%; width: 64%; height: 58%; transform: translateX(-50%); object-fit: contain; pointer-events: none; filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .4)); }
.sqb .ico.pico { filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .4)); }
.sqb .lbl b { font-weight: 900; font-size: calc(1em * var(--fit, 1)); }
.sqb .lbl { position: absolute; left: 7%; right: 7%; bottom: 8%; height: 23%; display: flex; align-items: center; justify-content: center; font-size: .66em; font-weight: 900; line-height: 1; white-space: nowrap; overflow: hidden; pointer-events: none; }
.sqb.css .lbl { background: #1a0e58; border-radius: .6em; border: .1em solid #5a2fe0; left: 9%; right: 9%; bottom: 9%; box-shadow: inset 0 .12em .2em rgba(0, 0, 0, .5); }
.sqb.i-shop .lbl { bottom: 9%; } .sqb.i-col .lbl { bottom: 8%; }
.sqb .dot { position: absolute; right: -.25em; top: -.25em; min-width: 1.5em; height: 1.5em; padding: 0 .3em; border-radius: 1em; background: radial-gradient(circle at 40% 30%, #ff7a68, #e0201a); border: .14em solid #fff; box-shadow: 0 .1em 0 rgba(0, 0, 0, .4); display: none; align-items: center; justify-content: center; font-size: .78em; font-weight: 900; line-height: 1; z-index: 2; }
.sqb .dot.on { display: flex; animation: dotPulse .7s ease-in-out infinite alternate; }
.sqb .dot.badge { background: radial-gradient(circle at 40% 30%, #ffe86a, #f0a000); color: #3a2200; border-color: #3a2200; }
#b-super.ready .bg { animation: pulse .6s infinite alternate; }
@keyframes dotPulse { from { transform: scale(1); } to { transform: scale(1.18); } }

/* ---- Правый верх: пауза, настройки, событие, бусты ---- */
#hud-menu { display: flex; gap: .4em; justify-content: flex-end; align-items: center; }
.rnd { pointer-events: auto; cursor: pointer; width: 2.9em; height: 2.9em; border-radius: 50%; padding: 0; border: .16em solid var(--ink); color: #fff; display: inline-flex; align-items: center; justify-content: center;
       background: radial-gradient(circle at 50% 22%, #9a62ff, #5a1cf0 60%, #3a0cb0); box-shadow: inset 0 0 0 .12em #a56fff, 0 .15em 0 rgba(0, 0, 0, .4); }
.rnd:active { transform: translateY(.1em); } .rnd svg, .rnd img.ic { width: 1.45em; height: 1.45em; }
#hud-event { display: flex; justify-content: flex-end; }
.ev { pointer-events: auto; cursor: pointer; display: flex; align-items: center; gap: .4em; height: 100%; width: 100%; padding: 0 .65em 0 .3em; border-radius: 1.2em; background: linear-gradient(#ffe86a, #ffbf1f 55%, #f09a08); border: .16em solid #4a2a00;
       box-shadow: inset 0 .16em 0 rgba(255, 255, 255, .6), inset 0 -.28em 0 rgba(150, 80, 0, .4), 0 .16em 0 rgba(0, 0, 0, .4); }
.ev img.ic { width: 2.5em; height: 2.5em; margin: -.2em -.1em -.2em -.1em; filter: drop-shadow(0 .08em 0 rgba(0, 0, 0, .4)); }
.ev .tx { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0; line-height: 1; }
.ev .n { font-size: .78em; font-weight: 900; white-space: nowrap; margin-bottom: .15em; }
.ev .tm { font-size: 1.12em; font-weight: 900; background: #1b1250; color: #ffe86a; border-radius: .7em; padding: .08em .6em; box-shadow: inset 0 .1em .15em rgba(0, 0, 0, .5); white-space: nowrap; }
.ev.now .tm { color: #ff9a8a; animation: pulse .5s infinite alternate; }
.hl-low .ev .n { display: none; } .hl-low .ev .tm { font-size: 1em; }
#hud-boosts { display: flex; flex-direction: column; gap: .3em; align-items: flex-end; }
.boost { display: flex; align-items: center; gap: .3em; background: linear-gradient(#35239a, #1b1250); border: .14em solid var(--ink); border-radius: .9em; padding: .12em .55em .12em .3em; font-weight: 900; font-size: .9em; pointer-events: auto; cursor: pointer; white-space: nowrap; box-shadow: inset 0 0 0 .1em #6a3cf0; }
.boost img.ic { width: 1.5em; height: 1.5em; } .boost.act { box-shadow: inset 0 0 0 .1em #ffd23a; } .boost.gift { box-shadow: inset 0 0 0 .1em #5dff6a; animation: pulse .7s infinite alternate; }

/* ---- Центр сверху: задание и плашка погони ---- */
#hud-quest { display: flex; justify-content: center; align-items: flex-start; }
#quest { background: linear-gradient(rgba(42, 26, 110, .92), rgba(27, 18, 80, .92)); border: .15em solid var(--ink); border-radius: 1em; box-shadow: inset 0 0 0 .1em #5a3ee0, 0 .15em 0 rgba(0, 0, 0, .3); padding: .32em 1.2em; font-size: 1.2em; font-weight: 900; text-align: center; max-width: 100%; line-height: 1.15; }
#hud-chase { display: none; justify-content: center; }
#hud-chase.on { display: flex; }
.chase { position: relative; width: 100%; padding-bottom: 1.2em; }
.chase .ch-main { display: flex; align-items: center; justify-content: center; gap: .5em; height: 2.8em; padding: 0 1em 0 .5em; border-radius: 1.4em; background: linear-gradient(#ff6a5a, #e8281e 55%, #b81410); border: .17em solid #4a0606;
                  box-shadow: inset 0 .16em 0 rgba(255, 255, 255, .45), inset 0 -.28em 0 rgba(0, 0, 0, .25), 0 .18em 0 rgba(0, 0, 0, .4), 0 0 1.2em rgba(255, 60, 40, .55); animation: pulse .5s infinite alternate; }
.chase .ch-main svg { width: 2.2em; height: 2.2em; flex: none; } .chase .ch-main span { font-size: 1.45em; font-weight: 900; line-height: 1; white-space: nowrap; }
.chase .ch-sub { position: absolute; left: 50%; bottom: 0; transform: translateX(-50%); padding: .12em 1.2em; border-radius: 1em; background: linear-gradient(#35239a, #1b1250); border: .13em solid var(--ink); box-shadow: inset 0 0 0 .09em #6a3cf0; font-size: .95em; font-weight: 900; white-space: nowrap; }

/* ---- Низ: хотбар, автоудар, спринт, рывок, прыжок ---- */
#hud-bottom { display: flex; align-items: flex-end; justify-content: center; gap: .55em; }
#btn-auto { pointer-events: auto; cursor: pointer; width: 5.4em; height: 4.3em; padding: 0 .3em; font-size: 1em; margin-bottom: .15em; flex-direction: column; gap: .06em; line-height: 1; border-radius: 1em; }
#btn-auto .ai { display: flex; width: 2.6em; height: 2.3em; margin-top: -.15em; } #btn-auto .ai img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.3); filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .35)); pointer-events: none; }
#btn-auto .at { width: 2.1em; height: 2.1em; display: none; margin-top: -.1em; } #btn-auto.drop .at { display: block; } #btn-auto.drop .ai { display: none; }
#btn-auto .al { font-size: .76em; white-space: nowrap; font-weight: 900; }
#btn-auto.on { --c1: #9af46a; --c2: #38cf3a; --c3: #17a032; }
#hotbar { display: flex; gap: .55em; align-items: flex-end; }
.slot { --s: 4.8em; --tc: #4a43b8; pointer-events: auto; cursor: pointer; position: relative; width: var(--s); height: var(--s); border-radius: .9em; border: .2em solid color-mix(in srgb, var(--tc) 55%, #4a43b8);
        background: radial-gradient(circle at 50% 80%, color-mix(in srgb, var(--tc) 60%, transparent), transparent 70%), linear-gradient(#2c1f86, #140c44);
        box-shadow: 0 0 0 .14em var(--ink), 0 .26em 0 .14em rgba(0, 0, 0, .35), inset 0 .16em 0 rgba(255, 255, 255, .16), inset 0 -.2em .4em rgba(0, 0, 0, .3); transition: transform .1s; }
.slot.glow { box-shadow: 0 0 0 .14em var(--ink), 0 0 .9em .12em var(--tc), 0 .26em 0 .14em rgba(0, 0, 0, .35), inset 0 .16em 0 rgba(255, 255, 255, .16); }
.slot.sel { border-color: #ffd23a; box-shadow: 0 0 0 .14em var(--ink), 0 0 1em .15em rgba(255, 210, 58, .85), inset 0 .16em 0 rgba(255, 255, 255, .2), inset 0 -.2em .4em rgba(0, 0, 0, .25); transform: translateY(-.2em); }
.slot .num { position: absolute; left: -.5em; top: -.55em; width: 1.6em; height: 1.6em; border-radius: 50%; background: radial-gradient(circle at 40% 30%, #5a4ee0, #1b1250); border: .15em solid var(--ink); display: flex; align-items: center; justify-content: center; font-size: .85em; font-weight: 900; z-index: 3; box-shadow: 0 .12em 0 rgba(0, 0, 0, .35), inset 0 0 0 .08em #7a6cf8; }
.slot.sel .num { background: radial-gradient(circle at 40% 30%, #fff07a, #ffb000); color: #3a2200; text-shadow: none; }
.slot .si { position: absolute; inset: .22em; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: .65em; }
.slot .si img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.32); filter: drop-shadow(0 .12em 0 rgba(0, 0, 0, .35)); pointer-events: none; -webkit-user-drag: none; }
.slot .si img.pico { width: 92%; height: 92%; transform: none; }
.slot span.sl { position: absolute; bottom: .12em; left: .12em; right: .12em; font-size: .56em; font-weight: 900; text-align: center; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: .15em .3em; background: rgba(10, 4, 48, .72); border-radius: .7em; z-index: 2; }
.slot span.sl:empty { display: none; }
.slot .eggb { position: absolute; right: -.4em; top: -.45em; width: 1.9em; height: 1.9em; object-fit: contain; z-index: 3; display: none; filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .45)); pointer-events: none; }
.slot.egg .eggb { display: block; }
.slot.egg .si img.pico { width: 76%; height: 76%; margin-top: -.3em; }
.slot.egg .si::before { content: ''; position: absolute; left: 14%; right: 14%; top: 6%; bottom: 14%; border-radius: 50% 50% 46% 46% / 62% 62% 38% 38%; background: radial-gradient(circle at 35% 30%, #fffaf0, #f2d3a6 60%, #d8a468); border: .12em solid var(--ink); }
.pl-ui #btn-auto { display: none; }
.slot .drop { display: none; position: absolute; right: -.45em; bottom: -.45em; width: 1.5em; height: 1.5em; border-radius: 50%; background: #e5383b; border: .12em solid #fff; align-items: center; justify-content: center; z-index: 4; }
.pl-ui .slot .drop { display: flex; } .slot .drop svg { width: .85em; height: .85em; }
#hud-sprint { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: .1em; }
#hud-sprint .sp-t { font-size: 1.05em; font-weight: 900; line-height: 1; }
#hud-sprint .sp-bar { display: flex; align-items: center; width: 100%; gap: .35em; padding: .15em .5em .15em .35em; border-radius: 1em; background: linear-gradient(#35239a, #1b1250); border: .14em solid var(--ink); box-shadow: inset 0 0 0 .1em #6a3cf0; }
#hud-sprint .sp-bar img.ic { width: 2em; height: 2em; margin: -.3em -.15em -.3em -.25em; flex: none; }
#hud-sprint .sp-track { flex: 1; height: .85em; border-radius: .5em; background: #0e0838; overflow: hidden; box-shadow: inset 0 .1em .2em rgba(0, 0, 0, .6); }
#hud-sprint .sp-track i { display: block; height: 100%; width: 0; border-radius: .5em; background: linear-gradient(#b8f2ff, #3cc8ff 50%, #1a8be0); box-shadow: inset 0 .12em 0 rgba(255, 255, 255, .55); }
#hud-acts { display: flex; align-items: flex-end; justify-content: flex-end; gap: .55em; }
#btn-dash, #btn-chord { position: relative; flex: none; pointer-events: auto; cursor: pointer; border: 0; padding: 0; background: none; color: #fff; font: inherit; -webkit-tap-highlight-color: transparent; }
#btn-dash { width: 6.4em; height: 6.4em; } #btn-chord { width: 4.8em; height: 4.8em; }
.hl-low #btn-dash { width: 5.8em; height: 5.8em; } .hl-low #btn-chord { width: 4.4em; height: 4.4em; }
#btn-chord .dash { background: radial-gradient(circle at 50% 24%, #d9a8ff, #8f4dff 46%, #5a1ccf 100%); border-color: #1b0a58; box-shadow: inset 0 0 0 .17em #c99bff, inset 0 -.55em .7em rgba(40, 0, 130, .5), 0 .26em 0 rgba(0, 0, 0, .42); }
#btn-chord .dash .rn { width: 2.4em; height: 2.4em; margin-top: -.1em; } #btn-chord .dash .dl { font-size: .8em; }
#btn-chord.ready .dash { animation: chordPulse .8s ease-in-out infinite alternate; }
@keyframes chordPulse { from { box-shadow: inset 0 0 0 .17em #c99bff, inset 0 -.55em .7em rgba(40, 0, 130, .5), 0 .26em 0 rgba(0, 0, 0, .42), 0 0 0 rgba(190, 120, 255, 0); } to { box-shadow: inset 0 0 0 .17em #c99bff, inset 0 -.55em .7em rgba(40, 0, 130, .5), 0 .26em 0 rgba(0, 0, 0, .42), 0 0 .9em .2em rgba(190, 120, 255, .8); } }
#btn-chord:active .dash { transform: scale(.95); }
.dash { position: relative; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 24%, #ffd88a, #ff9a1f 46%, #e45a0a 100%);
        border: .2em solid #3a1200; box-shadow: inset 0 0 0 .17em #ffc062, inset 0 -.55em .7em rgba(150, 40, 0, .5), 0 .26em 0 rgba(0, 0, 0, .42); }
.dash { gap: .12em; padding-bottom: .1em; }
.dash .rn { width: 3.1em; height: 3.1em; flex: none; filter: drop-shadow(0 .1em 0 rgba(0, 0, 0, .3)); } .dash .rn img { width: 100%; height: 100%; object-fit: contain; transform: scale(1.1); filter: none; pointer-events: none; }
.dash .dl { font-size: .95em; font-weight: 900; line-height: 1; text-transform: uppercase; flex: none; }
.keyb { position: absolute; left: -.35em; top: -.2em; z-index: 3; font: 900 .62em/1 var(--ui-font); padding: .22em .55em; border-radius: .6em; background: #fff; color: #1b1250; border: .2em solid var(--ink); box-shadow: 0 .18em 0 rgba(0, 0, 0, .4); display: none; pointer-events: none; }
html:not(.hl-touch) .keyb { display: block; }
.dash .cd { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(rgba(16, 6, 70, .66) calc(var(--r, 0) * 360deg), transparent 0); }
#btn-dash.ready .dash { animation: dashPulse .8s ease-in-out infinite alternate; } #btn-dash:active .dash { transform: scale(.95); }
@keyframes dashPulse { from { box-shadow: inset 0 0 0 .17em #ffc062, inset 0 -.55em .7em rgba(150, 40, 0, .5), 0 .26em 0 rgba(0, 0, 0, .42), 0 0 0 rgba(255, 170, 40, 0); } to { box-shadow: inset 0 0 0 .17em #ffc062, inset 0 -.55em .7em rgba(150, 40, 0, .5), 0 .26em 0 rgba(0, 0, 0, .42), 0 0 .9em .2em rgba(255, 170, 40, .75); } }
#jump-btn { pointer-events: auto; position: fixed; border-radius: 50%; background: radial-gradient(circle at 50% 24%, rgba(110, 80, 255, .85), rgba(40, 20, 150, .85)); border: .2em solid #0c0530; box-shadow: inset 0 0 0 .14em rgba(170, 130, 255, .8), 0 .2em 0 rgba(0, 0, 0, .4); display: none; align-items: center; justify-content: center; padding: 0; font-size: calc(16px * var(--hl-k, 1) * var(--uf, 1)); }
#jump-btn img.ic { width: 2.6em; height: 2.6em; } .hl-touch #jump-btn { display: flex; }
#hud-offer { position: fixed; z-index: 21; transform: translateX(-50%); display: flex; gap: .4em; font-size: calc(15px * var(--hl-k, 1)); pointer-events: none; }
#hud-offer .rb { font-size: 1em; padding: .35em .7em; white-space: nowrap; } #hud-offer .rb img.ic { width: 1.5em; height: 1.5em; }

/* ---- Метки над объектами мира ---- */
#labels { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 15; font-family: var(--ui-font); }
.lb { transition: opacity .15s; position: absolute; left: 0; top: 0; transform: translate(-50%, -100%); text-align: center; white-space: nowrap; font-weight: 900; color: #fff; will-change: transform; line-height: 1.05; font-size: 15px; }
.lb .nm { font-size: 17px; } .lb .rr { font-size: 13px; margin-top: 1px; }
.lb .inc { display: inline-flex; align-items: center; gap: 4px; margin-top: 3px; padding: 1px 10px 1px 3px; border-radius: 999px; background: rgba(22, 10, 70, .86); border: 2px solid #5a3ee0; color: #6dff6a; font-size: 16px; text-shadow: 0 2px 0 #0c0530; }
.lb .inc .coin { width: 19px; height: 19px; }
.lb .tm { font-size: 15px; color: #ff9a8a; margin-bottom: 2px; } .lb .mut { font-size: 12px; color: #ffd23a; }
.lb .hp { position: relative; width: 132px; height: 17px; margin: 4px auto 0; background: #120a40; border: 2px solid var(--ink); border-radius: 10px; box-shadow: 0 0 0 2px #6a3cf0, 0 3px 0 2px rgba(0, 0, 0, .35); overflow: hidden; }
.lb .hp i { position: absolute; inset: 0; background: linear-gradient(#c8f6ff, #3cc8ff 50%, #1a8be0); transform-origin: left center; border-radius: 8px; }
.lb .hp em { position: absolute; inset: 0; font-style: normal; font-size: 11px; line-height: 13px; color: #fff; text-shadow: 0 1px 0 #0c0530, 1px 0 0 #0c0530, -1px 0 0 #0c0530, 0 -1px 0 #0c0530; }
.lb .face { font-size: 32px; line-height: 1; } .lb .diff { font-size: 18px; }
.lb.guard .gd { display: inline-flex; align-items: center; gap: 6px; padding: 2px 12px 2px 8px; border-radius: 999px; background: linear-gradient(#7a1a2a, #3e0c1e); border: 2px solid #ff6a5a; }
.lb.name .nm { font-size: 14px; padding: 1px 9px; border-radius: 999px; background: rgba(22, 10, 70, .6); }
.lb.shop .pl { display: inline-block; padding: 3px 14px; border-radius: 12px; background: linear-gradient(#2c1d86, #170f4e); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px var(--pc, #4fd6ff), 0 3px 0 rgba(0, 0, 0, .35); font-size: 18px; }
.lb.base .pl { display: inline-flex; align-items: center; gap: 6px; padding: 3px 16px; border-radius: 12px; font-size: 20px; border: 3px solid #0c0530; box-shadow: 0 3px 0 rgba(0, 0, 0, .35), inset 0 3px 0 rgba(255, 255, 255, .35); }
.lb.base .pl.me { background: linear-gradient(#58d4ff, #1c86e8); } .lb.base .pl.foe { background: linear-gradient(#ff7a68, #c01c1a); font-size: 17px; }
.lb.base .sh { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; padding: 1px 12px 1px 6px; border-radius: 999px; background: rgba(22, 10, 70, .86); border: 2px solid #3cd2ff; font-size: 15px; color: #bff0ff; }
.lb.base .sh img { width: 26px; height: 26px; margin: -4px 0 -4px -4px; }
.lb.home { z-index: 4; } .lb.home .hm { display: inline-flex; align-items: center; gap: 7px; padding: 4px 18px 4px 10px; border-radius: 999px; background: linear-gradient(#58d4ff, #1c7fe0); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .55), 0 3px 0 rgba(0, 0, 0, .35), 0 0 16px rgba(60, 210, 255, .6); font-size: 20px; }
.lb.home .hm img { width: 38px; height: 38px; margin: -8px -2px -8px -6px; flex: none; } .lb.home .ar { width: 0; height: 0; margin: 2px auto 0; border: 11px solid transparent; border-top: 13px solid #fff; border-bottom: 0; filter: drop-shadow(0 2px 0 #0c0530); animation: bobY .6s ease-in-out infinite alternate; }
@keyframes bobY { from { transform: translateY(-3px); } to { transform: translateY(4px); } }
.lb.offer .pl { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 14px 5px; border-radius: 14px; background: linear-gradient(#2c1d86, #170f4e); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px #6a3cf0, 0 3px 0 rgba(0, 0, 0, .35); }
.lb.offer .pl.rare { box-shadow: inset 0 0 0 2px #ffd23a, 0 0 14px rgba(255, 210, 58, .7), 0 3px 0 rgba(0, 0, 0, .35); } .lb.offer .nm { font-size: 17px; }
.lb.offer .pr { display: inline-flex; align-items: center; gap: 5px; font-size: 19px; font-weight: 900; color: #6dff6a; text-shadow: 0 2px 0 #0c0530; } .lb.offer .pr.no { color: #ff7a6a; } .lb.offer .pr .coin { width: 21px; height: 21px; }
.lb.offer .rareb { padding: 0 12px; margin-bottom: 3px; border-radius: 999px; background: linear-gradient(#fff07a, #ffb000); border: 3px solid #4a2a00; color: #fff; font-size: 14px; animation: pulse .5s infinite alternate; }
.lb.say { z-index: 3; }
.lb.say .bub { background: #fff; color: #1b1250; border: 3px solid #0c0530; border-radius: 16px; padding: 5px 12px; font-size: 15px; font-weight: 900; text-shadow: none; max-width: 230px; white-space: normal; line-height: 1.15; position: relative; animation: toastIn .2s ease-out; }
.lb.say .bub::after { content: ''; position: absolute; left: 50%; bottom: -12px; transform: translateX(-50%); border: 9px solid transparent; border-top-color: #0c0530; }
.rbw { background: linear-gradient(90deg, #ff3b3b, #ff8a1f, #ffe14a, #3bdc5a, #3b8bff, #a54dff, #ff3b3b); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent !important; text-shadow: none !important;
  filter: drop-shadow(1.5px 0 0 #0c0530) drop-shadow(-1.5px 0 0 #0c0530) drop-shadow(0 1.5px 0 #0c0530) drop-shadow(0 -1.5px 0 #0c0530); animation: rbwMove 2.4s linear infinite; }
@keyframes rbwMove { from { background-position: 0% 0 } to { background-position: 200% 0 } }

/* ---- Подсказка взаимодействия ---- */
#prompt { position: fixed; left: 0; top: 0; transform: translate(-50%, -50%); display: none; pointer-events: auto; z-index: 18; font-family: var(--ui-font); cursor: pointer; }
#prompt .pk { display: flex; align-items: center; gap: 10px; background: linear-gradient(#2a1a6e, #170f4e); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px #6a3cf0, 0 4px 0 rgba(0, 0, 0, .4); border-radius: 14px; padding: 5px 16px 5px 5px; }
#prompt .key { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(#fff, #d8d4ff); color: #1b1250; border: 2px solid #0c0530; font-weight: 900; font-size: 20px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; box-shadow: inset 0 -3px 0 rgba(60, 40, 160, .25); }
#prompt .key span { position: relative; z-index: 1; } #prompt .key i { position: absolute; left: 0; bottom: 0; height: 100%; background: rgba(60, 220, 90, .65); width: 0; }
#prompt .pic { display: none; width: 44px; height: 44px; margin: -6px -4px -6px -2px; object-fit: contain; flex: none; filter: drop-shadow(0 2px 0 rgba(0, 0, 0, .35)); pointer-events: none; -webkit-user-drag: none; } #prompt .pk.hasic .pic { display: block; }
#prompt .t1 { font-size: 17px; font-weight: 900; color: #fff; text-transform: uppercase; text-shadow: 0 2px 0 #0c0530; } #prompt .t2 { font-size: 12px; font-weight: 800; color: #bfc6ff; }

/* ---- Всплывающие ---- */
#toasts { position: fixed; left: 50%; top: 17%; transform: translateX(-50%); width: min(90vw, 640px); display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 30; pointer-events: none; font-family: var(--ui-font); }
.toast { font-weight: 900; font-size: clamp(14px, 2.4vw, 21px); line-height: 1.15; text-align: center; max-width: 100%; padding: .12em .8em; border-radius: 999px; background: rgba(27, 18, 80, .55); animation: toastIn .25s ease-out, toastOut .4s ease-in forwards; animation-delay: 0s, var(--d, 2.2s); }
@keyframes toastIn { from { transform: scale(.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }
@keyframes toastOut { to { transform: translateY(-14px); opacity: 0 } }
@keyframes pulse { from { transform: scale(1) } to { transform: scale(1.07) } }
.floater { position: fixed; z-index: 16; font-family: var(--ui-font); font-weight: 900; pointer-events: none; transform: translate(-50%, -50%); animation: floatUp 1.1s ease-out forwards; white-space: nowrap; }
@keyframes floatUp { 0% { opacity: 0; transform: translate(-50%, -30%) scale(.5) } 15% { opacity: 1; transform: translate(-50%, -60%) scale(1.15) } 100% { opacity: 0; transform: translate(-50%, -180%) scale(1) } }
.bubble { background: #fff; color: #1b1250; border-radius: 14px; padding: 4px 12px; font-size: 22px; border: 3px solid #0c0530; }

/* ---- Окна: рамка из window-frame.webp, заголовок на title-plate.webp, красная кнопка закрытия ---- */
#modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 40; padding: 40px 8px 8px; background: rgba(12, 4, 50, .45); pointer-events: auto; font-family: var(--ui-font); font-weight: 800; color: #fff; }
#modal.open { display: flex; } #modal.mod-bare { background: radial-gradient(ellipse at 50% 45%, rgba(255, 190, 60, .28), rgba(14, 4, 60, .78) 75%); }
.win { --fw: 15px; position: relative; width: min(94vw, var(--ww, 860px)); max-height: calc(100vh - 48px); display: flex; flex-direction: column; font-size: 16px;
       border-style: solid; border-color: transparent; border-width: calc(var(--fw) * 1.37) var(--fw) calc(var(--fw) * 1.08) var(--fw);
       border-image: url('${SPI.frame}') 52 38 41 38 fill / calc(var(--fw) * 1.37) var(--fw) calc(var(--fw) * 1.08) var(--fw) stretch; animation: winIn .2s ease-out; filter: drop-shadow(0 .4em 0 rgba(0, 0, 0, .35)); }
@keyframes winIn { from { transform: scale(.88); opacity: 0 } to { transform: scale(1); opacity: 1 } }
.win-h { position: absolute; left: 50%; top: calc(var(--fw) * -1.37 - 1.1em); transform: translateX(-50%); z-index: 4; ${uiCrop('title')} min-width: 11em; max-width: calc(100% - 3.5em); padding: .42em 2.2em .62em; font-size: clamp(17px, 3.3vw, 28px); line-height: 1.1; text-align: center; white-space: nowrap; filter: drop-shadow(0 .12em 0 rgba(0, 0, 0, .35)); }
.win-h h2 { margin: 0; font: inherit; font-weight: 900; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; }
.win-x { position: absolute; z-index: 5; right: calc(var(--fw) * -1.1); top: calc(var(--fw) * -1.37 - 22px); width: 44px; height: 44px; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #3a0606; background: radial-gradient(circle at 50% 24%, #ff9a88, #ea2a20 58%, #b0120c);
         box-shadow: inset 0 3px 0 rgba(255, 255, 255, .45), inset 0 -4px 0 rgba(0, 0, 0, .2), 0 4px 0 rgba(0, 0, 0, .4); }
.win-x svg { width: 64%; height: 64%; pointer-events: none; } .win-x:active { transform: translateY(2px); }
.win-b { --pt: 6px; --px: 10px; --pb: 10px; padding: var(--pt) var(--px) var(--pb); overflow: auto; flex: 1; min-height: 0; color: #fff; -webkit-overflow-scrolling: touch; margin-top: 1.3em; }
.win-b::-webkit-scrollbar { height: 10px; width: 10px; } .win-b::-webkit-scrollbar-thumb { background: #5a3ee0; border-radius: 6px; border: 2px solid #1b1250; } .win-b::-webkit-scrollbar-track { background: rgba(0, 0, 0, .25); border-radius: 6px; }
.win.bare { border: 0; border-image: none; filter: none; background: none; width: min(96vw, var(--ww, 560px)); max-height: calc(100vh - 24px); }
.win.bare .win-b { margin: 0; padding: 0; overflow: visible; }
.row { display: flex; gap: 12px; } .cards { display: flex; gap: 12px; overflow-x: auto; padding: 6px 4px 10px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.card { background: linear-gradient(#33249c, #1d1366); border: 3px solid var(--ink); box-shadow: inset 0 0 0 2px #5a3ee0, 0 3px 0 rgba(0, 0, 0, .3); border-radius: 14px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; color: #fff; font-weight: 900; }
.card.rare-epic { background: linear-gradient(#6a38c8, #3a1c82); box-shadow: inset 0 0 0 2px #c080ff, 0 3px 0 rgba(0, 0, 0, .3); }
.card.rare-legendary { background: linear-gradient(#a8344a, #5a1230); box-shadow: inset 0 0 0 2px #ff8a7a, 0 3px 0 rgba(0, 0, 0, .3); }
.card.gold { background: linear-gradient(#b88a24, #5a3a0c); box-shadow: inset 0 0 0 2px #ffd23a, 0 3px 0 rgba(0, 0, 0, .3); }
.card .ttl { font-size: 18px; text-align: center; } .card .sub { font-size: 13px; color: #ffd23a; }
.card .acts { display: flex; flex-direction: column; gap: 6px; width: 100%; } .card .acts .rb { width: 100%; font-size: 15px; padding: .4em .5em; }
.grid.pets { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); }
.card .buff { display: flex; align-items: center; gap: .3em; font-size: 14px; color: #ffe27a; } .card .buff img.ic, .card .buff svg { width: 1.4em; height: 1.4em; }
.card.eq { box-shadow: inset 0 0 0 3px #ffd23a, 0 0 14px rgba(255, 210, 58, .5); padding-top: 26px; } .card .tag { position: absolute; left: 50%; transform: translateX(-50%); top: 6px; white-space: nowrap; font-size: 11px; padding: 2px 8px; border-radius: 999px; background: #ffd23a; color: #3a2a00; text-shadow: none; border: 2px solid var(--ink); }
.pill { display: inline-flex; align-items: center; justify-content: center; gap: .4em; background: linear-gradient(#20156e, #130b44); border: 3px solid var(--ink); box-shadow: inset 0 0 0 2px #4a2fb8; border-radius: 999px; padding: 4px 14px; font-weight: 900; font-size: 17px; text-align: center; }
.pill.bf { color: #ffe27a; gap: .3em; } .pill.bf img.ic, .pill.bf svg { width: 1.3em; height: 1.3em; }
.card img:not(.ic), .card canvas { width: 118px; height: 118px; object-fit: contain; }
.card div.ic { display: flex; align-items: center; justify-content: center; width: 118px; height: 118px; }
.tabs { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; } .tabs .rb { font-size: 15px; padding: 6px 12px; }
.note { color: #cfd0ff; font-weight: 800; font-size: 14px; }
.lb-list { display: flex; flex-direction: column; gap: 6px; } .lb-row { display: flex; align-items: center; gap: 10px; background: linear-gradient(#251a78, #170f4e); border: 2px solid #3a2a9a; border-radius: 12px; padding: 6px 12px; font-weight: 900; }
.lb-row.me { border-color: #ffd23a; background: linear-gradient(#5a3e14, #2e1c08); } .lb-row img { width: 34px; height: 34px; border-radius: 50%; } .lb-row .v { margin-left: auto; color: #6dff6a; }
.set-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 12px; padding: 10px 12px; background: linear-gradient(#251a78, #170f4e); border: 2px solid #3a2a9a; box-shadow: inset 0 .1em 0 rgba(255, 255, 255, .08); border-radius: 14px; margin-bottom: 8px; font-weight: 900; font-size: 18px; }
.set-row .rb { font-size: 16px; padding: .4em .75em; } .set-opts { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
.prog { height: 14px; background: #0e0838; border: 2px solid var(--ink); box-shadow: 0 0 0 2px #4a2fb8; border-radius: 8px; overflow: hidden; } .prog i { display: block; height: 100%; background: linear-gradient(#fff07a, #ffc81f 55%, #ee9608); border-radius: 6px; }
.menu-btns { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.win-b > .menu-btns .rb { min-width: 11em; font-size: 20px; padding: .55em 1.2em; }
.sup-prize { display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 14px; background: linear-gradient(135deg, rgba(255, 210, 58, .28), rgba(196, 92, 255, .28)); border: 3px solid #ffd23a; margin-bottom: 12px; }
.sup-prize .pic { width: 110px; height: 110px; flex: none; display: flex; align-items: center; justify-content: center; } .sup-prize .pic img { width: 110px; height: 110px; object-fit: contain; }
.sup-steps { display: flex; gap: 8px; margin: 10px 0; } .sup-steps i { flex: 1; height: 18px; border-radius: 8px; background: #0e0838; border: 3px solid var(--ink); box-shadow: 0 0 0 2px #4a2fb8; }
.sup-steps i.on { background: linear-gradient(#fff07a, #ffbf1f); }
.eggpill { display: inline-flex; align-items: center; gap: 8px; padding: 4px 14px 4px 6px; border-radius: 14px; background: linear-gradient(#20156e, #130b44); border: 3px solid var(--ink); box-shadow: inset 0 0 0 2px #4a2fb8; font-size: 14px; }
.eggpill .pico { width: 40px; height: 40px; }
@media (max-height: 460px) { .win { --fw: 11px; max-height: calc(100vh - 40px); } .win-b { --pt: 4px; --px: 6px; --pb: 6px; } .win-x { width: 36px; height: 36px; } .card img:not(.ic), .card canvas, .card div.ic { width: 84px; height: 84px; } .card .ttl { font-size: 14px; } #modal { padding-top: 32px; } }
@media (max-width: 520px) { .win { --fw: 11px; } .win-b { --pt: 4px; --px: 4px; --pb: 8px; } .win-x { width: 38px; height: 38px; } .win-h { padding-left: 1.5em; padding-right: 1.5em; font-size: clamp(15px, 4.2vw, 24px); } }

/* ---- Коллекция ---- */
.col-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.col-top .tabs { margin: 0; flex: 1 1 auto; min-width: 0; } .col-top .tabs .rb { flex: 1; min-width: 0; font-size: 16px; padding: .45em .5em; }
.col-top .cnt { font-size: 26px; font-weight: 900; white-space: nowrap; color: #ffd23a; } .col-top .cnt small { font-size: .8em; color: #fff; }
.cgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 9px; }
.cc { position: relative; aspect-ratio: 1 / 1.08; border-radius: 14px; border: 3px solid var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 4px 4px 6px; overflow: hidden; --cc: #3cd2ff; background: radial-gradient(circle at 50% 38%, #1a4a9a, #0d1f5e 75%); box-shadow: inset 0 0 0 3px var(--cc), 0 3px 0 rgba(0, 0, 0, .35); }
.cc.t-rare { --cc: #a45dff; background: radial-gradient(circle at 50% 38%, #4a2aa8, #1e0f62 75%); }
.cc.t-legend { --cc: #ffc21a; background: radial-gradient(circle at 50% 38%, #8a3a2a, #3a1020 78%); }
.cc .pico { position: absolute; left: 8%; right: 8%; top: 5%; width: 84%; height: 66%; object-fit: contain; } .cc .nm { position: relative; font-size: 15px; font-weight: 900; line-height: 1; margin-top: auto; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cc .star { position: absolute; left: 7px; top: 6px; width: 26px; height: 26px; filter: drop-shadow(0 2px 0 rgba(0, 0, 0, .4)); z-index: 2; }
.cc .dots { position: absolute; right: 7px; top: 8px; display: flex; gap: 3px; z-index: 2; } .cc .dots i { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--ink); background: rgba(0, 0, 0, .55); }
.cc.lock { background: radial-gradient(circle at 50% 38%, #2a3358, #141a38 80%); --cc: #5a6490; } .cc.lock .pico { filter: brightness(0); opacity: .5; }
.cc .lk { position: absolute; right: 7px; top: 6px; width: 28px; height: 28px; z-index: 2; opacity: .9; }
.col-note { margin-top: 10px; text-align: center; font-size: 15px; color: #ffe86a; }

/* ---- Перерождение ---- */
.rb-wrap, .rb-l, .rb-r { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; width: 100%; }
.rb-ic { position: relative; width: 150px; height: 140px; ${uiCrop('rebirth')} margin-top: -2px; filter: drop-shadow(0 6px 0 rgba(0, 0, 0, .3)) drop-shadow(0 0 18px rgba(200, 80, 255, .6)); animation: rbSpin 4s ease-in-out infinite alternate; }
@keyframes rbSpin { from { transform: rotate(-6deg) scale(1); } to { transform: rotate(6deg) scale(1.05); } }
.rb-wrap .rst { font-size: 16px; font-weight: 800; color: #e6e0ff; } .rb-lv { font-size: 30px; font-weight: 900; line-height: 1; } .rb-lv b { color: #ffd23a; } .rb-lv em { font-style: normal; color: #3cd2ff; margin: 0 .2em; }
.rb-bar { position: relative; width: 100%; max-width: 400px; aspect-ratio: 639 / 86; ${uiCrop('bar')} filter: drop-shadow(0 3px 0 rgba(0, 0, 0, .3)); }
.rb-bar .cov { position: absolute; top: 21%; bottom: 17%; right: 14.4%; background: #130b44; border-radius: 0 999px 999px 0; box-shadow: inset 0 3px 4px rgba(0, 0, 0, .6); }
.rb-bar span { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 900; }
.rb-rew { display: flex; gap: 12px; width: 100%; max-width: 400px; justify-content: center; }
.rw { position: relative; flex: 1; aspect-ratio: 1 / 1.02; max-width: 190px; filter: drop-shadow(0 4px 0 rgba(0, 0, 0, .3)); } .rw.cn { ${uiCrop('rewCoins')} } .rw.ne { ${uiCrop('rewNest')} }
.rw span { position: absolute; left: 8%; right: 8%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 900; white-space: nowrap; } .rw.cn span { top: 70%; height: 17%; } .rw.ne span { top: 73%; height: 17%; }
.gbtn { position: relative; width: 100%; max-width: 400px; aspect-ratio: 638 / 174; border: 0; padding: 0; background: none; ${uiCrop('gold')} cursor: pointer; pointer-events: auto; color: #fff; font: 900 24px/1 var(--ui-font); filter: drop-shadow(0 4px 0 rgba(0, 0, 0, .35)); display: flex; align-items: center; justify-content: center; padding-left: 22%; padding-right: 4%; transition: transform .08s; }
.gbtn:active { transform: translateY(3px); } .gbtn.off { filter: grayscale(.55) brightness(.82) drop-shadow(0 4px 0 rgba(0, 0, 0, .35)); cursor: default; }
.gbtn.go { animation: pulse .7s ease-in-out infinite alternate; }

@media (max-height: 460px) and (orientation: landscape) { .win.w-rebirth { width: min(96vw, 740px); } .w-rebirth .rb-wrap { flex-direction: row; gap: 14px; align-items: center; } .w-rebirth .rb-l { width: 36%; gap: 6px; } .w-rebirth .rb-r { width: 64%; gap: 6px; }
  .w-rebirth .rb-ic { width: 96px; height: 90px; } .w-rebirth .rb-lv { font-size: 24px; } .w-rebirth .rst { font-size: 13px; } .w-rebirth .rb-rew { gap: 8px; } .w-rebirth .rw { max-width: 120px; } .w-rebirth .rw span { font-size: 12px; } .w-rebirth .gbtn { max-width: 290px; font-size: 20px; } .w-rebirth .rb-bar span { font-size: 14px; } .w-rebirth .note { font-size: 12px; } }
/* ---- Улучшения ---- */
.up-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px 12px 14px; margin-bottom: 8px; aspect-ratio: auto; min-height: 92px; ${uiCrop('plate')} }
.up-ic { flex: none; width: 66px; height: 66px; display: flex; align-items: center; justify-content: center; } .up-ic i { display: block; width: 100%; height: 100%; } .up-ic img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 3px 0 rgba(0, 0, 0, .35)); }
.up-ic .nest { height: 70%; ${uiCrop('nestic')} filter: drop-shadow(0 3px 0 rgba(0, 0, 0, .35)); } .up-ic .cns { height: 70%; ${uiCrop('coinsic')} filter: drop-shadow(0 3px 0 rgba(0, 0, 0, .35)); }
.up-tx { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; } .up-tx .nm { font-size: 19px; line-height: 1.05; } .up-tx .v { font-size: 14px; color: #cfe0ff; font-weight: 800; } .up-tx .pr { font-size: 19px; display: flex; align-items: center; gap: 5px; line-height: 1.1; }
.up-tx .lv { font-size: 12px; color: #ffe86a; }
.up-buy { flex: none; width: 58px; height: 58px; padding: 0; font-size: 20px; border-radius: 14px; } .up-buy svg { width: 34px; height: 34px; } .up-buy.off { --c1: #aeb7d6; --c2: #7c88b2; --c3: #566087; }
.up-max { flex: none; padding: 6px 14px; border-radius: 999px; background: #0e0838; border: 2px solid #ffd23a; color: #ffd23a; font-size: 16px; font-weight: 900; }
.up-sh .rb { min-width: 110px; font-size: 16px; padding: .5em .8em; }

/* ---- Окно «Новый монстр!» ---- */
.ht { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 4px 4px 0; }
.ht-title { display: inline-flex; align-items: center; gap: 10px; padding: .3em 1.2em; border-radius: 999px; background: linear-gradient(#a45dff, #6a2ad8 55%, #4a14b0); border: 4px solid #1b0a58; box-shadow: inset 0 3px 0 rgba(255, 255, 255, .45), 0 5px 0 rgba(0, 0, 0, .35), 0 0 0 3px #ffd23a; font-size: clamp(22px, 5.2vw, 38px); font-weight: 900; line-height: 1; white-space: nowrap; animation: pulse .9s ease-in-out infinite alternate; }
.ht-title img.ic { width: 1.3em; height: 1.3em; }
.ht-stage { position: relative; width: min(60vw, 290px, 37vh); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
.ht-stage .rays { position: absolute; inset: -34%; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255, 220, 90, .55) 0deg 9deg, rgba(255, 220, 90, 0) 9deg 20deg); -webkit-mask: radial-gradient(circle, #000 12%, transparent 66%); mask: radial-gradient(circle, #000 12%, transparent 66%); animation: raySpin 14s linear infinite; }
@keyframes raySpin { to { transform: rotate(360deg); } }
.ht-stage .pico { position: relative; width: 94%; height: 94%; animation: htPop .6s cubic-bezier(.2, 1.6, .4, 1) both, htBob 2.4s ease-in-out .6s infinite alternate; filter: drop-shadow(0 6px 0 rgba(0, 0, 0, .3)); }
.ht-stage .pico.m-golden, .ht-stage .pico.m-diamond { filter: none; }
@keyframes htPop { from { transform: scale(.2) rotate(-12deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } } @keyframes htBob { from { transform: translateY(0) rotate(-1.5deg); } to { transform: translateY(-6px) rotate(1.5deg); } }
.ht-stage .sp { position: absolute; font-size: 30px; line-height: 1; animation: twinkle 1.3s ease-in-out infinite alternate; filter: drop-shadow(0 2px 0 rgba(0, 0, 0, .35)); } .ht-stage .sp img { width: 1em; height: 1em; }
@keyframes twinkle { from { transform: scale(.6) rotate(-20deg); opacity: .6; } to { transform: scale(1.15) rotate(20deg); opacity: 1; } }
.ht-plate { min-width: min(80vw, 300px); padding: 6px 20px 8px; border-radius: 18px; background: linear-gradient(#2a1a6e, #170f4e); border: 4px solid #0c0530; box-shadow: inset 0 0 0 3px #6a3cf0, 0 5px 0 rgba(0, 0, 0, .35); display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ht-plate .nm { font-size: clamp(24px, 5.6vw, 38px); font-weight: 900; line-height: 1; text-transform: uppercase; } .ht-plate .rr { padding: 1px 18px; border-radius: 999px; font-size: 18px; font-weight: 900; text-transform: uppercase; border: 3px solid var(--ink); background: var(--rc, #888); }
.ht-plate .inc { font-size: 24px; font-weight: 900; color: #6dff6a; display: flex; align-items: center; gap: 6px; } .ht-plate .inc .coin { width: 28px; height: 28px; }
.ht-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; width: 100%; }
.ht-btns .rb { flex: 1 1 150px; max-width: 250px; font-size: clamp(18px, 4.2vw, 26px); padding: .55em .8em; border-radius: 16px; } .ht-btns .rb svg { width: 1.5em; height: 1.5em; } .ht-btns .rb img.ic { width: 1.4em; height: 1.4em; }
@media (max-height: 460px) and (orientation: landscape) { .win.bare { width: min(96vw, 760px); } .ht { display: grid; grid-template-columns: auto 1fr; grid-template-areas: 'ti ti' 'st pl' 'st bt'; align-items: center; gap: 6px 16px; } .ht-title { grid-area: ti; justify-self: center; font-size: 22px; } .ht-stage { grid-area: st; width: min(34vw, 40vh, 200px); } .ht-plate { grid-area: pl; min-width: 0; } .ht-btns { grid-area: bt; } .ht-btns .rb { font-size: 18px; } }

/* ---- Главное меню ---- */
.menu-screen { color: #fff; position: fixed; inset: 0; z-index: 35; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 2vh; pointer-events: auto; font-family: var(--ui-font); overflow: hidden;
   background: radial-gradient(ellipse at 50% 42%, rgba(60, 30, 180, 0) 22%, rgba(36, 14, 120, .55) 68%, rgba(14, 4, 56, .86) 100%); }
.menu-screen.open { display: flex; }
.menu-logo { width: min(86vw, 520px, 56vh * 1.437); height: auto; filter: drop-shadow(0 .35em 0 rgba(0, 0, 0, .35)) drop-shadow(0 0 1.2em rgba(120, 60, 255, .6)); animation: logoBob 3.2s ease-in-out infinite alternate; pointer-events: none; position: relative; z-index: 2; }
/* Пикабу: название только по-русски — текстовый логотип в цветах картинки */
.menu-logo-ru { display: flex; flex-direction: column; align-items: center; line-height: .9; font-weight: 900; text-transform: uppercase; letter-spacing: .02em; font-size: min(15vw, 104px, 11vh); -webkit-text-stroke: .14em #3a1580; paint-order: stroke fill; text-shadow: 0 .08em 0 #24094f; }
.menu-logo-ru .l1 { color: #fff1d0; font-size: .62em; } .menu-logo-ru .l2 { color: #45e2f2; } .menu-logo-ru .l3 { color: #ffb21f; font-size: .8em; }
@keyframes logoBob { from { transform: translateY(-.3em) rotate(-1deg); } to { transform: translateY(.3em) rotate(1deg); } }
.menu-btns { display: flex; flex-direction: column; gap: 1.4vh; align-items: center; position: relative; z-index: 2; }
.menu-btns .rb { font-size: clamp(16px, 2.6vw, 22px); min-width: 11em; padding: .5em 1em; }
.menu-btns .play { font-size: clamp(28px, 5.4vw, 46px); min-width: 6.5em; padding: .35em 1.2em; border-radius: .6em; box-shadow: inset 0 .14em 0 rgba(255, 255, 255, .55), inset 0 -.3em 0 rgba(0, 0, 0, .22), 0 .2em 0 rgba(0, 0, 0, .42), 0 0 0 .1em #7b3cff, 0 0 1.2em rgba(255, 210, 58, .55); animation: pulse .8s ease-in-out infinite alternate; }
.menu-btns .play svg { width: .9em; height: .9em; }
.menu-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; } .menu-row .rb { min-width: 0; font-size: clamp(14px, 2.2vw, 19px); }
.mn-sp { position: absolute; bottom: -1vh; height: 40vh; width: auto; pointer-events: none; z-index: 1; filter: drop-shadow(0 .3em 0 rgba(0, 0, 0, .3)); animation: spBob 2.2s ease-in-out infinite alternate; }
.mn-sp.a { left: 3vw; } .mn-sp.b { right: 3vw; animation-delay: -1.1s; } .mn-sp.c { left: 17vw; height: 25vh; animation-delay: -.6s; } .mn-sp.d { right: 17vw; height: 25vh; animation-delay: -1.7s; }
@keyframes spBob { from { transform: translateY(0) rotate(-2deg); } to { transform: translateY(-1.4vh) rotate(2deg); } }
@media (max-width: 700px), (max-height: 520px) { .mn-sp.c, .mn-sp.d { display: none; } .mn-sp { height: 24vh; opacity: .9; } }
@media (max-height: 520px) and (orientation: landscape) { .menu-screen { flex-direction: row; gap: 4vw; } .menu-logo { width: min(40vw, 70vh * 1.437); } .menu-btns { gap: 1.6vh; } .menu-btns .play { font-size: 8vh; } .menu-row .rb { font-size: 4.4vh; } .menu-btns .rb { min-width: 0; } .mn-sp { display: none; } }
`;

/** @satisfies {Record<string, any>} */
const UI = {
    /** @type {HTMLElement | null} */
    root: null,
    _els: {},
    _modalStack: [],
    open: '',
    autoOn: false,
    /** Окна, ждущие закрытия текущего (праздничное окно вылупления): [kind, ...args]. */
    _queue: [],

    /** Точка межстраничной рекламы (Playables, `?plads`): Game.adBreak сам пропускает обучение, погоню, rewarded и частые вызовы. */
    adBreak(place) { if (typeof Game !== 'undefined' && typeof Game.adBreak === 'function') Game.adBreak(place); },

    el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return /** @type {HTMLElement} */ (d.firstElementChild); },
    $(sel) { return /** @type {HTMLElement} */ (document.querySelector(sel)); },
    esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); },
    // Подпись редкости: цвет редкости, «Секретный» — радужный перелив.
    rar(r, text, cls, style) {
        const c = GameData.RARITY[r] ? GameData.RARITY[r].color : '#fff';
        return r === 'secret' ? `<span class="rbw ${cls || ''}" style="${style || ''}">${this.esc(text)}</span>` : `<span class="${cls || ''}" style="color:${c};${style || ''}">${this.esc(text)}</span>`;
    },
    clip(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; },
    mmss(sec) { sec = Math.max(0, Math.ceil(sec)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); },
    clock(sec) {
        sec = Math.max(0, Math.floor(sec));
        const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
        return h ? h + Lang.t('t.h') + ' ' + m + Lang.t('t.m') : m + Lang.t('t.m') + ' ' + String(s).padStart(2, '0') + Lang.t('t.s');
    },
    /** Монеты без знака валюты: рядом всегда значок монеты. */
    num(n) { return GameData.money(n).replace(/^\$/, ''); },
    /** HTML: значок монеты + число. */
    coins(n) { return `<i class="coin"></i>${this.esc(this.num(n))}`; },
    /** «Ансамбль ×1.18 · 4» (HTML): множитель дохода за разные виды монстров на базе. */
    bandText(b) { return `${this.esc(Lang.t('hud.band', { m: +Number(b.mult).toFixed(2) }))} <small>· ${b.count}</small>`; },

    // Блоки HUD по режимам окна HudLayout (размеры в em при кегле 16 px × uf режима).
    MODES: {
        wide: { uf: 1, sq: 4.2 }, land: { uf: 0.92, sq: 4.2 }, tall: { uf: 0.95, sq: 4.0 }, low: { uf: 0.82, sq: 3.7 },
    },
    _modeKey: '',

    init() {
        const st = document.createElement('style'); st.textContent = UI_CSS; document.head.appendChild(st);
        if (Game.playablesUi()) document.documentElement.classList.add('pl-ui');
        const root = this.el('<div id="ui"></div>');
        document.body.appendChild(root);
        this.root = root;
        const lab = this.el('<div id="labels"></div>'); document.body.appendChild(lab);
        this.labels.root = lab;
        document.body.appendChild(this.el('<div id="toasts"></div>'));
        document.body.appendChild(this.el('<div id="prompt"><div class="pk"><div class="key"><i></i><span>E</span></div><img class="pic" src="assets/ui/sp/icons/hand.webp" alt=""><div><div class="t1"></div><div class="t2"></div></div></div></div>'));
        document.body.appendChild(this.el('<div id="modal"></div>'));
        const sq = (id, cls, icon, lbl, extra) => `<button class="sqb ${cls}" id="${id}">${cls.indexOf('css') >= 0 ? '<div class="bg"></div>' + icon : '<div class="bg"></div>'}<span class="lbl ui-o1"><b data-t="${lbl}"></b></span>${extra || ''}</button>`;
        const dot = (id) => `<i class="dot" id="${id}">!</i>`;
        const ico = (src) => `<img class="ico" src="${src}" alt="">`;
        root.insertAdjacentHTML('beforeend', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="gRun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fff0d8"/><stop offset="1" stop-color="#ffc078"/></linearGradient>
</defs></svg>
<div id="hud-money" class="hl-blk"><div class="coinbar"><span class="amt ui-o" id="st-money">0</span></div><div class="incpill"><span class="ui-o1" id="st-inc">+0/${this.esc(Lang.t('t.s'))}</span></div></div>
<div id="hud-band" class="hl-blk"><div class="bandchip ui-o1">${UI_ICONS.band}<span></span></div></div>
<div id="hud-stats" class="hl-blk">
  <div class="chip ui-o1" id="st-gems">${UI_ICONS.gem}<span></span><b class="plus" id="b-gemsplus">${UI_ICONS.plus}</b></div>
  <div class="chip ui-o1" id="st-speed">${UI_ICONS.speed}<span></span><b class="plus" id="b-speedplus">${UI_ICONS.plus}</b></div>
</div>
<div id="hud-menu" class="hl-blk"><button class="rnd" id="b-menu">${UI_ICONS.menu}</button><button class="rnd" id="b-set">${UI_ICONS.gear}</button></div>
<div id="hud-quest" class="hl-blk"><div id="quest" class="ui-o1"></div></div>
<div id="hud-chase" class="hl-blk"><div class="chase"><div class="ch-main">${UI_ICONS.siren}<span class="ui-o" data-t="hud.chased"></span></div><div class="ch-sub ui-o1" data-t="hud.chasedSub"></div></div></div>
<div id="hud-event" class="hl-blk"><div class="ev" id="ev">${UI_ICONS.goldenegg}<div class="tx"><span class="n ui-o1" data-t="titanic.name"></span><span class="tm ui-o1"></span></div></div></div>
<div id="hud-conv" class="hl-blk"><div class="cv">${UI_ICONS.conveyor}<div class="tx"><span class="n ui-o1"></span><span class="tm ui-o1"></span></div></div></div>
<div id="hud-boosts" class="hl-blk"></div>
<div id="hud-left" class="hl-blk">
  ${sq('b-shop', 'i-shop', '', 'hud.shop')}
  ${sq('b-index', 'i-col', '', 'hud.collection')}
  ${sq('b-daily', 'css', ico('assets/ui/gift.webp'), 'hud.daily', dot('dot-daily'))}
  ${sq('b-wheel', 'css', ico('assets/ui/prize-wheel.webp'), 'hud.wheel', dot('dot-wheel'))}
  ${sq('b-rebirth', 'css', ico('assets/ui/sp/rebirth.webp'), 'hud.rebirthShort', dot('dot-rebirth'))}
</div>
<div id="hud-right" class="hl-blk">
  ${sq('b-eggs', 'css', ico('assets/ui/sp/icons/monster-egg.webp'), 'hud.eggs')}
  ${sq('b-pets', 'css', ico('assets/ui/sp/icons/monster.webp'), 'hud.monsters')}
  ${sq('b-lb', 'css', ico('assets/ui/trophy.webp'), 'hud.records')}
  ${sq('b-super', 'css', ico('assets/ui/chest.webp'), 'hud.reward', '<i class="dot badge on">0/5</i>')}
  ${sq('b-upg', 'css', ico('assets/ui/sp/icons/upgrade.webp'), 'hud.upgrade', dot('dot-upg'))}
</div>
<div id="hud-offer"></div>
<div id="hud-sprint" class="hl-blk"><div class="sp-t ui-o1" data-t="hud.sprint"></div><div class="sp-bar">${UI_ICONS.dash}<div class="sp-track"><i></i></div></div></div>
<div id="hud-bottom" class="hl-blk">
  <button class="rb c-red ui-o1" id="btn-auto"><span class="ai">${UI_ICONS.autoswing}</span>${UI_ICONS.trash.replace('<svg', '<svg class="at"')}<span class="al" data-t="hud.auto"></span></button>
  <div id="hotbar">
    <div class="slot s1" data-k="1" id="hb-1"><b class="num ui-o1">1</b><div class="si"></div></div>
    <div class="slot s2" data-k="2" id="hb-2" style="--tc:#8f4dff"><b class="num ui-o1">2</b><div class="si"></div></div>
    <div class="slot s3" data-k="3" id="hb-3" style="display:none"><b class="num ui-o1">3</b><div class="si"><img class="pico" id="hb-3img" src="assets/monsters/moxlo.webp" alt=""></div><img class="eggb" src="assets/ui/sp/icons/monster-egg.webp" alt=""><span class="sl ui-o1" id="hb-pet"></span><i class="drop">${UI_ICONS.trash}</i></div>
  </div>
</div>
<div id="hud-acts" class="hl-blk">
  <button id="btn-chord"><div class="dash"><div class="rn" id="chord-ic">${UI_ICONS.chord}</div><span class="dl ui-o" data-t="hud.chord"></span><div class="cd"></div></div><kbd class="keyb">R</kbd></button>
  <button id="btn-dash"><div class="dash"><div class="rn">${UI_ICONS.dash}</div><span class="dl ui-o" data-t="hud.dash"></span><div class="cd"></div></div><kbd class="keyb">Shift</kbd></button>
</div>
<button id="jump-btn">${UI_ICONS.jump}</button>`);
        Lang.apply(root);
        this._bind();
        this.layout();
        HudLayout.onChange(() => { if (HudLayout.mode !== this._modeKey) this.layout(); });
        this.labels.init();
    },

    // Блоки HUD для текущего режима окна (wide | land | low | tall). Повторный вызов обновляет размеры и причалы.
    layout() {
        const mode = HudLayout.mode || 'wide', M = this.MODES[mode] || this.MODES.wide;
        this._modeKey = mode;
        document.documentElement.style.setProperty('--uf', String(M.uf));
        const u = 16 * M.uf, sq = M.sq, gap = 0.4, low = mode === 'low';
        const col = 5 * sq + 4 * gap;
        document.getElementById('hud-left').classList.toggle('row', low);
        document.getElementById('hud-right').classList.toggle('row', low);
        for (const e of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.sqb'))) e.style.setProperty('--s', sq + 'em');
        const B = (id, dock, w, h, extra) => HudLayout.block(id, Object.assign({ dock, w: Math.round(w * u), h: Math.round(h * u), el: '#' + (extra && extra.sel || 'hud-' + id) }, extra, { sel: undefined }));
        const pl = Game.playablesUi();
        B('money', 'tl', 15.6, 5.5, { order: 0, sel: 'hud-money' });
        B('band', 'tl', 11.5, 1.95, { order: 1, sel: 'hud-band', visible: () => !!this._bandVis });
        B('stats', 'tl', 15.6, 2.1, { order: 2, sel: 'hud-stats' });
        if (low) {
            B('left', 'tl', 5 * sq + 4 * gap, sq, { order: 3, sel: 'hud-left' });
            B('right', 'tr', 5 * sq + 4 * gap, sq, { order: 2, sel: 'hud-right' });
            B('event', 'tc', 9, 2.2, { order: 2, sel: 'hud-event' });
        } else {
            B('left', 'ml', sq, col, { order: 0, sel: 'hud-left' });
            B('right', 'mr', sq, col, { order: 0, sel: 'hud-right' });
            B('event', 'tr', 11.2, 3, { order: 1, sel: 'hud-event' });
        }
        B('menu', 'tr', 6.4, 3, { order: 0, sel: 'hud-menu' });
        B('boosts', 'tr', 9.5, 6.6, { order: 3, sel: 'hud-boosts' });
        B('quest', 'tc', 26, 3, { order: 0, fill: true, maxW: 580, sel: 'hud-quest', visible: () => !this._chase });
        B('chase', 'tc', low ? 19 : 22, 4.2, { order: 1, sel: 'hud-chase', visible: () => !!this._chase });
        B('conv', 'tc', 12.5, 2.6, { order: 3, sel: 'hud-conv', visible: () => !!this._convVis });
        B('sprint', 'bc', 13, 3, { order: 1, sel: 'hud-sprint', visible: () => !!this._sprintVis });
        B('bottom', 'bc', pl ? 16 : 22.2, 5.4, { order: 0, sel: 'hud-bottom' });
        // Рывок и «Аккорд» — один блок: две круглые кнопки в ряд у правого нижнего угла.
        B('acts', 'br', low ? 5.8 + 4.4 + 0.55 : 6.4 + 4.8 + 0.55, low ? 5.8 : 6.4, { order: 0, sel: 'hud-acts', min: 52 });
        B('jump', 'br', 5, 5, { order: 1, sel: 'jump-btn', touchOnly: true, min: 56 });
        HudLayout.schedule();
    },

    _bind() {
        const on = (id, fn, ad) => { const e = document.getElementById(id); if (e) e.addEventListener('pointerdown', (ev) => { ev.stopPropagation(); ev.preventDefault(); Sfx.play('click', 0.5); fn(ev); if (ad) this.adBreak(ad); }); };
        on('b-shop', () => Game.openWithAd(() => Shops.openShop()));
        on('b-index', () => Game.openWithAd(() => this.openCollection()));
        on('b-daily', () => Game.openWithAd(() => Shops.openDaily()));
        on('b-wheel', () => Game.openWithAd(() => Shops.openWheel()));
        on('b-rebirth', () => Game.openWithAd(() => this.openRebirth()));
        on('b-eggs', () => Game.openWithAd(() => this.openEggs()));
        on('b-pets', () => Game.openWithAd(() => this.openPets()));
        on('b-lb', () => Game.openWithAd(() => this.openLeaderboard()));
        on('b-upg', () => Game.openWithAd(() => this.openUpgrades()));
        on('b-menu', () => Game.openWithAd(() => this.openPause()));
        on('b-set', () => this.openSettings(), 'ui:settings');
        on('b-speedplus', () => this.openBoosts());
        on('b-gemsplus', () => Game.openWithAd(() => this.openConverter()));
        on('b-super', () => Game.openWithAd(() => this.openSuper()));
        on('ev', () => Game.openWithAd(() => this.openEggs()));
        on('btn-auto', () => Game.toggleAuto());
        const dash = document.getElementById('btn-dash');
        dash.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Game.tryDash(); });
        const chord = document.getElementById('btn-chord');
        chord.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); if (typeof Game.tryChord === 'function') Game.tryChord(); });
        for (const s of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('#hotbar .slot'))) {
            s.addEventListener('pointerdown', (ev) => { ev.stopPropagation(); ev.preventDefault(); Game.selectSlot(Number(s.dataset.k)); });
        }
        const jb = document.getElementById('jump-btn');
        jb.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Input.setVirtual('jump', true); });
        const up = () => Input.setVirtual('jump', false);
        jb.addEventListener('pointerup', up); jb.addEventListener('pointercancel', up); jb.addEventListener('pointerleave', up);
        const pr = document.getElementById('prompt');
        pr.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Game.promptPress(true); });
        pr.addEventListener('pointerup', () => Game.promptPress(false));
        pr.addEventListener('pointercancel', () => Game.promptPress(false));
        document.getElementById('modal').addEventListener('pointerdown', (e) => { if (e.target === e.currentTarget) this.closeWindow(); });
        window.addEventListener('keydown', (e) => { if (e.code === 'Escape' && this.open) { this.closeWindow(); e.preventDefault(); } });
    },

    // --- HUD ---
    _last: {},
    _t: 0,
    setText(id, v) { if (this._last[id] === v) return; this._last[id] = v; const e = document.querySelector(id); if (e) e.textContent = v; },
    update(dt) {
        const g = Game, s = g.save;
        if (!s) return;
        this.setText('#st-money', this.num(s.money));
        this.setText('#st-inc', '+' + this.num(g.incomeNow()) + '/' + Lang.t('t.s'));
        this.setText('#st-speed span', String(Math.floor(g.player ? g.player.speedStat : s.speed)));
        this.setText('#st-gems span', GameData.fmt(Shops.gems()));
        const tit = !!World.titanic;
        this.setText('#ev .tm', tit ? Lang.t('titanic.now') : this.mmss(World.titanicTimer));
        const ev = document.getElementById('ev'); if (ev.classList.contains('now') !== tit) ev.classList.toggle('now', tit);
        const carrying = g.player && g.player.carry;
        // Слот 1 — 3D-превью текущей кирки (цвет рамки по тиру), слот 2 — превью текущего инструмента (гитара); обновляются при смене.
        if (this._pickIcon !== s.pick) {
            this._pickIcon = s.pick;
            const px = GameData.pickaxe(s.pick), sl = document.getElementById('hb-1');
            sl.style.setProperty('--tc', px.head); sl.classList.toggle('glow', !!px.glow);
            sl.title = Lang.t('pick.' + px.id);
            this.setThumb(sl.querySelector('.si'), Thumbs.get('pick', s.pick));
        }
        const bat = Shops.look().bat;
        if (this._batIcon !== bat) {
            this._batIcon = bat;
            const sl = document.getElementById('hb-2');
            sl.title = Lang.t('hud.bat');
            this.setThumb(sl.querySelector('.si'), Shops.icon({ tab: 'bat', look: bat }));
        }
        const hb3 = document.getElementById('hb-3');
        if (hb3) {
            hb3.style.display = carrying ? '' : 'none';
            if (carrying) {
                const p = carrying.pet, sig = p.sp + (p.h === false ? 'e' : 'p');
                if (this._slot3 !== sig) {
                    this._slot3 = sig;
                    /** @type {HTMLImageElement} */ (document.getElementById('hb-3img')).src = GameData.PETS[p.sp].img;
                    hb3.classList.toggle('egg', p.h === false);
                    hb3.title = Lang.t((p.h === false ? 'egg.' : 'pet.') + p.sp);
                    document.getElementById('hb-pet').textContent = Lang.t('pet.' + p.sp);
                }
            }
        }
        const auto = document.getElementById('btn-auto');
        if (auto) {
            const mode = carrying ? 'drop' : (g.autoSwing ? 'on' : 'off');
            if (this._autoMode !== mode) {
                this._autoMode = mode;
                auto.classList.toggle('on', mode === 'on');
                auto.classList.toggle('c-red', mode !== 'on');
                auto.classList.toggle('drop', mode === 'drop');
                auto.querySelector('.al').textContent = Lang.t(mode === 'drop' ? 'hud.drop' : 'hud.auto');
            }
        }
        const sel = g.player ? (g.player.carry ? 3 : g.player.tool === 'bat' ? 2 : 1) : 1;
        for (const sl of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('#hotbar .slot'))) sl.classList.toggle('sel', Number(sl.dataset.k) === sel);
        this.setText('#quest', g.questText());
        const qv = !Tutorial.active;
        if (this._questVis !== qv) { this._questVis = qv; document.getElementById('hud-quest').style.visibility = qv ? '' : 'hidden'; }
        // Рывок: заряд 0..1 — тёмный сектор на кнопке уменьшается, полоска «Спринт» над хотбаром.
        const ch = Math.max(0, Math.min(1, g.dashCharge()));
        const q = Math.round(ch * 50);
        if (this._dashQ !== q) {
            this._dashQ = q;
            const d = document.getElementById('btn-dash');
            d.style.setProperty('--r', (1 - q / 50).toFixed(2));
            d.classList.toggle('ready', q >= 50);
            /** @type {HTMLElement} */ (document.querySelector('#hud-sprint .sp-track i')).style.width = Math.round(q * 2) + '%';
        }
        // «Аккорд»: заряд Game.chordCharge() 0..1 — кольцо на кнопке (API основной сессии; нет функции — кнопка просто заряжена).
        const cc = typeof g.chordCharge === 'function' ? Math.max(0, Math.min(1, g.chordCharge())) : 1, cq = Math.round(cc * 50);
        if (this._chordQ !== cq) {
            this._chordQ = cq;
            const c = document.getElementById('btn-chord');
            c.style.setProperty('--r', (1 - cq / 50).toFixed(2));
            c.classList.toggle('ready', cq >= 50);
        }
        // Ансамбль: чип под плашкой дохода — «♪ Ансамбль ×1.18 · 4».
        const band = typeof g.bandInfo === 'function' ? g.bandInfo() : null;
        const bv = !!band && band.count > 0;
        if (this._bandVis !== bv) { this._bandVis = bv; document.getElementById('hud-band').style.visibility = bv ? '' : 'hidden'; HudLayout.schedule(); }
        if (bv) {
            const bs = this.bandText(band);
            if (this._bandSig !== bs) { this._bandSig = bs; document.querySelector('#hud-band .bandchip span').innerHTML = bs; }
        }
        // Конвейер яиц в хабе: «Редкое яйцо через 00:28».
        const ci = typeof g.conveyorInfo === 'function' ? g.conveyorInfo() : null;
        const inHub = !!ci && ci.rareIn > 0 && g.state === 'play' && !carrying && typeof World.inHub === 'function' && World.inHub(g.player.x, g.player.y);
        if (this._convVis !== inHub) { this._convVis = inHub; document.getElementById('hud-conv').style.visibility = inHub ? '' : 'hidden'; HudLayout.schedule(); }
        if (inHub) {
            const sec = Math.ceil(ci.rareIn), parts = Lang.t('hud.rareEgg', { t: '\u0001' }).split('\u0001');
            this.setText('#hud-conv .n', parts[0].trim());
            this.setText('#hud-conv .tm', String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'));
        }
        const sv = !!carrying || ch < 1;
        if (this._sprintVis !== sv) { this._sprintVis = sv; document.getElementById('hud-sprint').style.visibility = sv ? '' : 'hidden'; HudLayout.schedule(); }
        this._t -= dt;
        if (this._t <= 0) { this._t = 0.25; this.updateBadges(); this.fitLabels(); }
        this.updateBoosts();
        this.updateOffers();
        this.labels.update();
        this.updatePrompt();
    },

    // Подписи кнопок-квадратов не влезают в плашку на длинных словах («Перерожд.»): уменьшаем кегль подписи по ширине (раз на язык).
    fitLabels() {
        if (this._fitLang === Lang.code) return;
        let ok = true;
        for (const lbl of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.sqb .lbl'))) {
            const b = /** @type {HTMLElement} */ (lbl.firstElementChild);
            if (!lbl.clientWidth || !b.offsetWidth) { ok = false; continue; }
            b.style.setProperty('--fit', '1');
            const r = (lbl.clientWidth - 4) / b.offsetWidth;
            b.style.setProperty('--fit', String(r < 1 ? +r.toFixed(3) : 1));
        }
        if (ok) this._fitLang = Lang.code;
    },

    // Картинка-превью в держателе (3D-превью Thumbs подгружается позже: до загрузки остаётся запасная иконка).
    setThumb(holder, img) {
        if (!holder) return;
        const old = holder.querySelector('img.th'); if (old) old.remove();
        holder.classList.remove('loaded');
        if (!img) return;
        img.className = (img.className ? img.className + ' ' : '') + 'th';
        const done = () => holder.classList.add('loaded');
        img.addEventListener('load', done);
        if (img.complete && img.naturalWidth) done();
        holder.appendChild(img);
    },

    // Красные «!» на кнопках: подарок и колесо ждут, хватает монет на улучшение или перерождение; счётчик супер-награды.
    updateBadges() {
        const g = Game, s = g.save, set = (id, on) => { const e = document.getElementById(id); if (e && e.classList.contains('on') !== on) e.classList.toggle('on', on); };
        const b = Shops.badge();
        set('dot-daily', !!b.daily); set('dot-wheel', !!b.wheel);
        set('dot-upg', g.upgradeInfo().some(u => u.can));
        set('dot-rebirth', g.rebirthInfo().can);
        const st = s.superAd;
        if (st) {
            this.setText('#b-super .badge', st.views + '/' + g.SUPER_VIEWS);
            const ready = st.views >= g.SUPER_VIEWS || (Platform.rewardedSupported() && g.adCooldown('super') <= 0 && st.views > 0);
            const bs = document.getElementById('b-super');
            if (bs && bs.classList.contains('ready') !== ready) bs.classList.toggle('ready', ready);
        }
    },

    updateBoosts() {
        const s = Game.save, now = Date.now();
        const items = [
            ['money', UI_ICONS.boostcash, 'boost.money'],
            ['luck', UI_ICONS.luck, 'boost.luck'],
            ['speed', UI_ICONS.speed, 'boost.speed'],
        ];
        const gift = Game.giftOffer;
        const key = items.map(([k]) => Math.max(0, Math.ceil(((s.boosts[k] || 0) - now) / 1000))).join(',') + (Platform.rewardedSupported() ? 1 : 0) + (gift ? 'g' + Math.ceil((gift.until - now) / 1000) : '');
        if (this._boostKey === key) return;
        this._boostKey = key;
        const box = document.getElementById('hud-boosts');
        box.innerHTML = '';
        if (gift) {
            const g = this.el(`<div class="boost gift ui-o1">${UI_ICONS.gift}<span>+${this.coins(gift.amount)} · ${this.esc(Lang.t('ad.short'))}</span></div>`);
            g.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); Game.claimGift(); });
            box.appendChild(g);
        }
        for (const [k, icon, label] of items) {
            const left = Math.max(0, Math.ceil(((s.boosts[k] || 0) - now) / 1000));
            if (!left && !Platform.rewardedSupported()) continue;
            const b = this.el(`<div class="boost ui-o1 ${left ? 'act' : ''}">${icon}<span>${left ? 'x2 ' + this.clock(left) : this.esc(Lang.t(label))}</span></div>`);
            b.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); if (!left) this.openBoosts(); });
            box.appendChild(b);
        }
    },

    // --- Подсказка взаимодействия ---
    prompt: null,
    updatePrompt() {
        const el = document.getElementById('prompt');
        const p = this.prompt;
        if (!p || this.open || Game.state !== 'play') { el.style.display = 'none'; return; }
        const v = World.app.location.view.projectToScreen(p.x, p.y, p.h || 120);
        if (!v.visible) { el.style.display = 'none'; return; }
        el.style.display = 'block';
        el.style.transform = `translate(${v.x}px, ${v.y}px) translate(-50%, -50%)`;
        const key = Input.device === 'touch' ? '👆' : (Input.labelOf('interact') || 'E');
        const hand = /^(steal|pickup)/.test(String(p.id || ''));   // «Украсть» и «Подобрать»: рука рядом с клавишей
        const sig = p.t1 + '|' + p.t2 + '|' + key + '|' + (hand ? 1 : 0);
        if (this._promptSig !== sig) {
            this._promptSig = sig;
            el.querySelector('.pk').classList.toggle('hasic', hand);
            el.querySelector('.t1').textContent = p.t1;
            el.querySelector('.t2').textContent = p.t2 || '';
            el.querySelector('.key span').textContent = key;
        }
        /** @type {HTMLElement} */ (el.querySelector('.key i')).style.width = Math.round((p.progress || 0) * 100) + '%';
    },

    // --- Всплывающие ---
    toast(text, color, dur) {
        const box = document.getElementById('toasts');
        if (this._lastToast === text && Date.now() - (this._lastToastAt || 0) < 1500) return;   // без повторов подряд
        this._lastToast = text; this._lastToastAt = Date.now();
        const t = this.el(`<div class="toast ui-o" style="color:${color || '#fff'};--d:${dur || 2.2}s">${this.esc(text)}</div>`);
        box.appendChild(t);
        while (box.children.length > 3) box.firstElementChild.remove();
        setTimeout(() => t.remove(), ((dur || 2.2) + 0.5) * 1000);
    },
    // Погоня: красная плашка с сиреной «ТЕБЯ ЗАМЕТИЛИ!». Зовёт Game каждый кадр.
    bigRun(on) {
        on = !!on;
        if (this._chase === on) return;
        this._chase = on;
        document.getElementById('hud-chase').classList.toggle('on', on);
        HudLayout.schedule();
    },
    // Всплывашка над точкой мира.
    floater(x, y, h, html, cls, color, size) {
        const v = World.app.location.view.projectToScreen(x, y, h);
        if (!v.visible) return;
        const inner = color === 'rainbow' ? `<span class="rbw">${html}</span>` : html;
        const f = this.el(`<div class="floater ${cls || 'ui-o'}" style="left:${v.x}px;top:${v.y}px;color:${color === 'rainbow' ? '#fff' : (color || '#fff')};font-size:${size || 24}px">${inner}</div>`);
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 1200);
    },

    // --- Метки над объектами мира ---
    labels: {
        root: null,
        /** @type {any[]} */
        list: [],
        init() {},
        add(o) {
            const el = document.createElement('div');
            el.className = 'lb ui-o1 ' + (o.kind || '');
            el.style.display = 'none';
            this.root.appendChild(el);
            const rec = Object.assign({ el, sig: '', vis: false }, o);
            this.list.push(rec);
            return rec;
        },
        remove(rec) {
            if (!rec) return;
            const i = this.list.indexOf(rec);
            if (i >= 0) this.list.splice(i, 1);
            rec.el.remove();
        },
        // Приоритет меток при наложении друг на друга: важная остаётся, менее важная прячется.
        PRI: { home: 9, say: 7, egg: 6, offer: 6, pet: 5, dropped: 5, guard: 4, base: 3, shop: 3, name: 2 },
        /** Прямоугольники блоков HUD (раскладка HudLayout; задание — по факту текста). Метки под ними прячутся. */
        _hud: /** @type {number[][]} */ ([]),
        _hudT: 0,
        hudRects() {
            const now = performance.now();
            if (now - this._hudT < 400) return this._hud;
            this._hudT = now;
            const out = [];
            const rects = HudLayout.rects || {};
            for (const id of Object.keys(rects)) {
                const q = rects[id];
                if (id === 'quest') { const e = document.getElementById('quest'); const c = e && e.offsetParent ? e.getBoundingClientRect() : null; if (c) out.push([c.left, c.top, c.right, c.bottom]); continue; }
                out.push([q.x, q.y, q.x + q.w, q.y + q.h]);
            }
            this._hud = out;
            return out;
        },
        update() {
            const app = World.app, view = app.location.view, cam = app.camera;
            const tx = cam.target.x, ty = cam.target.y;
            const pl = Game.player;
            const vis = [];
            const free = HudLayout.free;
            for (const r of this.list) {
                let x = r.x, y = r.y, h = r.h || 100, max = 1800;
                if (r.kind === 'home') {   // метка «БАЗА · N м» — только пока несёшь ношу, видна издалека
                    if (!pl || !pl.carry || Game.state !== 'play' || UI.open) { if (r.vis) { r.el.style.display = 'none'; r.vis = false; } continue; }
                    max = 1e9;
                } else if (r.actor) { x = r.actor.x; y = r.actor.y; h = (r.actor.gh || 0) + r.actor.h + (r.actor.carry ? 330 : 236); max = 1600; }
                else if (r.guard) { x = r.guard.x; y = r.guard.y; max = 3200; }
                else if (r.npc) { if (!(r.npc.sayT > 0)) { if (r.vis) { r.el.style.display = 'none'; r.vis = false; } continue; } max = 1400; }
                else if (r.view) { x = r.view.x; y = r.view.y; h = r.view.h + r.view.height + 30; max = 1300; }
                else if (r.offer) { x = r.offer.x; y = r.offer.y; h = r.offer.h || 120; max = 1300; }
                else if (r.egg) { max = r.egg.titanic ? 4000 : 1150; }
                else if (r.kind === 'shop' || r.kind === 'base') max = 3600;
                const d = Math.hypot(x - tx, y - ty);
                let show = d < max && !UI.open;
                let v = null;
                if (show) { v = view.projectToScreen(x, y, h); show = v.visible; }
                if (!show) { if (r.vis) { r.el.style.display = 'none'; r.vis = false; r.hid = false; r.el.style.opacity = ''; } continue; }
                if (!r.vis) { r.el.style.display = ''; r.vis = true; }
                const screenK = Math.max(0.62, Math.min(1, Math.min(window.innerWidth, window.innerHeight) / 680));
                const sc = r.kind === 'home' ? screenK * 1.1 : screenK * Math.max(0.55, Math.min(r.kind === 'shop' || r.kind === 'base' ? 1 : 1.2, 900 / Math.max(300, d)));
                this.render(r);
                const w = (r.mw || 80) * sc, hh = (r.mh || 24) * sc;
                let px = v.x, py = v.y;
                if (r.kind === 'home' && free && free.r - free.l > w) {   // метка базы не прячется: прижимается к свободной зоне между блоками HUD
                    px = Math.max(free.l + w / 2, Math.min(free.r - w / 2, px));
                    py = Math.max(free.t + hh, Math.min(Math.max(free.t + hh, free.b), py));
                }
                r.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -100%) scale(${sc.toFixed(2)})`;
                vis.push({ r, d, x0: px - w / 2, x1: px + w / 2, y0: py - hh, y1: py, pri: (r.egg && r.egg.titanic) ? 8 : (this.PRI[r.kind] || 1) });
            }
            // Метки не лезут на блоки HUD и друг на друга: прячем (плавно) ту, что под HUD или менее важную из пересёкшихся.
            const hud = this.hudRects(), placed = [];
            vis.sort((p, q) => q.pri - p.pri || p.d - q.d);
            const hit = (p, q) => { const sx = (p.x1 - p.x0) * 0.1, sy = (p.y1 - p.y0) * 0.1; return p.x0 + sx < q[2] && p.x1 - sx > q[0] && p.y0 + sy < q[3] && p.y1 - sy > q[1]; };
            for (const o of vis) {
                let hide = false;
                if (o.r.kind !== 'home') {
                    for (const q of hud) if (hit(o, q)) { hide = true; break; }
                    if (!hide) for (const q of placed) if (hit(o, [q.x0, q.y0, q.x1, q.y1])) { hide = true; break; }
                }
                if (hide !== !!o.r.hid) { o.r.hid = hide; o.r.el.style.opacity = hide ? '0' : ''; }
                if (!hide) placed.push(o);
            }
        },
        render(r) {
            let sig = '', html = '';
            if (r.kind === 'egg') {
                const e = r.egg, hurt = e.hp < e.max;
                const hp = hurt ? Math.max(0, e.hp) : e.max;
                sig = e.type.id + '|' + (hurt ? Math.ceil(hp) : '');
                if (sig === r.sig) return;
                const er = GameData.eggRarity(e.type);
                html = `<div class="nm ui-o">${UI.esc(Lang.t('egg.' + e.type.id))}</div><div class="rr ui-o1">${UI.rar(er, Lang.t('rar.' + er))}</div>` +
                    (hurt ? `<div class="hp"><i style="transform:scaleX(${(hp / e.max).toFixed(3)})"></i><em>${GameData.fmt(hp)}/${GameData.fmt(e.max)}</em></div>` : '');
            } else if (r.kind === 'pet' || r.kind === 'dropped') {
                const p = r.pet, hatched = p.h !== false;
                const t = r.drop ? Math.ceil(r.drop.t) : 0;
                sig = p.uid + '|' + p.mut + '|' + t + '|' + (hatched ? 1 : 0);
                if (sig === r.sig) return;
                const tm = r.drop ? `<div class="tm ui-o1">⏱ ${t}${Lang.t('t.s')}</div>` : '';
                if (!hatched) html = tm + `<div class="nm ui-o">???</div><div class="rr ui-o1" style="color:#d8c4ff">${UI.esc(Lang.t('hud.hatching'))}</div>`;
                else html = tm + `<div class="nm ui-o">${UI.esc(Lang.t('pet.' + p.sp))}</div>` +
                    `<div class="rr ui-o1">${UI.rar(p.r, Lang.t('rar.' + p.r))}${p.mut !== 'normal' ? ' · <span style="color:#ffd23a">' + UI.esc(Lang.t('mut.' + p.mut)) + '</span>' : ''}</div>` +
                    `<div class="inc"><i class="coin"></i>+${UI.esc(UI.num(GameData.incomeOf(p)))}/${Lang.t('t.s')}</div>`;
            } else if (r.kind === 'name') {
                const a = r.actor;
                sig = a.name + (a.carry ? '|c' : '') + (a.isPlayer ? '|p' : '');
                if (sig === r.sig) return;
                html = `<div class="nm ui-o1">${UI.esc(a.name)}</div>`;
            } else if (r.kind === 'guard') {
                const z = GameData.zoneOf(r.guard.zone);
                sig = 'g' + r.guard.zone;
                if (sig === r.sig) return;
                html = `<div class="gd"><span class="face">${z.face}</span><span class="diff ui-o" style="color:${z.color}">${UI.esc(Lang.t('zone.' + z.id))}</span></div>`;
            } else if (r.kind === 'say') {
                sig = r.npc.text;
                if (sig === r.sig) return;
                html = `<div class="bub">${UI.esc(r.npc.text)}</div>`;
            } else if (r.kind === 'shop') {
                sig = r.text;
                if (sig === r.sig) return;
                html = `<div class="pl ui-o" style="--pc:${r.color || '#4fd6ff'};color:${r.color || '#4fd6ff'}">${UI.esc(r.text)}</div>`;
            } else if (r.kind === 'base') {
                const b = r.base, mine = !!(b.owner && b.owner.isPlayer);
                const sh = mine ? Math.ceil(Game.shieldLeft()) : 0;
                sig = (b.owner ? b.owner.name : '') + '|' + (mine ? 1 : 0) + '|' + sh;
                if (sig === r.sig) return;
                html = mine ? `<div class="pl me ui-o">${UI.esc(Lang.t('hud.yourBase'))}</div>` + (sh > 0 ? `<div class="sh ui-o1">${UI_ICONS.shield}${UI.esc(UI.mmss(sh))}</div>` : '')
                    : (b.owner ? `<div class="pl foe ui-o">${UI.esc(Lang.t('hud.baseOf', { n: b.owner.name }))}</div>` : '');
            } else if (r.kind === 'offer') {
                const o = r.offer, afford = Game.save.money >= o.price;
                sig = o.sp + '|' + o.price + '|' + (o.rare ? 1 : 0) + '|' + (afford ? 1 : 0);
                if (sig === r.sig) return;
                html = `<div class="pl${o.rare ? ' rare' : ''}">${o.rare ? `<div class="rareb ui-o1">${UI.esc(Lang.t('offer.rare'))}</div>` : ''}<div class="nm ui-o">${UI.esc(Lang.t('egg.' + o.sp))}</div><div class="pr${afford ? '' : ' no'}"><i class="coin"></i>${UI.esc(UI.num(o.price))}</div></div>`;
            } else if (r.kind === 'home') {
                const p = Game.player, b = r.base;
                const n = Math.round(Math.hypot(p.x - b.x, p.y - b.y) / 100);
                sig = 'h' + n;
                if (sig === r.sig) return;
                html = `<div class="hm ui-o">${UI_ICONS.home}${UI.esc(Lang.t('hud.home', { n }))}</div><div class="ar"></div>`;
            }
            r.sig = sig;
            r.el.innerHTML = html;
            r.mw = r.el.offsetWidth; r.mh = r.el.offsetHeight;
        },
    },

    // --- Окна ---
    // opts: { id, title, width, bare (без рамки: праздничные окна), onClose }. Возвращает тело окна.
    window(opts) {
        const m = document.getElementById('modal');
        const bare = !!opts.bare;
        const w = this.el(`<div class="win${bare ? ' bare' : ''}${opts.cls ? ' ' + opts.cls : ''}" style="${opts.width ? '--ww:' + opts.width + 'px' : ''}">
            ${bare ? '' : `<div class="win-h"><h2 class="ui-o3">${this.esc(opts.title || '')}</h2></div><button class="win-x" aria-label="close"><svg viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#3a0606" stroke-width="6.6" stroke-linecap="round"/><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="#fff" stroke-width="3.8" stroke-linecap="round"/></svg></button>`}
            <div class="win-b"></div></div>`);
        m.innerHTML = '';
        m.appendChild(w);
        m.classList.add('open');
        m.classList.toggle('mod-bare', bare);
        this.open = opts.id || 'win';
        const x = w.querySelector('.win-x');
        const wid = this.open;
        if (x) x.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); Sfx.play('close', 0.5); this.closeWindow(); this.adBreak('ui:close-' + wid); });
        Sfx.play('open', 0.45);
        Game.onWindow(true);
        this._onClose = opts.onClose || null;
        return /** @type {HTMLElement} */ (w.querySelector('.win-b'));
    },
    closeWindow() {
        const m = document.getElementById('modal');
        if (!this.open) return;
        m.classList.remove('open', 'mod-bare');
        m.innerHTML = '';
        const was = this.open;
        this.open = '';
        const cb = this._onClose; this._onClose = null;
        if (cb) cb();
        Game.onWindow(false, was);
        if (this._queue.length) setTimeout(() => this._flush(), 150);
    },
    // Окна в очереди (вылупление, пока было открыто другое окно): показываем по одному после закрытия.
    _flush() {
        if (this.open) return;
        if (Game.state !== 'play') { this._queue.length = 0; return; }
        const q = this._queue.shift();
        if (q && q[0] === 'hatch') this.showHatch(q[1], q[2]);
    },
    // Кнопка окон и меню. После действия — точка рекламы Playables (adBreak); кнопки «за рекламу» (в html значок просмотра видео)
    // и opts.noAd — без неё. opts.place — имя точки для аналитики (по умолчанию ui:<открытое окно>).
    btn(html, cls, fn, opts) {
        const b = this.el(`<button class="rb ${cls || 'c-green'} ui-o">${html}</button>`);
        const noAd = !!(opts && opts.noAd) || html.indexOf(UI_ICONS.ad) >= 0;
        b.addEventListener('pointerdown', (e) => {
            e.stopPropagation(); e.preventDefault();
            if (b.hasAttribute('disabled')) { Sfx.play('error', 0.4); return; }
            Sfx.play('click', 0.5);
            const place = 'ui:' + ((opts && opts.place) || this.open || 'menu');
            fn(e, b);
            if (!noAd) this.adBreak(place);
        });
        return b;
    },

    // Портрет монстра (картинка GameData.PETS[sp].img). Мутации — CSS-фильтрами: золотая, алмазная, радужная (перелив).
    petIcon(sp, mut) {
        const img = document.createElement('img');
        img.alt = ''; img.draggable = false;
        const d = GameData.PETS[sp];
        if (d) img.src = d.img;
        img.className = 'pico' + (mut && mut !== 'normal' ? ' m-' + mut : '');
        return img;
    },

    // --- Магазин кирок (карточки в ряд) ---
    openPickaxes() {
        const b = this.window({ id: 'pickaxes', title: Lang.t('win.pickaxes'), width: 920 });
        const render = () => {
            b.innerHTML = '';
            const row = this.el('<div class="cards"></div>');
            const s = Game.save;
            GameData.PICKAXES.forEach((px, i) => {
                const owned = i <= s.pick;
                const next = i === s.pick + 1;
                const c = this.el(`<div class="card ${i >= 8 ? 'rare-epic' : ''} ${i >= 11 ? 'gold' : ''}" style="min-width:190px">
                    <div class="ttl ui-o">${this.esc(Lang.t('pick.' + px.id))}</div>
                    <div class="pkimg"></div>
                    <div class="pill ui-o1"><span style="color:#47c8ff">${GameData.fmt(px.power)}</span> ${this.esc(Lang.t('win.power'))}</div></div>`);
                const img = Thumbs.get('pick', i);
                if (img) c.querySelector('.pkimg').appendChild(img);
                if (owned) c.appendChild(this.el(`<div class="pill ui-o1" style="color:#7dff6a">${this.esc(i === s.pick ? Lang.t('win.equipped') : Lang.t('win.owned'))}</div>`));
                else {
                    const can = next && s.money >= px.price;
                    const bt = this.btn(this.coins(px.price), can ? 'c-green' : 'c-gray', () => { if (Game.buyPickaxe(i)) render(); });
                    if (!next) { bt.setAttribute('disabled', ''); bt.innerHTML = UI_ICONS.lock + this.coins(px.price); }
                    else if (!can) bt.classList.add('off');
                    c.appendChild(bt);
                }
                row.appendChild(c);
            });
            b.appendChild(row);
            b.appendChild(this.el(`<div class="note" style="margin-top:8px">${this.esc(Lang.t('win.pickNote'))}</div>`));
            const cur = /** @type {HTMLElement} */ (row.children[Math.min(row.children.length - 1, s.pick + 1)]);
            if (cur) setTimeout(() => cur.scrollIntoView({ inline: 'center', block: 'nearest' }), 30);
        };
        render();
    },

    // --- Монстры (инвентарь): гнёзда, хранилище, продажа ---
    openPets() {
        const b = this.window({ id: 'pets', title: Lang.t('win.pets'), width: 900 });
        const render = () => {
            b.innerHTML = '';
            const s = Game.save, base = Game.player.base;
            const head = this.el('<div class="row" style="align-items:center;flex-wrap:wrap;margin-bottom:10px"></div>');
            head.appendChild(this.el(`<div class="pill ui-o1">${this.esc(Lang.t('win.active', { n: base.pets().length, m: base.slotCount }))}</div>`));
            head.appendChild(this.el(`<div class="pill ui-o1" style="color:#6dff6a">${this.coins(base.income())}/${Lang.t('t.s')}</div>`));
            head.appendChild(this.btn(Lang.t('win.equipBest'), 'c-green', () => { Game.equipBest(); render(); }));
            b.appendChild(head);
            // Ансамбль: разные монстры в гнёздах звучат вместе и дают бонус дохода.
            const band = typeof Game.bandInfo === 'function' ? Game.bandInfo() : null;
            if (band) b.appendChild(this.el(`<div class="row" style="align-items:center;flex-wrap:wrap;margin-bottom:8px"><div class="bandchip ui-o1">${UI_ICONS.band}<span>${this.bandText(band)}</span></div><div class="note" style="flex:1;min-width:180px">${this.esc(Lang.t('band.note'))}</div></div>`));
            // С собой: до FOLLOW_MAX монстров идут следом и дают бонусы.
            const fol = this.el('<div class="row" style="align-items:center;flex-wrap:wrap;margin-bottom:6px"></div>');
            fol.appendChild(this.el(`<div class="pill ui-o1" style="color:#ffd23a">${this.esc(Lang.t('pets.following', { n: Game.followCount(), m: GameData.FOLLOW_MAX }))}</div>`));
            const bf = Game.buffs();
            for (const k of ['power', 'speed', 'cash', 'luck']) if (bf[k] > 0) fol.appendChild(this.el(`<div class="pill bf ui-o1">${this.buffIcon(k)}+${Math.round(bf[k] * 100)}%</div>`));
            fol.appendChild(this.btn(Lang.t('pets.followBest'), 'c-yellow', () => { Game.followBest(); render(); }));
            b.appendChild(fol);
            b.appendChild(this.el(`<div class="note" style="margin:0 0 10px">${this.esc(Lang.t('pets.note'))}</div>`));
            const grid = this.el('<div class="grid pets"></div>');
            const pets = s.pets.slice().sort((u, v) => (v.eq ? 1 : 0) - (u.eq ? 1 : 0) || GameData.incomeOf(v) - GameData.incomeOf(u));
            if (!pets.length) b.appendChild(this.el(`<div class="note">${this.esc(Lang.t('win.noPets'))}</div>`));
            for (const p of pets) {
                const placed = p.slot >= 0;
                const bu = GameData.petBuff(p);
                const c = this.el(`<div class="card ${p.r === 'epic' ? 'rare-epic' : ''} ${p.r === 'legendary' || p.r === 'mythic' || p.r === 'secret' ? 'rare-legendary' : ''} ${p.mut !== 'normal' ? 'gold' : ''} ${p.eq ? 'eq' : ''}">
                    ${p.eq ? `<div class="tag">${this.esc(Lang.t('pets.withYou'))}</div>` : ''}
                    <div class="ttl ui-o">${this.esc(Lang.t('pet.' + p.sp))}</div><div class="ic"></div>
                    <div class="sub ui-o1">${this.rar(p.r, Lang.t('rar.' + p.r))}${p.mut !== 'normal' ? ' · ' + this.esc(Lang.t('mut.' + p.mut)) : ''}</div>
                    <div class="ui-o1" style="color:#6dff6a">${this.coins(GameData.incomeOf(p))}/${Lang.t('t.s')} · ${p.kg}${Lang.t('kg')}</div>
                    <div class="buff ui-o1">${this.buffIcon(bu.type)}${this.esc(Lang.t('buff.' + bu.type))} +${Math.round(bu.v * 100)}%</div></div>`);
                c.querySelector('.ic').appendChild(this.petIcon(p.sp, p.mut));
                const r = this.el('<div class="acts"></div>');
                r.appendChild(this.btn(placed ? Lang.t('win.unequip') : Lang.t('win.equip'), placed ? 'c-red' : 'c-blue', () => { Game.togglePet(p.uid); render(); }));
                r.appendChild(this.btn(p.eq ? Lang.t('pets.unfollow') : Lang.t('pets.follow'), p.eq ? 'c-red' : 'c-yellow', () => { Game.toggleFollow(p.uid); render(); }));
                r.appendChild(this.btn(Lang.t('win.sell') + ' ' + this.coins(GameData.incomeOf(p) * GameData.SELL_SECONDS), 'c-gray', () => { Game.sellPet(p.uid); render(); }));
                c.appendChild(r);
                grid.appendChild(c);
            }
            b.appendChild(grid);
        };
        render();
    },

    buffIcon(type) { return type === 'speed' ? UI_ICONS.speed : type === 'cash' ? UI_ICONS.cash : type === 'luck' ? UI_ICONS.luck : UI_ICONS.pick; },

    // --- Коллекция: все монстры, вкладки «Все / Редкие / Легенды», найденные с цветными точками редкостей ---
    _colTab: 'all',
    openCollection(tab) {
        if (tab) this._colTab = tab;
        const b = this.window({ id: 'collection', title: Lang.t('win.collection'), width: 720 });
        const s = Game.save, ids = Object.keys(GameData.PETS);
        const have = ids.filter(id => s.index[id]).length;
        const render = () => {
            b.innerHTML = '';
            const top = this.el('<div class="col-top"></div>');
            const tabs = this.el('<div class="tabs"></div>');
            for (const [id, key] of [['all', 'col.all'], ['rare', 'col.rare'], ['legend', 'col.legend']]) {
                tabs.appendChild(this.btn(this.esc(Lang.t(key)), this._colTab === id ? 'c-blue sel' : 'c-dark', () => { this._colTab = id; render(); }));
            }
            top.appendChild(tabs);
            top.appendChild(this.el(`<div class="cnt ui-o">${have} <small>/ ${ids.length}</small></div>`));
            b.appendChild(top);
            const grid = this.el('<div class="cgrid"></div>');
            for (const id of ids) {
                const tier = GameData.tierOf(id);
                if (this._colTab === 'rare' && tier !== 'rare') continue;
                if (this._colTab === 'legend' && tier !== 'legend') continue;
                const known = !!s.index[id], seen = s.seen[id] || [];
                const dots = GameData.raritiesOf(id).map(r => `<i style="${seen.indexOf(r) >= 0 ? 'background:' + GameData.RARITY[r].color : ''}" title="${this.esc(Lang.t('rar.' + r))}"></i>`).join('');
                const c = this.el(`<div class="cc t-${tier}${known ? '' : ' lock'}">
                    ${known ? `<img class="star" src="assets/ui/star.webp" alt=""><div class="dots">${dots}</div>` : `<img class="lk" src="assets/ui/lock.webp" alt="">`}
                    <div class="nm ui-o1">${this.esc(known ? Lang.t('pet.' + id) : Lang.t('col.unknown'))}</div></div>`);
                c.insertBefore(this.petIcon(id), c.querySelector('.nm'));
                grid.appendChild(c);
            }
            b.appendChild(grid);
            b.appendChild(this.el(`<div class="col-note ui-o1">${this.esc(Lang.t('win.luckNote'))}</div>`));
        };
        render();
    },
    openIndex() { this.openCollection(); },

    // --- Яйца и зоны: у каждого яйца — портрет его монстра, HP защиты, страж ---
    openEggs() {
        const b = this.window({ id: 'eggs', title: Lang.t('win.eggs'), width: 900 });
        const power = GameData.pickaxe(Game.save.pick).power;
        b.appendChild(this.el(`<div class="note" style="margin-bottom:8px">${this.esc(Lang.t('win.eggsNote', { p: GameData.fmt(power), s: Math.floor(Game.player.speedStat) }))}</div>`));
        GameData.ZONES.forEach((z, i) => {
            const row = this.el(`<div class="set-row" style="flex-wrap:wrap"><div style="min-width:160px"><span style="font-size:26px">${z.face}</span> <span class="ui-o" style="color:${z.color}">${this.esc(Lang.t('zone.' + z.id))}</span><div class="note">${this.esc(Lang.t('win.guardSpeed', { n: z.guard }))}</div></div></div>`);
            for (const e of GameData.eggsOfZone(i)) {
                const hits = Math.ceil(e.hp / power);
                const pill = this.el(`<div class="eggpill"><div><div class="ui-o1">${this.esc(Lang.t('egg.' + e.id))}</div><div style="color:${hits > 60 ? '#ff8a8a' : '#7dff6a'}">${UI_ICONS.shield.replace('class="ic"', 'class="ic" style="width:1.1em;height:1.1em;vertical-align:-.2em"')} ${GameData.fmt(e.hp)} · ${hits > 999 ? '999+' : hits} ${this.esc(Lang.t('win.hits'))}</div></div></div>`);
                pill.insertBefore(this.petIcon(e.sp), pill.firstChild);
                row.appendChild(pill);
            }
            b.appendChild(row);
        });
        b.appendChild(this.el(`<div class="note">${this.esc(Lang.t('win.titanicNote'))}</div>`));
    },

    // --- Слияние ---
    openMerge() {
        const b = this.window({ id: 'merge', title: Lang.t('win.merge'), width: 900 });
        const render = () => {
            b.innerHTML = '';
            b.appendChild(this.el(`<div class="note" style="margin-bottom:10px">${this.esc(Lang.t('win.mergeNote'))}</div>`));
            const groups = Game.mergeGroups();
            if (!groups.length) b.appendChild(this.el(`<div class="pill ui-o1">${this.esc(Lang.t('win.mergeNone'))}</div>`));
            const grid = this.el('<div class="grid"></div>');
            for (const g of groups) {
                const next = GameData.MUTATIONS[GameData.MUTATIONS.findIndex(m => m.id === g.mut) + 1];
                const c = this.el(`<div class="card gold"><div class="ttl ui-o">${this.esc(Lang.t('pet.' + g.sp))}</div><div class="ic"></div>
                    <div class="ui-o1">${g.count} × ${this.esc(Lang.t('mut.' + g.mut))} → <span style="color:#ffd23a">${this.esc(Lang.t('mut.' + next.id))}</span></div>
                    <div class="ui-o1" style="color:#6dff6a">x${next.mult / GameData.mutation(g.mut).mult}</div></div>`);
                c.querySelector('.ic').appendChild(this.petIcon(g.sp, next.id));
                c.appendChild(this.btn(Lang.t('win.mergeBtn'), 'c-blue', () => { Game.merge(g.sp, g.mut); render(); }));
                grid.appendChild(c);
            }
            b.appendChild(grid);
        };
        render();
    },

    // --- Бусты за рекламу ---
    openBoosts() {
        const b = this.window({ id: 'boosts', title: Lang.t('win.boosts'), width: 640 });
        const s = Game.save;
        const items = [['money', UI_ICONS.boostcash], ['luck', UI_ICONS.luck], ['speed', UI_ICONS.speed]];
        const ok = Platform.rewardedSupported();
        for (const [k, icon] of items) {
            const left = Math.max(0, Math.ceil(((s.boosts[k] || 0) - Date.now()) / 1000));
            const row = this.el(`<div class="set-row"><div style="display:flex;align-items:center;gap:10px"><span style="width:44px;height:44px;display:inline-flex">${icon}</span><div><div class="ui-o1">${this.esc(Lang.t('boost.' + k + '.t'))}</div><div class="note">${this.esc(Lang.t('boost.' + k + '.d'))}</div></div></div></div>`);
            const bt = this.btn(UI_ICONS.ad + (left ? this.clock(left) + ' +5' + Lang.t('t.m') : Lang.t('ad.watch')), 'c-yellow', async (e, btn) => {
                btn.setAttribute('disabled', '');
                if (await Game.rewardBoost(k)) this.openBoosts(); else btn.removeAttribute('disabled');
            });
            if (!ok) { bt.setAttribute('disabled', ''); bt.title = Lang.t('ad.none'); }
            row.appendChild(bt);
            b.appendChild(row);
        }
        /** @type {[string, string, string, string, () => Promise<boolean>][]} */
        const extra = [
            ['speed', UI_ICONS.speed, 'ad.speedUp.t', 'ad.speedUp.d', () => Game.speedUp()],
            ['titanic', UI_ICONS.goldenegg, 'ad.titanic.t', 'ad.titanic.d', () => Game.titanicNow()],
        ];
        for (const [id, icon, t, d, fn] of extra) {
            const cd = Math.ceil(Game.adCooldown(id));
            const blocked = id === 'titanic' && !!World.titanic;
            const row = this.el(`<div class="set-row"><div style="display:flex;align-items:center;gap:10px"><span style="width:44px;height:44px;display:inline-flex">${icon}</span><div><div class="ui-o1">${this.esc(Lang.t(t))}</div><div class="note">${this.esc(Lang.t(d))}</div></div></div></div>`);
            const bt = this.btn(UI_ICONS.ad + (cd > 0 ? this.mmss(cd) : Lang.t('ad.watch')), 'c-yellow', async (e, btn) => {
                btn.setAttribute('disabled', '');
                if (await fn()) this.openBoosts(); else btn.removeAttribute('disabled');
            });
            if (!ok || cd > 0 || blocked) bt.setAttribute('disabled', '');
            row.appendChild(bt);
            b.appendChild(row);
        }
        if (!ok) b.appendChild(this.el(`<div class="note">${this.esc(Lang.t('ad.none'))}</div>`));
    },

    // Предложения над нижним блоком: «Вернуть монстра» и «Разбить сразу» (за рекламу).
    updateOffers() {
        const g = Game, box = document.getElementById('hud-offer');
        if (!box) return;
        const r = g.rescueOffer, e = g.breakOffer;
        const rb = HudLayout.rect('bottom'), rs = this._sprintVis ? HudLayout.rect('sprint') : null;
        const top = rb ? Math.min(rb.y, rs ? rs.y : 1e9) : 0, cx = rb ? rb.x + rb.w / 2 : 0;
        const sig = (r ? 'r' + Math.ceil((r.until - Date.now()) / 1000) : '') + (e ? 'e' : '') + (UI.open ? 'o' : '') + '|' + Math.round(top) + '|' + Math.round(cx);
        if (sig === this._offerSig) return;
        this._offerSig = sig;
        box.innerHTML = '';
        if (UI.open || g.state !== 'play') return;
        box.style.left = cx + 'px'; box.style.top = (top - 4) + 'px'; box.style.transform = 'translate(-50%, -100%)';
        if (r) {
            const left = Math.max(0, Math.ceil((r.until - Date.now()) / 1000));
            box.appendChild(this.btn(UI_ICONS.ad + Lang.t('ad.rescue', { n: Lang.t('pet.' + r.drop.pet.sp) }) + ' ' + left, 'c-green', () => g.rescuePet()));
        } else if (e) {
            box.appendChild(this.btn(UI_ICONS.ad + Lang.t('ad.break'), 'c-yellow', () => g.instantBreak()));
        }
        box.style.pointerEvents = 'none';
        for (const c of box.children) /** @type {HTMLElement} */ (c).style.pointerEvents = 'auto';
    },

    // Супер-награда: 5 реклам с перерывом -> крупный приз.
    openSuper() {
        const b = this.window({ id: 'super', title: Lang.t('super.title'), width: 620 });
        const render = () => {
            if (this.open !== 'super') return;
            b.innerHTML = '';
            const st = Game.save.superAd, prize = Game.superPrize(st.cycle);
            const pz = this.el(`<div class="sup-prize"><div class="pic"></div><div><div class="ui-o" style="font-size:22px">${this.esc(prize.kind === 'pet' ? Lang.t('pet.' + prize.sp) : Lang.t('super.chest', { n: prize.gems }))}</div>
                <div class="ui-o1" style="margin-top:4px">${prize.kind === 'pet' ? this.rar('secret', Lang.t('rar.secret')) + ' · +' + prize.gems + ' 💎' : this.esc(Lang.t('super.chestBoost', { m: prize.boost }))}</div>
                <div class="note" style="margin-top:6px">${this.esc(Lang.t('super.note', { n: Game.SUPER_VIEWS }))}</div></div></div>`);
            const pic = prize.kind === 'pet' ? this.petIcon(prize.sp, 'normal') : this.el('<img src="assets/ui/chest.webp" alt="">');
            if (pic) pz.querySelector('.pic').appendChild(pic);
            b.appendChild(pz);
            const steps = this.el('<div class="sup-steps"></div>');
            for (let i = 0; i < Game.SUPER_VIEWS; i++) steps.appendChild(this.el(`<i class="${i < st.views ? 'on' : ''}"></i>`));
            b.appendChild(steps);
            const row = this.el('<div class="menu-btns"></div>');
            if (st.views >= Game.SUPER_VIEWS) {
                row.appendChild(this.btn(UI_ICONS.star + Lang.t('super.claim'), 'c-green', () => {
                    const got = Game.superClaim();
                    if (got) UI.toast(Lang.t('super.got', { n: got.kind === 'pet' ? Lang.t('pet.' + got.sp) : Lang.t('super.chest', { n: got.gems }) }), '#ffd23a', 3);
                    render();
                }, { noAd: true }));
            } else {
                const cd = Math.ceil(Game.adCooldown('super'));
                const bt = this.btn(UI_ICONS.ad + (cd > 0 ? Lang.t('super.wait', { t: this.mmss(cd) }) : Lang.t('super.watch', { n: st.views + 1, m: Game.SUPER_VIEWS })), 'c-yellow', async (e, btn) => {
                    btn.setAttribute('disabled', '');
                    await Game.superWatch();
                    render();
                });
                if (cd > 0 || !Platform.rewardedSupported()) bt.setAttribute('disabled', '');
                row.appendChild(bt);
                if (!Platform.rewardedSupported()) row.appendChild(this.el(`<div class="note">${this.esc(Lang.t('ad.none'))}</div>`));
            }
            b.appendChild(row);
        };
        render();
        clearInterval(this._superIv);
        this._superIv = setInterval(() => { if (this.open !== 'super') { clearInterval(this._superIv); return; } if (Game.adCooldown('super') > 0 || this._superWas) render(); this._superWas = Game.adCooldown('super') > 0; }, 1000);
    },

    // --- Рекорды (лидерборд площадки + локальная таблица) ---
    async openLeaderboard() {
        const b = this.window({ id: 'lb', title: Lang.t('win.lb'), width: 640 });
        b.innerHTML = `<div class="note">${this.esc(Lang.t('loading'))}</div>`;
        let rows = null;
        try { rows = await Platform.leaderboard({ avatarSize: 'small' }); } catch (e) { rows = null; }
        if (this.open !== 'lb') return;
        b.innerHTML = '';
        b.appendChild(this.el(`<div class="note" style="margin-bottom:8px">${this.esc(Lang.t('win.lbNote'))}</div>`));
        const list = this.el('<div class="lb-list"></div>');
        const data = rows && rows.length ? rows.map(r => ({ rank: r.rank, name: r.name, score: r.score, me: r.me, avatar: r.avatar })) : Game.localBoard();
        if (!data.length) list.appendChild(this.el(`<div class="pill">${this.esc(Lang.t('win.lbEmpty'))}</div>`));
        for (const r of data.slice(0, 20)) {
            const row = this.el(`<div class="lb-row ui-o1 ${r.me ? 'me' : ''}"><b>#${r.rank}</b>${r.avatar ? `<img src="${this.esc(r.avatar)}" alt="">` : ''}<span>${this.esc(r.name || '—')}</span><span class="v">${this.coins(r.score)}/${Lang.t('t.s')}</span></div>`);
            list.appendChild(row);
        }
        b.appendChild(list);
        if (Platform.canLogin && Platform.canLogin() && !Platform.authorized()) {
            b.appendChild(this.btn(Lang.t('win.login'), 'c-blue', async () => { if (await Platform.login()) Game.reloadSave(); }));
        }
    },

    // --- Перерождение: монеты, кирка и база сбрасываются, навсегда доход ×2 и +гнёзда ---
    openRebirth() {
        const b = this.window({ id: 'rebirth', title: Lang.t('win.rebirth'), width: 470, cls: 'w-rebirth' });
        const render = () => {
            if (this.open !== 'rebirth') return;
            const info = Game.rebirthInfo();
            const p = info.maxed ? 1 : Math.max(0, Math.min(1, info.money / info.price));
            b.innerHTML = `<div class="rb-wrap"><div class="rb-l">
                <div class="rb-ic"></div>
                <div class="rst ui-o1">${this.esc(Lang.t('rb.reset'))}</div>
                ${info.maxed ? `<div class="rb-lv ui-o3"><b>${info.level}</b></div>` : `<div class="rb-lv ui-o3">${this.esc(Lang.t('rb.level'))} <b>${info.level}</b><em>→</em><b>${info.next}</b></div>`}</div><div class="rb-r">
                <div class="rb-bar"><div class="cov" style="left:${(1.9 + (83.6 - 1.9) * p).toFixed(2)}%"></div><span class="ui-o1">${this.esc(this.num(info.money))} / ${this.esc(this.num(info.price))}</span></div>
                <div class="rb-rew">
                    <div class="rw cn"><span class="ui-o1">${this.esc(Lang.t('rb.income', { m: GameData.fmt(info.nextMult) }))}</span></div>
                    <div class="rw ne"><span class="ui-o1">${this.esc(Lang.t('rb.slots', { n: info.addSlots }))}</span></div>
                </div>
                <div class="note">${this.esc(Lang.t('rb.keep'))}</div>
                <button class="gbtn ${info.can ? 'go' : 'off'} ui-o3">${this.esc(info.maxed ? Lang.t('rb.max') : info.can ? Lang.t('rb.go') : Lang.t('rb.need', { n: this.num(info.price) }))}</button></div></div>`;
            const gb = /** @type {HTMLElement} */ (b.querySelector('.gbtn'));
            gb.addEventListener('pointerdown', (e) => {
                e.stopPropagation(); e.preventDefault();
                if (!info.can) { Sfx.play('error', 0.4); return; }
                Sfx.play('click', 0.5);
                if (Game.doRebirth()) this.closeWindow(); else render();
            });
        };
        render();
    },

    // --- Улучшения базы: гнёзда, защита, доход + кнопка включения защиты ---
    openUpgrades() {
        const b = this.window({ id: 'upgrades', title: Lang.t('win.upgrades'), width: 540 });
        const icon = { nests: '<i class="nest"></i>', shield: UI_ICONS.shield, income: '<i class="cns"></i>' };
        const val = (u) => u.id === 'nests' ? Lang.t('up.nests.v', { a: u.cur, b: u.next }) : u.id === 'shield' ? Lang.t('up.shield.v', { a: this.mmss(u.cur), b: this.mmss(u.next) })
            : Lang.t('up.income.v', { a: +u.cur.toFixed(2), b: +u.next.toFixed(2) });
        const shieldRow = this.el(`<div class="up-row up-sh"><div class="up-ic">${UI_ICONS.shield}</div><div class="up-tx"><div class="nm ui-o"></div><div class="v ui-o1"></div></div></div>`);
        const sBtn = this.btn('', 'c-blue', () => { if (Game.activateShield()) { renderShield(); render(); } });
        shieldRow.appendChild(sBtn);
        const renderShield = () => {
            const left = Game.shieldLeft(), cd = Game.shieldCooldown();
            shieldRow.querySelector('.nm').textContent = Lang.t('act.shield');
            shieldRow.querySelector('.v').textContent = left > 0 ? Lang.t('hud.shieldOn', { t: this.mmss(left) }) : cd > 0 ? Lang.t('act.shieldCd', { t: this.mmss(cd) }) : Lang.t('act.shieldInfo', { t: this.mmss(GameData.shieldSec(Game.save.up.shield)) });
            sBtn.textContent = left > 0 ? Lang.t('up.shieldRun') : cd > 0 ? this.mmss(cd) : Lang.t('up.shieldOn');
            const busy = left > 0 || cd > 0;
            sBtn.classList.toggle('off', busy); sBtn.classList.toggle('c-blue', !busy); sBtn.classList.toggle('c-gray', busy);
            if (busy) sBtn.setAttribute('disabled', ''); else sBtn.removeAttribute('disabled');
        };
        const render = () => {
            if (this.open !== 'upgrades') return;
            b.innerHTML = '';
            for (const u of Game.upgradeInfo()) {
                const row = this.el(`<div class="up-row"><div class="up-ic">${icon[u.id]}</div><div class="up-tx"><div class="nm ui-o">${this.esc(Lang.t('up.' + u.id))}</div>
                    <div class="v ui-o1">${this.esc(u.maxed ? Lang.t('up.max') : val(u))}</div>
                    ${u.maxed ? '' : `<div class="pr ui-o1">${this.coins(u.price)}</div>`}<div class="lv ui-o1">${this.esc(Lang.t('up.lvl', { a: u.level, b: u.max }))}</div></div></div>`);
                if (u.maxed) row.appendChild(this.el(`<div class="up-max ui-o1">${this.esc(Lang.t('up.max'))}</div>`));
                else row.appendChild(this.btn(UI_ICONS.plus, u.can ? 'c-green up-buy' : 'c-gray up-buy', () => { if (Game.buyUpgrade(u.id)) render(); else Sfx.play('error', 0.4); }));
                b.appendChild(row);
            }
            b.appendChild(shieldRow);
            renderShield();
        };
        render();
        clearInterval(this._upIv);
        this._upIv = setInterval(() => { if (this.open !== 'upgrades') { clearInterval(this._upIv); return; } renderShield(); }, 1000);
    },

    // --- «Новый монстр!»: праздничное окно после вылупления в гнезде. Занято другим окном — встаёт в очередь. ---
    showHatch(pet, opts) {
        opts = opts || {};
        if (this.open) { this._queue.push(['hatch', pet, opts]); return; }
        const rc = pet.r === 'secret' ? '#ff5fd8' : (GameData.RARITY[pet.r] || GameData.RARITY.common).color;
        const inc = GameData.incomeOf(pet) * Game.incomeMult();
        const b = this.window({ id: 'hatch', bare: true, width: 560 });
        const isNew = opts.isNew !== false;
        b.innerHTML = `<div class="ht">
            <div class="ht-title ui-o3">${UI_ICONS.crown}<span>${this.esc(Lang.t(isNew ? 'hatch.new' : 'hatch.got'))}</span>${UI_ICONS.crown}</div>
            <div class="ht-stage"><div class="rays"></div>
                <span class="sp" style="left:2%;top:18%">${UI_ICONS.star}</span><span class="sp" style="right:0;top:8%;animation-delay:-.4s">${UI_ICONS.sparkles}</span>
                <span class="sp" style="left:8%;bottom:10%;animation-delay:-.8s">${UI_ICONS.sparkles}</span><span class="sp" style="right:4%;bottom:20%;animation-delay:-.2s">${UI_ICONS.star}</span></div>
            <div class="ht-plate"><div class="nm ui-o3">${this.esc(Lang.t('pet.' + pet.sp))}</div>
                <div class="rr ${pet.r === 'secret' ? '' : 'ui-o1'}" style="--rc:${pet.r === 'secret' ? '#7a2ee0' : rc}">${pet.r === 'secret' ? this.rar('secret', Lang.t('rar.secret')) : this.esc(Lang.t('rar.' + pet.r))}</div>
                <div class="inc ui-o"><i class="coin"></i>+${this.esc(this.num(inc))}/${this.esc(Lang.t('t.s'))}</div></div>
            <div class="ht-btns"></div></div>`;
        b.querySelector('.ht-stage').insertBefore(this.petIcon(pet.sp, pet.mut), null);
        const btns = b.querySelector('.ht-btns');
        btns.appendChild(this.btn(UI_ICONS.home + '<span>' + this.esc(Lang.t('hatch.toBase')) + '</span>', 'c-green', () => this.closeWindow()));
        btns.appendChild(this.btn(UI_ICONS.egg + '<span>' + this.esc(Lang.t('hatch.more')) + '</span>', 'c-purple', () => { this.closeWindow(); Game.goEgg(); }));
        Sfx.play('win', 0.5);
    },

    // --- Пауза / меню и настройки ---
    openPause() {
        const b = this.window({ id: 'pause', title: Lang.t('win.pause'), width: 460 });
        const col = this.el('<div class="menu-btns"></div>');
        col.appendChild(this.btn(Lang.t('menu.continue'), 'c-green', () => this.closeWindow()));
        col.appendChild(this.btn(Lang.t('menu.howto'), 'c-blue', () => { this.closeWindow(); Game.replayTutorial(); }));
        col.appendChild(this.btn(Lang.t('menu.settings'), 'c-purple', () => this.openSettings()));
        col.appendChild(this.btn(Lang.t('menu.toMenu'), 'c-orange', () => { this.closeWindow(); Game.toMenu(); }));
        b.appendChild(col);
    },
    openSettings() {
        const b = this.window({ id: 'settings', title: Lang.t('menu.settings'), width: 560 });
        const s = Game.save.settings;
        const toggle = (label, get, set) => {
            const row = this.el(`<div class="set-row"><span class="ui-o1">${this.esc(label)}</span></div>`);
            const bt = this.btn(get() ? Lang.t('set.on') : Lang.t('set.off'), get() ? 'c-green' : 'c-gray', () => { set(!get()); bt.className = 'rb ui-o ' + (get() ? 'c-green' : 'c-gray'); bt.textContent = get() ? Lang.t('set.on') : Lang.t('set.off'); Game.persist(); });
            row.appendChild(bt); b.appendChild(row);
        };
        toggle(Lang.t('set.sound'), () => !Sound.muted, (v) => { if (Sound.muted === v) Sound.toggleMuted(); });
        toggle(Lang.t('set.music'), () => s.music, (v) => { s.music = v; Game.applyMusic(); });
        toggle(Lang.t('set.steal'), () => s.steal !== false, (v) => { s.steal = v; });
        const q = this.el(`<div class="set-row"><span class="ui-o1">${this.esc(Lang.t('set.quality'))}</span><div class="set-opts"></div></div>`);
        for (const lv of ['auto', 'low', 'medium', 'high']) {
            const cur = (typeof Quality !== 'undefined' && Quality.choice) || 'auto';
            q.querySelector('.set-opts').appendChild(this.btn(Lang.t('set.q.' + lv), cur === lv ? 'c-green' : 'c-gray', () => { if (typeof Quality !== 'undefined') Quality.set(lv); this.openSettings(); }));
        }
        b.appendChild(q);
        const sr = this.el(`<div class="set-row"><span class="ui-o1">${this.esc(Lang.t('set.sens'))}</span><div class="set-opts"></div></div>`);
        /** @type {[string, number][]} */
        const sensLevels = [['low', 0.6], ['mid', 1], ['high', 1.6]];
        for (const [lv, k] of sensLevels) {
            const cur = s.sens || 1;
            sr.querySelector('.set-opts').appendChild(this.btn(Lang.t('set.sens.' + lv), Math.abs(cur - k) < 0.01 ? 'c-green' : 'c-gray', () => { s.sens = k; Game.persist(); this.openSettings(); }));
        }
        b.appendChild(sr);
        // Музыка под CC BY 4.0 — автор и лицензия обязаны быть видны в игре.
        b.appendChild(this.el(`<div class="note" style="margin:12px 0 0;font-size:13px;opacity:.8">${this.esc(Lang.t('set.credits'))}</div>`));
    },

    // Обменник монет на кристаллы.
    openConverter() {
        const b = this.window({ id: 'converter', title: Lang.t('conv.title'), width: 640 });
        const render = () => {
            b.innerHTML = '';
            const s = Game.save;
            b.appendChild(this.el(`<div class="set-row"><span class="ui-o1">${this.esc(Lang.t('conv.rate'))}</span><span class="pill ui-o1"><span style="color:#f2b8ff">1 ${UI_ICONS.gem.replace('class="ic gem"', 'class="ic gem" style="width:1.4em;height:1.4em;vertical-align:-.35em"')}</span> = <span style="color:#6dff6a">${this.coins(Game.gemPrice())}</span></span></div>`));
            b.appendChild(this.el(`<div class="note" style="margin:0 0 10px">${this.esc(Lang.t('conv.note'))}</div>`));
            const grid = this.el('<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))"></div>');
            Game.GEM_PACKS.forEach((pack, i) => {
                const price = Game.packPrice(pack);
                const c = this.el(`<div class="card rare-epic"><div class="ttl ui-o" style="font-size:26px">${pack.n} ${UI_ICONS.gem.replace('class="ic gem"', 'class="ic gem" style="width:1.3em;height:1.3em;vertical-align:-.3em"')}</div>
                    <div class="sub ui-o1">${pack.k < 1 ? this.esc(Lang.t('conv.discount', { n: Math.round((1 - pack.k) * 100) })) : '&nbsp;'}</div></div>`);
                const bt = this.btn(this.coins(price), s.money >= price ? 'c-green' : 'c-gray', () => { if (Game.buyGems(i)) render(); });
                if (s.money < price) bt.classList.add('off');
                c.appendChild(bt);
                grid.appendChild(c);
            });
            b.appendChild(grid);
            b.appendChild(this.el(`<div class="note" style="margin-top:10px">${this.esc(Lang.t('conv.balance', { m: this.num(s.money), g: GameData.fmt(Shops.gems()) }))}</div>`));
        };
        render();
    },

    // Пока вас не было.
    openOffline(amount) {
        const b = this.window({ id: 'offline', title: Lang.t('win.offline'), width: 520 });
        b.appendChild(this.el(`<div class="pill ui-o" style="font-size:32px;color:#6dff6a;margin:10px auto;display:flex;width:fit-content;padding:6px 26px">+${this.coins(amount)}</div>`));
        const row = this.el('<div class="menu-btns"></div>');
        row.appendChild(this.btn(Lang.t('win.claim'), 'c-green', () => { Game.claimOffline(1); this.closeWindow(); }));
        if (Platform.rewardedSupported()) {
            row.appendChild(this.btn(UI_ICONS.ad + Lang.t('win.claimX2'), 'c-yellow', async (e, bt) => { bt.setAttribute('disabled', ''); const ok = await Game.claimOfflineX2(); if (ok) this.closeWindow(); else bt.removeAttribute('disabled'); }));
        }
        b.appendChild(row);
        this._onClose = () => Game.claimOffline(1);
    },

    // --- Главное меню (мир крутится фоном) ---
    showMenu(on) {
        let m = document.getElementById('menu');
        if (!m) {
            m = this.el(`<div id="menu" class="menu-screen">
                <img class="mn-sp a" src="assets/monsters/moxlo.webp" alt=""><img class="mn-sp b" src="assets/monsters/pudloo.webp" alt=""><img class="mn-sp c" src="assets/monsters/zazzit.webp" alt=""><img class="mn-sp d" src="assets/monsters/grumplet.webp" alt="">
                ${String(GAME_PLATFORM) === 'pikabu' ? `<div class="menu-logo menu-logo-ru" role="img" aria-label="${this.esc(GAME_TITLE)}"><span class="l1">Вор</span><span class="l2">яиц</span><span class="l3">монстров</span></div>` : `<img class="menu-logo" src="assets/branding/monster-logo.webp" alt="${this.esc(Lang.t('logo.1') + ' ' + Lang.t('logo.2') + ' ' + Lang.t('logo.3'))}">`}
                <div class="menu-btns"></div></div>`);
            document.body.appendChild(m);
            const col = m.querySelector('.menu-btns');
            col.appendChild(this.btn(UI_ICONS.play + '<span>' + this.esc(Lang.t('menu.play')) + '</span>', 'c-yellow play', () => Game.play()));
            const row = this.el('<div class="menu-row"></div>');
            row.appendChild(this.btn(UI_ICONS.cart + Lang.t('hud.shop'), 'c-purple', () => Game.openWithAd(() => Shops.openShop())));
            row.appendChild(this.btn(UI_ICONS.gift + Lang.t('hud.daily'), 'c-pink', () => Game.openWithAd(() => Shops.openDaily())));
            row.appendChild(this.btn(UI_ICONS.wheel + Lang.t('hud.wheel'), 'c-orange', () => Game.openWithAd(() => Shops.openWheel())));
            row.appendChild(this.btn(UI_ICONS.trophy + Lang.t('win.lb'), 'c-blue', () => Game.openWithAd(() => this.openLeaderboard())));
            col.appendChild(row);
            const row2 = this.el('<div class="menu-row"></div>');
            row2.appendChild(this.btn(Lang.t('menu.howto'), 'c-dark', () => Game.play(true)));
            row2.appendChild(this.btn(UI_ICONS.gear + Lang.t('menu.settings'), 'c-dark', () => this.openSettings()));
            col.appendChild(row2);
        }
        m.classList.toggle('open', !!on);
        this.root.style.display = on ? 'none' : '';
        document.getElementById('labels').style.display = on ? 'none' : '';
    },
};

// Звуки по именам (файлы — docs/SOUNDS.md). Пути — литералами: сборщик берёт только их.
/** @satisfies {Record<string, any>} */
const Sfx = {
    FILES: {
        hit1: 'assets/sounds/hit-shield-1.ogg', hit2: 'assets/sounds/hit-shield-2.ogg', hit3: 'assets/sounds/hit-shield-3.ogg',
        crack: 'assets/sounds/egg-pop.ogg', hatch: 'assets/sounds/monster-hatch.ogg', pickup: 'assets/sounds/pickup-2.ogg',
        drop: 'assets/sounds/drop.ogg', deliver: 'assets/sounds/deliver-2.ogg', coin: 'assets/sounds/collect-coins.ogg',
        click: 'assets/sounds/click.ogg', open: 'assets/sounds/open.ogg', close: 'assets/sounds/close.ogg',
        buy: 'assets/sounds/buy.ogg', error: 'assets/sounds/error.ogg', upgrade: 'assets/sounds/upgrade.ogg',
        swing: 'assets/sounds/guitar-swing.ogg', bonk: 'assets/sounds/guitar-bonk-1.ogg', bonk2: 'assets/sounds/guitar-bonk-2.ogg', jump: 'assets/sounds/jump.ogg',
        step: 'assets/sounds/step.ogg', roar: 'assets/sounds/guardian-roar.ogg', stomp: 'assets/sounds/guardian-stomp.ogg',
        alarm: 'assets/sounds/spotted.ogg', titanic: 'assets/sounds/golden-fanfare.ogg', tick: 'assets/sounds/tick.ogg',
        win: 'assets/sounds/win.ogg', gift: 'assets/sounds/gift.ogg', merge: 'assets/sounds/merge.ogg',
        treadmill: 'assets/sounds/treadmill.ogg', splash: 'assets/sounds/splash.ogg',
        chord: 'assets/sounds/power-chord.ogg', conveyorBuy: 'assets/sounds/conveyor-buy.ogg', bandNote: 'assets/sounds/band-note.ogg',
        dash: 'assets/sounds/dash.ogg', shieldOn: 'assets/sounds/shield-on.ogg', shieldOff: 'assets/sounds/shield-off.ogg',
        rebirth: 'assets/sounds/rebirth.ogg', convIn: 'assets/sounds/conveyor-in.ogg', convOut: 'assets/sounds/conveyor-out.ogg',
    },
    MUSIC_MAIN: 'assets/sounds/music-monster-main.ogg',
    MUSIC_MENU: 'assets/sounds/music-monster-menu.ogg',
    MUSIC_TITANIC: 'assets/sounds/music-monster-golden.ogg',
    play(name, vol, rate) {
        const f = this.FILES[name];
        if (!f) return null;
        return Sound.play(f, { volume: vol == null ? 0.7 : vol, rate: rate || 1 });
    },
};

// Превью моделей в картинки (иконки окон): offscreen-рендер одной сцены, кэш dataURL. Кирки и косметика магазина;
// монстры в окнах — готовые портреты (UI.petIcon).
/** @satisfies {Record<string, any>} */
const Thumbs = {
    _cache: new Map(),
    _queue: [],
    _busy: false,
    // Своя модель: builder(scene) -> меш (центр низа в 0), height — высота кадра в px. key — уникальный.
    mesh(key, height, builder) { return this.get('mesh', key, height, builder); },
    get(kind, id, mut, builder) {
        const key = kind + '|' + id + '|' + (mut || '');
        let rec = this._cache.get(key);
        if (!rec) {
            rec = { url: null, waiters: [] };
            this._cache.set(key, rec);
            this._queue.push({ kind, id, mut, rec, builder });
            this._pump();
        }
        const img = document.createElement('img');
        img.alt = '';
        if (rec.url) img.src = rec.url; else rec.waiters.push(img);
        return img;
    },
    async _pump() {
        if (this._busy) return;
        this._busy = true;
        try {
            while (this._queue.length) {
                const job = this._queue.shift();
                try { job.rec.url = await this._render(job); } catch (e) { job.rec.url = ''; }
                for (const w of job.rec.waiters) if (job.rec.url) w.src = job.rec.url;
                job.rec.waiters = [];
            }
        } finally { this._busy = false; }
    },
    async _render(job) {
        if (!this.scene) {
            const eng = World3D.engine;
            const sc = new BABYLON.Scene(eng);
            sc.useRightHandedSystem = true;
            sc.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            sc.autoClear = true;
            const cam = new BABYLON.ArcRotateCamera('tc', 0.62, 1.2, 400, BABYLON.Vector3.Zero(), sc);
            cam.fov = 0.5; cam.minZ = 1; cam.maxZ = 5000;
            // Превью квадратное, а движок отдаёт пропорции экрана игры: проекция камеры — с aspect = 1.
            const camAny = /** @type {any} */ (cam);
            const origProj = cam.getProjectionMatrix.bind(cam);
            camAny._sxSquare = true;
            camAny.getProjectionMatrix = () => {
                const e = cam.getEngine(), saved = e.getAspectRatio;
                e.getAspectRatio = () => 1;
                try { return origProj(true); } finally { e.getAspectRatio = saved; }
            };
            const hl = new BABYLON.HemisphericLight('th', new BABYLON.Vector3(0.3, 1, 0.4), sc); hl.intensity = 1.0; hl.groundColor = new BABYLON.Color3(0.45, 0.45, 0.5);
            const dl = new BABYLON.DirectionalLight('td', new BABYLON.Vector3(-0.5, -1, -0.8), sc); dl.intensity = 0.55;
            this.scene = sc; this.cam = cam;
            this.rt = new BABYLON.RenderTargetTexture('thumb-rt', 192, sc, false);
            this.rt.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            sc.customRenderTargets.push(this.rt);
            this.rt.activeCamera = cam;
        }
        const sc = this.scene;
        let mesh = null, h = 100;
        if (job.kind === 'pick') {
            // Кирка плашмя к камере (вид 3/4 спереди), рукоять по диагонали.
            const root = new BABYLON.Mesh('thp', sc);
            const inner = new BABYLON.Mesh('thpi', sc);
            inner.parent = root;
            Noob.buildPickaxe(sc, GameData.pickaxe(job.id), inner, 'thp');
            inner.rotation.z = 0.85;
            inner.position.set(-40, 10, 0);
            root.rotation.y = 0.95;
            mesh = root; h = 150;
        } else if (job.kind === 'mesh' && job.builder) {
            mesh = job.builder(sc); h = job.mut || 120;
        }
        if (!mesh) return '';
        this.rt.renderList = [mesh].concat(mesh.getChildMeshes(false));
        this.cam.setTarget(new BABYLON.Vector3(0, h * 0.45, 0));
        this.cam.radius = h * 2.9;
        await new Promise(r => sc.executeWhenReady(() => r(null)));
        this.rt.render(true);
        const px = await this.rt.readPixels();
        const size = this.rt.getSize();
        const cv = document.createElement('canvas'); cv.width = size.width; cv.height = size.height;
        const ctx = cv.getContext('2d');
        const id = ctx.createImageData(size.width, size.height);
        const src = new Uint8Array(/** @type {ArrayBuffer} */ (px.buffer || px));
        // Перевернуть по вертикали (WebGL читает снизу вверх).
        for (let y = 0; y < size.height; y++) id.data.set(src.subarray((size.height - 1 - y) * size.width * 4, (size.height - y) * size.width * 4), y * size.width * 4);
        ctx.putImageData(id, 0, 0);
        mesh.dispose(false, true);
        return cv.toDataURL('image/png');
    },
};
