"use client";

import {
  Alert,
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, resolveLoginToken } from "@/lib/api/dummyjson";
import { setToken } from "@/lib/auth/session";

export default function Task1LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await login(username, password);
      const token = resolveLoginToken(response);
      if (!token) {
        throw new Error("توکن معتبر از سرور دریافت نشد.");
      }
      setToken(token);
      router.replace("/task-1/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "خطا در ورود. دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(180deg, #f6fcf9 0%, #edf8f2 100%)"
      px={4}
      py={{ base: 10, md: 16 }}
    >
      <Box mx="auto" maxW="lg">
        <Box
          rounded="3xl"
          borderWidth="1px"
          borderColor="brand.100"
          bg="white"
          p={{ base: 6, md: 8 }}
          shadow="sm"
        >
          <Stack gap={6}>
            <Stack align="center" gap={4}>
              <Box
                rounded="2xl"
                borderWidth="1px"
                borderColor="brand.100"
                bg="brand.50"
                p={3}
              >
                <Image
                  src="/Logo.png"
                  alt="لوگوی بهمن سبز"
                  width={110}
                  height={86}
                  style={{ width: "110px", height: "auto" }}
                  priority
                />
              </Box>
              <Stack gap={1} textAlign="center">
                <Heading size="lg">ورود به تسک ۱</Heading>
                <Text color="gray.600" fontSize="sm">
                  داشبورد کاربران و محصولات مبتنی بر DummyJSON
                </Text>
              </Stack>
            </Stack>

            <Box
              rounded="xl"
              borderWidth="1px"
              borderColor="brand.100"
              bg="brand.50"
              p={4}
              fontSize="sm"
              color="gray.700"
            >
              <Text fontWeight="bold" mb={1}>
                حساب تست معتبر DummyJSON
              </Text>
              <Text>نام کاربری: emilys</Text>
              <Text>رمز عبور: emilyspass</Text>
            </Box>

            {errorMessage ? (
              <Alert.Root status="error" variant="subtle" rounded="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>ورود ناموفق بود</Alert.Title>
                  <Alert.Description>{errorMessage}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            ) : null}

            <form onSubmit={onSubmit}>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>نام کاربری</Field.Label>
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="نام کاربری"
                    autoComplete="username"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>رمز عبور</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="رمز عبور"
                    autoComplete="current-password"
                  />
                </Field.Root>

                <Button
                  size="sm"
                  type="submit"
                  loading={loading}
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  paddingInline={8}
                >
                  ورود به داشبورد
                </Button>
              </Stack>
            </form>

            <Link href="/" className="text-center text-sm text-gray-600 underline">
              بازگشت به صفحه اصلی تسک ها
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
