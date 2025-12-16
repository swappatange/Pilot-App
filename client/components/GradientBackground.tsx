import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G, Defs, Pattern, Rect } from 'react-native-svg';
import { BrandColors } from '@/constants/theme';

interface GradientBackgroundProps {
  children: ReactNode;
  showPattern?: boolean;
}

const { width, height } = Dimensions.get('window');

function HexPattern() {
  const hexSize = 60;
  const patternHeight = hexSize * Math.sqrt(3);
  const patternWidth = hexSize * 3;
  
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <Pattern
          id="hexPattern"
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
        >
          <Path
            d={`M ${hexSize * 0.5},0 
                L ${hexSize * 1.5},0 
                L ${hexSize * 2},${patternHeight * 0.5} 
                L ${hexSize * 1.5},${patternHeight} 
                L ${hexSize * 0.5},${patternHeight} 
                L 0,${patternHeight * 0.5} Z`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            fill="none"
          />
          <Path
            d={`M ${hexSize * 2},0 
                L ${hexSize * 3},0 
                L ${hexSize * 3},${patternHeight * 0.5} 
                L ${hexSize * 3},${patternHeight} 
                L ${hexSize * 2},${patternHeight} 
                L ${hexSize * 1.5},${patternHeight * 0.5} Z`}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#hexPattern)" />
    </Svg>
  );
}

function DiamondPattern() {
  const size = 50;
  
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <Pattern
          id="diamondPattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <Path
            d={`M ${size / 2},0 L ${size},${size / 2} L ${size / 2},${size} L 0,${size / 2} Z`}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.5}
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#diamondPattern)" />
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
      {showPattern && <DiamondPattern />}
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
