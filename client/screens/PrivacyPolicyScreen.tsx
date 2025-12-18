import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { Spacing, Typography } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useApp();

  const sections = [
    { titleKey: 'privacyTitle1', contentKey: 'privacyContent1' },
    { titleKey: 'privacyTitle2', contentKey: 'privacyContent2' },
    { titleKey: 'privacyTitle3', contentKey: 'privacyContent3' },
    { titleKey: 'privacyTitle4', contentKey: 'privacyContent4' },
    { titleKey: 'privacyTitle5', contentKey: 'privacyContent5' },
    { titleKey: 'privacyTitle6', contentKey: 'privacyContent6' },
    { titleKey: 'privacyTitle7', contentKey: 'privacyContent7' },
    { titleKey: 'privacyTitle8', contentKey: 'privacyContent8' },
    { titleKey: 'privacyTitle9', contentKey: 'privacyContent9' },
    { titleKey: 'privacyTitle10', contentKey: 'privacyContent10' },
  ];

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.lastUpdated}>{t('lastUpdated')}</ThemedText>

        <Card style={styles.introCard}>
          <ThemedText style={[styles.introText, { color: theme.textSecondary }]}>
            {t('privacyIntro')}
          </ThemedText>
        </Card>

        {sections.map((section, index) => (
          <Card key={index} style={styles.sectionCard}>
            <ThemedText style={styles.sectionTitle}>{t(section.titleKey)}</ThemedText>
            <ThemedText style={[styles.sectionContent, { color: theme.textSecondary }]}>
              {t(section.contentKey)}
            </ThemedText>
          </Card>
        ))}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  lastUpdated: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  introCard: {
    marginBottom: Spacing.lg,
  },
  introText: {
    ...Typography.body,
    lineHeight: 22,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    ...Typography.body,
    lineHeight: 22,
  },
});
