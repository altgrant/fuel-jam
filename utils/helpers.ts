export type Orientation = 'horizontal' | 'vertical';

export type Vehicle = {
  id: string;
  name: string;
  orientation: Orientation;
  length: 2 | 3;
  position: [number, number]; // [row, col]
};

export type Level = {
  id: number;
  name: string;
  vehicles: Vehicle[];
};

export const GRID_SIZE = 6;
export const CELL_SIZE = 56;
export const CELL_MARGIN = 4;
export const BOARD_PADDING = 12;

// Convert grid position to screen coordinates (relative to board content area)
export const gridToScreen = (row: number, col: number): [number, number] => {
  const x = col * (CELL_SIZE + CELL_MARGIN);
  const y = row * (CELL_SIZE + CELL_MARGIN);
  return [x, y];
};

// Convert screen coordinates to grid position (relative to board content area)
export const screenToGrid = (x: number, y: number): [number, number] => {
  const col = Math.round(x / (CELL_SIZE + CELL_MARGIN));
  const row = Math.round(y / (CELL_SIZE + CELL_MARGIN));
  return [row, col];
};

// Get vehicle color based on ID
export const getVehicleColor = (vehicleId: string): string => {
  // Player goal vehicle (formerly red) is now green
  if (vehicleId === 'red') return '#16a34a'; // Green for AtoB truck
  if (vehicleId.startsWith('blue')) return '#3b82f6'; // Blue delivery trucks remain unchanged
  // All two-block cars (ids starting with "green") are now rendered red
  if (vehicleId.startsWith('green')) return '#dc2626'; // Bright red for cars
  if (vehicleId.startsWith('yellow')) return '#facc15'; // Bright yellow
  if (vehicleId.startsWith('purple')) return '#a855f7'; // Lively purple
  if (vehicleId.startsWith('orange')) return '#f97316'; // Vivid orange
  return '#9ca3af'; // Muted gray fallback
};

// Get all cells occupied by a vehicle
export const getOccupiedCells = (vehicle: Vehicle): [number, number][] => {
  const cells: [number, number][] = [];
  const [row, col] = vehicle.position;
  
  for (let i = 0; i < vehicle.length; i++) {
    if (vehicle.orientation === 'horizontal') {
      cells.push([row, col + i]);
    } else {
      cells.push([row + i, col]);
    }
  }
  
  return cells;
};

// Check if a position is within grid bounds
export const isWithinBounds = (row: number, col: number): boolean => {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
};

// Deep clone vehicle array
export const cloneVehicles = (vehicles: Vehicle[]): Vehicle[] => {
  return vehicles.map(vehicle => ({
    ...vehicle,
    position: [...vehicle.position] as [number, number]
  }));
}; 