import type { RawgGame, RawgGenre, RawgPlatform } from "./rawg-types";

export const FALLBACK_GENRES: RawgGenre[] = [
  { id: 4, name: "اکشن", slug: "action" },
  { id: 3, name: "ماجراجویی", slug: "adventure" },
  { id: 5, name: "نقش آفرینی", slug: "role-playing-games-rpg" },
  { id: 2, name: "شوتر", slug: "shooter" },
  { id: 10, name: "استراتژی", slug: "strategy" },
];

export const FALLBACK_PLATFORMS: RawgPlatform[] = [
  { id: 4, name: "PC", slug: "pc" },
  { id: 187, name: "PlayStation 5", slug: "playstation5" },
  { id: 18, name: "PlayStation 4", slug: "playstation4" },
  { id: 1, name: "Xbox One", slug: "xbox-one" },
  { id: 7, name: "Nintendo Switch", slug: "nintendo-switch" },
];

export const FALLBACK_GAMES: RawgGame[] = [
  {
    id: 3498,
    name: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    released: "2013-09-17",
    background_image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    rating: 4.47,
    ratings_count: 6900,
    metacritic: 92,
    playtime: 73,
    description_raw:
      "یک بازی اکشن جهان باز با داستان چندشاخه، ماموریت های متنوع و تجربه آنلاین گسترده.",
    genres: [FALLBACK_GENRES[0], FALLBACK_GENRES[1]],
    platforms: [
      { platform: FALLBACK_PLATFORMS[0] },
      { platform: FALLBACK_PLATFORMS[1] },
    ],
    publishers: [{ id: 10, name: "Rockstar Games" }],
    website: "https://www.rockstargames.com/gta-v",
  },
  {
    id: 3328,
    name: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    released: "2015-05-18",
    background_image:
      "https://media.rawg.io/media/games/0cd/0cd1203f0f3fcb7e9f98303f4d9b1d8f.jpg",
    rating: 4.66,
    ratings_count: 7900,
    metacritic: 93,
    playtime: 53,
    description_raw:
      "نقش آفرینی داستان محور با دنیای بسیار وسیع، ماموریت های جانبی عمیق و روایت سینمایی.",
    genres: [FALLBACK_GENRES[0], FALLBACK_GENRES[2]],
    platforms: [
      { platform: FALLBACK_PLATFORMS[0] },
      { platform: FALLBACK_PLATFORMS[2] },
      { platform: FALLBACK_PLATFORMS[4] },
    ],
    publishers: [{ id: 11, name: "CD PROJEKT RED" }],
    website: "https://www.thewitcher.com",
  },
  {
    id: 4200,
    name: "Portal 2",
    slug: "portal-2",
    released: "2011-04-18",
    background_image:
      "https://media.rawg.io/media/games/6ad/6ad4f5346e3d3dbdf6430faec7f47c35.jpg",
    rating: 4.62,
    ratings_count: 4300,
    metacritic: 95,
    playtime: 11,
    description_raw:
      "پازل اول شخص با تمرکز بر طراحی مراحل دقیق، طنز هوشمندانه و مکانیک پورتال.",
    genres: [FALLBACK_GENRES[1]],
    platforms: [
      { platform: FALLBACK_PLATFORMS[0] },
      { platform: FALLBACK_PLATFORMS[3] },
    ],
    publishers: [{ id: 12, name: "Valve" }],
    website: "https://www.thinkwithportals.com/",
  },
  {
    id: 12020,
    name: "Left 4 Dead 2",
    slug: "left-4-dead-2",
    released: "2009-11-17",
    background_image:
      "https://media.rawg.io/media/games/2bf/2bfdfc19353b8f5f2dc3b6f4c2dd8d54.jpg",
    rating: 4.09,
    ratings_count: 2200,
    metacritic: 89,
    playtime: 9,
    description_raw:
      "تجربه کوآپ شوتر زامبی با ریتم سریع، شخصیت های متنوع و ارزش تکرار بالا.",
    genres: [FALLBACK_GENRES[0], FALLBACK_GENRES[3]],
    platforms: [{ platform: FALLBACK_PLATFORMS[0] }],
    publishers: [{ id: 12, name: "Valve" }],
    website: "https://www.l4d.com/",
  },
  {
    id: 4291,
    name: "Counter-Strike: Global Offensive",
    slug: "counter-strike-global-offensive",
    released: "2012-08-21",
    background_image:
      "https://media.rawg.io/media/games/615/615f6f6f102f35f5cdcc4d52f5f35e8d.jpg",
    rating: 3.57,
    ratings_count: 6800,
    metacritic: 83,
    playtime: 65,
    description_raw:
      "شوتر رقابتی تیمی با تاکید بر تصمیم گیری سریع، تاکتیک تیمی و دقت بالا.",
    genres: [FALLBACK_GENRES[3]],
    platforms: [
      { platform: FALLBACK_PLATFORMS[0] },
      { platform: FALLBACK_PLATFORMS[3] },
    ],
    publishers: [{ id: 12, name: "Valve" }],
    website: "https://www.counter-strike.net/",
  },
];
