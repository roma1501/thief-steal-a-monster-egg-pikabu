// @ts-nocheck
// PikabuPacks.js — наборы за рубли в сборке Пикабу Игр (js/PikabuShop.js). Цены и названия товаров — в Студии
// (каталог CSV: coins_s 19 ₽, coins_m 49 ₽, coins_l 99 ₽, starter 29 ₽, no_ads 59 ₽), здесь — что игрок получает.
// Валюта магазина — кристаллы (Shop.addCoins), предметы набора — лучшие «за рекламу» из каталога Shop.
PikabuShop.setup({
    colors: ['#b14dff', '#ff4fa3'],
    ready: () => !!(typeof Shop !== 'undefined' && Shop.state && Shop.items().length),
    visible: () => Game.state === 'menu' || Game.state === 'play',
    persist: () => Shop._save('pikabu'),
    button: { corner: 'tr', x: 12, y: 74 },
    packs: [
        { id: 'coins_s', type: 'consumable', icon: '💎', name: 'Горсть кристаллов', desc: '1 000 кристаллов на костюмы, шапки и следы', grant: () => Shop.addCoins(1000) },
        { id: 'coins_m', type: 'consumable', icon: '💰', name: 'Мешок кристаллов', desc: '3 000 кристаллов', grant: () => Shop.addCoins(3000) },
        { id: 'coins_l', type: 'consumable', icon: '👑', name: 'Сундук кристаллов', desc: '8 000 кристаллов — хватит на самые дорогие предметы', best: true, grant: () => Shop.addCoins(8000) },
        {
            id: 'starter', type: 'non_consumable', icon: '👽', name: 'Набор Ауралюма', best: 'Один раз',
            desc: '1 500 кристаллов, костюм Ауралюма, шапка «НЛО» и след «Галактика»',
            grant: () => Shop.addCoins(1500),
            apply: () => PikabuShop.shopGrant(['outfit_mon_auralume', 'hat_ufo', 'trail_galaxy']),
        },
        { id: 'no_ads', type: 'non_consumable', icon: '🚫', name: 'Без рекламы', desc: 'Убирает рекламу между забегами навсегда. Награды за рекламу остаются', noAds: true },
    ],
});
