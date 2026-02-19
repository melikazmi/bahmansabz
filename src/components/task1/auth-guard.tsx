"use client";

import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { hasToken } from "@/lib/auth/session";

export default function Task1AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = hasToken();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/task-1/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <VStack minH="100vh" justify="center" gap={4}>
        <Spinner size="lg" color="brand.500" />
        <Text color="gray.600">در حال بررسی وضعیت ورود...</Text>
      </VStack>
    );
  }

  return <Box>{children}</Box>;
}
