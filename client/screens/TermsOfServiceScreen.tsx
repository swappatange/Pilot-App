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

export default function TermsOfServiceScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useApp();

  const sections = [
    { titleKey: 'tosTitle1', contentKey: 'tosContent1' },
    { titleKey: 'tosTitle2', contentKey: 'tosContent2' },
    { titleKey: 'tosTitle3', contentKey: 'tosContent3' },
    { titleKey: 'tosTitle4', contentKey: 'tosContent4' },
    { titleKey: 'tosTitle5', contentKey: 'tosContent5' },
    { titleKey: 'tosTitle6', contentKey: 'tosContent6' },
    { titleKey: 'tosTitle7', contentKey: 'tosContent7' },
    { titleKey: 'tosTitle8', contentKey: 'tosContent8' },
    { titleKey: 'tosTitle9', contentKey: 'tosContent9' },
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
