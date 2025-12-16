import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';
import { BrandColors } from '@/constants/theme';

interface GradientBackgroundProps {
  children: ReactNode;
  showPattern?: boolean;
}

const { width, height } = Dimensions.get('window');

function IsometricCubeGridPattern() {
  const size = 55;
  const h = size * 0.866; // height for equilateral triangles
  
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <Pattern
          id="isometricGrid"
          width={size}
          height={h}
          patternUnits="userSpaceOnUse"
        >
          {/* Vertical left line */}
          <Path
            d={`M ${size * 0.25},0 L ${size * 0.25},${h}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Vertical right line */}
          <Path
            d={`M ${size * 0.75},0 L ${size * 0.75},${h}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Top-right diagonal */}
          <Path
            d={`M 0,${h * 0.5} L ${size * 0.5},0 L ${size},${h * 0.5}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Bottom-left diagonal */}
          <Path
            d={`M 0,${h * 0.5} L ${size * 0.5},${h} L ${size},${h * 0.5}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Top-left edges */}
          <Path
            d={`M ${size * 0.25},0 L 0,${h * 0.25}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          <Path
            d={`M ${size * 0.25},0 L ${size * 0.5},${h * 0.25}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Top-right edges */}
          <Path
            d={`M ${size * 0.75},0 L ${size * 0.5},${h * 0.25}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          <Path
            d={`M ${size * 0.75},0 L ${size},${h * 0.25}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Bottom-left edges */}
          <Path
            d={`M ${size * 0.25},${h} L 0,${h * 0.75}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          <Path
            d={`M ${size * 0.25},${h} L ${size * 0.5},${h * 0.75}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Bottom-right edges */}
          <Path
            d={`M ${size * 0.75},${h} L ${size * 0.5},${h * 0.75}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
          <Path
            d={`M ${size * 0.75},${h} L ${size},${h * 0.75}`}
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="0.8"
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#isometricGrid)" />
    </Svg>
  );
}

export function GradientBackground({ children, showPattern = true }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[BrandColors.gradientTop, BrandColors.gradientMiddle, BrandColors.gradientBottom]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {showPattern && <IsometricCubeGridPattern />}
      <View style={styles.content}>
        {children}
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
  },
});
