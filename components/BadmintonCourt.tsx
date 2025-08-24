import { useSessionStore } from "@/stores/sessionStore";
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
  sessionId: string;
  teamA: { player1Name: string; player2Name: string };
  teamB: { player1Name: string; player2Name: string };
  server: "A" | "B";
  serverIndex: number;
  gameStarted: boolean;
  isTeamSwapped: boolean;
  isTeamASwapped: boolean;
  isTeamBSwapped: boolean;
  onSwapTeams: () => void;
  onSwapServer: () => void;
}

export const BadmintonCourt = ({
  sessionId,
  teamA,
  teamB,
  server,
  serverIndex,
  gameStarted,
  isTeamSwapped,
  isTeamASwapped,
  isTeamBSwapped,
  onSwapTeams,
  onSwapServer,
}: BadmintonCourtProps) => {
  const getCurrentGame = useSessionStore((state) => state.getCurrentGame);
  const updateSession = useSessionStore((state) => state.updateSession);
  const currentGame = getCurrentGame(sessionId as string);

  useEffect(() => {
    if (server === "A") {
      animateVerticalSwap(
        teamAPlayer1TranslateY,
        teamAPlayer2TranslateY,
        250,
        !isTeamASwapped
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeamASwapped, server]);

  useEffect(() => {
    if (server === "B") {
      animateVerticalSwap(
        teamBPlayer1TranslateY,
        teamBPlayer2TranslateY,
        250,
        !isTeamBSwapped
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeamBSwapped, server]);

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

  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      // Horizontal swap
      if (isTeamSwapped) {
        teamAPlayer1TranslateX.value = 310;
        teamAPlayer2TranslateX.value = 310;
        teamBPlayer1TranslateX.value = -310;
        teamBPlayer2TranslateX.value = -310;
      } else {
        teamAPlayer1TranslateX.value = 0;
        teamAPlayer2TranslateX.value = 0;
        teamBPlayer1TranslateX.value = 0;
        teamBPlayer2TranslateX.value = 0;
      }
      // Vertical swap for Team A
      if (isTeamASwapped) {
        teamAPlayer1TranslateY.value = 115;
        teamAPlayer2TranslateY.value = -115;
      } else {
        teamAPlayer1TranslateY.value = 0;
        teamAPlayer2TranslateY.value = 0;
      }
      // Vertical swap for Team B
      if (isTeamBSwapped) {
        teamBPlayer1TranslateY.value = 115;
        teamBPlayer2TranslateY.value = -115;
      } else {
        teamBPlayer1TranslateY.value = 0;
        teamBPlayer2TranslateY.value = 0;
      }
      didInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeamSwapped, isTeamASwapped, isTeamBSwapped]);

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
    if (!currentGame) return;
    animateVerticalSwap(
      teamAPlayer1TranslateY,
      teamAPlayer2TranslateY,
      250,
      isTeamASwapped
    );
    updateSession(sessionId as string, {
      currentGame: {
        ...currentGame,
        isTeamASwapped: !isTeamASwapped,
      },
    });
  };

  const handleSwapTeamB = () => {
    if (!currentGame) return;

    animateVerticalSwap(
      teamBPlayer1TranslateY,
      teamBPlayer2TranslateY,
      250,
      isTeamBSwapped
    );
    updateSession(sessionId as string, {
      currentGame: {
        ...currentGame,
        isTeamBSwapped: !isTeamBSwapped,
      },
    });
  };

  const handleSwapTeams = () => {
    animateHorizontalSwap(
      teamAPlayer1TranslateX,
      teamAPlayer2TranslateX,
      teamBPlayer1TranslateX,
      teamBPlayer2TranslateX,
      500,
      isTeamSwapped
    );
    onSwapTeams();
  };

  function getShuttlecockTargetPosition(
    server: "A" | "B",
    serverIndex: number
  ) {
    let visualServer = server;
    if (isTeamSwapped) {
      visualServer = server === "A" ? "B" : "A";
    }

    if (visualServer === "A" && serverIndex === 0) return { x: 130, y: 130 }; // Bottom left
    if (visualServer === "A" && serverIndex === 1) return { x: 130, y: 75 }; // Top left
    if (visualServer === "B" && serverIndex === 0) return { x: 340, y: 75 }; // Top right
    if (visualServer === "B" && serverIndex === 1) return { x: 340, y: 130 }; // Bottom right
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
                  onPress={isTeamSwapped ? handleSwapTeamB : handleSwapTeamA}
                />
              </View>

              {/* Right Side Player Swap Button */}
              <View className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
                <SwapButton
                  direction="vertical"
                  onPress={isTeamSwapped ? handleSwapTeamA : handleSwapTeamB}
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
                          // zIndex: 1,
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
                        // zIndex: 2,
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
};
