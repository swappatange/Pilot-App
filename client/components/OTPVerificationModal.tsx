import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface OTPVerificationModalProps {
  visible: boolean;
  farmerPhone: string;
  onVerify: (otp: string) => void;
  onCancel: () => void;
}

export default function OTPVerificationModal({
  visible,
  farmerPhone,
  onVerify,
  onCancel,
}: OTPVerificationModalProps) {
  const { theme } = useTheme();
  const { t } = useApp();
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      // Generate a random 6-digit OTP
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);
      setOtp('');
      setError('');
      console.log(`OTP for farmer ${farmerPhone}: ${newOTP}`);
    }
  }, [visible, farmerPhone]);

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError(t('enterOtpError'));
      return;
    }

    if (otp === generatedOTP) {
      setIsLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsLoading(false);
        onVerify(otp);
      }, 500);
    } else {
      setError(t('invalidOtp'));
    }
  };

  const maskedPhone = `${farmerPhone.slice(0, -4)}****`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={styles.title}>{t('verifyOtp')}</ThemedText>

          <View style={styles.content}>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {t('enterOtp')} {maskedPhone}
            </ThemedText>

            <TextInput
              style={[
                styles.otpInput,
                {
                  borderColor: error ? BrandColors.dangerText : theme.border,
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                },
              ]}
              placeholder="000000"
              placeholderTextColor={theme.textSecondary}
              value={otp}
              onChangeText={(text) => {
                setOtp(text.replace(/[^0-9]/g, '').slice(0, 6));
                setError('');
              }}
              maxLength={6}
              keyboardType="numeric"
              editable={!isLoading}
            />

            {error && (
              <ThemedText style={[styles.errorText, { color: BrandColors.dangerText }]}>
                {error}
              </ThemedText>
            )}

            <ThemedText style={[styles.helperText, { color: theme.textSecondary }]}>
              {t('otpSentToFarmer')}
            </ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={t('cancel')}
              onPress={onCancel}
              variant="outline"
              disabled={isLoading}
              style={styles.button}
            />
            {isLoading ? (
              <View style={[styles.button, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="small" color={BrandColors.white} />
              </View>
            ) : (
              <Button
                title={t('verify')}
                onPress={handleVerify}
                disabled={otp.length !== 6}
                style={styles.button}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    ...Typography.h4,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  content: {
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.small,
    marginBottom: Spacing.lg,
  },
  otpInput: {
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.small,
    marginBottom: Spacing.md,
  },
  helperText: {
    ...Typography.caption,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
