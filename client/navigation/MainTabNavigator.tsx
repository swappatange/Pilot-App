import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import HomeStackNavigator from '@/navigation/HomeStackNavigator';
import CalendarStackNavigator from '@/navigation/CalendarStackNavigator';
import ProfileStackNavigator from '@/navigation/ProfileStackNavigator';
import EarningsScreen from '@/screens/EarningsScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors } from '@/constants/theme';

export type MainTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  EarningsTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface MainTabNavigatorProps {
  onLogout: () => void;
}

export default function MainTabNavigator({ onLogout }: MainTabNavigatorProps) {
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
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{
          headerShown: false,
          title: t('bookings'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EarningsTab"
        component={EarningsScreen}
        options={{
          headerShown: false,
          title: t('earnings'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="rupee-sign" size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{
          headerShown: false,
          title: t('history'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        options={{
          headerShown: false,
          title: t('profile'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      >
        {() => <ProfileStackNavigator onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
