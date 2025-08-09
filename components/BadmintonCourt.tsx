import { Text, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import SwapButton from "./SwapButton";

interface BadmintonCourtProps {
  leftTeam: { top: string; bottom: string };
  rightTeam: { top: string; bottom: string };
  onSwapLeftTeam: () => void;
  onSwapRightTeam: () => void;
  onSwapTeams: () => void;
}

export default function BadmintonCourt({ 
  leftTeam, 
  rightTeam, 
  onSwapLeftTeam, 
  onSwapRightTeam, 
  onSwapTeams 
}: BadmintonCourtProps) {

  // Slide animation shared values
  const leftTopTranslateY = useSharedValue(0);
  const leftBottomTranslateY = useSharedValue(0);
  const rightTopTranslateY = useSharedValue(0);
  const rightBottomTranslateY = useSharedValue(0);
  const leftTeamTranslateX = useSharedValue(0);
  const rightTeamTranslateX = useSharedValue(0);

  // Animated styles using transforms
  const leftTopStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftTopTranslateY.value }],
  }));

  const leftBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: leftBottomTranslateY.value }],
  }));

  const rightTopStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rightTopTranslateY.value }],
  }));

  const rightBottomStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rightBottomTranslateY.value }],
  }));

  const leftTeamStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftTeamTranslateX.value }],
  }));

  const rightTeamStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightTeamTranslateX.value }],
  }));

  // Swap functions with slide animations
  const handleSwapLeftTeam = () => {
    // Trigger parent callback
    onSwapLeftTeam();
    
    // Simple slide animation
    leftTopTranslateY.value = withTiming(60, { duration: 200 });
    leftBottomTranslateY.value = withTiming(-60, { duration: 200 });
    
    // Reset positions after animation
    setTimeout(() => {
      leftTopTranslateY.value = withTiming(0, { duration: 0 });
      leftBottomTranslateY.value = withTiming(0, { duration: 0 });
    }, 200);
  };

  const handleSwapRightTeam = () => {
    // Trigger parent callback
    onSwapRightTeam();
    
    // Simple slide animation
    rightTopTranslateY.value = withTiming(60, { duration: 200 });
    rightBottomTranslateY.value = withTiming(-60, { duration: 200 });
    
    // Reset positions after animation
    setTimeout(() => {
      rightTopTranslateY.value = withTiming(0, { duration: 0 });
      rightBottomTranslateY.value = withTiming(0, { duration: 0 });
    }, 200);
  };

  const handleSwapTeams = () => {
    // Trigger parent callback
    onSwapTeams();
    
    // Simple slide animation
    leftTeamTranslateX.value = withTiming(150, { duration: 200 });
    rightTeamTranslateX.value = withTiming(-150, { duration: 200 });
    
    // Reset positions after animation
    setTimeout(() => {
      leftTeamTranslateX.value = withTiming(0, { duration: 0 });
      rightTeamTranslateX.value = withTiming(0, { duration: 0 });
    }, 200);
  };

  return (
    <View className="flex-1 bg-app-primary rounded-xl-plus p-6">
      <View className="flex-1 border-2 border-white rounded-lg p-2">
        <View className="flex-1 flex-col relative">
          {/* Net line (now vertical) */}
          <View className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-80" style={{
            borderStyle: 'dashed',
            borderLeftWidth: 2,
            borderLeftColor: 'white',
            backgroundColor: 'transparent'
          }} />
          
          {/* Short service line - left */}
          <View className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white opacity-60" />
          
          {/* Short service line - right */}
          <View className="absolute top-0 bottom-0 right-1/3 w-0.5 bg-white opacity-60" />
          
          {/* Top singles service line */}
          <View className="absolute top-4 left-0 right-0 h-0.5 bg-white opacity-60" />
          
          {/* Bottom singles service line */}
          <View className="absolute bottom-4 left-0 right-0 h-0.5 bg-white opacity-60" />
          
          {/* Left doubles service line */}
          <View className="absolute left-4 top-0 bottom-0 w-0.5 bg-white opacity-60" />
          
          {/* Right doubles service line */}
          <View className="absolute right-4 top-0 bottom-0 w-0.5 bg-white opacity-60" />
          
          {/* Center line - top court (from left border to short service line) */}
          <View className="absolute top-1/2 left-0 right-2/3 h-0.5 bg-white opacity-60" />
          
          {/* Center line - bottom court (from short service line to right border) */}
          <View className="absolute top-1/2 left-2/3 right-0 h-0.5 bg-white opacity-60" />
          
          {/* Left Side Player Swap Button */}
          <View className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            <SwapButton 
              direction="vertical"
              onPress={handleSwapLeftTeam}
            />
          </View>

          {/* Right Side Player Swap Button */}
          <View className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <SwapButton 
              direction="vertical"
              onPress={handleSwapRightTeam}
            />
          </View>

          {/* Center Team Swap Button */}
          <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <SwapButton 
              direction="horizontal"
              onPress={handleSwapTeams}
            />
          </View>
          
          {/* Top row */}
          <View className="flex-1 flex-row mb-1">
            <Animated.View className="flex-1 mr-1 items-center justify-center" style={[leftTeamStyle, leftTopStyle]}>
              <Text className="text-white text-sm font-semibold">{leftTeam.top}</Text>
            </Animated.View>
            <Animated.View className="flex-1 items-center justify-center" style={[rightTeamStyle, rightTopStyle]}>
              <Text className="text-white text-sm font-semibold">{rightTeam.top}</Text>
            </Animated.View>
          </View>
          
          {/* Bottom row */}
          <View className="flex-1 flex-row">
            <Animated.View className="flex-1 mr-1 items-center justify-center" style={[leftTeamStyle, leftBottomStyle]}>
              <Text className="text-white text-sm font-semibold">{leftTeam.bottom}</Text>
            </Animated.View>
            <Animated.View className="flex-1 items-center justify-center" style={[rightTeamStyle, rightBottomStyle]}>
              <Text className="text-white text-sm font-semibold">{rightTeam.bottom}</Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}