import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandColors, Typography, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useApp();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
    textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 400 });
      textOpacity.value = withTiming(0, { duration: 400 });
      setTimeout(onComplete, 400);
    }, 4600);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[BrandColors.gradientTop, BrandColors.gradientMiddle, BrandColors.gradientBottom]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('@assets/images/atomik-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.tagline, textAnimatedStyle]}>
          {t('advancingAgriculture')}
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 280,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    ...Typography.h4,
    color: BrandColors.white,
    marginTop: Spacing.xl,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
