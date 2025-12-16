import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useTheme } from '@/hooks/useTheme';
import { useApp, Booking, BookingStatus } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BookingDetail'>;
  route: RouteProp<HomeStackParamList, 'BookingDetail'>;
}

export default function BookingDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, bookings, updateBookingStatus } = useApp();

  const booking = bookings.find(b => b.id === route.params.bookingId);

  if (!booking) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ThemedText style={{ color: '#fff' }}>Booking not found</ThemedText>
        </View>
      </GradientBackground>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${booking.farmerPhone.replace(/\s/g, '')}`);
  };

  const handleAccept = () => {
    updateBookingStatus(booking.id, 'active');
    Alert.alert('Booking Accepted', 'You have accepted this booking');
  };

  const handleDecline = () => {
    Alert.alert(
      t('confirmDecline'),
      t('declineReason'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          style: 'destructive',
          onPress: () => {
            updateBookingStatus(booking.id, 'cancelled');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleStartSpray = () => {
    updateBookingStatus(booking.id, 'in_progress');
    Alert.alert('Spray Started', 'You have started the spray operation');
  };

  const handleComplete = () => {
    updateBookingStatus(booking.id, 'completed');
    Alert.alert('Spray Completed', 'Booking has been marked as completed');
    navigation.goBack();
  };

  const handleCancel = () => {
    Alert.alert(
      t('confirmCancel'),
      t('cancelReason'),
      [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          style: 'destructive',
          onPress: () => {
            updateBookingStatus(booking.id, 'cancelled');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + (booking.status !== 'completed' && booking.status !== 'cancelled' ? 100 : Spacing.xl) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <StatusBadge status={booking.status} />
        </View>

        <Card style={styles.card}>
          <ThemedText style={styles.cardTitle}>{t('farmerDetails')}</ThemedText>
          <View style={styles.farmerRow}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Feather name="user" size={24} color={BrandColors.white} />
            </View>
            <View style={styles.farmerInfo}>
              <ThemedText style={styles.farmerName}>{booking.farmerName}</ThemedText>
              <ThemedText style={[styles.farmerPhone, { color: theme.textSecondary }]}>
                {booking.farmerPhone}
              </ThemedText>
            </View>
            <Pressable
              style={[styles.callButton, { backgroundColor: BrandColors.primary }]}
              onPress={handleCall}
            >
              <Feather name="phone" size={20} color={BrandColors.white} />
            </Pressable>
          </View>
        </Card>

        <Card style={styles.card}>
          <ThemedText style={styles.cardTitle}>{t('bookingDetails')}</ThemedText>

          <DetailRow icon="map-pin" label={t('location')} value={`${booking.village}, ${booking.district}`} />
          <DetailRow icon="maximize-2" label={t('acreage')} value={`${booking.acreage} ${t('acres')}`} />
          <DetailRow icon="layers" label={t('cropType')} value={booking.cropType} />
          <DetailRow
            icon="droplet"
            label={t('sprayType')}
            value={booking.sprayType === 'pesticide' ? t('pesticide') : t('fertilizer')}
          />
          <DetailRow icon="calendar" label={t('scheduledDate')} value={formatDate(booking.scheduledDate)} />
          <DetailRow icon="clock" label={t('scheduledTime')} value={booking.scheduledTime} />

          {booking.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <ThemedText style={[styles.instructionsLabel, { color: theme.textSecondary }]}>
                {t('specialInstructions')}
              </ThemedText>
              <ThemedText style={styles.instructionsText}>{booking.specialInstructions}</ThemedText>
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <View style={styles.pricingRow}>
            <View>
              <ThemedText style={[styles.pricingLabel, { color: theme.textSecondary }]}>
                {t('totalAmount')}
              </ThemedText>
              <ThemedText style={styles.pricingValue}>
                {'\u20B9'}{booking.amount.toLocaleString('en-IN')}
              </ThemedText>
            </View>
            <View
              style={[
                styles.paymentBadge,
                {
                  backgroundColor:
                    booking.paymentStatus === 'paid'
                      ? BrandColors.successLight
                      : BrandColors.warningLight,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.paymentText,
                  {
                    color:
                      booking.paymentStatus === 'paid'
                        ? BrandColors.successText
                        : BrandColors.warningText,
                  },
                ]}
              >
                {booking.paymentStatus === 'paid' ? t('paid') : t('unpaid')}
              </ThemedText>
            </View>
          </View>
        </Card>
      </ScrollView>

      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
        <View
          style={[
            styles.footer,
            {
              bottom: tabBarHeight,
              backgroundColor: 'rgba(0, 30, 25, 0.95)',
            },
          ]}
        >
          {booking.status === 'pending' && (
            <View style={styles.actionButtons}>
              <Button
                title={t('decline')}
                onPress={handleDecline}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title={t('acceptBooking')}
                onPress={handleAccept}
                style={styles.actionButton}
              />
            </View>
          )}

          {booking.status === 'active' && (
            <View style={styles.actionButtons}>
              <Button
                title={t('cancel')}
                onPress={handleCancel}
                variant="danger"
                style={styles.actionButton}
              />
              <Button
                title={t('startSpray')}
                onPress={handleStartSpray}
                style={styles.actionButton}
              />
            </View>
          )}

          {booking.status === 'in_progress' && (
            <Button title={t('markComplete')} onPress={handleComplete} />
          )}
        </View>
      )}
    </GradientBackground>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.iconContainer}>
        <Feather name={icon as any} size={18} color={BrandColors.white} />
      </View>
      <View style={detailStyles.content}>
        <ThemedText style={[detailStyles.label, { color: theme.textSecondary }]}>{label}</ThemedText>
        <ThemedText style={detailStyles.value}>{value}</ThemedText>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.caption,
    marginBottom: 2,
  },
  value: {
    ...Typography.body,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  statusRow: {
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.lg,
  },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  farmerName: {
    ...Typography.bodyBold,
  },
  farmerPhone: {
    ...Typography.small,
    marginTop: 2,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: BrandColors.warningLight,
    borderRadius: BorderRadius.sm,
  },
  instructionsLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  instructionsText: {
    ...Typography.small,
    color: BrandColors.warningText,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    ...Typography.small,
  },
  pricingValue: {
    ...Typography.h3,
    marginTop: Spacing.xs,
    color: BrandColors.white,
  },
  paymentBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  paymentText: {
    ...Typography.small,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
