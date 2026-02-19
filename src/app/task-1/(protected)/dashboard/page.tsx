import { Badge, Box, Button, Heading, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { getProducts, getUsers } from "@/lib/api/dummyjson";
import { toPersianNumber } from "@/lib/utils/format";

export default async function Task1DashboardPage() {
  const [usersData, productsData] = await Promise.all([
    getUsers({ limit: 10, skip: 0 }),
    getProducts({ limit: 10, skip: 0 }),
  ]);

  const totalUsers = usersData.total;
  const totalProducts = productsData.total;
  const avgProductPrice =
    productsData.products.reduce((sum, item) => sum + item.price, 0) /
    Math.max(productsData.products.length, 1);

  return (
    <Stack gap={6}>
      <Box
        rounded="3xl"
        borderWidth="1px"
        borderColor="brand.100"
        bg="white"
        p={{ base: 5, md: 6 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          insetInlineEnd="-50px"
          top="-60px"
          w="170px"
          h="170px"
          rounded="full"
          bg="brand.50"
          pointerEvents="none"
        />
        <Stack position="relative" zIndex={1} gap={4}>
          <Stack gap={1}>
            <Heading size="lg">داشبورد تسک ۱</Heading>
            <Text color="gray.600">
              نمای کلی کاربران و محصولات از سرویس <code>dummyjson.com</code>
            </Text>
          </Stack>

          <HStack gap={2} flexWrap="wrap">
            <Link href="/task-1/users">
              <Button size="sm" bg="brand.500" color="white" _hover={{ bg: "brand.600" }} paddingInline={8}>
                مدیریت کاربران
              </Button>
            </Link>
            <Link href="/task-1/products">
              <Button size="sm" variant="outline" borderColor="gray.300" paddingInline={8}>
                مدیریت محصولات
              </Button>
            </Link>
          </HStack>
        </Stack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Box rounded="xl" borderWidth="1px" borderColor="brand.200" bg="brand.50" p={5}>
          <Text fontSize="sm" color="gray.600">
            تعداد کل کاربران
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="bold" color="brand.700">
            {toPersianNumber(totalUsers)}
          </Text>
        </Box>

        <Box rounded="xl" borderWidth="1px" borderColor="gray.200" bg="white" p={5}>
          <Text fontSize="sm" color="gray.600">
            تعداد کل محصولات
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="bold">
            {toPersianNumber(totalProducts)}
          </Text>
        </Box>

        <Box rounded="xl" borderWidth="1px" borderColor="accent.200" bg="accent.50" p={5}>
          <Text fontSize="sm" color="gray.600">
            میانگین قیمت (نمونه فعلی)
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="bold" color="accent.700">
            ${toPersianNumber(Math.round(avgProductPrice))}
          </Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
        <Box rounded="xl" borderWidth="1px" borderColor="gray.200" bg="white" p={5}>
          <Heading size="sm" mb={4}>
            کاربران اخیر
          </Heading>
          <Stack gap={3}>
            {usersData.users.slice(0, 5).map((user) => (
              <HStack
                key={user.id}
                rounded="lg"
                borderWidth="1px"
                borderColor="gray.100"
                p={3}
                justify="space-between"
              >
                <Stack gap={0.5}>
                  <Text fontWeight="bold">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {user.email}
                  </Text>
                </Stack>
                <Badge colorPalette="green" variant="subtle">
                  {user.age.toLocaleString("fa-IR")} سال
                </Badge>
              </HStack>
            ))}
          </Stack>
        </Box>

        <Box rounded="xl" borderWidth="1px" borderColor="gray.200" bg="white" p={5}>
          <Heading size="sm" mb={4}>
            محصولات اخیر
          </Heading>
          <Stack gap={3}>
            {productsData.products.slice(0, 5).map((product) => (
              <HStack
                key={product.id}
                rounded="lg"
                borderWidth="1px"
                borderColor="gray.100"
                p={3}
                justify="space-between"
              >
                <Stack gap={0.5}>
                  <Text fontWeight="bold">{product.title}</Text>
                  <Text color="gray.600" fontSize="sm">
                    قیمت: ${toPersianNumber(product.price)}
                  </Text>
                </Stack>
                <Badge colorPalette="yellow" variant="subtle">
                  {product.rating} ⭐
                </Badge>
              </HStack>
            ))}
          </Stack>
        </Box>
      </SimpleGrid>
    </Stack>
  );
}
