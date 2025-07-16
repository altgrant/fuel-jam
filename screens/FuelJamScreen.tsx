import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { GameBoard } from '../components/GameBoard';
import { WinModal } from '../components/WinModal';
import { usePuzzleEngine } from '../hooks/usePuzzleEngine';

interface FuelJamScreenProps {
  shouldReward?: boolean;
}

export const FuelJamScreen: React.FC<FuelJamScreenProps> = ({ shouldReward = false }) => {
  const {
    vehicles,
    isWon,
    moveCount,
    currentLevelIndex,
    totalLevels,
    currentLevel,
    moveVehicleToPosition,
    resetLevel,
    nextLevel,
    previousLevel,
    hasNextLevel,
    hasPreviousLevel,
  } = usePuzzleEngine();

  const handleVehicleMove = (vehicleId: string, newPosition: [number, number]) => {
    moveVehicleToPosition(vehicleId, newPosition);
  };

  const handleNextLevel = () => {
    nextLevel();
  };

  const handleRestart = () => {
    resetLevel();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fuel Jam</Text>
          <Text style={styles.level}>Level {currentLevelIndex + 1} of {totalLevels}</Text>
          {currentLevel && (
            <Text style={styles.levelName}>{currentLevel.name}</Text>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moveCount}</Text>
            <Text style={styles.statLabel}>Moves</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🎯</Text>
            <Text style={styles.statLabel}>Exit</Text>
          </View>
        </View>

        {/* Game Board */}
        <View style={styles.gameContainer}>
          <GameBoard
            vehicles={vehicles}
            onVehicleMove={handleVehicleMove}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Move the green truck to the exit by dragging vehicles
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, !hasPreviousLevel && styles.disabledButton]}
            onPress={previousLevel}
            disabled={!hasPreviousLevel}
          >
            <Text style={[styles.buttonText, !hasPreviousLevel && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleRestart}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, !hasNextLevel && styles.disabledButton]}
            onPress={nextLevel}
            disabled={!hasNextLevel}
          >
            <Text style={[styles.primaryButtonText, !hasNextLevel && styles.disabledText]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Win Modal */}
      <WinModal
        visible={isWon}
        onClose={() => {}}
        onNextLevel={handleNextLevel}
        onRestart={handleRestart}
        moveCount={moveCount}
        levelName={currentLevel?.name || ''}
        hasNextLevel={hasNextLevel}
        shouldReward={shouldReward}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  gameContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#c3f53c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#c3f53c',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  resetButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  disabledText: {
    color: '#9ca3af',
  },
}); 