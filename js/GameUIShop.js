// GameUIShop.js — магазин косметики, подарок дня и колесо фортуны: данные — GameShopData.js, логика — Shop.js /
// DailyGift.js / Wheel.js, здесь окна (каркас UI.window) и связка с игрой.
// Валюта магазина — кристаллы (💎, Shop.coins). Окно магазина прижато к краю экрана (справа, в портрете — снизу):
// герой в 3D остаётся виден, примерка (Shop.preview + Game.applyLook) показывается прямо на нём.
// Окно открыто — мир стоит (Game.update не идёт), поэтому анимации здесь на requestAnimationFrame / таймерах.

const SHOP_UI_STRINGS = {
    ru: {
        'shop.rarity.mythic': 'Мифический', 'sh.unique': 'Уникальный',
        'sh.title': 'Магазин стиля', 'sh.daily.title': 'Ежедневный подарок', 'sh.wheel.title': 'Колесо фортуны',
        'sh.collection': 'Собрано {n} из {m}', 'sh.tapHint': 'Нажми на вещь — она появится на твоём герое',
        'sh.trying': 'Примеряешь: {name}', 'sh.clearTry': 'Снять примерку',
        'sh.bought': 'Куплено: {name}!', 'sh.unlocked': 'Открыто: {name}!', 'sh.adCounted': 'Просмотр засчитан: {a} из {b}',
        'sh.adFailed': 'Реклама не показана. Прогресс сохранён, попробуй позже',
        'sh.noAds': 'Реклама сейчас недоступна: вещи «за рекламу» откроются позже, прогресс сохраняется',
        'sh.dayPrize': 'Приз 7-го дня', 'sh.gotTitle': 'Ты получил',
        'sh.daily.note': 'Заходи каждый день: награды растут, а на 7-й день ждёт эксклюзивный скин',
        'sh.daily.goal': 'Главный приз', 'sh.daily.big': 'Крупная награда', 'sh.daily.plusItem': '+ вещь',
        'sh.daily.back': 'Приходи завтра за новым подарком!', 'sh.daily.same': 'Подарок уже получен сегодня',
        'sh.wheel.ad': 'Крутить за рекламу', 'sh.wheel.adLeft': 'Осталось {a} из {b}', 'sh.wheel.won': 'Выигрыш',
        'sh.wheel.note': 'Одно вращение в день бесплатно, ещё несколько — за рекламу',
        'sh.wheel.try': 'Испытай удачу!', 'sh.wheel.top': 'Главные призы и шансы', 'sh.wheel.last': 'Последний приз', 'sh.wheel.item': 'Вещь',
        // Игровая валюта здесь — кристаллы, а не «монеты» (подписи модулей Shop / DailyGift / Wheel).
        'shop.noCoins': 'Не хватает кристаллов: {n}', 'reward.coins': 'Кристаллы: {n}', 'reward.big': 'Крупная награда: кристаллы {n}',
        'reward.dup': 'Такая вещь уже есть, кристаллы: {n}', 'reward.item': 'Вещь: {name}', 'reward.randomItem': 'Случайная вещь',
        'reward.randomItems': 'Случайные вещи: {n}',
    },
    en: {
        'shop.rarity.mythic': 'Mythic', 'sh.unique': 'Unique',
        'sh.title': 'Style Shop', 'sh.daily.title': 'Daily Gift', 'sh.wheel.title': 'Wheel of Fortune',
        'sh.collection': 'Collected {n} of {m}', 'sh.tapHint': 'Tap an item to try it on your hero',
        'sh.trying': 'Trying on: {name}', 'sh.clearTry': 'Clear try-on',
        'sh.bought': 'Bought: {name}!', 'sh.unlocked': 'Unlocked: {name}!', 'sh.adCounted': 'Ad counted: {a} of {b}',
        'sh.adFailed': 'The ad was not shown. Your progress is saved, try again later',
        'sh.noAds': 'Ads are not available right now: ad items unlock later, progress is saved',
        'sh.dayPrize': 'Day 7 prize', 'sh.gotTitle': 'You got',
        'sh.daily.note': 'Come back every day: rewards grow, and day 7 brings an exclusive skin',
        'sh.daily.goal': 'Grand prize', 'sh.daily.big': 'Big reward', 'sh.daily.plusItem': '+ item',
        'sh.daily.back': 'Come back tomorrow for a new gift!', 'sh.daily.same': 'Today\'s gift is already claimed',
        'sh.wheel.ad': 'Watch ad to spin', 'sh.wheel.adLeft': '{a} of {b} left', 'sh.wheel.won': 'You won',
        'sh.wheel.note': 'One free spin a day, a few more for ads',
        'sh.wheel.try': 'Try your luck!', 'sh.wheel.top': 'Top prizes and chances', 'sh.wheel.last': 'Last prize', 'sh.wheel.item': 'Item',
        'shop.noCoins': 'Not enough gems: {n}', 'reward.coins': 'Gems: {n}', 'reward.big': 'Big reward: {n} gems',
        'reward.dup': 'You already have this item, gems: {n}', 'reward.item': 'Item: {name}', 'reward.randomItem': 'Random item',
        'reward.randomItems': 'Random items: {n}',
    },
};
for (const code of Object.keys(SHOP_UI_STRINGS)) Object.assign(LANG_STRINGS[code] || (LANG_STRINGS[code] = {}), SHOP_UI_STRINGS[code]);

