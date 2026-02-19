import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const themeConfig = defineConfig({
  globalCss: {
    "html, body": {
      bg: "{colors.gray.50}",
      color: "{colors.gray.900}",
      minHeight: "100%",
    },
    body: {
      lineHeight: "1.65",
      fontFamily: "body",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-vazirmatn), Vazirmatn, Tahoma, sans-serif" },
        body: { value: "var(--font-vazirmatn), Vazirmatn, Tahoma, sans-serif" },
      },
      colors: {
        brand: {
          50: { value: "#EAF8F2" },
          100: { value: "#D1F0E2" },
          200: { value: "#B8E8D3" },
          300: { value: "#8AD9B7" },
          400: { value: "#5ECB9B" },
          500: { value: "#41BA89" },
          600: { value: "#33966E" },
          700: { value: "#267153" },
          800: { value: "#1A4D39" },
          900: { value: "#0F2B20" },
        },
        accent: {
          50: { value: "#FAF2DF" },
          100: { value: "#F4E4BF" },
          200: { value: "#EED79F" },
          300: { value: "#E8CA7E" },
          400: { value: "#E6BD5E" },
          500: { value: "#E3AC38" },
          600: { value: "#B6892D" },
          700: { value: "#8A6722" },
          800: { value: "#5D4517" },
          900: { value: "#31230B" },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: "{colors.brand.500}" },
        pageBg: { value: "{colors.gray.50}" },
        panelBg: { value: "{colors.white}" },
        softBorder: { value: "{colors.gray.200}" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, themeConfig);
