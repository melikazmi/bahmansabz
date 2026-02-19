"use client";

import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { clearToken } from "@/lib/auth/session";

const navItems = [
  { href: "/task-1/dashboard", label: "داشبورد" },
  { href: "/task-1/users", label: "کاربران" },
  { href: "/task-1/products", label: "محصولات" },
];

export default function Task1Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace("/task-1/login");
  }

  return (
    <Flex
      minH="100vh"
      bg="linear-gradient(180deg, #f6fcf9 0%, #edf8f2 100%)"
      direction={{ base: "column", md: "row" }}
    >
      <Box
        w={{ base: "full", md: "300px" }}
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderBottomWidth={{ base: "1px", md: 0 }}
        borderColor="brand.100"
        bg="white/95"
        p={5}
        backdropFilter="blur(8px)"
      >
        <Stack gap={6}>
          <Stack direction="row" align="center" gap={3}>
            <Box
              borderRadius="xl"
              borderWidth="1px"
              borderColor="brand.100"
              bg="brand.50"
              p={2}
            >
              <Image
                src="/Logo.png"
                alt="Bahman Sabz"
                width={48}
                height={38}
                style={{ width: "48px", height: "auto" }}
              />
            </Box>
            <Box>
              <Heading size="sm">تسک ۱</Heading>
              <Text fontSize="xs" color="gray.600">
                داشبورد DummyJSON
              </Text>
            </Box>
          </Stack>

          <Stack gap={2.5}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Box
                    px={3}
                    py={2.5}
                    rounded="lg"
                    fontWeight="bold"
                    borderWidth="1px"
                    borderColor={active ? "brand.300" : "gray.200"}
                    color={active ? "brand.700" : "gray.700"}
                    bg={active ? "brand.50" : "white"}
                    transition="all 0.2s"
                    _hover={{ borderColor: "brand.200", bg: "brand.50" }}
                  >
                    {item.label}
                  </Box>
                </Link>
              );
            })}
          </Stack>

          <Button
            colorPalette="red"
            variant="subtle"
            size="sm"
            onClick={logout}
            borderRadius="lg"
            paddingInline={8}
          >
            خروج از حساب
          </Button>
        </Stack>
      </Box>

      <Box flex={1} p={{ base: 4, md: 6 }}>
        <Box
          rounded="3xl"
          borderWidth="1px"
          borderColor="brand.100"
          bg="white"
          p={{ base: 4, md: 6 }}
          boxShadow="0 15px 30px rgba(15, 23, 42, 0.04)"
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
