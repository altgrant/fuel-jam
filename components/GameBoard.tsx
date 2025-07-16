import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Vehicle as VehicleComponent } from './Vehicle';
import { 
  Vehicle as VehicleType, 
  GRID_SIZE, 
  CELL_SIZE, 
  CELL_MARGIN
} from '../utils/helpers';

interface GameBoardProps {
  vehicles: VehicleType[];
  onVehicleMove: (vehicleId: string, newPosition: [number, number]) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ vehicles, onVehicleMove }) => {
  const boardSize = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_MARGIN;

  // Render the grid cells
  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isExitCell = row === 2 && col === GRID_SIZE - 1;
        cells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.gridCell,
              {
                left: col * (CELL_SIZE + CELL_MARGIN),
                top: row * (CELL_SIZE + CELL_MARGIN),
              },
              isExitCell && styles.exitCell,
            ]}
          >
            {isExitCell && (
              <Text style={styles.exitText}>⛽</Text>
            )}
          </View>
        );
      }
    }
    return cells;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { width: boardSize, height: boardSize }]}>
        {/* Grid cells */}
        {renderGrid()}
        
        {/* Vehicles */}
        {vehicles.map((vehicle) => (
          <VehicleComponent
            key={vehicle.id}
            vehicle={vehicle}
            allVehicles={vehicles}
            onMove={onVehicleMove}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e2e8f0', // slate-200
  },
  board: {
    position: 'relative',
    backgroundColor: '#1f2937', // slate-800
    borderRadius: 12,
    padding: 0,
    borderWidth: 6,
    borderColor: '#475569', // slate-600
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  gridCell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#334155', // slate-700
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitCell: {
    backgroundColor: '#c3f53c',
    borderColor: '#a3e635',
  },
  exitText: {
    fontSize: CELL_SIZE * 0.7, // dynamic size to nearly fill the square
    lineHeight: CELL_SIZE,    // vertical centering
    textAlign: 'center',
    color: '#1f2937',
  },
}); 