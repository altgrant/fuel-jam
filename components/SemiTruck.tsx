import React from 'react';
import { View, StyleSheet } from 'react-native';

type Orientation = 'horizontal' | 'vertical';

interface SemiTruckProps {
  gridPosition: [number, number];
  orientation?: Orientation;
  length?: number;          // trailer + cab cells; default 3
  cellSize: number;         // from helpers
  cellMargin: number;       // from helpers
  gridToScreen: (row: number, col: number) => [number, number];
}

export const SemiTruck: React.FC<SemiTruckProps> = ({
  gridPosition,
  orientation = 'horizontal',
  length = 3,
  cellSize,
  cellMargin,
  gridToScreen,
}) => {
  const [row, col] = gridPosition;
  const [x, y] = gridToScreen(row, col);
  const isH = orientation === 'horizontal';
  const trailerCells = length - 1;

  const containerStyle = {
    left: x,
    top: y,
    width:  isH
      ? length * cellSize + (length - 1) * cellMargin
      : cellSize,
    height: !isH
      ? length * cellSize + (length - 1) * cellMargin
      : cellSize,
    flexDirection: isH ? 'row' : 'column',
  } as const;

  const spacer = isH ? { marginLeft: cellMargin } : { marginTop: cellMargin };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.cab, { width: cellSize, height: cellSize }]} />
      <View
        style={[
          styles.trailer,
          spacer,
          isH
            ? { width: trailerCells * cellSize + (trailerCells - 1) * cellMargin, height: cellSize }
            : { height: trailerCells * cellSize + (trailerCells - 1) * cellMargin, width: cellSize },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    position: 'absolute', 
    borderRadius: 6, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  cab: { backgroundColor: '#16a34a', borderRadius: 6 },
  trailer: { backgroundColor: '#d1d5db', borderRadius: 6 },
}); 