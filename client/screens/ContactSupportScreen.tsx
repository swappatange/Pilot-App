import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { BrandColors, Spacing, Typography } from '@/constants/theme';

export default function ContactSupportScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useApp();

  const contactOptions = [
    {
      icon: 'phone',
      titleKey: 'callSupport',
      subtitleKey: 'availableHours',
      value: '+91 1800 123 4567',
      action: 'tel:+911800123456',
    },
    {
      icon: 'message-circle',
      titleKey: 'whatsAppChat',
      subtitleKey: 'quickResponsesChat',
      value: '+91 98765 43210',
      action: 'https://wa.me/919876543210',
    },
    {
      icon: 'mail',
      titleKey: 'emailSupport',
      subtitleKey: 'responseTime',
      value: 'support@atomik.farm',
      action: 'mailto:support@atomik.farm',
    },
  ];

  const quickLinks = [
    { icon: 'file-text', labelKey: 'reportBug', descKey: 'reportBugDesc' },
    { icon: 'star', labelKey: 'featureRequest', descKey: 'featureRequestDesc' },
    { icon: 'alert-circle', labelKey: 'droneEmergency', descKey: 'droneEmergencyDesc' },
    { icon: 'dollar-sign', labelKey: 'paymentIssues', descKey: 'paymentIssuesDesc' },
  ];

  const handleContact = async (action: string) => {
    try {
      await Linking.openURL(action);
    } catch (error) {
      console.error('Could not open link:', error);
    }
  };

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
        <Card style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Feather name="headphones" size={40} color={BrandColors.white} />
          </View>
          <ThemedText style={styles.headerTitle}>{t('wereHereToHelp')}</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {t('reachOutToSupport')}
          </ThemedText>
        </Card>

        {contactOptions.map((option, index) => (
          <Pressable key={index} onPress={() => handleContact(option.action)}>
            <Card style={styles.contactCard}>
              <View style={styles.contactIconCircle}>
                <Feather name={option.icon as any} size={24} color={BrandColors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactTitle}>{t(option.titleKey)}</ThemedText>
                <ThemedText style={[styles.contactSubtitle, { color: theme.textSecondary }]}>
                  {t(option.subtitleKey)}
                </ThemedText>
                <ThemedText style={styles.contactValue}>{option.value}</ThemedText>
              </View>
              <Feather name="chevron-right" size={20} color={BrandColors.white} />
            </Card>
          </Pressable>
        ))}

        <ThemedText style={styles.sectionTitle}>{t('quickLinks')}</ThemedText>

        <Card style={styles.linksCard}>
          {quickLinks.map((link, index) => (
            <Pressable
              key={index}
              style={[
                styles.linkRow,
                index < quickLinks.length - 1 && styles.linkBorder,
              ]}
            >
              <View style={styles.linkIconCircle}>
                <Feather name={link.icon as any} size={18} color={BrandColors.primary} />
              </View>
              <View style={styles.linkContent}>
                <ThemedText style={styles.linkLabel}>{t(link.labelKey)}</ThemedText>
                <ThemedText style={[styles.linkDescription, { color: theme.textSecondary }]}>
                  {t(link.descKey)}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </Pressable>
          ))}
        </Card>

        <Card style={styles.hoursCard}>
          <Feather name="clock" size={20} color={BrandColors.primary} />
          <View style={styles.hoursContent}>
            <ThemedText style={styles.hoursTitle}>{t('supportHours')}</ThemedText>
            <ThemedText style={[styles.hoursText, { color: theme.textSecondary }]}>
              {t('mondayToSaturday')}
            </ThemedText>
            <ThemedText style={[styles.hoursText, { color: theme.textSecondary }]}>
              {t('sundayEmergencyOnly')}
            </ThemedText>
          </View>
        </Card>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
  },
  headerSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contactIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.bodyBold,
  },
  contactSubtitle: {
    ...Typography.small,
  },
  contactValue: {
    ...Typography.body,
    color: BrandColors.primary,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.h4,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  linksCard: {
    paddingVertical: 0,
    marginBottom: Spacing.lg,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  linkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  linkIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  linkContent: {
    flex: 1,
  },
  linkLabel: {
    ...Typography.body,
  },
  linkDescription: {
    ...Typography.small,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  hoursContent: {
    flex: 1,
  },
  hoursTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.xs,
  },
  hoursText: {
    ...Typography.small,
  },
});
