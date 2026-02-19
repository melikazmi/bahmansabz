"use client";

import {
  Badge,
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DummyJsonProduct } from "@/lib/api/dummyjson";
import { getProductCategories, getProducts } from "@/lib/api/dummyjson";
import ProductQuickViewDialog from "@/components/task1/product-quick-view-dialog";
import PaginationControls from "@/components/ui/pagination-controls";
import { categoryToPersian, toPersianPercent } from "@/lib/utils/format";

type FilterState = {
  query: string;
  category: string;
};

const PAGE_SIZE = 9;

export default function Task1ProductsPage() {
  const [queryInput, setQueryInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    query: "",
    category: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<DummyJsonProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const averagePrice = useMemo(() => {
    if (!products.length) return 0;
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    return Math.round(totalPrice / products.length);
  }, [products]);

  const topRated = useMemo(
    () =>
      products.reduce(
        (best, product) => (product.rating > (best?.rating ?? 0) ? product : best),
        undefined as DummyJsonProduct | undefined
      ),
    [products]
  );

  const loadProducts = useCallback(async (filters: FilterState, nextPage: number) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const skip = (nextPage - 1) * PAGE_SIZE;
      const response = await getProducts({
        query: filters.query,
        category: filters.category,
        limit: PAGE_SIZE,
        skip,
      });
      setProducts(response.products);
      setTotal(response.total);
      setAppliedFilters(filters);
      setPage(nextPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "خطا در دریافت محصولات."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const categoryList = await getProductCategories().catch(() => []);
      setCategories(categoryList);
      await loadProducts({ query: "", category: "" }, 1);
    })();
  }, [loadProducts]);

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }}>
          محصولات
        </Text>
        <Text color="gray.600">
          مدیریت محصولات DummyJSON با فیلتر جستجو، جزئیات سریع و صفحه‌بندی
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
        <Box rounded="xl" borderWidth="1px" borderColor="brand.100" bg="brand.50" p={4}>
          <Text fontSize="sm" color="gray.600">
            تعداد نتایج
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="bold" color="brand.700">
            {total.toLocaleString("fa-IR")}
          </Text>
        </Box>
        <Box rounded="xl" borderWidth="1px" borderColor="gray.200" bg="white" p={4}>
          <Text fontSize="sm" color="gray.600">
            میانگین قیمت نتایج فعلی
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="bold">
            ${averagePrice.toLocaleString("fa-IR")}
          </Text>
        </Box>
        <Box rounded="xl" borderWidth="1px" borderColor="accent.200" bg="accent.50" p={4}>
          <Text fontSize="sm" color="gray.600">
            بالاترین امتیاز
          </Text>
          <Text mt={1} fontSize="xl" fontWeight="bold" color="accent.700" lineClamp={1}>
            {topRated ? `${topRated.title} (${topRated.rating})` : "نامشخص"}
          </Text>
        </Box>
      </SimpleGrid>

      <Box rounded="2xl" borderWidth="1px" borderColor="gray.200" bg="white" p={4}>
        <Stack gap={3}>
          <HStack align="stretch" gap={3} flexWrap="wrap">
            <Input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="جستجو بر اساس عنوان محصول"
              bg="white"
              maxW={{ base: "full", md: "340px" }}
              h="40px"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void loadProducts(
                    {
                      query: queryInput.trim(),
                      category: categoryInput,
                    },
                    1
                  );
                }
              }}
            />

            <NativeSelect.Root maxW={{ base: "full", md: "240px" }}>
              <NativeSelect.Field
                h="40px"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
              >
                <option value="">همه دسته بندی ها</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {categoryToPersian(item)}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>

            <Button
              size="sm"
              h="40px"
              onClick={() =>
                loadProducts(
                  {
                    query: queryInput.trim(),
                    category: categoryInput,
                  },
                  1
                )
              }
              paddingInline={8}
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
            >
              اعمال فیلتر
            </Button>

            <Button
              size="sm"
              h="40px"
              variant="outline"
              paddingInline={8}
              onClick={() => {
                setQueryInput("");
                setCategoryInput("");
                void loadProducts({ query: "", category: "" }, 1);
              }}
            >
              پاک کردن فیلتر
            </Button>
          </HStack>

          <HStack flexWrap="wrap" gap={2}>
            <Badge colorPalette="gray" variant="subtle" px={2.5} py={1}>
              صفحه: {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
            </Badge>
            {appliedFilters.query ? (
              <Badge colorPalette="green" variant="subtle" px={2.5} py={1}>
                جستجو: {appliedFilters.query}
              </Badge>
            ) : null}
            {appliedFilters.category ? (
              <Badge colorPalette="blue" variant="subtle" px={2.5} py={1}>
                دسته: {categoryToPersian(appliedFilters.category)}
              </Badge>
            ) : null}
            {!appliedFilters.query && !appliedFilters.category ? (
              <Text fontSize="sm" color="gray.500">
                فیلتر فعال وجود ندارد.
              </Text>
            ) : null}
          </HStack>
        </Stack>
      </Box>

      {loading ? (
        <HStack justify="center" py={10} gap={3}>
          <Spinner color="brand.500" />
          <Text color="gray.600">در حال بارگذاری محصولات...</Text>
        </HStack>
      ) : null}

      {errorMessage ? (
        <Box rounded="xl" borderWidth="1px" borderColor="red.200" bg="red.50" p={4}>
          <Text color="red.700">{errorMessage}</Text>
        </Box>
      ) : null}

      {!loading && !errorMessage ? (
        products.length ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
              {products.map((product) => (
                <Box
                  key={product.id}
                  rounded="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  bg="white"
                  overflow="hidden"
                  boxShadow="0 8px 20px rgba(0,0,0,0.05)"
                >
                  <Box
                    h="180px"
                    bgImage={`url(${product.thumbnail})`}
                    bgSize="cover"
                    backgroundPosition="center"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      inset={0}
                      bg="linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.0))"
                    />
                    <Badge
                      position="absolute"
                      bottom={3}
                      insetInlineStart={3}
                      borderRadius="full"
                      bg="white"
                      color="gray.800"
                      px={2.5}
                      py={1}
                    >
                      ${product.price.toLocaleString("fa-IR")}
                    </Badge>
                  </Box>
                  <Stack p={4} gap={2.5}>
                    <Text fontWeight="bold" fontSize="lg" lineClamp={1}>
                      {product.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" lineClamp={2}>
                      {product.description}
                    </Text>
                    <HStack justify="space-between" fontSize="sm" color="gray.700">
                      <Text>امتیاز: {product.rating}</Text>
                      <Text>موجودی: {product.stock.toLocaleString("fa-IR")}</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      دسته: {categoryToPersian(product.category)}
                    </Text>

                    <HStack justify="space-between" pt={1} align="center">
                      <ProductQuickViewDialog product={product} />
                      <Badge
                        bg="accent.50"
                        color="accent.700"
                        borderWidth="1px"
                        borderColor="accent.200"
                        px={2.5}
                        py={1}
                      >
                        تخفیف: {toPersianPercent(product.discountPercentage)}
                      </Badge>
                    </HStack>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>

            <PaginationControls
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => {
                void loadProducts(appliedFilters, nextPage);
              }}
              disabled={loading}
            />
          </>
        ) : (
          <Box
            rounded="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            bg="white"
            p={8}
            textAlign="center"
          >
            <Text fontWeight="bold" mb={2}>
              محصولی با فیلتر فعلی پیدا نشد
            </Text>
            <Text fontSize="sm" color="gray.600" mb={4}>
              فیلترها را تغییر دهید یا پاک کنید.
            </Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setQueryInput("");
                setCategoryInput("");
                void loadProducts({ query: "", category: "" }, 1);
              }}
              paddingInline={8}
            >
              نمایش همه محصولات
            </Button>
          </Box>
        )
      ) : null}
    </Stack>
  );
}
