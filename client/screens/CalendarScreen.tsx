import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp, Booking, BookingStatus } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

type FilterType = 'accepted' | 'all';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, bookings } = useApp();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(today));
  const [routeFilter, setRouteFilter] = useState<FilterType>('accepted');

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      if (!map[booking.scheduledDate]) {
        map[booking.scheduledDate] = [];
      }
      map[booking.scheduledDate].push(booking);
    });
    return map;
  }, [bookings]);

  const selectedBookings = useMemo(() => {
    return bookingsByDate[selectedDate] || [];
  }, [bookingsByDate, selectedDate]);

  const todayBookings = useMemo(() => {
    const todayStr = formatDate(today);
    const todayList = bookingsByDate[todayStr] || [];
    if (routeFilter === 'accepted') {
      return todayList.filter((b) => b.status === 'active' || b.status === 'in_progress');
    }
    return todayList.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  }, [bookingsByDate, routeFilter]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return BrandColors.primary;
      case 'pending':
        return BrandColors.warning;
      case 'completed':
        return BrandColors.success;
      case 'cancelled':
        return BrandColors.danger;
      default:
        return BrandColors.gray500;
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'active':
        return t('active');
      case 'in_progress':
        return t('inProgress');
      case 'pending':
        return t('pending');
      case 'completed':
        return t('completed');
      case 'cancelled':
        return t('cancel');
      default:
        return status;
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const todayStr = formatDate(today);

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = formatDate(date);
      const hasBookings = bookingsByDate[dateStr]?.length > 0;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push(
        <Pressable
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => setSelectedDate(dateStr)}
        >
          <ThemedText
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </ThemedText>
          {hasBookings ? (
            <View style={styles.bookingDots}>
              {bookingsByDate[dateStr].slice(0, 3).map((b, i) => (
                <View
                  key={i}
                  style={[styles.bookingDot, { backgroundColor: getStatusColor(b.status) }]}
                />
              ))}
            </View>
          ) : null}
        </Pressable>
      );
    }

    return days;
  };

  const renderBookingItem = (booking: Booking) => (
    <Card key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <ThemedText style={styles.farmerName}>{booking.farmerName}</ThemedText>
          <ThemedText style={[styles.bookingTime, { color: theme.textSecondary }]}>
            {booking.scheduledTime}
          </ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {getStatusLabel(booking.status)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
            {booking.village}, {booking.district}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <Feather name="maximize-2" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
            {booking.acreage} {t('acres')} - {booking.cropType}
          </ThemedText>
        </View>
      </View>
    </Card>
  );

  const renderRouteItem = ({ item, index }: { item: Booking; index: number }) => (
    <Card style={styles.routeCard}>
      <View style={styles.routeNumber}>
        <ThemedText style={styles.routeNumberText}>{index + 1}</ThemedText>
      </View>
      <View style={styles.routeContent}>
        <ThemedText style={styles.routeFarmer}>{item.farmerName}</ThemedText>
        <ThemedText style={[styles.routeLocation, { color: theme.textSecondary }]}>
          {item.village}, {item.district}
        </ThemedText>
        <View style={styles.routeMeta}>
          <ThemedText style={[styles.routeTime, { color: BrandColors.primary }]}>
            {item.scheduledTime}
          </ThemedText>
          <ThemedText style={[styles.routeAcres, { color: theme.textSecondary }]}>
            {item.acreage} {t('acres')}
          </ThemedText>
        </View>
      </View>
      <View style={[styles.routeStatus, { backgroundColor: getStatusColor(item.status) }]}>
        <Feather
          name={item.status === 'active' || item.status === 'in_progress' ? 'check' : 'clock'}
          size={14}
          color={BrandColors.white}
        />
      </View>
    </Card>
  );

  return (
    <GradientBackground>
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
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable onPress={previousMonth} style={styles.navButton}>
              <Feather name="chevron-left" size={24} color={BrandColors.white} />
            </Pressable>
            <ThemedText style={styles.monthTitle}>
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </ThemedText>
            <Pressable onPress={nextMonth} style={styles.navButton}>
              <Feather name="chevron-right" size={24} color={BrandColors.white} />
            </Pressable>
          </View>

          <View style={styles.weekDays}>
            {DAYS.map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <ThemedText style={[styles.weekDayText, { color: theme.textSecondary }]}>
                  {day}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>{renderCalendarDays()}</View>
        </Card>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('bookingsFor')}</ThemedText>
          <ThemedText style={[styles.selectedDateText, { color: BrandColors.primary }]}>
            {new Date(selectedDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </ThemedText>
        </View>

        {selectedBookings.length > 0 ? (
          selectedBookings.map(renderBookingItem)
        ) : (
          <Card style={styles.emptyCard}>
            <Feather name="calendar" size={32} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noBookingsForDate')}
            </ThemedText>
          </Card>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('routePlanner')}</ThemedText>
        </View>

        <View style={styles.filterRow}>
          <Pressable
            style={[
              styles.filterButton,
              routeFilter === 'accepted' && styles.filterButtonActive,
            ]}
            onPress={() => setRouteFilter('accepted')}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                routeFilter === 'accepted' && styles.filterButtonTextActive,
              ]}
            >
              {t('acceptedOnly')}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              routeFilter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setRouteFilter('all')}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                routeFilter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              {t('allPending')}
            </ThemedText>
          </Pressable>
        </View>

        {todayBookings.length > 0 ? (
          todayBookings.map((item, index) => (
            <View key={item.id}>{renderRouteItem({ item, index })}</View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Feather name="map" size={32} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noRoutesToday')}
            </ThemedText>
          </Card>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  calendarCard: {
    marginBottom: Spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  navButton: {
    padding: Spacing.xs,
  },
  monthTitle: {
    ...Typography.h4,
    color: BrandColors.white,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  selectedDay: {
    backgroundColor: BrandColors.primary,
    borderRadius: BorderRadius.full,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: BrandColors.primary,
    borderRadius: BorderRadius.full,
  },
  dayText: {
    ...Typography.body,
    color: BrandColors.white,
  },
  selectedDayText: {
    fontWeight: '700',
  },
  todayDayText: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
  bookingDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  bookingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: BrandColors.white,
  },
  selectedDateText: {
    ...Typography.body,
    fontWeight: '600',
  },
  bookingCard: {
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bookingInfo: {
    flex: 1,
  },
  farmerName: {
    ...Typography.bodyBold,
    color: BrandColors.white,
  },
  bookingTime: {
    ...Typography.small,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  bookingDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.small,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  filterButtonText: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.7)',
  },
  filterButtonTextActive: {
    color: BrandColors.white,
    fontWeight: '600',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
  },
  routeNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  routeNumberText: {
    ...Typography.bodyBold,
    color: BrandColors.white,
    fontSize: 14,
  },
  routeContent: {
    flex: 1,
  },
  routeFarmer: {
    ...Typography.bodyBold,
    color: BrandColors.white,
  },
  routeLocation: {
    ...Typography.small,
    marginTop: 2,
  },
  routeMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  routeTime: {
    ...Typography.small,
    fontWeight: '600',
  },
  routeAcres: {
    ...Typography.small,
  },
  routeStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.md,
  },
});
