import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, Typography } from '@/constants/theme';

export default function HelpCenterScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useApp();

  const helpTopics = [
    {
      icon: 'play-circle',
      titleKey: 'gettingStarted',
      contentKey: 'gettingStartedContent',
    },
    {
      icon: 'calendar',
      titleKey: 'managingBookings',
      contentKey: 'managingBookingsContent',
    },
    {
      icon: 'map-pin',
      titleKey: 'routePlanningHelp',
      contentKey: 'routePlanningContent',
    },
    {
      icon: 'dollar-sign',
      titleKey: 'earningsPayments',
      contentKey: 'earningsPaymentsContent',
    },
    {
      icon: 'cloud',
      titleKey: 'weatherHelp',
      contentKey: 'weatherHelpContent',
    },
    {
      icon: 'clock',
      titleKey: 'bookingHistoryHelp',
      contentKey: 'bookingHistoryContent',
    },
  ];

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.headerText}>
          {t('helpCenterIntro')}
        </ThemedText>

        {helpTopics.map((topic, index) => (
          <Card key={index} style={styles.topicCard}>
            <View style={styles.topicHeader}>
              <View style={styles.iconCircle}>
                <Feather name={topic.icon as any} size={20} color={BrandColors.primary} />
              </View>
              <ThemedText style={styles.topicTitle}>{t(topic.titleKey)}</ThemedText>
            </View>
            <ThemedText style={[styles.topicContent, { color: theme.textSecondary }]}>
              {t(topic.contentKey)}
            </ThemedText>
          </Card>
        ))}

        <Card style={styles.contactCard}>
          <Feather name="headphones" size={32} color={BrandColors.primary} />
          <ThemedText style={styles.contactTitle}>{t('stillNeedHelp')}</ThemedText>
          <ThemedText style={[styles.contactText, { color: theme.textSecondary }]}>
            {t('contactSupportPrompt')}
          </ThemedText>
        </Card>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  headerText: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  topicCard: {
    marginBottom: Spacing.md,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  topicTitle: {
    ...Typography.h4,
    flex: 1,
  },
  topicContent: {
    ...Typography.body,
    lineHeight: 22,
  },
  contactCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginTop: Spacing.md,
  },
  contactTitle: {
    ...Typography.h4,
    marginTop: Spacing.md,
  },
  contactText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
