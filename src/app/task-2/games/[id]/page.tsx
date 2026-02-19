import { Badge, Box, Button, Heading, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRawgGameById } from "@/lib/api/rawg";
import { toPersianDate, toPersianNumber } from "@/lib/utils/format";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function Task2GameDetailPage({ params }: Params) {
  const { id } = await params;
  const gameId = Number(id);
  if (Number.isNaN(gameId)) notFound();

  const game = await getRawgGameById(gameId);
  if (!game) notFound();

  return (
    <Stack gap={5}>
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Stack gap={1}>
          <Text fontSize="xs" color="brand.700" fontWeight="bold">
            جزئیات بازی
          </Text>
          <Heading size={{ base: "lg", md: "xl" }}>{game.name}</Heading>
        </Stack>
        <Link href="/task-2">
          <Button size="sm" variant="outline" paddingInline={8}>
            بازگشت به لیست بازی ها
          </Button>
        </Link>
      </HStack>

      <Box
        rounded="3xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.200"
        bg="white"
        boxShadow="0 16px 28px rgba(0,0,0,0.06)"
      >
        <Box position="relative" h={{ base: "240px", md: "370px" }} bg="gray.100">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <HStack h="full" justify="center" color="gray.500" fontSize="sm">
              تصویر برای این بازی موجود نیست
            </HStack>
          )}

          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(0deg, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0.06) 70%)"
          />
          <Stack position="absolute" insetInlineStart={4} bottom={4} gap={2}>
            <Badge
              alignSelf="start"
              borderRadius="full"
              px={3}
              py={1}
              bg="white/95"
              color="gray.800"
            >
              تاریخ انتشار: {toPersianDate(game.released)}
            </Badge>
            <Badge
              alignSelf="start"
              borderRadius="full"
              px={3}
              py={1}
              bg="brand.500"
              color="white"
            >
              امتیاز RAWG: {game.rating.toLocaleString("fa-IR")}
            </Badge>
          </Stack>
        </Box>

        <Stack p={{ base: 4, md: 6 }} gap={5}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <Box rounded="xl" borderWidth="1px" borderColor="gray.200" bg="gray.50" p={4}>
              <Text fontSize="sm" color="gray.600">
                متاکریتیک
              </Text>
              <Text mt={1} fontWeight="bold" fontSize="2xl">
                {game.metacritic ? toPersianNumber(game.metacritic) : "نامشخص"}
              </Text>
            </Box>

            <Box rounded="xl" borderWidth="1px" borderColor="brand.200" bg="brand.50" p={4}>
              <Text fontSize="sm" color="brand.700">
                تعداد رأی کاربران
              </Text>
              <Text mt={1} fontWeight="bold" fontSize="2xl" color="brand.800">
                {game.ratings_count ? toPersianNumber(game.ratings_count) : "نامشخص"}
              </Text>
            </Box>

            <Box rounded="xl" borderWidth="1px" borderColor="accent.200" bg="accent.50" p={4}>
              <Text fontSize="sm" color="accent.700">
                زمان تقریبی بازی
              </Text>
              <Text mt={1} fontWeight="bold" fontSize="2xl" color="accent.800">
                {game.playtime ? `${toPersianNumber(game.playtime)} ساعت` : "نامشخص"}
              </Text>
            </Box>
          </SimpleGrid>

          <Box>
            <Text mb={2} fontWeight="bold">
              ژانرها
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              {game.genres.map((item) => (
                <Badge
                  key={item.id}
                  borderRadius="full"
                  bg="brand.50"
                  color="brand.700"
                  borderWidth="1px"
                  borderColor="brand.200"
                  px={3}
                  py={1}
                >
                  {item.name}
                </Badge>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text mb={2} fontWeight="bold">
              پلتفرم ها
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              {game.platforms.map((item) => (
                <Badge
                  key={item.platform.id}
                  borderRadius="full"
                  bg="gray.100"
                  color="gray.700"
                  px={3}
                  py={1}
                >
                  {item.platform.name}
                </Badge>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text mb={2} fontWeight="bold">
              توضیحات
            </Text>
            <Text color="gray.700" lineHeight="1.9">
              {game.description_raw || "توضیحی برای این بازی ثبت نشده است."}
            </Text>
          </Box>

          {game.website ? (
            <Link href={game.website} target="_blank" rel="noreferrer">
              <Button size="sm" bg="brand.500" color="white" _hover={{ bg: "brand.600" }} paddingInline={8}>
                مشاهده وب سایت رسمی
              </Button>
            </Link>
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
}
