import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { BookingCard } from '@/components/BookingCard';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { languages, Language } from '@/constants/translations';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/HomeStackNavigator';

interface Props {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  location: string;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return 'sun';
  if (code <= 3) return 'cloud';
  if (code <= 49) return 'cloud';
  if (code <= 69) return 'cloud-rain';
  if (code <= 79) return 'cloud-snow';
  if (code <= 99) return 'cloud-lightning';
  return 'cloud';
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 69) return 'Rainy';
  if (code <= 79) return 'Snowy';
  if (code <= 99) return 'Stormy';
  return 'Unknown';
};

export default function DashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, operator, language, setLanguage, getBookingsByStatus, getTodayBookings, getEarnings } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLanguage = languages.find((l) => l.code === language);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  };

  const activeBookings = getBookingsByStatus(['pending', 'active', 'in_progress']);
  const todayBookings = getTodayBookings();
  const todayEarnings = getEarnings('today');

  const pendingCount = getBookingsByStatus('pending').length;
  const activeCount = getBookingsByStatus(['active', 'in_progress']).length;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (Platform.OS === 'web') {
          const mockWeather: WeatherData = {
            temperature: 28,
            humidity: 65,
            windSpeed: 12,
            weatherCode: 1,
            location: 'Current Location',
          };
          setWeather(mockWeather);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );
        const data = await response.json();

        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: data.current.weather_code,
            location: 'Current Location',
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLocationError('Unable to fetch weather');
      }
    };

    fetchWeather();
  }, []);

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          {weather ? (
            <Card style={styles.weatherCard}>
              <View style={styles.weatherMain}>
                <View style={styles.weatherLeft}>
                  <Feather
                    name={getWeatherIcon(weather.weatherCode) as any}
                    size={32}
                    color={BrandColors.white}
                  />
                  <View style={styles.weatherTemp}>
                    <ThemedText style={styles.temperature}>{weather.temperature}°C</ThemedText>
                    <ThemedText style={[styles.weatherDesc, { color: theme.textSecondary }]}>
                      {getWeatherDescription(weather.weatherCode)}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Feather name="droplet" size={12} color={BrandColors.white} />
                    <ThemedText style={styles.weatherDetailText}>{weather.humidity}%</ThemedText>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Feather name="wind" size={12} color={BrandColors.white} />
                    <ThemedText style={styles.weatherDetailText}>{weather.windSpeed} km/h</ThemedText>
                  </View>
                </View>
              </View>
            </Card>
          ) : locationError ? (
            <Card style={styles.weatherCard}>
              <View style={styles.weatherError}>
                <Feather name="cloud-off" size={20} color={theme.textSecondary} />
                <ThemedText style={[styles.weatherErrorText, { color: theme.textSecondary }]}>
                  {locationError}
                </ThemedText>
              </View>
            </Card>
          ) : (
            <View style={styles.weatherCard} />
          )}

          <Pressable
            style={[styles.languageSelector, { backgroundColor: theme.backgroundSecondary }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <Feather name="globe" size={18} color={BrandColors.primary} />
            <ThemedText style={styles.languageText}>{currentLanguage?.nativeName || 'EN'}</ThemedText>
            <Feather name="chevron-down" size={14} color={theme.textSecondary} />
          </Pressable>
        </View>

        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowLanguageModal(false)}
          >
            <View style={[styles.languageModal, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText style={styles.modalTitle}>{t('selectLanguage')}</ThemedText>
              {languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <ThemedText
                    style={[
                      styles.languageOptionText,
                      language === lang.code && styles.languageOptionTextActive,
                    ]}
                  >
                    {lang.nativeName}
                  </ThemedText>
                  {language === lang.code ? (
                    <Feather name="check" size={18} color={BrandColors.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        <Card style={styles.pilotInfoCard}>
          <View style={styles.pilotInfoHeader}>
            <View style={styles.pilotAvatar}>
              <Feather name="user" size={24} color={BrandColors.white} />
            </View>
            <View style={styles.pilotDetails}>
              <ThemedText style={styles.pilotName}>{operator?.name || 'Pilot'}</ThemedText>
              <View style={styles.pilotInfoRow}>
                <Feather name="map-pin" size={12} color={theme.textSecondary} />
                <ThemedText style={[styles.pilotInfoText, { color: theme.textSecondary }]}>
                  {operator?.address || t('homeLocation')}
                </ThemedText>
              </View>
              <View style={styles.pilotInfoRow}>
                <Feather name="airplay" size={12} color={theme.textSecondary} />
                <ThemedText style={[styles.pilotInfoText, { color: theme.textSecondary }]}>
                  {operator?.droneModel || t('droneModel')}
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="calendar" size={18} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{pendingCount + activeCount}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('activeBookings')}
            </ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="droplet" size={18} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{todayEarnings.count}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('spraysToday')}
            </ThemedText>
          </Card>

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="map" size={18} color={BrandColors.white} />
            </View>
            <ThemedText style={styles.statValue}>{todayEarnings.acres}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t('acresCovered')}
            </ThemedText>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{t('activeBookings')}</ThemedText>
          <Pressable onPress={() => navigation.navigate('BookingsList')}>
            <ThemedText style={[styles.viewAll, { color: BrandColors.white }]}>
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
            <Feather name="check-circle" size={48} color={BrandColors.white} />
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  weatherCard: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  languageText: {
    ...Typography.small,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  languageModal: {
    width: '100%',
    maxWidth: 300,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  languageOptionActive: {
    backgroundColor: `${BrandColors.primary}20`,
  },
  languageOptionText: {
    ...Typography.body,
  },
  languageOptionTextActive: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  weatherTemp: {
    gap: 2,
  },
  temperature: {
    ...Typography.h2,
    color: BrandColors.white,
  },
  weatherDesc: {
    ...Typography.small,
  },
  weatherDetails: {
    gap: Spacing.sm,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weatherDetailText: {
    ...Typography.small,
    color: BrandColors.white,
  },
  weatherError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  weatherErrorText: {
    ...Typography.small,
  },
  pilotInfoCard: {
    marginBottom: Spacing.md,
  },
  pilotInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pilotAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pilotDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
  pilotName: {
    ...Typography.h3,
    color: BrandColors.white,
  },
  pilotInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pilotInfoText: {
    ...Typography.small,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.h3,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    textAlign: 'center',
    fontSize: 11,
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