const SHOP_UI_CSS = `
.win.sx-win { position: relative; }
.win.sxw-shop { width: auto; }
.sxw-shop .win-h { font-size: clamp(16px, 2.7vw, 24px); }
@media (orientation: landscape) { .win.sxw-shop { position: fixed; top: 48px; bottom: 10px; right: 12px; width: min(54vw, 640px); max-height: none; } }
@media (orientation: portrait) { .win.sxw-shop { position: fixed; left: 8px; right: 8px; bottom: 8px; width: auto; max-height: 62vh; } }
@media (orientation: landscape) and (max-height: 460px) { .win.sxw-shop { top: 38px; bottom: 8px; right: 8px; width: min(58vw, 520px); } }
.sx-top { position: sticky; top: calc(var(--pt, 6px) * -1); z-index: 3; margin: calc(var(--pt, 6px) * -1) calc(var(--px, 10px) * -1) 10px; padding: 8px var(--px, 10px) 8px; background: linear-gradient(#251a78, #1b1250); border-bottom: 3px solid #0c0530; box-shadow: 0 3px 0 #4a2fb8; }
.sx-bar { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; margin-bottom: 8px; }
.sx-gems { display: inline-flex; align-items: center; gap: 6px; font-size: 22px; color: #f2b8ff; }
.sx-gems :is(svg, img.ic) { width: 28px; height: 28px; }
.sx-count { font-size: 14px; color: #d4d0ff; }
.sx-try { flex: 1 1 140px; min-width: 120px; font-size: 13px; line-height: 1.2; color: #d4d0ff; font-weight: 800; }
.sx-try b { color: #ffd23a; }
.sx-top { container-type: inline-size; }
.sx-tabs { position: relative; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 5px; padding: 2px 2px 6px; }
.sx-tabs .rb { min-width: 0; min-height: 40px; font-size: 14px; padding: 6px 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@container (max-width: 560px) { .sx-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); } .sx-tabs .rb { min-height: 34px; font-size: 14px; } }
.sx-tabs .rb.sel { box-shadow: inset 0 .16em 0 rgba(255, 255, 255, .5), inset 0 -.3em 0 rgba(0, 0, 0, .22), 0 0 0 .14em #fff, 0 .2em 0 rgba(0, 0, 0, .42); }
.sx-b { touch-action: manipulation; }
.sx-banner { margin: 0 0 10px; padding: 8px 12px; background: rgba(255,210,58,.14); border: 2px solid rgba(255,210,58,.5); border-radius: 12px; font-size: 13px; font-weight: 800; color: #ffe9a0; }
.sx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 10px; }
.sx-card { cursor: pointer; padding: 6px 6px 8px; gap: 4px; border-color: var(--rc, #121318); text-align: center; min-width: 0; -webkit-tap-highlight-color: transparent; }
.sx-card { box-shadow: inset 0 0 0 2px var(--rc, #5a3ee0), 0 3px 0 rgba(0, 0, 0, .3); }
.sx-card.r-common { background: linear-gradient(#33249c, #1d1366); } .sx-card.r-uncommon { background: linear-gradient(#25649a, #123a62); }
.sx-card.r-rare { background: linear-gradient(#3a58d0, #1c2a86); } .sx-card.r-epic { background: linear-gradient(#6a38c8, #3a1c82); }
.sx-card.r-legendary { background: linear-gradient(#b8443a, #5e1630); }
.sx-card.r-mythic { background: linear-gradient(#ffb347, #c4561a 55%, #6a260c); border-color: #ffb84a; animation: sxGlow 1.4s ease-in-out infinite alternate; }
@keyframes sxGlow { from { filter: drop-shadow(0 0 4px rgba(255,154,31,.55)); } to { filter: drop-shadow(0 0 12px rgba(255,200,70,.95)); } }
.sx-ribbon { position: absolute; right: 2px; top: 6px; z-index: 1; padding: 2px 7px; font-size: 10px; border: 2px solid #0c0530; border-radius: 6px; transform: rotate(5deg);
             background: linear-gradient(#ff7ae0, #a54dff); color: #fff; letter-spacing: .02em; }
.sx-card.sel { box-shadow: 0 0 0 4px #ffd23a, 0 0 18px rgba(255,210,58,.8); }
.sx-card.eq { box-shadow: inset 0 0 0 3px #7dff4d, 0 3px 0 rgba(0, 0, 0, .3); }
.sx-ic { position: relative; width: 100%; height: 120px; display: flex; align-items: center; justify-content: center; border-radius: 8px;
         background: radial-gradient(circle at 50% 42%, rgba(255,255,255,.26), rgba(255,255,255,0) 72%); }
.sx-ic > img { width: 120px; height: 120px; object-fit: contain; pointer-events: none; -webkit-user-drag: none; }
.sx-chip { position: absolute; left: 4px; top: 4px; z-index: 1; display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 999px; font-size: 11px; background: rgba(12,5,48,.75); color: #fff; }
.sx-chip :is(svg, img.ic) { width: 14px; height: 14px; } .sx-chip.ok { background: #1fa31e; }
.sx-card .ttl { font-size: 16px; line-height: 1.05; min-height: 2.1em; display: flex; align-items: center; justify-content: center; }
.sx-rar { font-size: 12px; }
.sx-act { width: 100%; display: flex; flex-direction: column; gap: 4px; align-items: stretch; margin-top: auto; }
.sx-act .prog { height: 8px; }
.sx-act .rb { width: 100%; min-height: 44px; font-size: 15px; padding: .3em .4em; line-height: 1.05; white-space: normal; }
.sx-act .rb :is(svg, img.ic) { width: 1.3em; height: 1.3em; }
.sx-act .rb.off { filter: grayscale(.75) brightness(.8); }
.sx-pill { padding: 6px; border-radius: 12px; font-size: 13px; background: rgba(12,5,48,.55); border: 2px solid #4a2fb8; line-height: 1.1; }
.sx-pill.gold { color: #ffd23a; border-color: #ffd23a; }
.sx-snack { position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%); z-index: 6; max-width: 92%; text-align: center; padding: 8px 14px; border-radius: 10px;
            background: linear-gradient(#2a1a6e, #170f4e); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px #6a3cf0; font-size: 15px; font-weight: 900; pointer-events: none; opacity: 0; }
.sx-snack.show { animation: sxSnack 2.8s ease-out forwards; }
@keyframes sxSnack { 0% { opacity: 0; transform: translate(-50%, 10px) } 8% { opacity: 1; transform: translate(-50%, 0) } 82% { opacity: 1 } 100% { opacity: 0 } }
/* Daily Gift */
.sx-days { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px; }
@media (min-width: 760px) { .sx-days { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
.sx-day { position: relative; border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px #5a3ee0, 0 3px 0 rgba(0,0,0,.3); border-radius: 14px; padding: 6px 4px 8px; background: linear-gradient(#33249c, #1d1366); text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-weight: 900; min-height: 108px; }
.sx-day .dn { font-size: 14px; } .sx-day .rw { font-size: 24px; display: flex; align-items: center; gap: 4px; } .sx-day .rw :is(svg, img.ic) { width: 26px; height: 26px; }
.sx-day .ri { font-size: 12px; color: #ffd23a; display: flex; align-items: center; gap: 3px; } .sx-day .ri :is(svg, img.ic) { width: 16px; height: 16px; }
.sx-day .st { font-size: 12px; color: #d4d0ff; }
.sx-day.today { box-shadow: inset 0 0 0 3px #ffd23a, 0 0 14px rgba(255,210,58,.6); background: linear-gradient(#ff8ad0, #c0388a); animation: sxPulse .8s ease-in-out infinite alternate; }
.sx-day.claimed { filter: brightness(.65); } .sx-day.claimed::after { content: '✓'; position: absolute; right: 6px; top: 2px; font-size: 24px; color: #7dff4d; text-shadow: 0 2px 0 #000; }
.sx-day.locked, .sx-day.tomorrow { opacity: .9; }
@keyframes sxPulse { from { transform: scale(1) } to { transform: scale(1.05) } }
.sx-day7 { display: flex; align-items: center; gap: 12px; border: 4px solid #ffd23a; border-radius: 16px; padding: 8px 12px; margin-bottom: 12px; font-weight: 900;
           background: linear-gradient(#a8344a, #4a1230); box-shadow: 0 0 0 3px rgba(255,210,58,.25), inset 0 0 28px rgba(255,210,58,.25); }
.sx-day7.today { animation: sxPulse .8s ease-in-out infinite alternate; } .sx-day7.claimed { filter: brightness(.7); }
.sx-day7 .pic { flex: none; width: 112px; height: 140px; display: flex; align-items: center; justify-content: center; }
.sx-day7 .pic img { width: 100%; height: 100%; object-fit: contain; }
.sx-day7 .pic :is(svg, img.ic) { width: 100%; height: 100%; }
.sx-day7 .tx { display: flex; flex-direction: column; gap: 3px; min-width: 0; } .sx-day7 .dn { font-size: 15px; color: #ffd23a; } .sx-day7 .nm { font-size: 24px; line-height: 1.05; }
.sx-day7 .rw { font-size: 30px; display: flex; align-items: center; gap: 6px; } .sx-day7 .rw :is(svg, img.ic) { width: 36px; height: 36px; }
.sx-day7 .note { font-size: 13px; }
.sx-foot { position: sticky; bottom: calc(var(--pb, 10px) * -1); z-index: 3; margin: 6px calc(var(--px, 10px) * -1) calc(var(--pb, 10px) * -1); padding: 8px var(--px, 10px) 10px; background: linear-gradient(#1b1250, #140c44); border-top: 3px solid #0c0530; box-shadow: 0 -3px 0 #4a2fb8; }
.sx-acts { display: flex; flex-wrap: wrap; gap: 8px 10px; justify-content: center; align-items: flex-start; margin: 0; }
.sx-acts .rb { font-size: clamp(16px, 2.6vw, 22px); min-height: 52px; min-width: 150px; }
.sx-acts .sub { font-size: 12px; color: #d4d0ff; font-weight: 800; text-align: center; margin-top: 4px; max-width: 220px; }
.sx-acts .col { display: flex; flex-direction: column; align-items: center; }
.sx-center { text-align: center; }
.sx-got { margin: 10px 0 4px; padding: 10px; border: 3px solid #7dff4d; border-radius: 16px; background: rgba(60,200,80,.16); text-align: center; }
.sx-got h3 { margin: 0 0 8px; font-size: 20px; color: #7dff4d; }
.sx-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.sx-gchip { display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(12,5,48,.6); border: 2px solid #4a2fb8; border-radius: 14px; font-size: 18px; font-weight: 900; }
.sx-gchip :is(svg, img.ic) { width: 28px; height: 28px; } .sx-gchip img:not(.ic) { width: 52px; height: 52px; object-fit: contain; }
.sx-gchip .rb { font-size: 14px; min-height: 40px; }
/* Колесо */
.sx-wheel-wrap { display: flex; gap: 14px 22px; align-items: center; justify-content: center; padding: 28px 12px 14px; }
.sx-wheel-wrap.side { flex-wrap: nowrap; } .sx-wheel-wrap.stack { flex-direction: column; }
.sxw-wheel .win-b { overflow-x: hidden; }
.sx-wheel { position: relative; flex: none; width: var(--ws, 300px); height: var(--ws, 300px); }
.sx-wheel .rim { position: absolute; inset: -10px; border-radius: 50%; border: 8px solid #0c0530; background: conic-gradient(#ffd23a, #ff8a1f, #ffd23a, #ff8a1f, #ffd23a, #ff8a1f, #ffd23a, #ff8a1f, #ffd23a); box-shadow: 0 6px 0 rgba(0,0,0,.35); }
.sx-wheel canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; will-change: transform; }
.sx-wheel .hub { position: absolute; left: 50%; top: 50%; width: 17%; height: 17%; transform: translate(-50%, -50%); border-radius: 50%; border: 5px solid #0c0530; background: radial-gradient(#fff, #ffd23a 70%); z-index: 2; }
.sx-wheel .ptr { position: absolute; left: 50%; top: -24px; width: 0; height: 0; z-index: 3; border-left: 17px solid transparent; border-right: 17px solid transparent; border-top: 36px solid #ff3b3b;
                 filter: drop-shadow(0 3px 0 #000) drop-shadow(0 0 0 #000); transform: translateX(-50%); transform-origin: 50% 0; transition: transform .07s; }
.sx-wpanel { flex: 1 1 0; min-width: 170px; max-width: 360px; display: flex; flex-direction: column; gap: 10px; align-items: stretch; }
.sx-wheel-wrap.stack .sx-wpanel { flex: none; width: 100%; max-width: 380px; }
.sx-wpanel .rb { min-height: 54px; font-size: clamp(16px, 2.4vw, 21px); width: 100%; flex-direction: column; gap: .1em; }
.sx-wpanel .rb small { font-size: .62em; font-weight: 800; opacity: .95; }
.sx-wpanel .rb .row1 { display: inline-flex; align-items: center; gap: .35em; }
.sx-wres { min-height: 78px; padding: 8px 10px; border-radius: 16px; background: linear-gradient(#251a78, #170f4e); border: 3px solid #0c0530; box-shadow: inset 0 0 0 2px #4a2fb8; text-align: center; font-weight: 900; font-size: 17px;
           display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; }
.sx-wres { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden; } .sx-wres > * { max-width: 100%; } .sx-wres h3 { white-space: normal; } .sx-wres .big { flex-wrap: wrap; justify-content: center; }
.sx-wpanel { min-width: 0; } .sx-wpanel > * { min-width: 0; }
.sx-wres.win { border-color: #ffd23a; background: rgba(255,210,58,.18); animation: sxPulse .5s ease-in-out 3 alternate; }
.sx-wres h3 { margin: 0; font-size: 21px; line-height: 1.05; color: #ffd23a; }
.sx-wres .cap { font-size: 12px; color: #d4d0ff; font-weight: 800; }
.sx-wres .big { font-size: 28px; display: flex; align-items: center; gap: 6px; color: #ffd23a; } .sx-wres .big :is(svg, img.ic) { width: 34px; height: 34px; }
.sx-wres img:not(.ic) { width: 60px; height: 60px; object-fit: contain; }
.sx-wprize { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
.sx-wlegend { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.sx-wchip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 999px; background: rgba(12,5,48,.6); border: 2px solid #4a2fb8; font-size: 15px; line-height: 1.1; }
.sx-wchip :is(svg, img.ic) { width: 20px; height: 20px; } .sx-wchip small { font-size: 11px; opacity: .8; font-weight: 800; }
.sx-wheel-wrap.compact .sx-wpanel { gap: 6px; } .sx-wheel-wrap.compact .sx-wpanel .rb { min-height: 44px; font-size: 16px; }
.sx-wheel-wrap.compact .sx-wres { min-height: 0; padding: 5px 8px; gap: 3px; font-size: 14px; }
.sx-wheel-wrap.compact .sx-wres h3 { font-size: 17px; } .sx-wheel-wrap.compact .sx-wres .cap { display: none; }
.sx-wheel-wrap.compact .sx-wres .big { font-size: 22px; } .sx-wheel-wrap.compact .sx-wres img:not(.ic) { width: 38px; height: 38px; }
.sx-wheel-wrap.compact .sx-wchip { font-size: 13px; padding: 2px 6px; } .sx-wheel-wrap.compact .sx-wchip :is(svg, img.ic) { width: 16px; height: 16px; }
.sx-wheel-wrap.compact .note { font-size: 12px; } .sx-wpanel .note:empty { display: none; }
@media (max-width: 520px) {
  .sx-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .sx-ic { height: 96px; } .sx-ic > img { width: 96px; height: 96px; }
  .sx-card .ttl { font-size: 14px; } .sx-act .rb { font-size: 13px; }
  .sx-gems { font-size: 19px; } .sx-gems :is(svg, img.ic) { width: 24px; height: 24px; }
  .sx-day { min-height: 92px; } .sx-dnote { font-size: 12px; margin-bottom: 8px !important; }
}
@media (max-height: 460px) {
  .sx-ic { height: 84px; } .sx-ic > img { width: 84px; height: 84px; } .sx-card .ttl { font-size: 13px; } .sx-act .rb { min-height: 40px; font-size: 13px; }
  .sx-grid { grid-template-columns: repeat(auto-fill, minmax(116px, 1fr)); gap: 8px; } .sx-gems { font-size: 18px; } .sx-gems :is(svg, img.ic) { width: 22px; height: 22px; }
  .sx-hint { display: none; } .sx-tabs .rb { min-height: 30px; font-size: 13px; } .sx-try { flex-basis: 100px; } .sx-top { padding: 6px 12px 4px; margin: -14px -14px 8px; } .sx-bar { margin-bottom: 4px; }
  .sx-dnote { display: none; } .sx-day { min-height: 84px; } .sx-day7 .pic { width: 80px; height: 100px; } .sx-day7 .nm { font-size: 18px; }
  .sx-acts .rb { min-height: 46px; }
}
`;

