import { Vehicle, getOccupiedCells, isWithinBounds, GRID_SIZE } from '../utils/helpers';

// Check if a vehicle can move to a new position
export const isMoveValid = (
  vehicle: Vehicle,
  newPosition: [number, number],
  allVehicles: Vehicle[]
): boolean => {
  // Create a temporary vehicle with the new position
  const tempVehicle: Vehicle = {
    ...vehicle,
    position: newPosition
  };

  // Check if all cells are within bounds
  const occupiedCells = getOccupiedCells(tempVehicle);
  for (const [row, col] of occupiedCells) {
    if (!isWithinBounds(row, col)) {
      return false;
    }
  }

  // Check for collisions with other vehicles
  const otherVehicles = allVehicles.filter(v => v.id !== vehicle.id);
  
  for (const otherVehicle of otherVehicles) {
    const otherCells = getOccupiedCells(otherVehicle);
    
    for (const [row, col] of occupiedCells) {
      for (const [otherRow, otherCol] of otherCells) {
        if (row === otherRow && col === otherCol) {
          return false; // Collision detected
        }
      }
    }
  }

  return true;
};

// Move a vehicle by a delta amount
export const moveVehicle = (
  vehicle: Vehicle,
  delta: [number, number],
  allVehicles: Vehicle[]
): Vehicle | null => {
  const [deltaRow, deltaCol] = delta;
  const [currentRow, currentCol] = vehicle.position;

  // Enforce axis lock based on orientation
  let newRow = currentRow;
  let newCol = currentCol;

  if (vehicle.orientation === 'horizontal') {
    // Only allow horizontal movement
    newCol = currentCol + deltaCol;
  } else {
    // Only allow vertical movement
    newRow = currentRow + deltaRow;
  }

  const newPosition: [number, number] = [newRow, newCol];

  // Check if the move is valid
  if (isMoveValid(vehicle, newPosition, allVehicles)) {
    return {
      ...vehicle,
      position: newPosition
    };
  }

  return null; // Invalid move
};

// Check if the game is won (red truck reaches exit)
export const checkIfWon = (vehicles: Vehicle[]): boolean => {
  const redTruck = vehicles.find(v => v.id === 'red');
  
  if (!redTruck) return false;

  const [row, col] = redTruck.position;
  
  // Win condition: red truck's rightmost cell reaches the right edge
  if (redTruck.orientation === 'horizontal') {
    const rightmostCol = col + redTruck.length - 1;
    return rightmostCol === GRID_SIZE - 1 && row === 2; // Row 2 is the exit row
  }
  
  return false;
};

// Get the next valid position when dragging
export const getNextValidPosition = (
  vehicle: Vehicle,
  targetPosition: [number, number],
  allVehicles: Vehicle[]
): [number, number] => {
  const [targetRow, targetCol] = targetPosition;
  const [currentRow, currentCol] = vehicle.position;

  // Try to move to the target position first
  if (isMoveValid(vehicle, targetPosition, allVehicles)) {
    return targetPosition;
  }

  // If direct move isn't valid, find the closest valid position
  if (vehicle.orientation === 'horizontal') {
    // Try moving horizontally towards the target
    const direction = targetCol > currentCol ? 1 : -1;
    let lastValidPosition: [number, number] = [currentRow, currentCol];
    
    for (let i = 1; i <= Math.abs(targetCol - currentCol); i++) {
      const testCol = currentCol + (i * direction);
      const testPosition: [number, number] = [currentRow, testCol];
      
      if (isMoveValid(vehicle, testPosition, allVehicles)) {
        lastValidPosition = testPosition;
      } else {
        // Hit an obstacle, return the last valid position
        break;
      }
    }
    
    return lastValidPosition;
  } else {
    // Try moving vertically towards the target
    const direction = targetRow > currentRow ? 1 : -1;
    let lastValidPosition: [number, number] = [currentRow, currentCol];
    
    for (let i = 1; i <= Math.abs(targetRow - currentRow); i++) {
      const testRow = currentRow + (i * direction);
      const testPosition: [number, number] = [testRow, currentCol];
      
      if (isMoveValid(vehicle, testPosition, allVehicles)) {
        lastValidPosition = testPosition;
      } else {
        // Hit an obstacle, return the last valid position
        break;
      }
    }
    
    return lastValidPosition;
  }
}; 