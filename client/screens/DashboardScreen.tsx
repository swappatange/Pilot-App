import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { BookingCard } from '@/components/BookingCard';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
}

export default function DashboardScreen({ navigation }: Props) {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, operator, getBookingsByStatus, getTodayBookings, getEarnings } = useApp();

  const activeBookings = getBookingsByStatus(['pending', 'active', 'in_progress']);
  const todayBookings = getTodayBookings();
  const todayEarnings = getEarnings('today');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const pendingCount = getBookingsByStatus('pending').length;
  const activeCount = getBookingsByStatus(['active', 'in_progress']).length;

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
        <Card style={styles.greetingCard}>
          <ThemedText style={[styles.greeting, { color: theme.textSecondary }]}>
            {getGreeting()},
          </ThemedText>
          <ThemedText style={styles.operatorName}>{operator?.name || 'Pilot'}</ThemedText>
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <Card style={[styles.statCard, { backgroundColor: BrandColors.primary + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: BrandColors.primary }]}>
              <Feather name="calendar" size={20} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{pendingCount + activeCount}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('activeBookings')}
            </ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: BrandColors.accent + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: BrandColors.accent }]}>
              <Feather name="droplet" size={20} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{todayEarnings.count}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('spraysToday')}
            </ThemedText>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: BrandColors.primaryDark + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: BrandColors.primaryDark }]}>
              <Feather name="map" size={20} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{todayEarnings.acres}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('acresCovered')}
            </ThemedText>
          </Card>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('activeBookings')}</ThemedText>
          <Pressable onPress={() => navigation.navigate('BookingsList')}>
            <ThemedText style={[styles.viewAll, { color: BrandColors.primary }]}>
              {t('viewAll')}
            </ThemedText>
          </Pressable>
        </View>

        {activeBookings.length > 0 ? (
          activeBookings.slice(0, 3).map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Feather name="check-circle" size={48} color={BrandColors.primary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noActiveBookings')}
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              {t('allCaughtUp')}
            </ThemedText>
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('todaySchedule')}</ThemedText>
        </View>

        {todayBookings.length > 0 ? (
          todayBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
              compact
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Feather name="calendar" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noScheduleToday')}
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
  greetingCard: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.body,
  },
  operatorName: {
    ...Typography.h3,
    marginTop: Spacing.xs,
  },
  statsContainer: {
    paddingRight: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    width: 140,
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
    ...Typography.stats,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
  },
  viewAll: {
    ...Typography.body,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    ...Typography.small,
    marginTop: Spacing.xs,
  },
});
