import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SwapButton from "./SwapButton";

interface BadmintonCourtProps {
  teamA: { player1Name: string; player2Name: string };
  teamB: { player1Name: string; player2Name: string };
  server: "A" | "B";
  serverIndex: number;
  gameStarted: boolean;
  onSwapTeams: () => void;
  onSwapServer: () => void;
}

export default function BadmintonCourt({
  teamA,
  teamB,
  server,
  serverIndex,
  gameStarted,
  onSwapTeams,
  onSwapServer,
}: BadmintonCourtProps) {
  // Track previous server to detect changes
  const prevServer = useRef<"A" | "B" | null>(null);
  const prevServerIndex = useRef<number | null>(null);

  useEffect(() => {
    if (prevServer.current !== null && prevServerIndex.current !== null) {
      // Only trigger swap if server stays the same and serverIndex changes
      if (
        prevServer.current === server &&
        prevServerIndex.current !== serverIndex
      ) {
        if (server === "A") {
          handleSwapTeamA();
        } else if (server === "B") {
          handleSwapTeamB();
        }
      }
    }
    prevServer.current = server;
    prevServerIndex.current = serverIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, serverIndex]);

  useEffect(() => {
    const { x, y } = getShuttlecockTargetPosition(server, serverIndex);
    shuttlecockX.value = withTiming(x, { duration: 250 });
    shuttlecockY.value = withTiming(y, { duration: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, serverIndex]);

  // Slide animation shared values
  const teamAPlayer1TranslateX = useSharedValue(0);
  const teamAPlayer1TranslateY = useSharedValue(0);
  const teamAPlayer2TranslateX = useSharedValue(0);
  const teamAPlayer2TranslateY = useSharedValue(0);
  const teamBPlayer1TranslateX = useSharedValue(0);
  const teamBPlayer1TranslateY = useSharedValue(0);
  const teamBPlayer2TranslateX = useSharedValue(0);
  const teamBPlayer2TranslateY = useSharedValue(0);
  const shuttlecockX = useSharedValue(0);
  const shuttlecockY = useSharedValue(0);
  const swapServerButtonRotation = useSharedValue(0);

  const teamASwapped = useRef(false);
  const teamBSwapped = useRef(false);
  const teamSwapped = useRef(false);

  // Animated styles using transforms
  const teamAPlayer1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: teamAPlayer1TranslateX.value },
      { translateY: teamAPlayer1TranslateY.value },
    ],
  }));

  const teamAPlayer2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: teamAPlayer2TranslateX.value },
      { translateY: teamAPlayer2TranslateY.value },
    ],
  }));

  const teamBPlayer1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: teamBPlayer1TranslateX.value },
      { translateY: teamBPlayer1TranslateY.value },
    ],
  }));

  const teamBPlayer2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: teamBPlayer2TranslateX.value },
      { translateY: teamBPlayer2TranslateY.value },
    ],
  }));

  const shuttlecockStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: shuttlecockX.value,
    top: shuttlecockY.value,
  }));

  const swapServerButtonStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swapServerButtonRotation.value}deg` }],
  }));

  /// Helper for vertical swap animation
  const animateVerticalSwap = (
    player1TranslateY: typeof teamAPlayer1TranslateY,
    player2TranslateY: typeof teamAPlayer2TranslateY,
    animationTime: number,
    swapped: boolean
  ) => {
    if (swapped) {
      player1TranslateY.value = withTiming(0, { duration: animationTime });
      player2TranslateY.value = withTiming(0, { duration: animationTime });
    } else {
      player1TranslateY.value = withTiming(115, { duration: animationTime });
      player2TranslateY.value = withTiming(-115, { duration: animationTime });
    }
  };

  // Helper for horizontal swap animation
  const animateHorizontalSwap = (
    teamAplayer1TranslateX: typeof teamAPlayer1TranslateX,
    teamAplayer2TranslateX: typeof teamAPlayer2TranslateX,
    teamBplayer1TranslateX: typeof teamBPlayer1TranslateX,
    teamBplayer2TranslateX: typeof teamBPlayer2TranslateX,
    animationTime: number,
    swapped: boolean
  ) => {
    if (swapped) {
      teamAplayer1TranslateX.value = withTiming(0, { duration: animationTime });
      teamAplayer2TranslateX.value = withTiming(0, { duration: animationTime });
      teamBplayer1TranslateX.value = withTiming(0, { duration: animationTime });
      teamBplayer2TranslateX.value = withTiming(0, { duration: animationTime });
    } else {
      teamAplayer1TranslateX.value = withTiming(310, {
        duration: animationTime,
      });
      teamAplayer2TranslateX.value = withTiming(310, {
        duration: animationTime,
      });
      teamBplayer1TranslateX.value = withTiming(-310, {
        duration: animationTime,
      });
      teamBplayer2TranslateX.value = withTiming(-310, {
        duration: animationTime,
      });
    }
  };

  // Swap functions with slide animations
  const handleSwapTeamA = () => {
    animateVerticalSwap(
      teamAPlayer1TranslateY,
      teamAPlayer2TranslateY,
      250,
      teamASwapped.current
    );
    teamASwapped.current = !teamASwapped.current;
  };

  const handleSwapTeamB = () => {
    animateVerticalSwap(
      teamBPlayer1TranslateY,
      teamBPlayer2TranslateY,
      250,
      teamBSwapped.current
    );
    teamBSwapped.current = !teamBSwapped.current;
  };

  const handleSwapTeams = () => {
    animateHorizontalSwap(
      teamAPlayer1TranslateX,
      teamAPlayer2TranslateX,
      teamBPlayer1TranslateX,
      teamBPlayer2TranslateX,
      500,
      teamSwapped.current
    );
    teamSwapped.current = !teamSwapped.current;
    onSwapTeams();
  };

  function getShuttlecockTargetPosition(
    server: "A" | "B",
    serverIndex: number
  ) {
    // Adjust these values to match your court layout
    if (server === "A" && serverIndex === 0) return { x: 130, y: 130 }; // Bottom left
    if (server === "A" && serverIndex === 1) return { x: 130, y: 75 }; // Top left
    if (server === "B" && serverIndex === 0) return { x: 340, y: 75 }; // Top right
    if (server === "B" && serverIndex === 1) return { x: 340, y: 130 }; // Bottom right
    return { x: 130, y: 75 };
  }

  return (
    <View className="flex-1 bg-app-primary rounded-xl-plus p-6">
      <View className="flex-1 border-2 border-white rounded-lg p-1">
        <View className="flex-1 flex-col relative">
          {/* Net line (now vertical) */}
          <View className="absolute top-0 bottom-0 left-1/2 w-0.5 opacity-60 border-l-2 border-dashed border-app-white" />

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

          {/* Shuttlecock Icon */}
          <Animated.View style={shuttlecockStyle}>
            <MaterialCommunityIcons name="badminton" size={20} color="#fff" />
          </Animated.View>

          {/* Swap Buttons */}
          {!gameStarted && (
            <>
              {/* Left Side Player Swap Button */}
              <View className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
                <SwapButton
                  direction="vertical"
                  onPress={
                    teamSwapped.current ? handleSwapTeamB : handleSwapTeamA
                  }
                />
              </View>

              {/* Right Side Player Swap Button */}
              <View className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
                <SwapButton
                  direction="vertical"
                  onPress={
                    teamSwapped.current ? handleSwapTeamA : handleSwapTeamB
                  }
                />
              </View>

              {/* Center Team Swap Button */}
              <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <SwapButton direction="horizontal" onPress={handleSwapTeams} />
              </View>

              {/* Swap Server Button */}
              <View className="absolute left-1/2 -bottom-6 -translate-x-1/2 z-10">
                <TouchableOpacity
                  onPress={() => {
                    swapServerButtonRotation.value = withTiming(
                      swapServerButtonRotation.value + 180,
                      {
                        duration: 300,
                      }
                    );
                    onSwapServer();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1b373dcf",
                    borderRadius: 50,
                    padding: 5,
                    opacity: 1,
                    elevation: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.7,
                    shadowRadius: 4,
                  }}
                  activeOpacity={0.6}
                >
                  <View
                    style={{
                      position: "relative",
                      width: 35,
                      height: 35,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Circular arrows */}
                    <Animated.View
                      style={[
                        {
                          position: "absolute",
                          zIndex: 1,
                          opacity: 0.5,
                        },
                        swapServerButtonStyle,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="autorenew"
                        size={35}
                        color="#fff"
                      />
                    </Animated.View>
                    {/* Shuttlecock icon */}
                    <MaterialCommunityIcons
                      name="badminton"
                      size={14}
                      color="#fff"
                      style={{
                        position: "absolute",
                        zIndex: 2,
                        opacity: 0.8,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Top row */}
          <View className="flex-1 flex-row">
            <Animated.View
              className="flex-1 mr-40 items-center justify-center"
              style={[teamAPlayer1Style]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  {teamA.player1Name}
                </Text>
              </View>
            </Animated.View>
            <Animated.View
              className="flex-1 items-center justify-center"
              style={[teamBPlayer1Style]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  {teamB.player1Name}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Bottom row */}
          <View className="flex-1 flex-row">
            <Animated.View
              className="flex-1 mr-40 items-center justify-center"
              style={[teamAPlayer2Style]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  {teamA.player2Name}
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              className="flex-1 items-center justify-center"
              style={[teamBPlayer2Style]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  {teamB.player2Name}
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}
