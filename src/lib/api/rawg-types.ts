export type RawgGenre = {
  id: number;
  name: string;
  slug: string;
};

export type RawgPlatform = {
  id: number;
  name: string;
  slug: string;
};

export type RawgGame = {
  id: number;
  name: string;
  slug: string;
  description_raw?: string;
  released?: string;
  background_image?: string;
  rating: number;
  ratings_count?: number;
  metacritic?: number;
  playtime?: number;
  genres: RawgGenre[];
  platforms: Array<{ platform: RawgPlatform }>;
  publishers?: Array<{ id: number; name: string }>;
  website?: string;
};

export type RawgListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type RawgGameFilters = {
  search?: string;
  genres?: string;
  platforms?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
};
