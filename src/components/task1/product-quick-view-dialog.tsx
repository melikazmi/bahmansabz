"use client";

import {
  Badge,
  Box,
  Button,
  Dialog,
  HStack,
  Image,
  Portal,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { DummyJsonProduct } from "@/lib/api/dummyjson";
import { categoryToPersian, toPersianPercent } from "@/lib/utils/format";

type ProductQuickViewDialogProps = {
  product: DummyJsonProduct;
};

export default function ProductQuickViewDialog({ product }: ProductQuickViewDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="sm" h="32px" px={3} variant="outline" borderColor="gray.300" paddingInline={8}>
          جزئیات سریع
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner p={4}>
          <Dialog.Content rounded="2xl" maxW="3xl" overflow="hidden">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.200" p={4}>
              <Stack gap={1}>
                <Dialog.Title fontSize="lg">{product.title}</Dialog.Title>
                <Dialog.Description color="gray.600">
                  {categoryToPersian(product.category)}
                </Dialog.Description>
              </Stack>
            </Dialog.Header>

            <Dialog.Body p={4}>
              <Stack gap={4}>
                <Box
                  rounded="xl"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor="gray.200"
                  bg="gray.100"
                >
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    w="100%"
                    h={{ base: "180px", md: "260px" }}
                    objectFit="cover"
                  />
                </Box>

                <HStack flexWrap="wrap" gap={2}>
                  <Badge
                    bg="brand.50"
                    color="brand.700"
                    borderWidth="1px"
                    borderColor="brand.200"
                    px={2.5}
                    py={1}
                  >
                    قیمت: ${product.price.toLocaleString("fa-IR")}
                  </Badge>
                  <Badge bg="gray.100" color="gray.700" px={2.5} py={1}>
                    امتیاز: {product.rating}
                  </Badge>
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
                  <Badge bg="gray.100" color="gray.700" px={2.5} py={1}>
                    موجودی: {product.stock.toLocaleString("fa-IR")}
                  </Badge>
                </HStack>

                <Text fontSize="sm" color="gray.700" lineHeight="1.9">
                  {product.description}
                </Text>

                <SimpleGrid columns={{ base: 2, md: 4 }} gap={2}>
                  {product.images.slice(0, 4).map((imageUrl, index) => (
                    <Box
                      key={`${product.id}-${imageUrl}`}
                      rounded="lg"
                      overflow="hidden"
                      borderWidth="1px"
                      borderColor="gray.200"
                      bg="gray.50"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.title} ${index + 1}`}
                        w="100%"
                        h="88px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer borderTopWidth="1px" borderColor="gray.200" p={4}>
              <Dialog.ActionTrigger asChild>
                <Button size="sm" variant="outline" paddingInline={8}>
                  بستن
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
