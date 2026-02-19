"use client";

import { Button, HStack, Text } from "@chakra-ui/react";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

function buildVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const normalized = Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);

  return normalized;
}

export default function PaginationControls({
  page,
  totalPages,
  onChange,
  disabled = false,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const visiblePages = buildVisiblePages(page, totalPages);

  return (
    <HStack
      rounded="2xl"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      p={3}
      justify="space-between"
      gap={3}
      flexWrap="wrap"
    >
      <Button
        size="sm"
        variant="outline"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        paddingInline={8}
      >
        صفحه قبل
      </Button>

      <HStack gap={1.5} flexWrap="wrap" justify="center">
        {visiblePages.map((item, index) => {
          const previous = visiblePages[index - 1];
          const showGap = previous && item - previous > 1;

          return (
            <HStack key={item} gap={1.5}>
              {showGap ? (
                <Text color="gray.500" fontSize="sm" px={1}>
                  ...
                </Text>
              ) : null}
              <Button
                size="sm"
                minW="34px"
                px={0}
                variant={item === page ? "solid" : "outline"}
                bg={item === page ? "brand.500" : undefined}
                color={item === page ? "white" : undefined}
                _hover={item === page ? { bg: "brand.600" } : undefined}
                disabled={disabled}
                onClick={() => onChange(item)}
                paddingInline={8}
              >
                {item.toLocaleString("fa-IR")}
              </Button>
            </HStack>
          );
        })}
      </HStack>

      <Button
        size="sm"
        variant="outline"
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
        paddingInline={8}
      >
        صفحه بعد
      </Button>
    </HStack>
  );
}
