import "server-only";
import { FALLBACK_GAMES, FALLBACK_GENRES, FALLBACK_PLATFORMS } from "./rawg-fallback";
import type {
  RawgGame,
  RawgGameFilters,
  RawgGenre,
  RawgListResponse,
  RawgPlatform,
} from "./rawg-types";

const BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.RAWG_API_KEY || process.env.NEXT_PUBLIC_RAWG_API_KEY;
const IS_RAWG_CONFIGURED = Boolean(RAWG_API_KEY);

export type RawgDataSource = "rawg" | "fallback";

class RawgNoApiKeyError extends Error {
  constructor() {
    super("کلید RAWG_API_KEY تنظیم نشده است.");
    this.name = "RawgNoApiKeyError";
  }
}

function mapFallbackList(
  filters: RawgGameFilters = {}
): RawgListResponse<RawgGame> {
  const page = filters.page || 1;
  const pageSize = filters.page_size || 12;
  const search = (filters.search || "").trim().toLowerCase();
  const genreFilters = (filters.genres || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const platformIds = (filters.platforms || "")
    .split(",")
    .map((value) => Number(value))
    .filter(Boolean);

  let items = [...FALLBACK_GAMES];

  if (search) {
    items = items.filter((game) => game.name.toLowerCase().includes(search));
  }

  if (genreFilters.length) {
    items = items.filter((game) =>
      genreFilters.some((filterValue) =>
        game.genres.some(
          (genre) =>
            String(genre.id) === filterValue || genre.slug.toLowerCase() === filterValue
        )
      )
    );
  }

  if (platformIds.length) {
    items = items.filter((game) =>
      platformIds.some((platformId) =>
        game.platforms.some((item) => item.platform.id === platformId)
      )
    );
  }

  if (filters.ordering === "-rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else if (filters.ordering === "-released") {
    items.sort((a, b) => (b.released || "").localeCompare(a.released || ""));
  } else if (filters.ordering === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  const count = items.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const results = items.slice(start, end);

  return {
    count,
    next: end < count ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    results,
  };
}

async function fetchRawg<T>(
  endpoint: string,
  query: Record<string, string | number | undefined> = {}
): Promise<T> {
  if (!RAWG_API_KEY) {
    throw new RawgNoApiKeyError();
  }

  const searchParams = new URLSearchParams();
  searchParams.set("key", RAWG_API_KEY);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const res = await fetch(`${BASE_URL}${endpoint}?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "درخواست RAWG با خطا مواجه شد.");
  }

  return (await res.json()) as T;
}

export function isRawgConfigured(): boolean {
  return IS_RAWG_CONFIGURED;
}

export async function getRawgGenresWithSource(): Promise<{
  data: RawgGenre[];
  source: RawgDataSource;
}> {
  try {
    const data = await fetchRawg<RawgListResponse<RawgGenre>>("/genres", {
      page_size: 40,
    });
    return { data: data.results, source: "rawg" };
  } catch {
    return { data: FALLBACK_GENRES, source: "fallback" };
  }
}

export async function getRawgPlatformsWithSource(): Promise<{
  data: RawgPlatform[];
  source: RawgDataSource;
}> {
  try {
    const data = await fetchRawg<RawgListResponse<RawgPlatform>>("/platforms/lists/parents", {
      page_size: 40,
    });
    return { data: data.results, source: "rawg" };
  } catch {
    return { data: FALLBACK_PLATFORMS, source: "fallback" };
  }
}

export async function getRawgGamesWithSource(
  filters: RawgGameFilters = {}
): Promise<{ data: RawgListResponse<RawgGame>; source: RawgDataSource }> {
  try {
    const data = await fetchRawg<RawgListResponse<RawgGame>>("/games", {
      search: filters.search,
      genres: filters.genres,
      platforms: filters.platforms,
      ordering: filters.ordering || "-rating",
      page: filters.page || 1,
      page_size: filters.page_size || 12,
    });
    return { data, source: "rawg" };
  } catch {
    return { data: mapFallbackList(filters), source: "fallback" };
  }
}

export async function getRawgGameByIdWithSource(id: number): Promise<{
  data: RawgGame | null;
  source: RawgDataSource;
}> {
  try {
    const data = await fetchRawg<RawgGame>(`/games/${id}`);
    return { data, source: "rawg" };
  } catch {
    return {
      data: FALLBACK_GAMES.find((item) => item.id === id) ?? null,
      source: "fallback",
    };
  }
}

export async function getRawgGenres(): Promise<RawgGenre[]> {
  const result = await getRawgGenresWithSource();
  return result.data;
}

export async function getRawgPlatforms(): Promise<RawgPlatform[]> {
  const result = await getRawgPlatformsWithSource();
  return result.data;
}

export async function getRawgGames(
  filters: RawgGameFilters = {}
): Promise<RawgListResponse<RawgGame>> {
  const result = await getRawgGamesWithSource(filters);
  return result.data;
}

export async function getRawgGameById(id: number): Promise<RawgGame | null> {
  const result = await getRawgGameByIdWithSource(id);
  return result.data;
}
