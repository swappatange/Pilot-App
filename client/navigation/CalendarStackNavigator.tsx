import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '@/screens/CalendarScreen';
import BookingDetailScreen from '@/screens/BookingDetailScreen';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';

export type CalendarStackParamList = {
  CalendarMain: undefined;
  BookingDetail: { bookingId: string };
};

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export default function CalendarStackNavigator() {
  const { theme, isDark } = useTheme();
  const { t } = useApp();

  const headerConfig = Platform.select({
    ios: {
      headerTransparent: true,
      headerBlurEffect: isDark ? 'dark' : 'light',
    } as const,
    android: {
      headerStyle: {
        backgroundColor: theme.backgroundRoot,
      },
    },
    default: {},
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.text,
        ...headerConfig,
      }}
    >
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{
          headerTitle: t('bookings'),
        }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{
          headerTitle: t('bookingDetails'),
        }}
      />
    </Stack.Navigator>
  );
}
