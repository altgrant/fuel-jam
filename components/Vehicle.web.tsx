import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';

import { 
  Vehicle as VehicleType, 
  CELL_SIZE, 
  CELL_MARGIN, 
  getVehicleColor, 
  gridToScreen, 
  screenToGrid,
  BOARD_PADDING
} from '../utils/helpers';
import { getNextValidPosition } from '../logic/engine';

interface VehicleProps {
  vehicle: VehicleType;
  allVehicles: VehicleType[];
  onMove: (vehicleId: string, newPosition: [number, number]) => void;
}

// Utility: lighten a hex color by the given percent (0-1)
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(255 * percent);
  const r = Math.min(255, (num >> 16) + amt);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const b = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const VehicleShape: React.FC<{ vehicle: VehicleType; width: number; height: number }> = ({ vehicle, width, height }) => {
  const isHorizontal = vehicle.orientation === 'horizontal';
  const vehicleColor = getVehicleColor(vehicle.id);
  const isTruck = vehicle.length === 3;

  // Dimensions for internal layout
  const vehicleWidth = isHorizontal ? width : CELL_SIZE;
  const vehicleHeight = isHorizontal ? CELL_SIZE : height;

  // Early-return custom truck rendering
  if (isTruck) {
    const trailerColor = lightenColor(vehicleColor, 0.35);

    return (
      <View
        style={[
          styles.truckContainer,
          {
            width: vehicleWidth,
            height: vehicleHeight,
            flexDirection: isHorizontal ? 'row' : 'column',
          },
        ]}
      >
        {/* Cab */}
        <View
          style={[
            isHorizontal ? styles.cabHorizontal : styles.cabVertical,
            { backgroundColor: vehicleColor },
          ]}
        />

        {/* Trailer */}
        <View
          style={[
            isHorizontal ? styles.trailerHorizontal : styles.trailerVertical,
            { backgroundColor: trailerColor, flex: 1 },
          ]}
        />
      </View>
    );
  }

  // ----- Cars (unchanged) -----
  return (
    <View
      style={[
        styles.unifiedVehicle,
        {
          width: vehicleWidth,
          height: vehicleHeight,
          backgroundColor: vehicleColor,
        },
        isHorizontal ? styles.carHorizontal : styles.carVertical,
      ]}
    >
      {isHorizontal ? (
        <>
          {/* Car windshield */}
          <View style={styles.carWindshieldHorizontal} />
          {/* Car rear window */}
          <View style={styles.carRearWindowHorizontal} />
          {/* Car side windows */}
          <View style={styles.carSideWindowLeftHorizontal} />
          <View style={styles.carSideWindowRightHorizontal} />
        </>
      ) : (
        <>
          {/* Vertical car windshield */}
          <View style={styles.carWindshieldVertical} />
          {/* Vertical car rear window */}
          <View style={styles.carRearWindowVertical} />
          {/* Vertical car side windows */}
          <View style={styles.carSideWindowLeftVertical} />
          <View style={styles.carSideWindowRightVertical} />
        </>
      )}
    </View>
  );
};

