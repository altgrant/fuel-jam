import { useState, useEffect } from 'react';
import { Vehicle, Level, cloneVehicles } from '../utils/helpers';
import { isMoveValid, checkIfWon } from '../logic/engine';
import levelsData from '../data/levels.json';

export const usePuzzleEngine = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [levels] = useState<Level[]>(() => {
    // Ensure levels data is properly typed and loaded
    try {
      const data = Array.isArray(levelsData) ? levelsData : (levelsData as any).default || [];
      console.log('Loaded levels:', data.length, 'levels');
      return data as Level[];
    } catch (error) {
      console.error('Error loading levels:', error);
      return [];
    }
  });

  // Load level data
  useEffect(() => {
    if (levels.length > 0 && currentLevelIndex < levels.length) {
      const level = levels[currentLevelIndex];
      console.log('Loading level:', level.name);
      setVehicles(cloneVehicles(level.vehicles));
      setIsWon(false);
      setMoveCount(0);
    } else {
      console.warn('No levels available or invalid level index');
    }
  }, [currentLevelIndex, levels]);

  // Check win condition after each move
  useEffect(() => {
    if (vehicles.length > 0) {
      const won = checkIfWon(vehicles);
      setIsWon(won);
    }
  }, [vehicles]);

  // Move a vehicle to a new position
  const moveVehicleToPosition = (vehicleId: string, newPosition: [number, number]): boolean => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return false;

    if (isMoveValid(vehicle, newPosition, vehicles)) {
      setVehicles(prevVehicles => 
        prevVehicles.map(v => 
          v.id === vehicleId ? { ...v, position: newPosition } : v
        )
      );
      setMoveCount(prev => prev + 1);
      return true;
    }
    return false;
  };

  // Reset current level
  const resetLevel = () => {
    if (levels.length > 0 && currentLevelIndex < levels.length) {
      const level = levels[currentLevelIndex];
      setVehicles(cloneVehicles(level.vehicles));
      setIsWon(false);
      setMoveCount(0);
    }
  };

  // Go to next level
  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    }
  };

  // Go to previous level
  const previousLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(prev => prev - 1);
    }
  };

  // Get current level info
  const getCurrentLevel = (): Level | null => {
    if (levels.length > 0 && currentLevelIndex < levels.length) {
      return levels[currentLevelIndex];
    }
    return null;
  };

  return {
    vehicles,
    isWon,
    moveCount,
    currentLevelIndex,
    totalLevels: levels.length,
    currentLevel: getCurrentLevel(),
    moveVehicleToPosition,
    resetLevel,
    nextLevel,
    previousLevel,
    hasNextLevel: currentLevelIndex < levels.length - 1,
    hasPreviousLevel: currentLevelIndex > 0,
  };
}; 