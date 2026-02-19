"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DummyJsonUser } from "@/lib/api/dummyjson";
import { getUsers } from "@/lib/api/dummyjson";
import PaginationControls from "@/components/ui/pagination-controls";

const PAGE_SIZE = 9;

export default function Task1UsersPage() {
  const [queryInput, setQueryInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [users, setUsers] = useState<DummyJsonUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const loadUsers = useCallback(async (searchQuery: string, nextPage: number) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const normalizedQuery = searchQuery.trim();
      const skip = (nextPage - 1) * PAGE_SIZE;
      const response = await getUsers({
        query: normalizedQuery,
        limit: PAGE_SIZE,
        skip,
      });
      setUsers(response.users);
      setTotal(response.total);
      setAppliedQuery(normalizedQuery);
      setPage(nextPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "خطا در دریافت کاربران."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers("", 1);
  }, [loadUsers]);

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }}>
          کاربران
        </Text>
        <Text color="gray.600">
          مدیریت کاربران DummyJSON با جستجوی سریع، کارت پروفایل و صفحه‌بندی
        </Text>
      </Stack>

      <Box rounded="2xl" borderWidth="1px" borderColor="gray.200" bg="white" p={4}>
        <Stack gap={3}>
          <HStack gap={3} align="stretch" flexWrap="wrap">
            <Input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="جستجو بر اساس نام یا ایمیل"
              bg="white"
              h="40px"
              maxW={{ base: "full", md: "360px" }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void loadUsers(queryInput, 1);
                }
              }}
            />
            <Button
              size="sm"
              h="40px"
              onClick={() => loadUsers(queryInput, 1)}
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.600" }}
              paddingInline={8}
            >
              جستجو
            </Button>
            <Button
              size="sm"
              h="40px"
              variant="outline"
              onClick={() => {
                setQueryInput("");
                void loadUsers("", 1);
              }}
              paddingInline={8}
            >
              پاک کردن
            </Button>
          </HStack>

          <HStack flexWrap="wrap" gap={2}>
            <Badge colorPalette="green" variant="subtle" px={2.5} py={1}>
              نتیجه: {total.toLocaleString("fa-IR")}
            </Badge>
            <Badge colorPalette="gray" variant="subtle" px={2.5} py={1}>
              صفحه: {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
            </Badge>
            {appliedQuery ? (
              <Badge colorPalette="blue" variant="subtle" px={2.5} py={1}>
                جستجو: {appliedQuery}
              </Badge>
            ) : (
              <Text fontSize="sm" color="gray.500">
                همه کاربران نمایش داده می‌شوند.
              </Text>
            )}
          </HStack>
        </Stack>
      </Box>

      {loading ? (
        <HStack justify="center" py={10} gap={3}>
          <Spinner color="brand.500" />
          <Text color="gray.600">در حال بارگذاری کاربران...</Text>
        </HStack>
      ) : null}

      {errorMessage ? (
        <Box rounded="xl" borderWidth="1px" borderColor="red.200" bg="red.50" p={4}>
          <Text color="red.700">{errorMessage}</Text>
        </Box>
      ) : null}

      {!loading && !errorMessage ? (
        users.length ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
              {users.map((user) => (
                <Box
                  key={user.id}
                  rounded="2xl"
                  borderWidth="1px"
                  borderColor="gray.200"
                  bg="white"
                  p={4}
                  boxShadow="0 8px 18px rgba(0,0,0,0.04)"
                >
                  <HStack align="start" gap={3}>
                    <Avatar.Root size="lg" borderWidth="1px" borderColor="gray.200">
                      <Avatar.Image src={user.image} />
                      <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                    </Avatar.Root>

                    <Stack gap={1} flex={1}>
                      <Text fontWeight="bold" fontSize="lg" lineClamp={1}>
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text color="gray.600" fontSize="sm" lineClamp={1}>
                        {user.email}
                      </Text>
                      <HStack gap={2} flexWrap="wrap">
                        <Badge colorPalette="green" variant="subtle">
                          {user.age.toLocaleString("fa-IR")} سال
                        </Badge>
                        <Badge colorPalette="gray" variant="subtle">
                          {user.gender}
                        </Badge>
                      </HStack>
                    </Stack>
                  </HStack>

                  <Stack mt={3} gap={1.5} fontSize="sm" color="gray.700">
                    <Text>تلفن: {user.phone}</Text>
                    <Text>شرکت: {user.company?.name ?? "نامشخص"}</Text>
                    <Text>
                      شهر: {user.address?.city ?? "نامشخص"} -{" "}
                      {user.address?.country ?? "نامشخص"}
                    </Text>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>

            <PaginationControls
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => {
                void loadUsers(appliedQuery, nextPage);
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
              کاربری پیدا نشد
            </Text>
            <Text color="gray.600" fontSize="sm">
              عبارت جستجو را تغییر دهید.
            </Text>
          </Box>
        )
      ) : null}
    </Stack>
  );
}
