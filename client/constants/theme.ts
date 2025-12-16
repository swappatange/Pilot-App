import { Platform } from "react-native";

export const BrandColors = {
  // Atomik brand gradient colors (blue to green)
  gradientTop: "#1565A0",
  gradientMiddle: "#2E7D5A",
  gradientBottom: "#2E7D32",
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryDeep: "#1565A0",
  accent: "#43A047",
  teal: "#1565A0",
  // Status colors
  warning: "#f39c12",
  warningLight: "#fff3cd",
  warningText: "#856404",
  success: "#28a745",
  successLight: "#d4edda",
  successText: "#155724",
  danger: "#dc3545",
  dangerLight: "#f8d7da",
  dangerText: "#721c24",
  // Neutrals
  white: "#ffffff",
  cream: "#f8f9fa",
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#6c757d",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
};

export const Colors = {
  light: {
    text: "#212529",
    textSecondary: "#6c757d",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6c757d",
    tabIconSelected: BrandColors.primary,
    link: BrandColors.primary,
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F8F9FA",
    backgroundSecondary: "#E9ECEF",
    backgroundTertiary: "#DEE2E6",
    border: "#DEE2E6",
    cardBackground: "#FFFFFF",
    primary: BrandColors.primary,
    primaryDark: BrandColors.primaryDark,
    accent: BrandColors.accent,
  },
  dark: {
    text: "#F8F9FA",
    textSecondary: "#ADB5BD",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6c757d",
    tabIconSelected: BrandColors.accent,
    link: BrandColors.accent,
    backgroundRoot: "#1a1a1a",
    backgroundDefault: "#242424",
    backgroundSecondary: "#2e2e2e",
    backgroundTertiary: "#383838",
    border: "#383838",
    cardBackground: "#242424",
    primary: BrandColors.primary,
    primaryDark: BrandColors.primaryDark,
    accent: BrandColors.accent,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  stats: {
    fontSize: 28,
    fontWeight: "600" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: BrandColors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
