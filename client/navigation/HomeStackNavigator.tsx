import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { useApp } from '@/context/AppContext';

import DashboardScreen from '@/screens/DashboardScreen';
import BookingsListScreen from '@/screens/BookingsListScreen';
import BookingDetailScreen from '@/screens/BookingDetailScreen';
import { AtomikHeaderTitle } from '@/components/HeaderTitle';

export type HomeStackParamList = {
  Home: undefined;
  BookingsList: undefined;
  BookingDetail: { bookingId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useApp();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          headerTitle: () => <AtomikHeaderTitle />,
        }}
      />
      <Stack.Screen
        name="BookingsList"
        component={BookingsListScreen}
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
