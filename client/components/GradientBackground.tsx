import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G } from 'react-native-svg';

interface GradientBackgroundProps {
  children: ReactNode;
  showPattern?: boolean;
}

const { width, height } = Dimensions.get('window');

const CUBE_COLOR = '#3F8B63';
const CUBE_SIZE = 72;
const CUBE_SPACING = 48;

function IsometricCubeOutline({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
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
      <Path d={topFace} stroke={CUBE_COLOR} strokeWidth={1} fill="none" />
      <Path d={leftFace} stroke={CUBE_COLOR} strokeWidth={1} fill="none" />
      <Path d={rightFace} stroke={CUBE_COLOR} strokeWidth={1} fill="none" />
    </G>
  );
}

function CubePattern() {
  const cubes: { x: number; y: number; size: number; opacity: number }[] = [];
  
  const leftClusterX = width * 0.14;
  const rightClusterX = width * 0.86;
  const verticalStart = height * 0.40;
  const verticalEnd = height * 0.88;
  
  const generateStairCluster = (baseX: number, isRight: boolean) => {
    const clusterCubes: { x: number; y: number; size: number; opacity: number }[] = [];
    const rows = 5;
    
    for (let row = 0; row < rows; row++) {
      const cubesInRow = rows - row;
      const rowY = verticalEnd - (row * CUBE_SPACING * 0.8);
      const baseOpacity = 0.32 - (row * 0.06);
      
      for (let col = 0; col < cubesInRow; col++) {
        const offsetX = isRight 
          ? baseX - (col * CUBE_SIZE * 0.5) - (row * CUBE_SIZE * 0.25)
          : baseX + (col * CUBE_SIZE * 0.5) + (row * CUBE_SIZE * 0.25);
        const offsetY = rowY - (col * CUBE_SIZE * 0.3);
        
        clusterCubes.push({
          x: offsetX,
          y: offsetY,
          size: CUBE_SIZE,
          opacity: Math.max(0.08, baseOpacity - (col * 0.04)),
        });
      }
    }
    
    return clusterCubes;
  };
  
  cubes.push(...generateStairCluster(leftClusterX - CUBE_SIZE, false));
  cubes.push(...generateStairCluster(rightClusterX, true));

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      {cubes.map((cube, index) => (
        <IsometricCubeOutline
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
      colors={['#103B2F', '#1F5C46', '#1A7057', '#0E4F63']}
      locations={[0, 0.42, 0.68, 1]}
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
