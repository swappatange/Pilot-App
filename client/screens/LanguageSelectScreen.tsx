import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { Language, languages } from '@/constants/translations';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface LanguageSelectScreenProps {
  onContinue: () => void;
}

export default function LanguageSelectScreen({ onContinue }: LanguageSelectScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { language, setLanguage, t } = useApp();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <ThemedView style={styles.container}>
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

        <View style={styles.grid}>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={({ pressed }) => [
                  styles.languageCard,
                  {
                    backgroundColor: isSelected ? BrandColors.primary + '15' : theme.cardBackground,
                    borderColor: isSelected ? BrandColors.primary : theme.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <ThemedText style={styles.nativeName}>{lang.nativeName}</ThemedText>
                <ThemedText style={[styles.englishName, { color: theme.textSecondary }]}>
                  {lang.name}
                </ThemedText>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Feather name="check" size={16} color={BrandColors.white} />
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
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Button title={t('continue')} onPress={onContinue} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
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
  },
  englishName: {
    ...Typography.small,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BrandColors.primary,
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
