import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@/screens/ProfileScreen';
import HelpCenterScreen from '@/screens/HelpCenterScreen';
import ContactSupportScreen from '@/screens/ContactSupportScreen';
import TermsOfServiceScreen from '@/screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from '@/screens/PrivacyPolicyScreen';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors } from '@/constants/theme';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  HelpCenter: undefined;
  ContactSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

interface ProfileStackNavigatorProps {
  onLogout: () => void;
}

export default function ProfileStackNavigator({ onLogout }: ProfileStackNavigatorProps) {
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
        headerTintColor: BrandColors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        ...headerConfig,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        options={{
          headerShown: false,
        }}
      >
        {() => <ProfileScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
