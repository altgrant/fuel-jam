# 🌐 Web Browser Testing Guide

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start the web development server:**
```bash
npm run web
```

3. **Open your browser:**
The game will automatically open at `http://localhost:3000`

## What to Expect

✅ **Working Features:**
- Full game mechanics (drag, drop, collision detection)
- All 5 levels playable
- Win detection and modal
- Level progression
- Move counting
- Reset functionality

⚠️ **Differences from Mobile:**
- Uses mouse drag instead of touch gestures
- Some animations may feel different
- Performance may vary based on browser

## Controls

- **Drag**: Click and drag vehicles with your mouse
- **Axis Lock**: Horizontal vehicles only move left/right, vertical only up/down
- **Snap**: Vehicles snap to grid positions automatically
- **Reset**: Click "Reset" button to restart current level

## Testing Tips

1. **Test all levels** - Use Previous/Next buttons to navigate
2. **Test win condition** - Move red truck to exit on right side
3. **Test collision detection** - Try to overlap vehicles (should be blocked)
4. **Test boundary limits** - Try to drag vehicles off the grid
5. **Test reward modal** - Complete a level to see win screen

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Troubleshooting

**If the game doesn't load:**
1. Check console for errors (F12)
2. Ensure all dependencies are installed
3. Try clearing browser cache
4. Restart the dev server

**If dragging doesn't work:**
1. Make sure you're clicking directly on vehicles
2. Try refreshing the page
3. Check if JavaScript is enabled

---

**Ready to test! 🎮 The red truck needs to reach the exit!** 