export const Vehicle: React.FC<VehicleProps> = ({ vehicle, allVehicles, onMove }) => {
  const [screenX, screenY] = gridToScreen(vehicle.position[0], vehicle.position[1]);
  
  const pan = useRef(new Animated.ValueXY({ x: screenX, y: screenY })).current;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPosition = useRef({ x: screenX, y: screenY });

  // Update position when vehicle prop changes
  useEffect(() => {
    const [newScreenX, newScreenY] = gridToScreen(vehicle.position[0], vehicle.position[1]);
    
    if (!isDragging) {
      pan.setValue({ x: newScreenX, y: newScreenY });
      dragStartPosition.current = { x: newScreenX, y: newScreenY };
    }
  }, [vehicle.position, pan, isDragging]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: (evt, gestureState) => {
      setIsDragging(true);
      const currentScreenX = screenX;
      const currentScreenY = screenY;
      dragStartPosition.current = { x: currentScreenX, y: currentScreenY };
      
      pan.setOffset({
        x: currentScreenX,
        y: currentScreenY,
      });
      pan.setValue({ x: 0, y: 0 });
    },

    onPanResponderMove: (evt, gestureState) => {
      if (vehicle.orientation === 'horizontal') {
        // Only allow horizontal movement
        pan.setValue({ x: gestureState.dx, y: 0 });
      } else {
        // Only allow vertical movement
        pan.setValue({ x: 0, y: gestureState.dy });
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      setIsDragging(false);
      pan.flattenOffset();

      // Calculate final position
      const finalX = dragStartPosition.current.x + (vehicle.orientation === 'horizontal' ? gestureState.dx : 0);
      const finalY = dragStartPosition.current.y + (vehicle.orientation === 'vertical' ? gestureState.dy : 0);

      // Convert to grid coordinates
      const [targetRow, targetCol] = screenToGrid(finalX, finalY);

      // Get valid position
      const validPosition = getNextValidPosition(vehicle, [targetRow, targetCol], allVehicles);

      // Move to valid position
      onMove(vehicle.id, validPosition);

      // Animate to final position
      const [finalScreenX, finalScreenY] = gridToScreen(validPosition[0], validPosition[1]);
      Animated.spring(pan, {
        toValue: { x: finalScreenX, y: finalScreenY },
        useNativeDriver: false,
        tension: 150,
        friction: 8,
      }).start();
    },
  });

  const vehicleWidth = vehicle.orientation === 'horizontal' 
    ? vehicle.length * CELL_SIZE + (vehicle.length - 1) * CELL_MARGIN
    : CELL_SIZE;
  
  const vehicleHeight = vehicle.orientation === 'vertical' 
    ? vehicle.length * CELL_SIZE + (vehicle.length - 1) * CELL_MARGIN
    : CELL_SIZE;

  return (
    <Animated.View
      style={[
        styles.vehicle,
        {
          width: vehicleWidth,
          height: vehicleHeight,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
          opacity: isDragging ? 0.8 : 1,
          zIndex: isDragging ? 100 : 10,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <VehicleShape vehicle={vehicle} width={vehicleWidth} height={vehicleHeight} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  vehicle: {
    position: 'absolute',
  },
  vehicleContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  vehicleSegment: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // UNIFIED VEHICLE BASE
  unifiedVehicle: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  
  // HORIZONTAL TRUCK STYLES
  truckHorizontal: {
    borderRadius: 8,
    // Truck shape: narrower at cab, wider at trailer
  },
  truckCabSection: {
    position: 'absolute',
    width: '32%', // First third for cab
    height: '75%',
    left: '2%',
    top: '12.5%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34495e',
  },
  truckWindshieldHorizontal: {
    position: 'absolute',
    width: '12%',
    height: '45%',
    left: '15%',
    top: '27.5%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  truckGrilleHorizontal: {
    position: 'absolute',
    width: '6%',
    height: '35%',
    left: '3%',
    top: '32.5%',
    backgroundColor: '#1a252f',
    borderRadius: 2,
  },
  trailerConnectionHorizontal: {
    position: 'absolute',
    width: '3%',
    height: '20%',
    left: '32%',
    top: '40%',
    backgroundColor: '#34495e',
    borderRadius: 1,
  },
  
  // HORIZONTAL CAR STYLES
  carHorizontal: {
    borderRadius: 12,
  },
  carWindshieldHorizontal: {
    position: 'absolute',
    width: '20%',
    height: '50%',
    left: '15%',
    top: '25%',
    backgroundColor: '#87ceeb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carRearWindowHorizontal: {
    position: 'absolute',
    width: '20%',
    height: '50%',
    right: '15%',
    top: '25%',
    backgroundColor: '#87ceeb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carSideWindowLeftHorizontal: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    left: '37%',
    top: '15%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carSideWindowRightHorizontal: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    left: '37%',
    bottom: '15%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  
  // VERTICAL TRUCK STYLES
  truckVertical: {
    borderRadius: 8,
  },
  truckCabSectionVertical: {
    position: 'absolute',
    width: '75%',
    height: '32%', // First third for cab
    left: '12.5%',
    top: '2%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34495e',
  },
  truckWindshieldVertical: {
    position: 'absolute',
    width: '45%',
    height: '12%',
    left: '27.5%',
    top: '15%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  truckGrilleVertical: {
    position: 'absolute',
    width: '35%',
    height: '6%',
    left: '32.5%',
    top: '3%',
    backgroundColor: '#1a252f',
    borderRadius: 2,
  },
  trailerConnectionVertical: {
    position: 'absolute',
    width: '20%',
    height: '3%',
    left: '40%',
    top: '32%',
    backgroundColor: '#34495e',
    borderRadius: 1,
  },
  
  // VERTICAL CAR STYLES
  carVertical: {
    borderRadius: 12,
  },
  carWindshieldVertical: {
    position: 'absolute',
    width: '50%',
    height: '20%',
    left: '25%',
    top: '15%',
    backgroundColor: '#87ceeb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carRearWindowVertical: {
    position: 'absolute',
    width: '50%',
    height: '20%',
    left: '25%',
    bottom: '15%',
    backgroundColor: '#87ceeb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carSideWindowLeftVertical: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    left: '15%',
    top: '37%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },
  carSideWindowRightVertical: {
    position: 'absolute',
    width: '25%',
    height: '25%',
    right: '15%',
    top: '37%',
    backgroundColor: '#87ceeb',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#5a6c7d',
  },

  // Modern truck styles
  truckContainer: {
    position: 'relative',
  },
  cabHorizontal: {
    width: CELL_SIZE,
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  trailerHorizontal: {
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  cabVertical: {
    height: CELL_SIZE,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  trailerVertical: {
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
}); 