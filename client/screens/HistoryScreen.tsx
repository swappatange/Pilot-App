import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp, Booking } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

type FilterType = 'all' | '7days' | 'month' | '3months';

export default function HistoryScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, getBookingsByStatus } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  const completedBookings = getBookingsByStatus('completed');

  const filterBookings = (bookings: Booking[]): Booking[] => {
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 86400000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 86400000);
        break;
      default:
        return bookings;
    }

    return bookings.filter(b => {
      const completedDate = new Date(b.completedAt || b.scheduledDate);
      return completedDate >= startDate;
    });
  };

  const filteredBookings = filterBookings(completedBookings);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: '7days', label: t('last7Days') },
    { key: 'month', label: t('lastMonth') },
    { key: '3months', label: t('last3Months') },
  ];

  const renderBooking = ({ item }: { item: Booking }) => {
    const date = new Date(item.completedAt || item.scheduledDate);
    return (
      <Card style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={[styles.dateContainer, { backgroundColor: BrandColors.primary + '15' }]}>
            <ThemedText style={styles.dateDay}>{date.getDate()}</ThemedText>
            <ThemedText style={[styles.dateMonth, { color: theme.textSecondary }]}>
              {date.toLocaleDateString('en-IN', { month: 'short' })}
            </ThemedText>
          </View>
          <View style={styles.historyInfo}>
            <ThemedText style={styles.historyName}>{item.farmerName}</ThemedText>
            <View style={styles.historyMeta}>
              <Feather name="map-pin" size={12} color={theme.textSecondary} />
              <ThemedText style={[styles.historyLocation, { color: theme.textSecondary }]}>
                {item.village}
              </ThemedText>
            </View>
          </View>
          <View style={styles.historyRight}>
            <ThemedText style={styles.historyAmount}>
              {'\u20B9'}{item.amount.toLocaleString('en-IN')}
            </ThemedText>
            <ThemedText style={[styles.historyAcres, { color: theme.textSecondary }]}>
              {item.acreage} {t('acres')}
            </ThemedText>
          </View>
        </View>
        <View style={styles.historyDetails}>
          <View style={styles.detailItem}>
            <Feather name="layers" size={14} color={BrandColors.primary} />
            <ThemedText style={styles.detailText}>{item.cropType}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={14} color={BrandColors.primary} />
            <ThemedText style={styles.detailText}>
              {item.sprayType === 'pesticide' ? t('pesticide') : t('fertilizer')}
            </ThemedText>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterContainer, { marginTop: headerHeight + Spacing.sm }]}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = filter === item.key;
            return (
              <Pressable
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? BrandColors.primary : theme.backgroundDefault,
                    borderColor: isActive ? BrandColors.primary : theme.border,
                  },
                ]}
                onPress={() => setFilter(item.key)}
              >
                <ThemedText
                  style={[
                    styles.filterText,
                    { color: isActive ? BrandColors.white : theme.text },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        renderItem={renderBooking}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Feather name="archive" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noHistory')}
            </ThemedText>
          </Card>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    ...Typography.small,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    ...Typography.bodyBold,
  },
  dateMonth: {
    ...Typography.caption,
    textTransform: 'uppercase',
  },
  historyInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  historyName: {
    ...Typography.bodyBold,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  historyLocation: {
    ...Typography.caption,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    ...Typography.bodyBold,
    color: BrandColors.success,
  },
  historyAcres: {
    ...Typography.caption,
    marginTop: 2,
  },
  historyDetails: {
    flexDirection: 'row',
    paddingTop: Spacing.md,
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.lg,
  },
});
