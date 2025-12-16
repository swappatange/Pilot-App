import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Button } from '@/components/Button';
import { Language, languages } from '@/constants/translations';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface LanguageSelectScreenProps {
  onContinue: () => void;
}

export default function LanguageSelectScreen({ onContinue }: LanguageSelectScreenProps) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useApp();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing['3xl'],
            paddingBottom: insets.bottom + Spacing['5xl'] + 60,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>{t('selectLanguage')}</ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your preferred language to continue
        </ThemedText>

        <View style={styles.grid}>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={({ pressed }) => [
                  styles.languageCard,
                  {
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                    borderColor: isSelected ? BrandColors.white : 'rgba(255,255,255,0.3)',
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <ThemedText style={styles.nativeName}>{lang.nativeName}</ThemedText>
                <ThemedText style={styles.englishName}>
                  {lang.name}
                </ThemedText>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Feather name="check" size={16} color="#1A5C6A" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}
      >
        <Button title={t('continue')} onPress={onContinue} />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
    color: BrandColors.white,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Spacing['3xl'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  nativeName: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
    color: BrandColors.white,
  },
  englishName: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BrandColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
