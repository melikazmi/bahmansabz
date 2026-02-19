"use client";

import {
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdvancedMultiSelect, {
  type AdvancedSelectItem,
} from "@/components/task3/advanced-multi-select";
import PaginationControls from "@/components/ui/pagination-controls";
import type { RawgGame, RawgGenre, RawgPlatform } from "@/lib/api/rawg-types";
import { toPersianDate, toPersianNumber } from "@/lib/utils/format";

type MetaResponse = {
  genres: RawgGenre[];
  platforms: RawgPlatform[];
  source?: "rawg" | "fallback";
  configured?: boolean;
};

type GamesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
  source?: "rawg" | "fallback";
  configured?: boolean;
};

type FilterState = {
  search: string;
  ordering: string;
  genreSlugs: string[];
  platformIds: string[];
};

const PAGE_SIZE = 9;

function platformGroupByName(platformName: string): string {
  const normalized = platformName.toLowerCase();
  if (normalized.includes("playstation")) return "PlayStation";
  if (normalized.includes("xbox")) return "Xbox";
  if (normalized.includes("nintendo")) return "Nintendo";
  if (normalized.includes("pc")) return "PC";
  return "سایر";
}

export default function Task2GamesPage() {
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-rating");
  const [selectedGenreSlugs, setSelectedGenreSlugs] = useState<string[]>([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [genres, setGenres] = useState<RawgGenre[]>([]);
  const [platforms, setPlatforms] = useState<RawgPlatform[]>([]);
  const [games, setGames] = useState<RawgGame[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metaSource, setMetaSource] = useState<"rawg" | "fallback">("fallback");
  const [gamesSource, setGamesSource] = useState<"rawg" | "fallback">("fallback");
  const [isRawgConfigured, setIsRawgConfigured] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const genreItems = useMemo<AdvancedSelectItem[]>(
    () =>
      genres.map((item) => ({
        id: item.slug,
        label: item.name,
        group: "ژانرها",
        keywords: [item.slug, String(item.id)],
      })),
    [genres]
  );

  const platformItems = useMemo<AdvancedSelectItem[]>(
    () =>
      platforms.map((item) => ({
        id: String(item.id),
        label: item.name,
        group: platformGroupByName(item.name),
        keywords: [item.slug],
      })),
    [platforms]
  );

  const loadMeta = useCallback(async () => {
    const response = await fetch("/api/rawg/meta", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("خطا در دریافت فهرست ژانر و پلتفرم.");
    }

    const data = (await response.json()) as MetaResponse;
    setGenres(data.genres);
    setPlatforms(data.platforms);
    setMetaSource(data.source ?? "fallback");
    setIsRawgConfigured(Boolean(data.configured));
  }, []);

  const loadGames = useCallback(async (nextPage: number, filters: FilterState) => {
    setLoading(true);
    setErrorMessage(null);

    const searchParams = new URLSearchParams({
      page: String(nextPage),
      page_size: String(PAGE_SIZE),
      ordering: filters.ordering,
    });

    if (filters.search.trim()) searchParams.set("search", filters.search.trim());
    if (filters.genreSlugs.length) {
      searchParams.set("genres", filters.genreSlugs.join(","));
    }
    if (filters.platformIds.length) {
      searchParams.set("platforms", filters.platformIds.join(","));
    }

    try {
      const response = await fetch(`/api/rawg/games?${searchParams.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("خطا در دریافت بازی ها.");
      }

      const data = (await response.json()) as GamesResponse;
      setGames(data.results);
      setTotal(data.count);
      setPage(nextPage);
      setGamesSource(data.source ?? "fallback");
      if (typeof data.configured === "boolean") {
        setIsRawgConfigured(data.configured);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "خطا در دریافت بازی ها."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const currentFilters = useMemo<FilterState>(
    () => ({
      search,
      ordering,
      genreSlugs: selectedGenreSlugs,
      platformIds: selectedPlatformIds,
    }),
    [ordering, search, selectedGenreSlugs, selectedPlatformIds]
  );

  useEffect(() => {
    void (async () => {
      try {
        await loadMeta();
        await loadGames(1, {
          search: "",
          ordering: "-rating",
          genreSlugs: [],
          platformIds: [],
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "خطا در آماده سازی صفحه بازی ها."
        );
        setLoading(false);
      }
    })();
  }, [loadGames, loadMeta]);

  return (
    <Stack gap={6}>
      <Box
        rounded="3xl"
        borderWidth="1px"
        borderColor="brand.100"
        bg="white"
        p={{ base: 5, md: 7 }}
        boxShadow="0 14px 35px rgba(0,0,0,0.04)"
        position="relative"
        overflow="visible"
      >
        <Box
          position="absolute"
          insetInlineEnd="-80px"
          top="-90px"
          w="240px"
          h="240px"
          rounded="full"
          bg="linear-gradient(180deg, rgba(65,186,137,0.2), rgba(65,186,137,0.04))"
          pointerEvents="none"
        />
        <Stack gap={4} position="relative" zIndex={1}>
          <Flex justify="space-between" align={{ base: "start", md: "center" }} gap={4}>
            <Stack gap={1}>
              <Heading size={{ base: "lg", md: "xl" }}>گالری بازی ها</Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                قالب اختصاصی تسک ۲ با فیلتر پیشرفته و خروجی فارسی
              </Text>
            </Stack>
            <Badge
              borderRadius="full"
              px={3}
              py={1}
              bg="accent.50"
              color="accent.700"
              borderWidth="1px"
              borderColor="accent.200"
              fontSize="xs"
            >
              نتیجه کل: {toPersianNumber(total)}
            </Badge>
          </Flex>

          <Alert.Root
            status={gamesSource === "rawg" ? "success" : "warning"}
            variant="subtle"
            rounded="xl"
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>نکته اتصال RAWG</Alert.Title>
              <Alert.Description>
                {gamesSource === "rawg"
                  ? "داده‌ها مستقیماً از RAWG دریافت می‌شوند."
                  : isRawgConfigured
                    ? "کلید تنظیم شده اما دریافت RAWG با خطا مواجه شد؛ داده نمونه نمایش داده می‌شود."
                    : "برای دریافت داده واقعی باید RAWG_API_KEY در .env.local تنظیم شود؛ فعلاً داده نمونه نمایش می‌دهیم."}{" "}
                (منبع متا: {metaSource === "rawg" ? "RAWG" : "Fallback"} / منبع لیست:{" "}
                {gamesSource === "rawg" ? "RAWG" : "Fallback"})
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
            <AdvancedMultiSelect
              label="ژانرها"
              items={genreItems}
              value={selectedGenreSlugs}
              onChange={setSelectedGenreSlugs}
              placeholder="انتخاب ژانر"
              viewportHeight={220}
              rowHeight={36}
            />
            <AdvancedMultiSelect
              label="پلتفرم ها"
              items={platformItems}
              value={selectedPlatformIds}
              onChange={setSelectedPlatformIds}
              placeholder="انتخاب پلتفرم"
              viewportHeight={220}
              rowHeight={36}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3, xl: 5 }} gap={3}>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="نام بازی..."
              h="40px"
              bg="white"
              borderColor="gray.300"
              _focusVisible={{ borderColor: "brand.500", boxShadow: "none" }}
            />

            <NativeSelect.Root>
              <NativeSelect.Field
                h="40px"
                value={ordering}
                onChange={(event) => setOrdering(event.target.value)}
              >
                <option value="-rating">بالاترین امتیاز</option>
                <option value="-released">جدیدترین انتشار</option>
                <option value="name">مرتب سازی الفبایی</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Button
              size="sm"
              h="40px"
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
              onClick={() => loadGames(1, currentFilters)}
              paddingInline={8}
            >
              اعمال فیلتر
            </Button>

            <Button
              size="sm"
              h="40px"
              variant="outline"
              borderColor="gray.300"
              paddingInline={8}
              onClick={() => {
                setSearch("");
                setOrdering("-rating");
                setSelectedGenreSlugs([]);
                setSelectedPlatformIds([]);
                void loadGames(1, {
                  search: "",
                  ordering: "-rating",
                  genreSlugs: [],
                  platformIds: [],
                });
              }}
            >
              پاک کردن فیلتر
            </Button>

            <Button
              size="sm"
              asChild
              h="40px"
              variant="subtle"
              bg="gray.100"
              paddingInline={8}
              _hover={{ bg: "gray.200" }}
            >
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </SimpleGrid>
        </Stack>
      </Box>

      {loading ? (
        <HStack
          justify="center"
          rounded="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          bg="white"
          py={12}
          gap={3}
        >
          <Spinner color="brand.500" />
          <Text color="gray.600">در حال بارگذاری بازی‌ها...</Text>
        </HStack>
      ) : null}

      {errorMessage ? (
        <Alert.Root status="error" rounded="xl">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>خطا در بارگذاری</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      {!loading && !errorMessage ? (
        games.length ? (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
            {games.map((game) => (
              <Box
                key={game.id}
                rounded="2xl"
                borderWidth="1px"
                borderColor="gray.200"
                bg="white"
                overflow="hidden"
                boxShadow="0 10px 24px rgba(0,0,0,0.05)"
                transition="transform 0.2s ease, box-shadow 0.2s ease"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 30px rgba(0,0,0,0.08)",
                }}
              >
                <Box position="relative" h="210px" bg="gray.100">
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      alt={game.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <HStack h="full" justify="center" color="gray.500" fontSize="sm">
                      تصویر موجود نیست
                    </HStack>
                  )}
                  <Box
                    position="absolute"
                    inset={0}
                    bg="linear-gradient(0deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.0) 60%)"
                  />
                  <Box position="absolute" insetInlineStart={3} bottom={3}>
                    <Badge bg="white/92" color="gray.800" borderRadius="full" px={2.5} py={1}>
                      امتیاز: {game.rating.toLocaleString("fa-IR")}
                    </Badge>
                  </Box>
                </Box>

                <Stack p={4} gap={3}>
                  <Heading size="md" lineClamp={1}>
                    {game.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    تاریخ انتشار: {toPersianDate(game.released)}
                  </Text>
                  <HStack flexWrap="wrap" gap={1.5}>
                    {game.genres.slice(0, 3).map((genre) => (
                      <Badge
                        key={genre.id}
                        borderRadius="full"
                        bg="brand.50"
                        color="brand.700"
                        borderWidth="1px"
                        borderColor="brand.200"
                        px={2.5}
                        py={1}
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </HStack>

                  <Button
                    asChild
                    size="sm"
                    alignSelf="start"
                    bg="gray.900"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                    paddingInline={8}
                  >
                    <Link href={`/task-2/games/${game.id}`}>مشاهده جزئیات</Link>
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box
            rounded="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            bg="white"
            p={8}
            textAlign="center"
          >
            <Heading size="sm" mb={2}>
              بازی‌ای با این فیلترها پیدا نشد
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              فیلترها را تغییر دهید یا پاک‌سازی کنید.
            </Text>
            <Button
              size="sm"
              variant="outline"
              paddingInline={8}
              onClick={() => {
                setSearch("");
                setOrdering("-rating");
                setSelectedGenreSlugs([]);
                setSelectedPlatformIds([]);
                void loadGames(1, {
                  search: "",
                  ordering: "-rating",
                  genreSlugs: [],
                  platformIds: [],
                });
              }}
            >
              پاک‌سازی فیلترها
            </Button>
          </Box>
        )
      ) : null}

      {!loading && !errorMessage ? (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onChange={(nextPage) => {
            void loadGames(nextPage, currentFilters);
          }}
          disabled={loading}
        />
      ) : null}
    </Stack>
  );
}
