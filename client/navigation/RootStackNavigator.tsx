import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import SplashScreen from '@/screens/SplashScreen';
import LanguageSelectScreen from '@/screens/LanguageSelectScreen';
import PhoneInputScreen from '@/screens/PhoneInputScreen';
import OtpVerifyScreen from '@/screens/OtpVerifyScreen';
import { useScreenOptions } from '@/hooks/useScreenOptions';
import { useApp } from '@/context/AppContext';

export type RootStackParamList = {
  Splash: undefined;
  LanguageSelect: undefined;
  PhoneInput: undefined;
  OtpVerify: { phone: string };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isAuthenticated, logout } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [phoneForOtp, setPhoneForOtp] = useState('');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLanguageContinue = () => {
    setHasSelectedLanguage(true);
  };

  const handleSendOtp = (phone: string) => {
    setPhoneForOtp(phone);
  };

  const handleOtpVerified = () => {
    setPhoneForOtp('');
  };

  const handleLogout = () => {
    logout();
    setHasSelectedLanguage(false);
    setPhoneForOtp('');
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!hasSelectedLanguage && !isAuthenticated) {
    return <LanguageSelectScreen onContinue={handleLanguageContinue} />;
  }

  if (!isAuthenticated && !phoneForOtp) {
    return <PhoneInputScreen onSendOtp={handleSendOtp} />;
  }

  if (!isAuthenticated && phoneForOtp) {
    return (
      <OtpVerifyScreen
        phone={phoneForOtp}
        onBack={() => setPhoneForOtp('')}
        onVerify={handleOtpVerified}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
      <Stack.Screen name="Main">
        {() => <MainTabNavigator onLogout={handleLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
