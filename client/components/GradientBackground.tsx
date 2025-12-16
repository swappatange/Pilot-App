import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Line, Defs, Pattern, Rect, G } from 'react-native-svg';

interface GradientBackgroundProps {
  children: ReactNode;
  showPattern?: boolean;
}

const { width, height } = Dimensions.get('window');

const CUBE_COLOR = '#6B9B5B';
const CUBE_STROKE_WIDTH = 1.5;
const CUBE_OPACITY = 0.85;

function IsometricCube({ x, y, size, opacity = CUBE_OPACITY }: { x: number; y: number; size: number; opacity?: number }) {
  const w = size;
  const h = size * 0.577;
  
  const topFace = `
    M ${x},${y - h}
    L ${x + w/2},${y - h * 1.5}
    L ${x + w},${y - h}
    L ${x + w/2},${y - h * 0.5}
    Z
  `;
  
  const leftFace = `
    M ${x},${y - h}
    L ${x + w/2},${y - h * 0.5}
    L ${x + w/2},${y + h * 0.5}
    L ${x},${y}
    Z
  `;
  
  const rightFace = `
    M ${x + w},${y - h}
    L ${x + w/2},${y - h * 0.5}
    L ${x + w/2},${y + h * 0.5}
    L ${x + w},${y}
    Z
  `;

  return (
    <G opacity={opacity}>
      <Path d={topFace} stroke={CUBE_COLOR} strokeWidth={CUBE_STROKE_WIDTH} fill="none" />
      <Path d={leftFace} stroke={CUBE_COLOR} strokeWidth={CUBE_STROKE_WIDTH} fill="none" />
      <Path d={rightFace} stroke={CUBE_COLOR} strokeWidth={CUBE_STROKE_WIDTH} fill="none" />
    </G>
  );
}

function VerticalLinesTexture() {
  const lines = [];
  const lineSpacing = 4;
  const numLines = Math.ceil(width / lineSpacing);
  
  for (let i = 0; i < numLines; i++) {
    const x = i * lineSpacing;
    const opacity = Math.random() * 0.08 + 0.02;
    const lineHeight = height * (0.3 + Math.random() * 0.7);
    const startY = Math.random() * height * 0.3;
    
    lines.push(
      <Line
        key={`line-${i}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={startY + lineHeight}
        stroke={CUBE_COLOR}
        strokeWidth={0.5}
        opacity={opacity}
      />
    );
  }
  
  return <>{lines}</>;
}

function CubePattern() {
  const cubeSize = 80;
  
  const cubes = [
    { x: -20, y: height - 50, size: cubeSize, opacity: 0.9 },
    { x: cubeSize * 0.4, y: height - 50 - cubeSize * 0.3, size: cubeSize, opacity: 0.9 },
    { x: cubeSize * 0.8, y: height - 50 - cubeSize * 0.6, size: cubeSize, opacity: 0.85 },
    { x: cubeSize * 1.2, y: height - 50 - cubeSize * 0.9, size: cubeSize, opacity: 0.8 },
    { x: cubeSize * 1.6, y: height - 50 - cubeSize * 1.2, size: cubeSize, opacity: 0.75 },
    { x: cubeSize * 2.0, y: height - 50 - cubeSize * 1.5, size: cubeSize, opacity: 0.7 },
    { x: cubeSize * 2.4, y: height - 50 - cubeSize * 1.8, size: cubeSize, opacity: 0.65 },
    
    { x: -20, y: height - 50 - cubeSize * 0.6, size: cubeSize, opacity: 0.85 },
    { x: cubeSize * 0.4, y: height - 50 - cubeSize * 0.9, size: cubeSize, opacity: 0.8 },
    { x: cubeSize * 0.8, y: height - 50 - cubeSize * 1.2, size: cubeSize, opacity: 0.75 },
    { x: cubeSize * 1.2, y: height - 50 - cubeSize * 1.5, size: cubeSize, opacity: 0.7 },
    
    { x: -20, y: height - 50 - cubeSize * 1.2, size: cubeSize, opacity: 0.7 },
    { x: cubeSize * 0.4, y: height - 50 - cubeSize * 1.5, size: cubeSize, opacity: 0.65 },
    
    { x: width - cubeSize * 1.5, y: height - 100, size: cubeSize * 1.2, opacity: 0.8 },
    { x: width - cubeSize * 0.8, y: height - 100 - cubeSize * 0.4, size: cubeSize * 1.2, opacity: 0.75 },
    { x: width - cubeSize * 1.5, y: height - 100 - cubeSize * 0.8, size: cubeSize * 1.2, opacity: 0.7 },
    { x: width - cubeSize * 0.8, y: height - 100 - cubeSize * 1.2, size: cubeSize * 1.2, opacity: 0.65 },
  ];

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <VerticalLinesTexture />
      {cubes.map((cube, index) => (
        <IsometricCube
          key={`cube-${index}`}
          x={cube.x}
          y={cube.y}
          size={cube.size}
          opacity={cube.opacity}
        />
      ))}
    </Svg>
  );
}

export function GradientBackground({ children, showPattern = true }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#0A1A14', '#0D2818', '#0A1A14']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {showPattern && <CubePattern />}
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
