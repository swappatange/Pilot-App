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

function TriangularMeshPattern() {
  const cellWidth = 48;
  const cellHeight = 42;
  
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <Pattern
          id="triangularMesh"
          width={cellWidth}
          height={cellHeight}
          patternUnits="userSpaceOnUse"
        >
          <Path
            d={`M 0,${cellHeight} L ${cellWidth / 2},0 L ${cellWidth},${cellHeight}`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.75}
            fill="none"
          />
          <Path
            d={`M 0,0 L ${cellWidth / 2},${cellHeight} L ${cellWidth},0`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.75}
            fill="none"
          />
          <Path
            d={`M 0,0 L 0,${cellHeight}`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.75}
            fill="none"
          />
          <Path
            d={`M ${cellWidth},0 L ${cellWidth},${cellHeight}`}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.75}
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#triangularMesh)" />
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
      {showPattern && <TriangularMeshPattern />}
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
