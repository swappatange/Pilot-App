import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Button } from '@/components/Button';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface OtpVerifyScreenProps {
  phone: string;
  onBack: () => void;
  onVerify: () => void;
}

export default function OtpVerifyScreen({ phone, onBack, onVerify }: OtpVerifyScreenProps) {
  const insets = useSafeAreaInsets();
  const { t, login } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }
    login(`+91 ${phone}`);
    onVerify();
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone');
  };

  const maskedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <GradientBackground>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={onBack}
        >
          <Feather name="arrow-left" size={24} color={BrandColors.white} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{t('verifyOtp')}</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing['3xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.subtitle}>
          {t('enterOtp')}
        </ThemedText>
        <ThemedText style={styles.phone}>{maskedPhone}</ThemedText>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                {
                  borderColor: focusedIndex === index ? BrandColors.white : 'rgba(255,255,255,0.5)',
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <ThemedText style={styles.resendText}>
              {t('resendIn')} {countdown}s
            </ThemedText>
          ) : (
            <Pressable onPress={handleResend}>
              <ThemedText style={styles.resendLink}>
                {t('resendOtp')}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <Button
          title={t('verify')}
          onPress={handleVerify}
          disabled={!isOtpComplete}
          style={styles.button}
        />
      </KeyboardAwareScrollViewCompat>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h4,
    flex: 1,
    textAlign: 'center',
    color: BrandColors.white,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    flexGrow: 1,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
  },
  phone: {
    ...Typography.bodyBold,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing['3xl'],
    color: BrandColors.white,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: BrandColors.white,
    ...Typography.h3,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  resendText: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.7)',
  },
  resendLink: {
    ...Typography.body,
    fontWeight: '600',
    color: BrandColors.white,
  },
  button: {
    marginTop: 'auto',
  },
});
