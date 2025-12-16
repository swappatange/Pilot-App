import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

type PeriodType = 'today' | 'week' | 'month';

export default function EarningsScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, getEarnings, getBookingsByStatus } = useApp();
  const [period, setPeriod] = useState<PeriodType>('week');

  const earnings = getEarnings(period);
  const completedBookings = getBookingsByStatus('completed');

  const periods: { key: PeriodType; label: string }[] = [
    { key: 'today', label: t('today') },
    { key: 'week', label: t('thisWeek') },
    { key: 'month', label: t('thisMonth') },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summaryCard}>
          <ThemedText style={[styles.totalLabel, { color: theme.textSecondary }]}>
            {t('totalEarnings')}
          </ThemedText>
          <ThemedText style={styles.totalValue}>
            {'\u20B9'}{earnings.total.toLocaleString('en-IN')}
          </ThemedText>

          <View style={styles.periodSelector}>
            {periods.map((p) => {
              const isActive = period === p.key;
              return (
                <Pressable
                  key={p.key}
                  style={[
                    styles.periodButton,
                    {
                      backgroundColor: isActive ? BrandColors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setPeriod(p.key)}
                >
                  <ThemedText
                    style={[
                      styles.periodText,
                      { color: isActive ? BrandColors.white : theme.textSecondary },
                    ]}
                  >
                    {p.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: BrandColors.primary + '15' }]}>
              <Feather name="check-circle" size={20} color={BrandColors.primary} />
            </View>
            <ThemedText style={styles.statValue}>{earnings.count}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('completedBookings')}
            </ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: BrandColors.accent + '15' }]}>
              <Feather name="map" size={20} color={BrandColors.accent} />
            </View>
            <ThemedText style={styles.statValue}>{earnings.acres}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('totalAcres')}
            </ThemedText>
          </Card>
        </View>

        <Card style={styles.avgCard}>
          <View style={styles.avgRow}>
            <View>
              <ThemedText style={[styles.avgLabel, { color: theme.textSecondary }]}>
                {t('avgPerBooking')}
              </ThemedText>
              <ThemedText style={styles.avgValue}>
                {'\u20B9'}{earnings.count > 0 ? Math.round(earnings.total / earnings.count).toLocaleString('en-IN') : 0}
              </ThemedText>
            </View>
            <View style={[styles.avgIcon, { backgroundColor: BrandColors.primaryDark + '15' }]}>
              <Feather name="trending-up" size={24} color={BrandColors.primaryDark} />
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('recentTransactions')}</ThemedText>
        </View>

        {completedBookings.length > 0 ? (
          completedBookings.slice(0, 10).map((booking) => (
            <Card key={booking.id} style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={[styles.transactionIcon, { backgroundColor: BrandColors.successLight }]}>
                  <Feather name="arrow-down-left" size={18} color={BrandColors.successText} />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText style={styles.transactionName}>{booking.farmerName}</ThemedText>
                  <ThemedText style={[styles.transactionDate, { color: theme.textSecondary }]}>
                    {new Date(booking.completedAt || booking.scheduledDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })} - {booking.acreage} {t('acres')}
                  </ThemedText>
                </View>
                <ThemedText style={styles.transactionAmount}>
                  +{'\u20B9'}{booking.amount.toLocaleString('en-IN')}
                </ThemedText>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Feather name="credit-card" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No transactions yet
            </ThemedText>
          </Card>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    ...Typography.small,
  },
  totalValue: {
    ...Typography.h1,
    color: BrandColors.primary,
    marginVertical: Spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: BorderRadius.full,
    padding: 4,
    marginTop: Spacing.md,
  },
  periodButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  periodText: {
    ...Typography.small,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statValue: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  avgCard: {
    marginBottom: Spacing.xl,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avgLabel: {
    ...Typography.small,
  },
  avgValue: {
    ...Typography.h3,
    marginTop: Spacing.xs,
  },
  avgIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
  },
  transactionCard: {
    marginBottom: Spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  transactionName: {
    ...Typography.body,
    fontWeight: '500',
  },
  transactionDate: {
    ...Typography.caption,
    marginTop: 2,
  },
  transactionAmount: {
    ...Typography.bodyBold,
    color: BrandColors.success,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.lg,
  },
});
