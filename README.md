# 🚛 Fuel Jam - React Native Edition

A Rush Hour-style sliding puzzle game built for React Native. Help the red AtoB truck escape the parking lot by sliding other vehicles out of the way!

## 🎮 Game Features

- **6x6 sliding puzzle grid** with axis-locked vehicle movement
- **5 challenging levels** with increasing difficulty
- **Gesture-based controls** using react-native-gesture-handler
- **Smooth animations** powered by react-native-reanimated
- **Win rewards system** with optional discount integration
- **Move counter** and level progression tracking
- **Fully offline capable** with local level storage

## 🎯 How to Play

1. **Objective**: Move the red AtoB truck to the exit on the right side
2. **Controls**: Drag vehicles to slide them in their allowed direction
3. **Constraints**: 
   - Horizontal vehicles only move left/right
   - Vertical vehicles only move up/down
   - Vehicles cannot overlap or go out of bounds
4. **Win**: Get the red truck to the exit to complete the level!

## 🏗️ Project Structure

```
FuelJam/
├── components/
│   ├── GameBoard.tsx     # Main game board with 6x6 grid
│   ├── Vehicle.tsx       # Draggable vehicle component
│   └── WinModal.tsx      # Victory modal with rewards
├── data/
│   └── levels.json       # 5 puzzle levels in JSON format
├── hooks/
│   └── usePuzzleEngine.ts # Game state management hook
├── logic/
│   └── engine.ts         # Core game logic and validation
├── screens/
│   └── FuelJamScreen.tsx # Main game screen
├── utils/
│   └── helpers.ts        # Utility functions and types
├── App.tsx               # App entry point
├── index.js              # React Native entry point
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- React Native development environment
- iOS Simulator / Android Emulator or physical device

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd FuelJam
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Install iOS dependencies (iOS only):**
```bash
cd ios && pod install && cd ..
```

4. **Run the app:**
```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android

# Web Browser (for testing)
npm run web
# or
yarn web
```

The web version will automatically open in your browser at `http://localhost:3000`

## 🎨 Customization

### Adding New Levels

Edit `data/levels.json` to add more puzzle configurations:

```json
{
  "id": 6,
  "name": "Your Level Name",
  "vehicles": [
    {
      "id": "red",
      "name": "AtoB Truck",
      "orientation": "horizontal",
      "length": 2,
      "position": [2, 0]
    }
    // ... more vehicles
  ]
}
```

### Enabling Rewards

Pass `shouldReward={true}` to `FuelJamScreen` to enable the reward system:

```tsx
<FuelJamScreen shouldReward={true} />
```

### Styling

Customize colors and sizes in `utils/helpers.ts`:

```ts
export const CELL_SIZE = 50;        // Grid cell size
export const CELL_MARGIN = 2;       // Space between cells
export const getVehicleColor = (vehicleId: string): string => {
  // Customize vehicle colors
  if (vehicleId === 'red') return '#FF4444';
  // ...
};
```

## 🧪 Testing

The core game logic includes validation functions that can be unit tested:

```ts
import { isMoveValid, checkIfWon, moveVehicle } from './logic/engine';

// Test move validation
const isValid = isMoveValid(vehicle, newPosition, allVehicles);

// Test win condition
const hasWon = checkIfWon(vehicles);
```

## 📱 Platform Support

- **iOS**: Fully supported with gesture handling
- **Android**: Fully supported with gesture handling
- **Web Browser**: Available for testing and development (uses React Native Web)
- **Bundle size**: < 500KB (excluding React Native framework)

### 🌐 Web Version (Testing)

The web version is provided for easy testing and development:

- **Purpose**: Quick testing without mobile device/emulator
- **Technology**: React Native Web with PanResponder for drag interactions
- **Limitations**: Some animations may behave differently than native
- **Access**: Run `npm run web` and visit `http://localhost:3000`

> **Note**: The web version is for testing purposes. The mobile app provides the optimal gaming experience.

## 🔧 Dependencies

- `react-native-gesture-handler`: For drag and touch gestures
- `react-native-reanimated`: For smooth animations and transitions
- `react` & `react-native`: Core framework

## 🎮 Game Mechanics

### Vehicle Movement
- **Horizontal vehicles**: Can only slide left or right
- **Vertical vehicles**: Can only slide up or down
- **Collision detection**: Prevents vehicles from overlapping
- **Boundary checking**: Keeps vehicles within the 6x6 grid

### Win Condition
- Red truck must reach the exit (rightmost column, row 2)
- Win modal appears with level completion stats
- Optional reward system integration

### Level Progression
- 5 built-in levels with increasing difficulty
- Move counter tracks efficiency
- Reset functionality for replay
- Next/Previous level navigation

## 🎯 Performance

- **Gesture handling**: Optimized with native drivers
- **Animations**: Hardware-accelerated transformations
- **State management**: Efficient React hooks
- **Bundle size**: Minimal footprint for mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎊 Credits

Inspired by the classic Rush Hour puzzle game. Built with React Native for the AtoB mobile app ecosystem.

---

**Ready to play? Get that red truck to the exit! 🚛➡️** 