const SHOP_WHEEL_COLORS = ['#ff4d4d', '#3b8bff', '#3bdc5a', '#ff8a1f', '#a54dff', '#ffc21f', '#ff5fa2', '#22c8d8'];

/** @satisfies {Record<string, any>} */
const Shops = {
    save: null,
    persist: null,
    /** Внешность по умолчанию (id из NoobLooks / Gfx.FACES). */
    DEFAULT_LOOK: { outfit: 'classic', hat: 'none', face: 'smile', bat: 'wood', trail: 'none', aura: 'none' },
    _cssDone: false,
    _tab: 'outfit',
    _win: '',
    _body: null,
    _el: {},
    _tried: {},
    _timers: [],
    _raf: 0,
    _refreshRaf: 0,
    _cache: {},
    _busy: false,
    _turn: null,
    _daily: null,
    _wheel: { angle: 0, spinning: false, asking: false, gen: 0, size: 300, res: null, imgs: {}, compact: false, last: null },
    _recovered: null,

    // =============================================================================================
    // Связка с игрой
    // =============================================================================================

    /** После Platform.load: подключить магазин, подарок дня и колесо к единому сохранению игры. */
    init(save, persist) {
        this.save = save;
        this.persist = persist;
        this._injectCss();
        // Мифическая редкость брейнрот-скинов: старше легендарной, в случайных наградах подарка и колеса не участвует
        // (там везде задан maxRarity не выше «Редкого»).
        if (!Shop.RARITIES.includes('mythic')) Shop.RARITIES.push('mythic');
        const weights = /** @type {any} */ (Shop.RARITY_WEIGHT);
        if (!(weights.mythic > 0)) weights.mythic = 0.2;
        const fresh = !save.shop;
        Shop.init({ tabs: SHOP_TABS, items: SHOP_ITEMS, state: save.shop, persist, adsAvailable: () => Platform.rewardedSupported() });
        save.shop = Shop.state;
        // Кристаллы старого сохранения (save.gems) переезжают в валюту магазина один раз.
        if (fresh && typeof save.gems === 'number' && save.gems > 0) Shop.addCoins(Math.floor(save.gems), { reason: 'migrate', save: false });
        delete save.gems;
        DailyGift.init({ rewards: DAILY_REWARDS, rewardsSink: Shop, state: save.daily, persist });
        save.daily = DailyGift.state;
        Wheel.init({
            sectors: WHEEL_SECTORS, rewardsSink: Shop, state: save.wheel, persist,
            onChange: (e) => { if (e.type === 'prize' && e.recovered) this._recovered = e; },
        });
        save.wheel = Wheel.state;
        Shop.on((e) => this._onShop(e));
        this._validate();
        if (this._recovered) {
            // Приз колеса, выданный при запуске (страницу закрыли посреди вращения).
            const e = this._recovered;
            setTimeout(() => { UI.toast(Lang.t('sh.wheel.won') + ': ' + e.label, '#ffd23a', 3.2); Sfx.play('win', 0.5); }, 3500);
        }
        // Окно магазина прижато к краю: касание рядом с ним не закрывает его (закрывают крестик и Esc).
        const modal = document.getElementById('modal');
        if (modal) modal.addEventListener('pointerdown', (e) => { if (e.target === modal && modal.querySelector('.sxw-shop')) e.stopImmediatePropagation(); }, true);
    },

    _validate() {
        const v = Shop.validate();
        if (!v.ok) console.warn('Shop.validate:', v.problems.map((p) => p.message));
        if (v.warnings.length) console.warn('Shop.validate (замечания):', v.warnings.map((p) => p.message));
        const d = DailyGift.validate();
        if (!d.ok || d.warnings.length) console.warn('DailyGift.validate:', d.problems.concat(d.warnings).map((p) => p.message));
        const w = Wheel.validate();
        if (!w.ok) console.warn('Wheel.validate:', w.problems.map((p) => p.message));
    },

    /** Внешность героя { outfit, hat, face, bat, trail, aura }: надетое и примерка поверх, иначе умолчания. */
    look() {
        const l = Shop.look();
        const out = Object.assign({}, this.DEFAULT_LOOK);
        for (const slot of Object.keys(out)) {
            const it = l[slot] ? Shop.item(l[slot]) : null;
            if (it && it.look) out[slot] = it.look;
        }
        return out;
    },

    gems() { return Shop.coins; },
    addGems(n, opts) { return Shop.addCoins(n, opts && opts.save === false ? { save: false } : undefined); },

    /** Красные точки на кнопках: { daily, wheel } (1 — есть что забрать). */
    badge() { return { daily: DailyGift.badge(), wheel: Wheel.badge() }; },

    shouldOfferDaily() { return DailyGift.shouldOffer() && !(typeof Tutorial !== 'undefined' && Tutorial.active); },

    _onShop(e) {
        if (e.type === 'preview') { if (e.id) this._tried[e.slot] = e.id; else delete this._tried[e.slot]; }
        if (e.type === 'equip' || e.type === 'unequip' || e.type === 'preview') {
            if (typeof Game !== 'undefined' && Game.player && Game.player.noob) Game.applyLook();
        }
        if (this._win === 'shop') this._scheduleRefresh();
    },

    _injectCss() {
        if (this._cssDone) return;
        this._cssDone = true;
        const st = document.createElement('style');
        st.textContent = SHOP_UI_CSS;
        document.head.appendChild(st);
    },

    // =============================================================================================
    // Окна: открытие, закрытие, общие мелочи
    // =============================================================================================

    _open(id, title, color, width) {
        this._cleanup();
        const b = UI.window({ id, title, color, width, onClose: () => { this._cleanup(); this._win = ''; this._body = null; } });
        this._win = id;
        this._body = b;
        this._busy = false;
        // Окна магазина, подарка и колеса скрывают главное меню, а не рисуются поверх него.
        const menu = document.getElementById('menu');
        if (menu && menu.classList.contains('open')) menu.style.visibility = 'hidden';
        b.parentElement.classList.add('sx-win', 'sxw-' + id);
        return b;
    },

    /** Сбросить всё, что держит окно: таймеры, примерка, вращение героя, незавершённое вращение колеса. */
    _cleanup() {
        for (const t of this._timers) clearInterval(t);
        this._timers = [];
        const menu = document.getElementById('menu');
        if (menu) menu.style.visibility = '';
        if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
        if (this._refreshRaf) { cancelAnimationFrame(this._refreshRaf); this._refreshRaf = 0; }
        if (this._win === 'shop') { this._stopTurn(); Shop.clearPreview(); }
        if (this._win === 'wheel') this._wheelClose();
        this._tried = {};
    },

    /** Секундный таймер окна; сам гасится, если окно закрыли или заменили другим. */
    _every(ms, fn) {
        const win = this._win;
        const t = setInterval(() => { if (UI.open !== win) { this._cleanup(); this._win = ''; return; } fn(); }, ms);
        this._timers.push(t);
    },

    /** Короткое сообщение внутри окна (тосты игры рисуются под затемнением окна и не видны). */
    _say(text, color) {
        const host = this._body && this._body.parentElement;
        if (!host || !text) return;
        let s = /** @type {HTMLElement} */ (host.querySelector('.sx-snack'));
        if (!s) { s = UI.el('<div class="sx-snack ui-o1"></div>'); host.appendChild(s); }
        s.textContent = text;
        s.style.color = color || '#fff';
        s.classList.remove('show');
        void s.offsetWidth;
        s.classList.add('show');
    },

    /** Кнопка окон магазина: срабатывает по click (прокрутка пальцем не жмёт её); класс off — «недоступно, но объясни почему».
     *  После действия — точка межстраничной рекламы Playables (UI.adBreak); кнопки «за рекламу» (значок просмотра видео в html)
     *  и opts.noAd (покупка за кристаллы — её точку ставит Game, вращение колеса — игровое действие с анимацией) — без неё. */
    _btn(html, cls, fn, opts) {
        const b = UI.el(`<button class="rb ${cls || 'c-green'} ui-o sx-b">${html}</button>`);
        const noAd = !!(opts && opts.noAd) || html.indexOf(UI_ICONS.ad) >= 0;
        b.addEventListener('pointerdown', (e) => e.stopPropagation());
        b.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            const off = b.classList.contains('off'), place = 'ui:' + (this._win || 'shop');
            Sfx.play(off ? 'error' : 'click', off ? 0.4 : 0.5);
            fn(e, b);
            if (!noAd && !off) UI.adBreak(place);
        });
        return b;
    },

    _gemIcon() { return UI_ICONS.gem; },
    _rarityColor(r) { return (GameData.RARITY[r] || GameData.RARITY.common).color; },

    // =============================================================================================
    // Магазин
    // =============================================================================================

    openShop(tab) {
        const tabs = Shop.tabs();
        if (!tabs.length) return;
        if (tab && tabs.some((t) => t.id === tab)) this._tab = tab;
        else if (!tabs.some((t) => t.id === this._tab)) this._tab = tabs[0].id;
        const b = this._open('shop', Lang.t('sh.title'), 'linear-gradient(#7dff4d,#1fa31e)');
        this._startTurn();
        const top = UI.el('<div class="sx-top"></div>');
        const bar = UI.el(`<div class="sx-bar"><div class="sx-gems ui-o">${this._gemIcon()}<span></span></div><div class="sx-count ui-o1"></div><div class="sx-try"></div></div>`);
        const tabsEl = UI.el('<div class="sx-tabs"></div>');
        top.appendChild(bar);
        top.appendChild(tabsEl);
        const grid = UI.el('<div class="sx-grid"></div>');
        const banner = UI.el(`<div class="sx-banner" style="display:none">${UI.esc(Lang.t('sh.noAds'))}</div>`);
        b.appendChild(top);
        b.appendChild(banner);
        b.appendChild(grid);
        this._el = {
            gems: bar.querySelector('.sx-gems span'), count: bar.querySelector('.sx-count'), tryEl: bar.querySelector('.sx-try'),
            tabs: tabsEl, grid, banner,
        };
        for (const t of tabs) {
            const tb = this._btn(UI.esc(t.name), 'c-gray', () => {
                if (this._tab === t.id) return;
                this._tab = t.id;
                this._refreshShop();
                b.scrollTop = 0;
            });
            tb.dataset.tab = t.id;
            tabsEl.appendChild(tb);
        }
        this._refreshShop();
        this._every(1000, () => { if (this._win === 'shop') this._refreshShop(true); });
    },

    _scheduleRefresh() {
        if (this._refreshRaf) return;
        this._refreshRaf = requestAnimationFrame(() => { this._refreshRaf = 0; this._refreshShop(); });
    },

    /** Перерисовать шапку и карточки текущей вкладки (прокрутка сохраняется). soft — только если что-то изменилось (таймер повтора рекламы). */
    _refreshShop(soft) {
        const b = this._body;
        if (!b || this._win !== 'shop' || !this._el.grid) return;
        const E = this._el;
        const sig = Shop.coins + '|' + this._tab + '|' + Object.keys(this._tried).map((k) => this._tried[k]).join(',') + '|' + (Shop._adBusy ? 1 : 0) + '|' + Shop.adWaitSec();
        if (soft && sig === this._sig) return;
        this._sig = sig;
        const st = b.scrollTop;
        E.gems.textContent = GameData.fmt(Shop.coins);
        const tabs = Shop.tabs();
        let own = 0, all = 0;
        for (const t of tabs) { own += t.owned; all += t.count; }
        E.count.textContent = Lang.t('sh.collection', { n: own, m: all });
        for (const tb of /** @type {HTMLElement[]} */ (Array.from(E.tabs.children))) {
            const on = tb.dataset.tab === this._tab;
            tb.classList.toggle('sel', on);
            tb.classList.toggle('c-green', on);
            tb.classList.toggle('c-gray', !on);
        }
        const tried = Object.keys(this._tried).map((k) => this._tried[k]);
        E.tryEl.innerHTML = '';
        if (tried.length) {
            E.tryEl.appendChild(UI.el(`<div>${UI.esc(Lang.t('sh.trying', { name: tried.map((id) => Shop.name(id)).join(', ') }))}</div>`));
            const cl = this._btn(UI.esc(Lang.t('sh.clearTry')), 'c-gray', () => Shop.clearPreview());
            cl.style.cssText = 'font-size:12px;padding:4px 8px;min-height:30px;margin-top:4px';
            E.tryEl.appendChild(cl);
        } else E.tryEl.innerHTML = `<span class="sx-hint">${UI.esc(Lang.t('sh.tapHint'))}</span>`;
        const cards = Shop.cards(this._tab);
        E.grid.innerHTML = '';
        for (const c of cards) E.grid.appendChild(this._card(c));
        const noAds = !Platform.rewardedSupported() && cards.some((c) => c.kind === 'ads' && !c.owned);
        E.banner.style.display = noAds ? '' : 'none';
        b.scrollTop = st;
    },

    _card(c) {
        const rc = this._rarityColor(c.rarity);
        const el = UI.el(`<div class="card sx-card r-${c.rarity || 'common'}${this._tried[c.slot] === c.id ? ' sel' : ''}${c.equipped ? ' eq' : ''}" style="--rc:${rc}">
            <div class="sx-ic"></div><div class="ttl ui-o">${UI.esc(c.name)}</div>
            <div class="sx-rar ui-o1" style="color:${rc}">${UI.esc(c.rarityLabel)}</div><div class="sx-act"></div></div>`);
        el.querySelector('.sx-ic').appendChild(this.icon(c.item));
        const ic = el.querySelector('.sx-ic');
        if (c.item.unique) ic.appendChild(UI.el(`<span class="sx-ribbon ui-o1">${UI.esc(Lang.t('sh.unique')).toUpperCase()}</span>`));
        if (c.equipped) ic.appendChild(UI.el(`<span class="sx-chip ok ui-o1">✓ ${UI.esc(Shop.t('shop.equipped'))}</span>`));
        else if (!c.owned) ic.appendChild(UI.el(`<span class="sx-chip ui-o1">${UI_ICONS.lock}</span>`));
        const act = el.querySelector('.sx-act');
        const run = (b) => this._act(c.id, b);
        if (c.owned) {
            if (c.action === 'unequip') act.appendChild(this._btn(UI.esc(c.actionLabel), 'c-gray', (e, b) => run(b)));
            else if (c.action === 'equip') act.appendChild(this._btn(UI.esc(c.actionLabel), 'c-blue', (e, b) => run(b)));
            else act.appendChild(UI.el(`<div class="sx-pill ui-o1">${UI.esc(Shop.t('shop.equipped'))}</div>`));
        } else if (c.kind === 'coins') {
            act.appendChild(this._btn(`${this._gemIcon()}<span>${UI.esc(GameData.fmt(c.price))}</span>`, c.enabled ? 'c-green' : 'c-gray off', (e, b) => run(b), { noAd: true }));
        } else if (c.kind === 'ads') {
            act.appendChild(UI.el(`<div class="prog"><i style="width:${Math.round(100 * c.progress / Math.max(1, c.need))}%"></i></div>`));
            const b = this._btn(`${UI_ICONS.ad}<span>${UI.esc(c.priceLabel)}</span>`, c.enabled ? 'c-yellow' : 'c-gray off', (e, bt) => run(bt));
            if (!c.enabled && c.hint) b.title = c.hint;
            act.appendChild(b);
        } else {
            act.appendChild(UI.el(`<div class="sx-pill gold ui-o1">${UI.esc(c.priceLabel)}<br>${UI.esc(Lang.t('sh.dayPrize'))}</div>`));
        }
        el.addEventListener('click', () => this._tryOn(c.id));
        return el;
    },

    /** Примерка: нажатие на карточку показывает вещь на герое, повторное — снимает. */
    _tryOn(id) {
        const it = Shop.item(id);
        if (!it) return;
        const slot = Shop.slotOf(it);
        Sfx.play('click', 0.35);
        if (this._tried[slot] === id) Shop.clearPreview(slot);
        else Shop.preview(id);
    },

    async _act(id, btn) {
        if (this._busy) return;
        const c = Shop.card(id);
        if (!c) return;
        const name = c.name;
        if (btn.classList.contains('off')) {   // недоступно: объясняем почему
            this._say(c.hint || (c.action === 'watch' ? Shop.t('shop.adUnavailable') : ''), '#ffd23a');
            return;
        }
        if (c.action === 'buy') {
            const r = Shop.buy(id);
            if (r.ok) { Sfx.play('buy', 0.7); this._say(Lang.t('sh.bought', { name }), '#7dff6a'); } else { Sfx.play('error', 0.5); this._say(c.hint, '#ffd23a'); }
        } else if (c.action === 'watch') {
            this._busy = true;
            btn.classList.add('off');
            let r;
            try { r = await Shop.watchAd(id); } catch (e) { r = { ok: false, reason: 'adFailed' }; }
            this._busy = false;
            if (r.ok && r.unlocked) { Sfx.play('win', 0.6); this._say(Lang.t('sh.unlocked', { name }), '#7dff6a'); }
            else if (r.ok) { Sfx.play('coin', 0.6); this._say(Lang.t('sh.adCounted', { a: r.progress, b: r.need }), '#ffd23a'); }
            else if (r.reason === 'adFailed') this._say(Lang.t('sh.adFailed'), '#ffd23a');
            else if (r.reason === 'cooldown' || r.reason === 'adUnavailable') this._say(Shop.t('shop.adUnavailable'), '#ffd23a');
            if (this._win === 'shop') this._refreshShop();
        } else if (c.action === 'equip' || c.action === 'unequip') {
            await Shop.act(id);
        }
    },

    // --- Сцена примерки: камера смотрит на героя левее окна (или выше него), герой медленно поворачивается ---
    // Окно открыто — мир стоит (Game.update не идёт), поэтому камеру и поворот ведём здесь; при закрытии всё возвращается.
    _startTurn() {
        const g = typeof Game !== 'undefined' ? Game : null;
        const p = g && g.player;
        if (!p || !p.noob) return;
        const t0 = performance.now(), y0 = p.noob.root.rotation.y;
        const stage = { p, cam: null, zoom: 0, pitch: 0, f: null, tx: 0, ty: 0, portrait: false, az0: null, az: null };
        this._turn = stage;
        if (UI.root) UI.root.style.visibility = 'hidden';   // HUD не закрывает героя
        setTimeout(() => {   // после анимации появления окна: размеры окна уже настоящие
            if (this._turn !== stage || UI.open !== 'shop') return;
            try {
                const cam = g.app.camera;
                if (!cam || !g.camTarget) return;
                stage.cam = cam; stage.zoom = cam.zoom; stage.pitch = cam.pitch;
                const H = (World3D.engine.getRenderingCanvas().clientHeight) || window.innerHeight;
                if (g.state === 'play') cam.zoomTarget = stage.zoom * (window.innerHeight < 500 ? 1.1 : 1.45);
                else { cam.pitch = 0.3; cam.zoomTarget = H / (2 * Math.tan(cam.cam.fov / 2) * 640); }
                // Герой — в центре свободной части экрана (левее окна, в портрете — выше него): цель камеры
                // подстраивается в цикле ниже по тому, где герой реально виден на экране.
                const win = this._body.parentElement.getBoundingClientRect();
                const portrait = window.innerHeight > window.innerWidth;
                if (portrait) cam.pitch = Math.max(cam.pitch, 0.95);   // сверху: герой выше окна, стены не перекрывают
                stage.tx = portrait ? window.innerWidth / 2 : win.left / 2;
                stage.ty = portrait ? win.top / 2 : window.innerHeight / 2;
                stage.portrait = portrait;
                stage.az0 = cam.azimuth;
                stage.az = this._pickAzimuth(p, cam, H, win, portrait);
                stage.f = { x: p.x, y: p.y, h: (p.gh || 0) + 120 };
                cam.follow(stage.f);
            } catch (e) { stage.cam = null; }
        }, 260);
        this._timers.push(setInterval(() => {
            if (UI.open !== 'shop') { this._cleanup(); this._win = ''; return; }
            p.noob.root.rotation.y = y0 + (performance.now() - t0) * 0.0011;
            if (stage.az != null && stage.cam) {   // плавный поворот камеры на открытую сторону
                let da = stage.az - stage.cam.azimuth;
                da = Math.atan2(Math.sin(da), Math.cos(da));
                if (Math.abs(da) > 0.002) stage.cam.azimuth += da * 0.12;
            }
            if (stage.f && stage.cam) {
                const v = World.app.location.view.projectToScreen(p.x, p.y, 120);
                const ex = v.x - stage.tx, ey = v.y - stage.ty;
                if (v.visible && Math.abs(ex) + Math.abs(ey) > 1.5) {
                    const d = stage.cam.screenDeltaToWorld(ex, ey);
                    const k = 0.14 * (stage.portrait ? 1 / Math.max(0.2, Math.sin(stage.cam.pitch)) : 1);
                    stage.f.x += d.x * k; stage.f.y += d.y * k;
                }
            }
        }, 33));
    },
    /**
     * Азимут камеры, с которого героя видно с открытой стороны. Камера стоит «за спиной» цели на расстоянии dist; пробуем
     * повороты от текущего азимута с шагом 15° (ближние первыми) и берём первый, где линия камера — герой не упирается
     * в стену или табло моста (World.isOpen / inBridge, как в Game.updateCamera); если открытого нет — где стена дальше.
     */
    _pickAzimuth(p, cam, H, win, portrait) {
        const pitch = cam.pitch, cp = Math.cos(pitch), spn = Math.sin(pitch), sp = Math.max(0.2, spn);
        const kz = 1 / (cam.zoomTarget || cam.zoom || 1);
        const dist = H / (2 * Math.tan(cam.cam.fov / 2) * (cam.zoomTarget || cam.zoom || 1));
        // Сдвиг цели камеры от героя (экранные px -> мир): левее окна или выше него.
        const sx = portrait ? 0 : (window.innerWidth - win.left) / 2;
        const sy = portrait ? (window.innerHeight - win.top) / 2 / sp : 0;
        const th = (p.gh || 0) + 120, camH = th + spn * dist;
        let best = cam.azimuth, bestScore = -1;
        for (let k = 0; k <= 24; k++) {
            const turn = k === 0 ? 0 : Math.ceil(k / 2) * (Math.PI / 12) * (k % 2 ? 1 : -1);
            const az = cam.azimuth + turn, ca = Math.cos(az), sa = Math.sin(az);
            const tx = p.x + (-sa * sx - ca * sy) * kz, ty = p.y + (ca * sx - sa * sy) * kz;
            const cx = tx - ca * cp * dist, cy = ty - sa * cp * dist;
            const len = Math.hypot(cx - p.x, cy - p.y), n = Math.max(2, Math.ceil(len / 40));
            let first = Infinity;
            for (let i = 0; i <= n; i++) {   // от камеры к герою
                const t = i / n, x = cx + (p.x - cx) * t, y = cy + (p.y - cy) * t, h = camH + (th - camH) * t;
                if ((h < 500 && !World.isOpen(x, y, 30)) || World.inBridge(x, y, h)) { first = (1 - t) * len; break; }
            }
            if (first === Infinity) return az;
            if (first > bestScore) { bestScore = first; best = az; }
        }
        return best;
    },
    _stopTurn() {
        const t = this._turn;
        this._turn = null;
        if (UI.root) UI.root.style.visibility = '';
        if (!t || !t.p || !t.p.noob) return;
        t.p.noob.root.rotation.y = -t.p.heading;
        if (t.cam) {
            if (t.az0 != null) t.cam.azimuth = t.az0;
            t.cam.follow(Game.camTarget);
            t.cam.zoomTarget = t.zoom;
            t.cam.pitch = t.pitch;
        }
    },

    // =============================================================================================
    // Превью предметов
    // =============================================================================================

    /** <img> с превью предмета. 3D-вещи (шапки, биты) рисует Thumbs из игровых моделей, остальное — canvas; всё в кэше. */
    icon(it) {
        const look = it.look;
        if (look === 'none' && it.tab !== 'face') return this._img(this._data('none', () => this._nonePng()));
        if (it.tab === 'hat') {
            return Thumbs.mesh('hat-' + look, 120, (scene) => {
                this._thumbFix();
                const root = new BABYLON.Mesh('h', scene);
                buildPrims(scene, NoobLooks.HATS[look], root, 'h');
                root.rotation.y = -1.4;   // передом к камере, как у героя
                return this._fit(root, 140);
            });
        }
        if (it.tab === 'bat') {
            return Thumbs.mesh('bat-' + look, 120, (scene) => {
                this._thumbFix();
                const root = new BABYLON.Mesh('b', scene);
                buildPrims(scene, NoobLooks.BATS[look], root, 'b');
                root.rotation.z = Math.PI / 2 - 0.3;   // бита стоит почти вертикально
                return this._fit(root, 150);
            });
        }
        if (it.tab === 'outfit') return Thumbs.mesh('outfit-' + look, 210, (scene) => { this._thumbFix(); return this._fit(this._noobMesh(scene, look), 272, 94); });
        if (it.tab === 'face') return this._img(this._data(it.id, () => this._facePng(look)));
        if (it.tab === 'trail') return this._img(this._data(it.id, () => this._trailPng(NoobLooks.TRAILS[look] || ['#ffffff'])));
        if (it.tab === 'aura') return this._img(this._data(it.id, () => this._auraPng(look)));
        return this._img('');
    },

    /**
     * Камера Thumbs берёт пропорции кадра у экрана игры (в портрете картинка выходит растянутой вширь, в низком
     * альбомном — худой), а превью квадратное: считаем её проекцию с aspect = 1.
     */
    _thumbFix() {
        const cam = /** @type {any} */ (Thumbs)['cam'];
        if (!cam || cam._sxSquare) return;
        cam._sxSquare = true;
        const orig = cam.getProjectionMatrix.bind(cam);
        cam.getProjectionMatrix = () => {
            const eng = cam.getEngine(), saved = eng.getAspectRatio;
            eng.getAspectRatio = () => 1;
            try { return orig(true); } finally { eng.getAspectRatio = saved; }
        };
    },

    /** Вписать модель в кадр Thumbs (центр на высоте взгляда камеры, наибольший размер — size). */
    _fit(root, size, cy) {
        root.computeWorldMatrix(true);
        for (const m of root.getChildMeshes(false)) m.computeWorldMatrix(true);
        const b = root.getHierarchyBoundingVectors(true);
        const dx = b.max.x - b.min.x, dy = b.max.y - b.min.y, dz = b.max.z - b.min.z;
        const k = size / Math.max(dx, dy, dz, 1);
        root.scaling.set(k, k, k);
        root.position.set(-(b.min.x + b.max.x) / 2 * k, (cy || 54) - (b.min.y + b.max.y) / 2 * k, -(b.min.z + b.max.z) / 2 * k);
        // Сцена Thumbs сама не рендерится: матрицы мира обновляем вручную, уже с итоговым масштабом.
        root.computeWorldMatrix(true);
        for (const m of root.getChildMeshes(false)) m.computeWorldMatrix(true);
        return root;
    },

    _data(key, make) { return this._cache[key] || (this._cache[key] = make()); },
    _img(url) { const i = new Image(); i.alt = ''; i.draggable = false; if (url) i.src = url; return i; },
    _canvas(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; },
    _rgba(hex, a) {
        const n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    },

    _nonePng() {
        const cv = this._canvas(160, 160), c = cv.getContext('2d');
        c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 12; c.lineCap = 'round';
        c.beginPath(); c.arc(80, 80, 44, 0, Math.PI * 2); c.moveTo(48, 112); c.lineTo(112, 48); c.stroke();
        return cv.toDataURL();
    },

    /**
     * Нуб спереди из блоков (как в игре: голова, торс с рисунком, руки, ноги, обувь) в прямоугольнике W×H.
     * look: { outfit | custom, face }.
     */
    _drawNoob(c, W, H, look) {
        const of = look.custom || NoobLooks.OUTFITS[look.outfit] || NoobLooks.OUTFITS.classic;
        const k = H * 0.94 / 210;
        const ox = W / 2, gy = H * 0.975;
        const X = (z) => ox + z * k, Y = (y) => gy - y * k;
        const skin = of.skin, arms = of.arms === 'skin' || !of.arms ? skin : of.arms;
        const lw = Math.max(1.5, H / 64);
        const part = (z0, z1, y0, y1, col, r) => {
            const x = X(z0), y = Y(y1), w = (z1 - z0) * k, h = (y1 - y0) * k;
            c.beginPath(); c.roundRect(x, y, w, h, r * k);
            c.fillStyle = col; c.fill();
            const g = c.createLinearGradient(x, y, x + w, y);
            g.addColorStop(0, 'rgba(255,255,255,.24)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.26)');
            c.fillStyle = g; c.fill();
            c.lineWidth = lw; c.strokeStyle = 'rgba(8,8,12,.8)'; c.stroke();
        };
        c.save();
        if (of.glow) { c.shadowColor = of.glow; c.shadowBlur = H * 0.06; }
        part(-40, 0, 0, 80, of.legs, 3); part(0, 40, 0, 80, of.legs, 3);
        const shoes = of.shoes || of.legs;
        part(-40, 0, 0, 14, shoes, 3); part(0, 40, 0, 14, shoes, 3);
        part(-80, -40, 80, 160, arms, 4); part(40, 80, 80, 160, arms, 4);
        part(-40, 40, 80, 160, of.torso, 4);
        c.restore();
        if (of.decal) {
            c.save();
            c.beginPath(); c.rect(X(-40), Y(160), 80 * k, 80 * k); c.clip();
            c.translate(X(-33), Y(153));
            Noob.drawDecal(c, of.decal, 66 * k, 66 * k);
            c.restore();
        }
        c.save();
        if (of.glow) { c.shadowColor = of.glow; c.shadowBlur = H * 0.05; }
        part(-25, 25, 160, 208, skin, 9);
        c.restore();
        c.save();
        c.translate(X(-23), Y(205));
        c.scale((46 * k) / 256, (42 * k) / 256);
        Gfx.drawFace(c, look.face || 'smile');
        c.restore();
    },

    /**
     * Нуб спереди из тех же блоков, что в игре (GameNoob._build): ноги, обувь, торс с рисунком, руки, голова с лицом и
     * надетые детали наряда (extra.head / extra.body) — для 3D-превью Thumbs. Материалы и текстуры свои: Thumbs их удалит.
     */
    _noobMesh(scene, id) {
        const of = NoobLooks.OUTFITS[id] || NoobLooks.OUTFITS.classic;
        const root = new BABYLON.Mesh('n', scene);
        const glow = of.glow ? BABYLON.Color3.FromHexString(of.glow).scale(0.18) : null;
        const mat = (hex, lit) => {
            const m = new BABYLON.StandardMaterial('nm', scene);
            m.diffuseColor = BABYLON.Color3.FromHexString(hex);
            m.specularColor = new BABYLON.Color3(0.12, 0.12, 0.12);
            if (lit && glow) m.emissiveColor = glow;
            return m;
        };
        const box = (w, h, d, x, y, z, hex, lit) => {
            const m = BABYLON.MeshBuilder.CreateBox('np', { width: w, height: h, depth: d }, scene);
            m.position.set(x, y, z); m.material = mat(hex, lit); m.parent = root;
            return m;
        };
        const skin = of.skin, arms = of.arms === 'skin' || !of.arms ? skin : of.arms;
        box(40, 80, 39, 0, 40, -20, of.legs, true); box(40, 80, 39, 0, 40, 20, of.legs, true);
        box(42, 14, 41, 0, 7, -20, of.shoes || of.legs); box(42, 14, 41, 0, 7, 20, of.shoes || of.legs);
        box(40, 80, 80, 0, 120, 0, of.torso, true);
        box(40, 80, 40, 0, 120, -60, arms, true); box(40, 80, 40, 0, 120, 60, arms, true);
        // Голова: узел в центре головы (как headNode), на нём цилиндры, лицо и extra.head.
        const hn = new BABYLON.Mesh('nh', scene);
        hn.parent = root; hn.position.set(0, 184, 0);
        const hm = mat(skin);
        for (const [hh, dd] of [[40, 50], [48, 42]]) {
            const c = BABYLON.MeshBuilder.CreateCylinder('nc', { height: hh, diameter: dd, tessellation: 22 }, scene);
            c.material = hm; c.parent = hn;
        }
        const plane = (w, h, px, py, pz, size, draw) => {
            const t = new BABYLON.DynamicTexture('nt', { width: size, height: size }, scene, true);
            t.hasAlpha = true;
            draw(t.getContext(), size);
            t.update(true);
            const m = new BABYLON.StandardMaterial('np', scene);
            m.diffuseTexture = t; m.useAlphaFromDiffuseTexture = true;
            m.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3); m.specularColor = new BABYLON.Color3(0, 0, 0);
            const pl = BABYLON.MeshBuilder.CreatePlane('npl', { width: w, height: h, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);
            pl.material = m; pl.rotation.y = -Math.PI / 2; pl.position.set(px, py, pz);
            return pl;
        };
        plane(46, 40, 25.8, 0, 0, 256, (c) => Gfx.drawFace(c, 'smile')).parent = hn;
        if (of.decal) plane(66, 66, 20.6, 120, 0, 132, (c, n) => Noob.drawDecal(c, of.decal, n, n)).parent = root;
        if (of.extra && of.extra.head) buildPrims(scene, of.extra.head, hn, 'nxh');
        if (of.extra && of.extra.body) buildPrims(scene, of.extra.body, root, 'nxb');
        root.rotation.y = -1.4;   // лицом к камере Thumbs, чуть боком
        return root;
    },

    _facePng(id) {
        const cv = this._canvas(256, 256), c = cv.getContext('2d');
        const sk = '#f5cd30';
        c.beginPath(); c.roundRect(24, 24, 208, 208, 56); c.fillStyle = sk; c.fill();
        const g = c.createLinearGradient(24, 24, 232, 232);
        g.addColorStop(0, 'rgba(255,255,255,.3)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.25)');
        c.fillStyle = g; c.fill();
        c.lineWidth = 8; c.strokeStyle = 'rgba(8,8,12,.85)'; c.stroke();
        c.save(); c.translate(20, 14); c.scale(0.84, 0.84); Gfx.drawFace(c, id); c.restore();
        return cv.toDataURL();
    },

    _trailPng(cols) {
        const S = 256, cv = this._canvas(S, S), c = cv.getContext('2d');
        c.beginPath(); c.roundRect(8, 8, S - 16, S - 16, 36);
        const bg = c.createLinearGradient(0, 0, S, S);
        bg.addColorStop(0, '#7a8296'); bg.addColorStop(1, '#434a5a');
        c.fillStyle = bg; c.fill();
        c.save(); c.clip();
        // Лента: кривая Безье со сужением к хвосту.
        const P = [[34, 206], [84, 246], [150, 40], [226, 70]];
        const pt = (t) => {
            const u = 1 - t;
            return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]];
        };
        const left = [], right = [];
        for (let i = 0; i <= 40; i++) {
            const t = i / 40, a = pt(t), b = pt(Math.min(1, t + 0.01)), a0 = pt(Math.max(0, t - 0.01));
            const dx = b[0] - a0[0], dy = b[1] - a0[1], len = Math.hypot(dx, dy) || 1;
            const w = 3 + 30 * Math.pow(t, 0.8);
            left.push([a[0] - dy / len * w, a[1] + dx / len * w]); right.push([a[0] + dy / len * w, a[1] - dx / len * w]);
        }
        const ribbon = () => { c.beginPath(); left.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); for (let i = right.length - 1; i >= 0; i--) c.lineTo(right[i][0], right[i][1]); c.closePath(); };
        const gr = c.createLinearGradient(P[0][0], P[0][1], P[3][0], P[3][1]);
        if (cols.length === 1) { gr.addColorStop(0, this._rgba(cols[0], 0.25)); gr.addColorStop(1, this._rgba(cols[0], 1)); }
        else cols.forEach((h, i) => gr.addColorStop(i / (cols.length - 1), this._rgba(h, i === 0 ? 0.55 : 1)));
        c.shadowColor = this._rgba(cols[cols.length - 1], 0.9); c.shadowBlur = 22;
        ribbon(); c.fillStyle = gr; c.fill();
        c.shadowBlur = 0; ribbon(); c.lineWidth = 4; c.strokeStyle = 'rgba(8,8,12,.55)'; c.stroke();
        // Блики-искры вдоль ленты.
        c.fillStyle = 'rgba(255,255,255,.85)';
        for (const [t, r] of [[0.3, 3], [0.55, 4], [0.8, 5], [0.92, 3]]) { const p = pt(t); c.beginPath(); c.arc(p[0] + 6, p[1] - 8, r, 0, Math.PI * 2); c.fill(); }
        c.restore();
        c.lineWidth = 6; c.strokeStyle = 'rgba(8,8,12,.7)'; c.beginPath(); c.roundRect(8, 8, S - 16, S - 16, 36); c.stroke();
        return cv.toDataURL();
    },

    _auraPng(id) {
        const a = NoobLooks.AURAS[id];
        const S = 256, cv = this._canvas(S, S), c = cv.getContext('2d');
        c.beginPath(); c.roundRect(8, 8, S - 16, S - 16, 36);
        const bg = c.createRadialGradient(S / 2, S / 2, 20, S / 2, S / 2, S * 0.75);
        bg.addColorStop(0, '#3a4256'); bg.addColorStop(1, '#161a24');
        c.fillStyle = bg; c.fill();
        c.save(); c.clip();
        c.save(); c.translate(S / 2 - 62, 40); this._drawNoob(c, 124, 190, { custom: { torso: '#566074', legs: '#434b5e', skin: '#6a7488', arms: '#566074' }, face: 'smile' }); c.restore();
        let seed = 7; for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) % 2147483647;
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const lighter = (a.blend || 'additive') === 'additive';
        c.globalCompositeOperation = lighter ? 'lighter' : 'source-over';
        for (let i = 0; i < 34; i++) {
            const ang = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
            const x = S / 2 + Math.cos(ang) * rr * 104, y = S / 2 + 6 + Math.sin(ang) * rr * 112;
            const r = (a.size[0] + rnd() * (a.size[1] - a.size[0])) * 0.95 + 2;
            const col = rnd() < 0.5 ? a.color : a.color2;
            if (lighter) {
                const g = c.createRadialGradient(x, y, 0, x, y, r * 1.8);
                g.addColorStop(0, this._rgba(col, 1)); g.addColorStop(0.35, this._rgba(col, 0.75)); g.addColorStop(1, this._rgba(col, 0));
                c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 1.8, 0, Math.PI * 2); c.fill();
            } else {
                c.fillStyle = this._rgba(col, 0.92); c.strokeStyle = 'rgba(8,8,12,.55)'; c.lineWidth = 2;
                c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
            }
            if (Math.abs(a.up) > 50) {   // след движения: вверх (огонь, гроза) или вниз (снег, листья)
                const dir = a.up > 0 ? 1 : -1;
                const g2 = c.createLinearGradient(x, y, x, y + dir * r * 3.5);
                g2.addColorStop(0, this._rgba(col, 0.5)); g2.addColorStop(1, this._rgba(col, 0));
                c.fillStyle = g2; c.fillRect(x - r * 0.4, Math.min(y, y + dir * r * 3.5), r * 0.8, r * 3.5);
            }
        }
        c.restore();
        c.globalCompositeOperation = 'source-over';
        c.lineWidth = 6; c.strokeStyle = 'rgba(8,8,12,.7)'; c.beginPath(); c.roundRect(8, 8, S - 16, S - 16, 36); c.stroke();
        return cv.toDataURL();
    },

    // =============================================================================================
    // Daily Gift
    // =============================================================================================

    openDaily() {
        DailyGift.markOffered();
        this._open('daily', Lang.t('sh.daily.title'), 'linear-gradient(#ffa0d8,#e03c84)', 780);
        this._daily = { got: null };
        this._renderDaily();
        this._every(1000, () => {
            if (this._win !== 'daily') return;
            const s = DailyGift.status();
            if (s.canClaim !== this._dailyCan) { this._renderDaily(); return; }
            const el = this._body.querySelector('.sx-next');
            if (el && !s.canClaim) el.textContent = s.nextLabel;
        });
    },

    _renderDaily() {
        const b = this._body;
        if (!b || this._win !== 'daily') return;
        const st = b.scrollTop;
        const v = DailyGift.view();
        this._dailyCan = v.canClaim;
        b.innerHTML = '';
        const got = this._daily && this._daily.got;
        if (got && !v.canClaim) b.appendChild(this._gotBlock(got));
        b.appendChild(UI.el(`<div class="note sx-center sx-dnote" style="margin-bottom:10px">${UI.esc(Lang.t('sh.daily.note'))}</div>`));
        const grid = UI.el('<div class="sx-days"></div>');
        for (const d of v.days.slice(0, v.days.length - 1)) {
            const r = d.reward;
            const gem = r.coins > 0 ? `<div class="rw ui-o">${this._gemIcon()}${GameData.fmt(r.coins)}</div>` : '';
            const item = r.item || r.randomItems > 0 ? `<div class="ri ui-o1">${UI_ICONS.gift}${UI.esc(Lang.t('sh.daily.plusItem'))}</div>` : '';
            grid.appendChild(UI.el(`<div class="sx-day ${d.state}"><div class="dn ui-o1">${UI.esc(d.dayLabel)}</div>${gem}${item}<div class="st ui-o1">${UI.esc(d.stateLabel)}</div></div>`));
        }
        b.appendChild(grid);
        // День 7: эксклюзивный скин виден заранее как цель.
        const d7 = v.days[v.days.length - 1];
        const box = UI.el(`<div class="sx-day7 ${d7.state}"><div class="pic"></div><div class="tx"></div></div>`);
        const tx = box.querySelector('.tx');
        tx.appendChild(UI.el(`<div class="dn ui-o1">${UI.esc(d7.dayLabel)} · ${UI.esc(Lang.t('sh.daily.goal'))}</div>`));
        if (d7.skin) {
            const it = Shop.item(d7.skin);
            box.querySelector('.pic').appendChild(this.icon(it));
            tx.appendChild(UI.el(`<div class="nm ui-o">${UI.esc(Shop.name(d7.skin))}</div>`));
            tx.appendChild(UI.el(`<div class="note ui-o1" style="color:#ffd23a">${UI.esc(Lang.t('daily.exclusive'))}</div>`));
            tx.appendChild(UI.el(`<div class="note">${UI.esc(Lang.t('daily.exclusiveHint'))}</div>`));
        } else {
            box.querySelector('.pic').innerHTML = UI_ICONS.gift;
            tx.appendChild(UI.el(`<div class="rw ui-o">${this._gemIcon()}${GameData.fmt(d7.reward.coins)}</div>`));
            tx.appendChild(UI.el(`<div class="note ui-o1" style="color:#ffd23a">${UI.esc(Lang.t('sh.daily.big'))}</div>`));
        }
        b.appendChild(box);
        // Кнопки (и таймер) — в нижней планке окна: «Забрать» всегда на виду, даже если окно низкое.
        const foot = UI.el('<div class="sx-foot"></div>');
        if (v.canClaim) {
            const acts = UI.el('<div class="sx-acts"></div>');
            const c1 = UI.el('<div class="col"></div>');
            c1.appendChild(this._btn(UI.esc(v.claim.label), 'c-green', () => this._claimDaily(false)));
            acts.appendChild(c1);
            if (v.x2.available) {
                const c2 = UI.el('<div class="col"></div>');
                const bx = this._btn(`${UI_ICONS.ad}<span>${UI.esc(v.x2.label)}</span>`, v.x2.enabled ? 'c-yellow' : 'c-gray off', () => {
                    if (!v.x2.enabled) { this._say(v.x2.hint || Lang.t('daily.adUnavailable'), '#ffd23a'); return; }
                    this._claimDaily(true);
                });
                c2.appendChild(bx);
                c2.appendChild(UI.el(`<div class="sub">${UI.esc(v.x2.hint || v.x2.rewardLabel)}</div>`));
                acts.appendChild(c2);
            } else if (v.x2.hint) acts.appendChild(UI.el(`<div class="sub" style="align-self:center">${UI.esc(v.x2.hint)}</div>`));
            foot.appendChild(acts);
        } else {
            foot.appendChild(UI.el(`<div class="sx-center"><div class="pill ui-o sx-next" style="display:inline-block">${UI.esc(v.nextLabel)}</div>
                <div class="note" style="margin-top:4px">${UI.esc(Lang.t(got ? 'sh.daily.back' : 'sh.daily.same'))}</div></div>`));
        }
        b.appendChild(foot);
        b.scrollTop = st;
    },

    /** Блок «Ты получил»: кристаллы и вещи с кнопкой «Надеть». */
    _gotBlock(res) {
        const box = UI.el(`<div class="sx-got"><h3 class="ui-o">${UI.esc(Lang.t('sh.gotTitle'))}</h3><div class="sx-chips"></div></div>`);
        const chips = box.querySelector('.sx-chips');
        for (const g of res.got) {
            if (g.type === 'coins') chips.appendChild(UI.el(`<div class="sx-gchip ui-o">${this._gemIcon()}+${GameData.fmt(g.amount)}</div>`));
            else {
                const it = Shop.item(g.id);
                const ch = UI.el('<div class="sx-gchip ui-o1"></div>');
                if (it) ch.appendChild(this.icon(it));
                ch.appendChild(UI.el(`<span>${UI.esc(Shop.name(g.id))}</span>`));
                if (it && !Shop.isEquipped(g.id)) {
                    ch.appendChild(this._btn(UI.esc(Shop.t('shop.equip')), 'c-blue', (e, bt) => { Shop.equip(g.id); bt.remove(); }));
                }
                chips.appendChild(ch);
            }
        }
        return box;
    },

    async _claimDaily(x2) {
        if (this._busy) return;
        this._busy = true;
        let r;
        try { r = x2 ? await DailyGift.claimX2() : DailyGift.claim(); } catch (e) { r = { ok: false, reason: 'adFailed' }; }
        this._busy = false;
        if (this._win !== 'daily') {   // окно закрыли, пока шла реклама: награда уже выдана
            if (r.ok) { UI.toast(DailyGift.rewardLabel(r.reward, r.mult), '#ffd23a'); Sfx.play('gift', 0.7); }
            return;
        }
        if (r.ok) {
            this._daily.got = r;
            Sfx.play('gift', 0.8);
            setTimeout(() => Sfx.play('win', 0.5), 350);
        } else if (r.reason === 'adFailed') this._say(Lang.t('sh.adFailed'), '#ffd23a');
        else if (r.reason === 'adUnavailable' || r.reason === 'cooldown') this._say(Lang.t('daily.adUnavailable'), '#ffd23a');
        else if (r.reason === 'claimed') this._say(Lang.t('sh.daily.same'), '#ffd23a');
        this._renderDaily();
    },

    // =============================================================================================
    // Колесо фортуны
    // =============================================================================================

    openWheel() {
        const b = this._open('wheel', Lang.t('sh.wheel.title'), 'linear-gradient(#fff07a,#e8a80a)', 820);
        const W = this._wheel;
        W.spinning = false; W.asking = false; W.res = null; W.gen++;
        // Размер диска — от места, которое реально есть в теле окна: в альбомной ориентации диск слева, панель справа
        // (диск <= 48% ширины и по высоте с запасом под стрелку и обод), в портрете — друг под другом.
        const win = b.parentElement;
        const vw = window.innerWidth, vh = window.innerHeight;
        const head = win.querySelector('.win-h');
        const maxH = parseFloat(getComputedStyle(win).maxHeight) || vh * 0.88;
        const availH = Math.max(120, maxH - (head ? head.offsetHeight : 56) - 10 - 28);
        const availW = Math.max(150, b.clientWidth - 28);
        const side = vw > vh && availW >= 440;
        const S = side ? Math.min(380, availW * 0.48, availH - 70) : Math.min(380, availW - 24, availH - 290);
        W.size = Math.round(Math.max(side ? 130 : 150, S));
        W.compact = side ? availH < 330 : availH < 560;
        const wrap = UI.el(`<div class="sx-wheel-wrap ${side ? 'side' : 'stack'}${W.compact ? ' compact' : ''}"></div>`);
        const wh = UI.el(`<div class="sx-wheel" style="--ws:${W.size}px"><div class="rim"></div><canvas></canvas><div class="hub"></div><div class="ptr"></div></div>`);
        const panel = UI.el('<div class="sx-wpanel"></div>');
        const res = UI.el('<div class="sx-wres ui-o"></div>');
        const free = this._btn('', 'c-green', () => this._spin('free'), { noAd: true });
        const ad = this._btn('', 'c-yellow', () => this._spin('ad'), { noAd: true });
        const note = UI.el('<div class="note sx-center"></div>');
        panel.appendChild(res); panel.appendChild(free); panel.appendChild(ad); panel.appendChild(note);
        wrap.appendChild(wh); wrap.appendChild(panel);
        b.appendChild(wrap);
        this._el = { wheel: wh, cv: wh.querySelector('canvas'), ptr: wh.querySelector('.ptr'), res, free, ad, note };
        this._el.cv.style.transform = 'rotate(' + W.angle + 'deg)';
        this._wheelRedraw();
        this._wheelUpdate();
        this._wheelShowResult(null);
        this._every(1000, () => { if (!W.spinning && !W.asking) this._wheelUpdate(); });
        const p = Wheel.pendingSpin();   // вращение, начатое раньше и не доставленное: догоняем
        if (p) this._wheelResume(p);
    },

    _wheelRedraw() {
        const E = this._el, W = this._wheel;
        if (!E.cv || this._win !== 'wheel') return;
        const S = W.size, cv = /** @type {HTMLCanvasElement} */ (E.cv);
        const secs = Wheel.sectors();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = cv.height = Math.round(S * dpr);
        const c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, S, S);
        const R = S / 2, step = Math.PI * 2 / secs.length;
        secs.forEach((s, i) => {
            const a0 = -Math.PI / 2 + (i - 0.5) * step;
            const col = SHOP_WHEEL_COLORS[i % SHOP_WHEEL_COLORS.length];
            c.beginPath(); c.moveTo(R, R); c.arc(R, R, R, a0, a0 + step); c.closePath();
            c.fillStyle = col; c.fill();
            const g = c.createRadialGradient(R, R, R * 0.15, R, R, R);
            g.addColorStop(0, 'rgba(255,255,255,.34)'); g.addColorStop(0.7, 'rgba(255,255,255,.05)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
            c.fillStyle = g; c.fill();
            c.lineWidth = Math.max(2, S / 100); c.strokeStyle = 'rgba(10,10,16,.85)'; c.stroke();
            c.save();
            c.translate(R, R); c.rotate(i * step);   // сектор i теперь сверху: рисуем «вверх» (-y)
            if (s.kind === 'item') this._wheelItem(c, R, s);
            else {
                this._gemPath(c, 0, -R * 0.8, R * 0.13);
                Gfx.strokeText(c, GameData.fmt(s.coins), 0, -R * 0.58, R * 0.2, '#ffffff', '#121212', 900);
                if (s.converted) Gfx.strokeText(c, '=', R * 0.01, -R * 0.4, R * 0.1, '#ffe680', '#121212', 900);
            }
            c.restore();
            // Лампочки на границах секторов.
            const ba = a0, bx = R + Math.cos(ba) * R * 0.93, by = R + Math.sin(ba) * R * 0.93;
            c.fillStyle = '#fff6c8'; c.strokeStyle = 'rgba(10,10,16,.8)'; c.lineWidth = 2;
            c.beginPath(); c.arc(bx, by, R * 0.03, 0, Math.PI * 2); c.fill(); c.stroke();
        });
    },

    /** Сектор с вещью: только крупная иконка на светлой подложке (подпись не помещается в сектор — имя в окне приза). */
    _wheelItem(c, R, s) {
        const it = Shop.item(s.itemId);
        let img = this._wheel.imgs[s.itemId];
        if (!img && it) {
            img = this.icon(it);
            this._wheel.imgs[s.itemId] = img;
            img.addEventListener('load', () => this._wheelRedraw());
        }
        const cy = -R * 0.64, sz = R * 0.46;
        const g = c.createRadialGradient(0, cy, 0, 0, cy, sz * 0.62);
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = g; c.beginPath(); c.arc(0, cy, sz * 0.62, 0, Math.PI * 2); c.fill();
        if (img && img.naturalWidth > 0) c.drawImage(img, -sz / 2, cy - sz / 2, sz, sz);
        else Gfx.strokeText(c, '?', 0, cy, R * 0.24, '#ffffff', '#121212', 900);
    },

    _gemPath(c, x, y, s) {
        c.save(); c.translate(x, y); c.lineJoin = 'round';
        c.beginPath(); c.moveTo(-s, -s * 0.3); c.lineTo(-s * 0.55, -s); c.lineTo(s * 0.55, -s); c.lineTo(s, -s * 0.3); c.lineTo(0, s); c.closePath();
        c.fillStyle = '#c45cff'; c.fill(); c.lineWidth = Math.max(1.5, s * 0.16); c.strokeStyle = '#2a0f45'; c.stroke();
        c.strokeStyle = '#ecc8ff'; c.lineWidth = Math.max(1, s * 0.09); c.beginPath(); c.moveTo(-s, -s * 0.3); c.lineTo(s, -s * 0.3); c.moveTo(-s * 0.2, -s); c.lineTo(0, s); c.lineTo(s * 0.2, -s); c.stroke();
        c.restore();
    },

    /** Состояние кнопок и подсказки по Wheel.status(). */
    _wheelUpdate() {
        const E = this._el, W = this._wheel;
        if (!E.free || this._win !== 'wheel') return;
        const s = Wheel.status();
        const busy = W.spinning || W.asking;
        const canFree = s.canSpinFree && !busy;
        E.free.className = 'rb ui-o sx-b ' + (canFree ? 'c-green' : 'c-gray off');
        E.free.innerHTML = `<span class="row1">${UI.esc(s.canSpinFree ? Lang.t('wheel.free') : s.freeLabel)}</span>`;
        const canAd = s.canSpinAd && !busy;
        E.ad.className = 'rb ui-o sx-b ' + (canAd ? 'c-yellow' : 'c-gray off');
        const left = s.adLeft + s.banked;
        E.ad.innerHTML = `<span class="row1">${UI_ICONS.ad}${UI.esc(Lang.t('sh.wheel.ad'))}</span><small>${UI.esc(Lang.t('sh.wheel.adLeft', { a: left, b: s.adLimit }))}</small>`;
        E.note.textContent = busy ? Lang.t('wheel.spinning') : (s.hint || (W.compact ? '' : Lang.t('sh.wheel.note')));
    },

    /**
     * Карточка справа от диска, всегда с содержимым: до вращения — призыв и главные призы с шансами (или последний
     * выигрыш этой сессии), во время вращения — «Крутится…», после — выигрыш крупно, с иконкой вещи и кнопкой «Надеть».
     * fin — ответ Wheel.finish(), 'spin' — вращение идёт, null — покой.
     */
    _wheelShowResult(fin) {
        const R = this._el.res, W = this._wheel;
        if (!R) return;
        R.className = 'sx-wres ui-o';
        R.innerHTML = '';
        if (fin && fin !== 'spin') { W.last = fin; R.classList.add('win'); }
        if (fin === 'spin') { R.appendChild(UI.el(`<h3 class="ui-o">${UI.esc(Lang.t('wheel.spinning'))}</h3>`)); return; }
        const last = fin || W.last;
        if (!last) {
            R.appendChild(UI.el(`<h3 class="ui-o">${UI.esc(Lang.t('sh.wheel.try'))}</h3>`));
            R.appendChild(UI.el(`<div class="cap ui-o1">${UI.esc(Lang.t('sh.wheel.top'))}</div>`));
            R.appendChild(this._wheelLegend());
            return;
        }
        R.appendChild(UI.el(`<h3 class="ui-o">${UI.esc(Lang.t(fin ? 'wheel.win' : 'sh.wheel.last'))}</h3>`));
        const g = last.got[0];
        if (g && g.type === 'item') {
            const it = Shop.item(g.id);
            const row = UI.el('<div class="sx-wprize"></div>');
            if (it) row.appendChild(this.icon(it));
            row.appendChild(UI.el(`<span>${UI.esc(Shop.name(g.id))}</span>`));
            R.appendChild(row);
            if (it && !Shop.isEquipped(g.id)) R.appendChild(this._btn(UI.esc(Shop.t('shop.equip')), 'c-blue', (e, bt) => { Shop.equip(g.id); bt.remove(); }));
        } else {
            const amt = last.got.reduce((n, x) => n + (x.type === 'coins' ? x.amount : 0), 0);
            R.appendChild(UI.el(`<div class="big ui-o">${this._gemIcon()}+${GameData.fmt(amt)}</div>`));
            if (g && g.converted) R.appendChild(UI.el(`<div class="cap ui-o1">${UI.esc(Lang.t('reward.dup', { n: amt }))}</div>`));
        }
    },

    /** Главные призы колеса: три крупнейшие суммы и «вещь» с шансом выпадения, % (по весам секторов). */
    _wheelLegend() {
        const secs = Wheel.sectors();
        const byAmount = {};
        let items = 0;
        for (const s of secs) {
            if (s.kind === 'item') items += s.chance;
            else byAmount[s.coins] = (byAmount[s.coins] || 0) + s.chance;
        }
        const pct = (v) => (v < 10 ? Math.round(v * 10) / 10 : Math.round(v)) + '%';
        const box = UI.el('<div class="sx-wlegend"></div>');
        Object.keys(byAmount).map(Number).sort((a, b) => b - a).slice(0, 3).forEach((n) => {
            box.appendChild(UI.el(`<span class="sx-wchip ui-o1">${this._gemIcon()}<b>${GameData.fmt(n)}</b><small>${pct(byAmount[n])}</small></span>`));
        });
        if (items > 0) box.appendChild(UI.el(`<span class="sx-wchip ui-o1">${UI_ICONS.gift}<b>${UI.esc(Lang.t('sh.wheel.item'))}</b><small>${pct(items)}</small></span>`));
        return box;
    },

    async _spin(kind) {
        const W = this._wheel;
        if (W.spinning || W.asking || this._win !== 'wheel') return;
        const s = Wheel.status();
        if (kind === 'free' ? !s.canSpinFree : !s.canSpinAd) { this._say(s.hint || Lang.t('wheel.noSpins'), '#ffd23a'); return; }
        const gen = W.gen;
        W.asking = true;
        this._wheelUpdate();
        let r;
        try { r = kind === 'free' ? Wheel.spinFree() : await Wheel.spinAd(); } catch (e) { r = { ok: false, reason: 'adFailed' }; }
        W.asking = false;
        if (!r.ok) {
            if (this._win === 'wheel' && gen === W.gen) {
                this._say(r.reason === 'adFailed' ? Lang.t('sh.adFailed') : r.reason === 'adUnavailable' || r.reason === 'cooldown' ? Lang.t('wheel.adUnavailable') : r.reason === 'limit' ? Lang.t('wheel.noSpins') : '', '#ffd23a');
                this._wheelUpdate();
            }
            return;
        }
        if (this._win !== 'wheel' || gen !== W.gen) {   // окно закрыли, пока шла реклама: результат уже выбран — выдаём приз
            const fin = Wheel.finish();
            if (fin.ok) { UI.toast(Lang.t('sh.wheel.won') + ': ' + fin.label, '#ffd23a', 3); Sfx.play('win', 0.5); }
            return;
        }
        this._wheelRun(r, r.durationMs);
    },

    /** Вращение, которое осталось от прошлого раза: доигрываем остаток или сразу ставим диск на место. */
    _wheelResume(p) {
        const left = p.durationMs - p.elapsedMs;
        if (left <= 300) {
            const to = Wheel.angleFrom(this._wheel.angle, p);
            this._wheel.angle = to;
            this._el.cv.style.transform = 'rotate(' + to + 'deg)';
            this._wheelFinish();
        } else this._wheelRun(p, left);
    },

    /** Анимация до угла результата: плавное торможение, тики на границах секторов, точная остановка. */
    _wheelRun(res, durMs) {
        const W = this._wheel, E = this._el;
        W.spinning = true; W.res = res;
        this._wheelShowResult('spin');
        this._wheelUpdate();
        const from = W.angle, to = Wheel.angleFrom(from, res), step = Wheel.step();
        const t0 = performance.now();
        let lastIdx = Math.floor((from + step / 2) / step), lastTick = 0;
        const frame = (now) => {
            if (!W.spinning || this._win !== 'wheel') return;
            const t = Math.min(1, (now - t0) / Math.max(300, durMs));
            const e = 1 - Math.pow(1 - t, 4);
            const ang = t >= 1 ? to : from + (to - from) * e;
            W.angle = ang;
            E.cv.style.transform = 'rotate(' + ang + 'deg)';
            const idx = Math.floor((ang + step / 2) / step);
            if (idx !== lastIdx) {
                lastIdx = idx;
                if (now - lastTick > 45) { lastTick = now; Sfx.play('tick', 0.35, 0.9 + 0.3 * (1 - e)); }
                E.ptr.style.transform = 'translateX(-50%) rotate(-16deg)';
                setTimeout(() => { if (E.ptr) E.ptr.style.transform = 'translateX(-50%)'; }, 70);
            }
            if (t >= 1) { this._raf = 0; this._wheelFinish(); } else this._raf = requestAnimationFrame(frame);
        };
        this._raf = requestAnimationFrame(frame);
    },

    _wheelFinish() {
        const W = this._wheel;
        if (Wheel.sectorAt(W.angle) !== (W.res ? W.res.sector : Wheel.sectorAt(W.angle))) console.warn('Wheel: диск остановился не на выпавшем секторе');
        const fin = Wheel.finish();
        W.spinning = false; W.res = null;
        if (!fin.ok) { this._wheelUpdate(); return; }
        Sfx.play('win', 0.7);
        if (fin.got.some((g) => g.type === 'item')) setTimeout(() => Sfx.play('gift', 0.7), 250);
        this._wheelShowResult(fin);
        this._wheelRedraw();
        this._wheelUpdate();
    },

    /** Окно колеса закрывают: если вращение шло, результат уже выбран — приз выдаём сразу (ровно один раз). */
    _wheelClose() {
        const W = this._wheel;
        W.gen++;
        const was = W.spinning;
        W.spinning = false; W.asking = false; W.res = null;
        if (Wheel.state.pending) {
            const fin = Wheel.finish();
            if (fin.ok && was) { UI.toast(Lang.t('sh.wheel.won') + ': ' + fin.label, '#ffd23a', 3); Sfx.play('win', 0.5); }
        }
    },
};
