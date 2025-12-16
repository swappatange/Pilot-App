import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface PhoneInputScreenProps {
  onSendOtp: (phone: string) => void;
}

export default function PhoneInputScreen({ onSendOtp }: PhoneInputScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useApp();
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }
    onSendOtp(phone);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing['4xl'],
            paddingBottom: insets.bottom + Spacing['3xl'],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@assets/images/atomik-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ThemedText style={styles.title}>{t('welcome')}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('enterPhone')}
        </ThemedText>

        <View style={styles.inputContainer}>
          <View
            style={[
              styles.countryCode,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText style={styles.countryCodeText}>+91</ThemedText>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: isFocused ? BrandColors.primary : theme.border,
                color: theme.text,
              },
            ]}
            placeholder={t('phoneNumber')}
            placeholderTextColor={theme.textSecondary}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        <Button
          title={t('sendOtp')}
          onPress={handleSendOtp}
          disabled={phone.length !== 10}
          style={styles.button}
        />

        <View style={styles.legalContainer}>
          <ThemedText style={[styles.legalText, { color: theme.textSecondary }]}>
            By continuing, you agree to our{' '}
          </ThemedText>
          <Pressable>
            <ThemedText style={[styles.legalLink, { color: BrandColors.primary }]}>
              {t('termsOfService')}
            </ThemedText>
          </Pressable>
          <ThemedText style={[styles.legalText, { color: theme.textSecondary }]}> and </ThemedText>
          <Pressable>
            <ThemedText style={[styles.legalLink, { color: BrandColors.primary }]}>
              {t('privacyPolicy')}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logo: {
    width: 200,
    height: 120,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  countryCode: {
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
  },
  countryCodeText: {
    ...Typography.body,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    ...Typography.body,
  },
  button: {
    marginBottom: Spacing['3xl'],
  },
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  legalText: {
    ...Typography.caption,
  },
  legalLink: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
