## Project Overview
- We're building a badminton score tracking app

## Design Principles
- Keep the UI design as minimal as possible
- Keep the UI sleek, modern, minimal, cool, and full of rounded corners
- Pitch black background with colorful cards as part of UI

## Session and Scoring
- Also the past games are for only that session
- A session is basically around 2-2.5 hours at the court
- We switch players and play multiple games and keep score

## State Management & Persistence
- **Zustand** for global state management (lightweight, minimal boilerplate)
- **AsyncStorage** for data persistence across app restarts
- Will implement session state, player data, and game history persistence
- **Implementation Status**: To be implemented later - currently using local state

## Styling & NativeWind Reference

### NativeWind with React Native Setup
- **NativeWind** is a React Native library that uses Tailwind CSS classes via `className` prop
- **NOT standard Tailwind CSS** - this is specifically for React Native/Expo projects
- Compiles Tailwind styles into React Native `StyleSheet.create` objects at build time
- Works across React Native platforms (iOS, Android, Web)
- Supports media queries, dark mode, pseudo-classes, and CSS variables

### Key Features
- Use `className` directly on React Native components (`View`, `Text`, `TouchableOpacity`) instead of `style` prop
- Supports custom values and CSS variables defined in `tailwind.config.js`
- Conditional styling with dynamic class names
- Platform-specific selectors available
- Integrates with Expo Router and React Navigation

### Installation & Configuration
```bash
# NativeWind installation (NOT standard Tailwind)
npm install nativewind
npm install --dev tailwindcss
```

### Configuration Files
- `tailwind.config.js` - Custom theme configuration with app-specific colors
- `metro.config.js` - Configured with `withNativeWind` wrapper
- `global.css` - Contains `@tailwind` directives, imported in `app/_layout.tsx`
- `nativewind-env.d.ts` - TypeScript definitions for NativeWind

### Usage Example
```javascript
// React Native components with NativeWind className
import { View, Text, TouchableOpacity } from 'react-native';

<View className="flex-1 bg-app-black p-5">
  <Text className="text-app-text-primary text-2xl font-bold">Title</Text>
  <TouchableOpacity className="bg-app-primary rounded-xl-plus py-4">
    <Text className="text-app-white font-semibold">Button</Text>
  </TouchableOpacity>
</View>

// Dynamic classes
const classNames = [];
if (bold) classNames.push("font-bold");
if (italic) classNames.push("italic");
<Text className={classNames.join(" ")} />
```

### Important Notes
- This is **NativeWind for React Native**, not standard Tailwind CSS for web
- Uses React Native components (`View`, `Text`) not HTML elements (`div`, `p`)
- CSS is imported in `app/_layout.tsx`, not individual components
- Styles compile to native `StyleSheet` objects for performance

## Custom CSS Variables Reference

### Colors (use with `bg-`, `text-`, `border-` prefixes)

**Base Colors:**
- `app-black` - #000000 (main background)
- `app-white` - #FFFFFF 
- `app-primary` - #6c935c (badminton court green)
- `app-secondary` - #6366F1 (indigo secondary)
- `app-success` - #22C55E (green success)
- `app-info` - #3B82F6 (blue info)
- `app-warning` - #F59E0B (amber warning)
- `app-danger` - #EF4444 (red danger)

**Card Styles:**
- `app-card` - rgba(255, 255, 255, 0.05) (glass card background)
- `app-card-border` - rgba(255, 255, 255, 0.1) (glass card border)
- `app-card-hover` - rgba(255, 255, 255, 0.08) (hover state)

**Success Variants:**
- `app-success-card` - rgba(34, 197, 94, 0.08) (green card background)
- `app-success-border` - rgba(34, 197, 94, 0.2) (green card border)
- `app-success-hover` - rgba(34, 197, 94, 0.12) (green hover)

**Primary Variants:**
- `app-primary-card` - rgba(108, 147, 92, 0.08) (badminton green card background)
- `app-primary-border` - rgba(108, 147, 92, 0.2) (badminton green card border)
- `app-primary-hover` - rgba(108, 147, 92, 0.12) (badminton green hover)

**Text Colors:**
- `app-text-primary` - #FFFFFF (main text)
- `app-text-secondary` - rgba(255, 255, 255, 0.8) (secondary text)
- `app-text-muted` - rgba(255, 255, 255, 0.6) (muted text)
- `app-text-disabled` - rgba(255, 255, 255, 0.4) (disabled text)

**Modal/Overlay:**
- `app-overlay` - rgba(0, 0, 0, 0.5) (modal backdrop)
- `app-modal-bg` - #1F2937 (modal background)
- `app-modal-border` - rgba(255, 255, 255, 0.1) (modal borders)

**Interactive States:**
- `app-selected` - rgba(59, 130, 246, 0.15) (selected state background)
- `app-selected-border` - #3B82F6 (selected state border)
- `app-disabled` - rgba(107, 114, 128, 0.5) (disabled state)

### Border Radius
- `rounded-xl-plus` - 20px
- `rounded-2xl-plus` - 24px
- `rounded-3xl` - 28px (custom override)

### Usage Examples
```javascript
// Main app background
<View className="bg-app-black">

// Primary button
<TouchableOpacity className="bg-app-primary rounded-xl-plus">
  <Text className="text-app-white">Button</Text>
</TouchableOpacity>

// Glass card
<View className="bg-app-card border border-app-card-border rounded-xl-plus">
  <Text className="text-app-text-primary">Content</Text>
  <Text className="text-app-text-muted">Subtitle</Text>
</View>

// Success card (past games)
<View className="bg-app-success-card border border-app-success-border">
  <Text className="text-app-success">Score: 21-15</Text>
</View>
```