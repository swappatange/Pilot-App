import React, { ReactNode } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

interface GradientBackgroundProps {
  children: ReactNode;
}

const backgroundImage = require('../assets/atomik-background.png');
const FALLBACK_COLOR = '#1A5C45';

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.container, { backgroundColor: FALLBACK_COLOR }]}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
