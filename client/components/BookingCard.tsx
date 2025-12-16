import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useApp, Booking } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function BookingCard({ booking, onPress, showActions = false, compact = false }: BookingCardProps) {
  const { theme } = useTheme();
  const { t, updateBookingStatus } = useApp();

  const handleAccept = () => {
    updateBookingStatus(booking.id, 'active');
  };

  const handleDecline = () => {
    updateBookingStatus(booking.id, 'cancelled');
  };

  const handleComplete = () => {
    updateBookingStatus(booking.id, 'completed');
  };

  if (compact) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
        <Card style={styles.compactCard}>
          <View style={styles.compactRow}>
            <View style={[styles.timeContainer, { backgroundColor: BrandColors.primary + '15' }]}>
              <ThemedText style={styles.time}>{booking.scheduledTime}</ThemedText>
            </View>
            <View style={styles.compactInfo}>
              <ThemedText style={styles.farmerName}>{booking.farmerName}</ThemedText>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={theme.textSecondary} />
                <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
                  {booking.village}
                </ThemedText>
                <ThemedText style={[styles.acreage, { color: theme.textSecondary }]}>
                  - {booking.acreage} {t('acres')}
                </ThemedText>
              </View>
            </View>
            <StatusBadge status={booking.status} small />
          </View>
        </Card>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <ThemedText style={styles.farmerName}>{booking.farmerName}</ThemedText>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
                {booking.village}, {booking.district}
              </ThemedText>
            </View>
          </View>
          <StatusBadge status={booking.status} />
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Feather name="maximize-2" size={16} color={BrandColors.primary} />
            <ThemedText style={styles.detailText}>
              {booking.acreage} {t('acres')}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Feather name="calendar" size={16} color={BrandColors.primary} />
            <ThemedText style={styles.detailText}>
              {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Feather name="clock" size={16} color={BrandColors.primary} />
            <ThemedText style={styles.detailText}>{booking.scheduledTime}</ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.amount}>
            {'\u20B9'}{booking.amount.toLocaleString('en-IN')}
          </ThemedText>

          {showActions && booking.status === 'pending' && (
            <View style={styles.actions}>
              <Pressable
                style={[styles.actionBtn, styles.declineBtn]}
                onPress={handleDecline}
              >
                <ThemedText style={[styles.actionText, { color: theme.textSecondary }]}>
                  {t('decline')}
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={handleAccept}
              >
                <ThemedText style={[styles.actionText, { color: BrandColors.white }]}>
                  {t('accept')}
                </ThemedText>
              </Pressable>
            </View>
          )}

          {showActions && (booking.status === 'active' || booking.status === 'in_progress') && (
            <Pressable
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={handleComplete}
            >
              <ThemedText style={[styles.actionText, { color: BrandColors.white }]}>
                {t('markComplete')}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  compactCard: {
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  time: {
    ...Typography.small,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  compactInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  farmerName: {
    ...Typography.bodyBold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 4,
  },
  location: {
    ...Typography.small,
  },
  acreage: {
    ...Typography.small,
  },
  details: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: Spacing.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.small,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  amount: {
    ...Typography.h4,
    color: BrandColors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  declineBtn: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  acceptBtn: {
    backgroundColor: BrandColors.primary,
  },
  actionText: {
    ...Typography.small,
    fontWeight: '600',
  },
});
