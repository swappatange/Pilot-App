import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface CardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  transparent?: boolean;
}

export function Card({ children, style, transparent = true }: CardProps) {
  const { theme } = useTheme();
  
  const backgroundColor = transparent 
    ? 'rgba(0, 60, 50, 0.65)' 
    : theme.cardBackground;
  
  return (
    <View
      style={[
        styles.card,
        { backgroundColor },
        !transparent && Shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});
