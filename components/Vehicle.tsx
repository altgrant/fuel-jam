import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import { 
  Vehicle as VehicleType, 
  CELL_SIZE, 
  CELL_MARGIN, 
  getVehicleColor, 
  gridToScreen, 
  screenToGrid 
} from '../utils/helpers';
import { getNextValidPosition } from '../logic/engine';

interface VehicleProps {
  vehicle: VehicleType;
  allVehicles: VehicleType[];
  onMove: (vehicleId: string, newPosition: [number, number]) => void;
}

export const Vehicle: React.FC<VehicleProps> = ({ vehicle, allVehicles, onMove }) => {
  const [screenX, screenY] = gridToScreen(vehicle.position[0], vehicle.position[1]);
  
  const translateX = useSharedValue(screenX);
  const translateY = useSharedValue(screenY);
  
  // Update position when vehicle prop changes
  React.useEffect(() => {
    const [newScreenX, newScreenY] = gridToScreen(vehicle.position[0], vehicle.position[1]);
    translateX.value = withSpring(newScreenX);
    translateY.value = withSpring(newScreenY);
  }, [vehicle.position, translateX, translateY]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (vehicle.orientation === 'horizontal') {
        // Only allow horizontal movement
        translateX.value = context.startX + event.translationX;
      } else {
        // Only allow vertical movement
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event, context) => {
      const finalX = context.startX + event.translationX;
      const finalY = context.startY + event.translationY;
      
      // Convert screen coordinates back to grid
      const [targetRow, targetCol] = screenToGrid(finalX, finalY);
      
      // Get the next valid position
      const validPosition = getNextValidPosition(vehicle, [targetRow, targetCol], allVehicles);
      
      // Move to the valid position
      runOnJS(onMove)(vehicle.id, validPosition);
      
      // Animate to the final valid position
      const [finalScreenX, finalScreenY] = gridToScreen(validPosition[0], validPosition[1]);
      translateX.value = withSpring(finalScreenX);
      translateY.value = withSpring(finalScreenY);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const vehicleWidth = vehicle.orientation === 'horizontal' 
    ? vehicle.length * CELL_SIZE + (vehicle.length - 1) * CELL_MARGIN
    : CELL_SIZE;
  
  const vehicleHeight = vehicle.orientation === 'vertical' 
    ? vehicle.length * CELL_SIZE + (vehicle.length - 1) * CELL_MARGIN
    : CELL_SIZE;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            styles.vehicle,
            {
              width: vehicleWidth,
              height: vehicleHeight,
              backgroundColor: getVehicleColor(vehicle.id),
            },
            animatedStyle,
          ]}
        />
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  vehicle: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
}); 