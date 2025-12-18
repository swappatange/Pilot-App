import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Linking, Platform, ActivityIndicator } from 'react-native';
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

interface WeatherForecast {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BookingDetail'>;
  route: RouteProp<HomeStackParamList, 'BookingDetail'>;
}

const getWeatherDescription = (code: number, t: (key: string) => string): string => {
  if (code === 0) return t('clear');
  if (code <= 3) return t('cloudy');
  if (code <= 49) return t('foggy');
  if (code <= 69) return t('rainy');
  if (code <= 79) return t('snowy');
  if (code <= 99) return t('stormy');
  return t('unknown');
};

const getWeatherIcon = (code: number): string => {
  if (code === 0) return 'sun';
  if (code <= 3) return 'cloud';
  if (code <= 49) return 'cloud';
  if (code <= 69) return 'cloud-rain';
  if (code <= 79) return 'cloud-snow';
  if (code <= 99) return 'cloud-lightning';
  return 'cloud';
};

const getSprayingCondition = (windSpeed: number, weatherCode: number, t: (key: string) => string): { text: string; color: string } => {
  if (weatherCode > 49) {
    return { text: t('notRecommended'), color: BrandColors.dangerText };
  }
  if (windSpeed > 20) {
    return { text: t('cautionHighWind'), color: BrandColors.warningText };
  }
  return { text: t('idealForSpraying'), color: BrandColors.successText };
};

export default function BookingDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, bookings, updateBookingStatus } = useApp();
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const booking = bookings.find(b => b.id === route.params.bookingId);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!booking) return;

      try {
        setWeatherLoading(true);
        
        if (Platform.OS === 'web') {
          const mockWeather: WeatherForecast = {
            temperature: 28,
            humidity: 55,
            windSpeed: 8,
            weatherCode: 1,
          };
          setWeather(mockWeather);
          setWeatherLoading(false);
          return;
        }

        const scheduledDate = booking.scheduledDate;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${booking.latitude}&longitude=${booking.longitude}&daily=temperature_2m_max,relative_humidity_2m_max,wind_speed_10m_max,weather_code&timezone=auto&start_date=${scheduledDate}&end_date=${scheduledDate}`
        );
        const data = await response.json();

        if (data.daily) {
          setWeather({
            temperature: Math.round(data.daily.temperature_2m_max[0]),
            humidity: data.daily.relative_humidity_2m_max[0],
            windSpeed: Math.round(data.daily.wind_speed_10m_max[0]),
            weatherCode: data.daily.weather_code[0],
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [booking?.id, booking?.scheduledDate]);

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
          { paddingTop: insets.top + Spacing.lg, paddingBottom: tabBarHeight + (booking.status !== 'completed' && booking.status !== 'cancelled' ? 100 : Spacing.xl) },
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
          <DetailRow 
            icon="layers" 
            label={t('cropType')} 
            value={`${booking.cropType} - ${booking.sprayType === 'pesticide' ? t('pesticide') : t('fertilizer')}`}
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
          <ThemedText style={styles.cardTitle}>{t('weatherForecast')}</ThemedText>
          {weatherLoading ? (
            <View style={styles.weatherLoading}>
              <ActivityIndicator color={BrandColors.primary} />
            </View>
          ) : weather ? (
            <>
              <View style={styles.weatherMain}>
                <View style={styles.weatherIconContainer}>
                  <Feather name={getWeatherIcon(weather.weatherCode) as any} size={40} color={BrandColors.white} />
                  <ThemedText style={styles.weatherCondition}>
                    {getWeatherDescription(weather.weatherCode, t)}
                  </ThemedText>
                </View>
                <View style={styles.weatherTemp}>
                  <ThemedText style={styles.temperatureValue}>{weather.temperature}</ThemedText>
                  <ThemedText style={styles.temperatureUnit}>°C</ThemedText>
                </View>
              </View>

              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailItem}>
                  <Feather name="wind" size={18} color={BrandColors.white} />
                  <View style={styles.weatherDetailText}>
                    <ThemedText style={[styles.weatherDetailLabel, { color: theme.textSecondary }]}>
                      {t('windSpeed')}
                    </ThemedText>
                    <ThemedText style={styles.weatherDetailValue}>
                      {weather.windSpeed} {t('kmh')}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.weatherDetailItem}>
                  <Feather name="droplet" size={18} color={BrandColors.white} />
                  <View style={styles.weatherDetailText}>
                    <ThemedText style={[styles.weatherDetailLabel, { color: theme.textSecondary }]}>
                      {t('humidity')}
                    </ThemedText>
                    <ThemedText style={styles.weatherDetailValue}>
                      {weather.humidity}%
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={[
                styles.sprayingCondition,
                { backgroundColor: getSprayingCondition(weather.windSpeed, weather.weatherCode, t).color + '20' }
              ]}>
                <ThemedText style={[
                  styles.sprayingConditionText,
                  { color: getSprayingCondition(weather.windSpeed, weather.weatherCode, t).color }
                ]}>
                  {getSprayingCondition(weather.windSpeed, weather.weatherCode, t).text}
                </ThemedText>
              </View>
            </>
          ) : null}
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
  weatherLoading: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherCondition: {
    ...Typography.small,
    marginTop: Spacing.xs,
    color: BrandColors.white,
  },
  weatherTemp: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: '700',
    color: BrandColors.white,
    lineHeight: 52,
  },
  temperatureUnit: {
    ...Typography.h4,
    color: BrandColors.white,
    marginTop: Spacing.xs,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  weatherDetailText: {
    alignItems: 'flex-start',
  },
  weatherDetailLabel: {
    ...Typography.caption,
  },
  weatherDetailValue: {
    ...Typography.bodyBold,
    color: BrandColors.white,
  },
  sprayingCondition: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  sprayingConditionText: {
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
