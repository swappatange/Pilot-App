import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useApp, BookingStatus } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface StatusBadgeProps {
  status: BookingStatus;
  small?: boolean;
}

export function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const { t } = useApp();

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          backgroundColor: BrandColors.warningLight,
          textColor: BrandColors.warningText,
          label: t('pending'),
        };
      case 'active':
        return {
          backgroundColor: BrandColors.successLight,
          textColor: BrandColors.successText,
          label: t('active'),
        };
      case 'in_progress':
        return {
          backgroundColor: BrandColors.primary + '20',
          textColor: BrandColors.primaryDark,
          label: t('inProgress'),
        };
      case 'completed':
        return {
          backgroundColor: BrandColors.gray200,
          textColor: BrandColors.gray700,
          label: t('completed'),
        };
      case 'cancelled':
        return {
          backgroundColor: BrandColors.dangerLight,
          textColor: BrandColors.dangerText,
          label: t('cancel'),
        };
      default:
        return {
          backgroundColor: BrandColors.gray200,
          textColor: BrandColors.gray700,
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSmall,
        { backgroundColor: config.backgroundColor },
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          small && styles.textSmall,
          { color: config.textColor },
        ]}
      >
        {config.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    ...Typography.small,
    fontWeight: '600',
  },
  textSmall: {
    ...Typography.caption,
  },
});
