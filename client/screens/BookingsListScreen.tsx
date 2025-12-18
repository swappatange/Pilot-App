import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { BookingCard } from '@/components/BookingCard';
import { useTheme } from '@/hooks/useTheme';
import { useApp, BookingStatus } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

type TabType = 'pending' | 'active' | 'completed' | 'cancelled';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BookingsList'>;
}

export default function BookingsListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, getBookingsByStatus } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const tabs: { key: TabType; label: string; statuses: BookingStatus[] }[] = [
    { key: 'pending', label: t('pending'), statuses: ['pending'] },
    { key: 'active', label: t('active'), statuses: ['active', 'in_progress'] },
    { key: 'completed', label: t('completed'), statuses: ['completed'] },
    { key: 'cancelled', label: t('cancelled'), statuses: ['cancelled'] },
  ];

  const bookings = getBookingsByStatus(tabs.find(tab => tab.key === activeTab)?.statuses || []);

  return (
    <GradientBackground>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: insets.top + Spacing.lg }}
        contentContainerStyle={styles.tabsContainer}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? BrandColors.primary : 'transparent',
                  borderColor: isActive ? BrandColors.primary : theme.border,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: isActive ? BrandColors.white : theme.text },
                ]}
              >
                {tab.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}
            showActions={activeTab !== 'completed' && activeTab !== 'cancelled'}
          />
        )}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Feather
              name={activeTab === 'completed' || activeTab === 'cancelled' ? 'archive' : 'inbox'}
              size={48}
              color={theme.textSecondary}
            />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t('noBookings')}
            </ThemedText>
          </Card>
        }
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 90,
  },
  tabText: {
    ...Typography.small,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
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
