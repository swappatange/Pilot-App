import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { GradientBackground } from '@/components/GradientBackground';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/context/AppContext';
import { languages } from '@/constants/translations';
import { BrandColors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { ProfileStackParamList } from '@/navigation/ProfileStackNavigator';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface ProfileScreenProps {
  onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { t, operator, language, setLanguage, updateOperator } = useApp();
  const [showLanguages, setShowLanguages] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newAddress, setNewAddress] = useState(operator?.address || '');

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: onLogout,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('deleteAccount'), t('deleteAccountConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: () => {},
      },
    ]);
  };

  const handleSaveLocation = () => {
    if (newAddress.trim()) {
      updateOperator({ address: newAddress.trim() });
      setShowLocationModal(false);
    }
  };

  const handleEditLocation = () => {
    setNewAddress(operator?.address || '');
    setShowLocationModal(true);
  };

  const currentLanguage = languages.find((l) => l.code === language);

  const sections = [
    {
      title: t('personalDetails'),
      items: [
        { icon: 'user', label: t('name'), value: operator?.name },
        { icon: 'phone', label: t('phoneNumber'), value: operator?.phone },
        { icon: 'mail', label: t('email'), value: operator?.email || '-' },
        { icon: 'map-pin', label: t('homeLocation'), value: operator?.address || '-', editable: true, onEdit: handleEditLocation },
      ],
    },
    {
      title: t('droneDetails'),
      items: [
        { icon: 'box', label: t('droneModel'), value: operator?.droneModel },
        { icon: 'hash', label: t('registration'), value: operator?.droneRegistration },
        { icon: 'award', label: t('license'), value: operator?.licenseNumber },
        { icon: 'shield', label: t('insuranceExpiry'), value: operator?.insuranceExpiry },
      ],
    },
  ];

  const settingsItems = [
    {
      icon: 'globe',
      label: t('language'),
      value: currentLanguage?.nativeName,
      onPress: () => setShowLanguages(!showLanguages),
    },
    { icon: 'bell', label: t('notifications'), value: 'On', onPress: () => {} },
  ];

  const supportLegalItems = [
    { icon: 'help-circle', label: t('helpCenter'), onPress: () => navigation.navigate('HelpCenter') },
    { icon: 'message-circle', label: t('contactSupport'), onPress: () => navigation.navigate('ContactSupport') },
    { icon: 'file-text', label: t('termsOfService'), onPress: () => navigation.navigate('TermsOfService') },
    { icon: 'shield', label: t('privacyPolicy'), onPress: () => navigation.navigate('PrivacyPolicy') },
  ];

  const accountItems = [
    { icon: 'log-out', label: t('logout'), onPress: handleLogout, danger: true },
  ];

  const renderIconCircle = (iconName: string, isDanger: boolean = false) => (
    <View
      style={[
        styles.iconCircle,
        {
          borderColor: isDanger ? BrandColors.danger : BrandColors.primary,
        },
      ]}
    >
      <Feather
        name={iconName as any}
        size={20}
        color={isDanger ? BrandColors.danger : BrandColors.primary}
      />
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: BrandColors.primary }]}>
            <ThemedText style={styles.avatarText}>
              {operator?.name?.charAt(0).toUpperCase() || 'P'}
            </ThemedText>
          </View>
          <ThemedText style={styles.profileName}>{operator?.name}</ThemedText>
          <ThemedText style={[styles.profilePhone, { color: theme.textSecondary }]}>
            {operator?.phone}
          </ThemedText>
          <View style={[styles.licenseBadge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Feather name="award" size={14} color={BrandColors.white} />
            <ThemedText style={[styles.licenseText, { color: BrandColors.white }]}>
              {operator?.licenseNumber}
            </ThemedText>
          </View>
        </Card>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.itemRow,
                    itemIndex < section.items.length - 1 && styles.itemBorder,
                  ]}
                >
                  {renderIconCircle(item.icon)}
                  <View style={styles.itemContent}>
                    <ThemedText style={[styles.itemLabel, { color: theme.textSecondary }]}>
                      {item.label}
                    </ThemedText>
                    <ThemedText style={styles.itemValue}>{item.value}</ThemedText>
                  </View>
                  {item.editable ? (
                    <Pressable
                      style={styles.editButton}
                      onPress={item.onEdit}
                    >
                      <Feather name="edit-2" size={16} color={BrandColors.primary} />
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('settings')}</ThemedText>
          <Card style={styles.sectionCard}>
            {settingsItems.map((item, index) => (
              <React.Fragment key={index}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuRow,
                    index < settingsItems.length - 1 && styles.itemBorder,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={item.onPress}
                >
                  {renderIconCircle(item.icon)}
                  <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
                  <ThemedText style={[styles.menuValue, { color: theme.textSecondary }]}>
                    {item.value}
                  </ThemedText>
                  <Feather name="chevron-right" size={20} color={BrandColors.white} />
                </Pressable>
                {item.label === t('language') && showLanguages && (
                  <View style={styles.languageList}>
                    {languages.map((lang) => (
                      <Pressable
                        key={lang.code}
                        style={[
                          styles.languageItem,
                          language === lang.code && {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                          },
                        ]}
                        onPress={() => {
                          setLanguage(lang.code);
                          setShowLanguages(false);
                        }}
                      >
                        <ThemedText style={styles.languageName}>{lang.nativeName}</ThemedText>
                        {language === lang.code && (
                          <Feather name="check" size={18} color={BrandColors.white} />
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </React.Fragment>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('supportAndLegal')}</ThemedText>
          <Card style={styles.sectionCard}>
            {supportLegalItems.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.menuRow,
                  index < supportLegalItems.length - 1 && styles.itemBorder,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={item.onPress}
              >
                {renderIconCircle(item.icon)}
                <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
                <Feather name="chevron-right" size={20} color={BrandColors.white} />
              </Pressable>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('account')}</ThemedText>
          <Card style={styles.sectionCard}>
            {accountItems.map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.menuRow,
                  index < accountItems.length - 1 && styles.itemBorder,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={item.onPress}
              >
                {renderIconCircle(item.icon, item.danger)}
                <ThemedText
                  style={[
                    styles.menuLabel,
                    item.danger && { color: BrandColors.danger },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            ))}
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText style={styles.modalTitle}>{t('editHomeLocation')}</ThemedText>
            <TextInput
              style={[
                styles.modalInput,
                { backgroundColor: 'rgba(255,255,255,0.1)', color: BrandColors.white },
              ]}
              value={newAddress}
              onChangeText={setNewAddress}
              placeholder={t('homeLocation')}
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
            <Pressable onPress={handleSaveLocation}>
              <LinearGradient
                colors={[BrandColors.primary, BrandColors.teal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButton}
              >
                <ThemedText style={styles.modalButtonText}>{t('saveLocation')}</ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    ...Typography.h2,
    color: BrandColors.white,
  },
  profileName: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  profilePhone: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  licenseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  licenseText: {
    ...Typography.small,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.md,
  },
  sectionCard: {
    paddingVertical: 0,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    backgroundColor: 'transparent',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    ...Typography.caption,
  },
  itemValue: {
    ...Typography.body,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    ...Typography.body,
    color: BrandColors.white,
  },
  menuValue: {
    ...Typography.small,
    marginRight: Spacing.sm,
  },
  languageList: {
    paddingLeft: Spacing['4xl'],
    paddingBottom: Spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  languageName: {
    ...Typography.body,
  },
  editButton: {
    padding: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  modalTitle: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalInput: {
    ...Typography.body,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    ...Typography.bodyBold,
    color: BrandColors.white,
  },
});
