import BadmintonCourt from "@/components/BadmintonCourt";
import { Scoreboard } from "@/components/Scoreboard";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function GameScreen() {
  const { sessionId } = useLocalSearchParams();
  const getCurrentGame = useSessionStore((state) => state.getCurrentGame);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const leftScoreboardX = useSharedValue(0);
  const rightScoreboardX = useSharedValue(0);

  const leftScoreboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftScoreboardX.value }],
  }));

  const rightScoreboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightScoreboardX.value }],
  }));

  const [isSwapped, setIsSwapped] = useState(false);
  const handleSwapTeams = () => {
    leftScoreboardX.value = withTiming(-400, { duration: 400 });
    rightScoreboardX.value = withTiming(400, { duration: 400 }, () => {
      // Swap teams after out animation
      runOnJS(setIsSwapped)((prev) => !prev);
      // Move scoreboards in from opposite sides
      leftScoreboardX.value = 400;
      rightScoreboardX.value = -400;
      leftScoreboardX.value = withTiming(0, { duration: 400 });
      rightScoreboardX.value = withTiming(0, { duration: 400 });
    });
  };

  // Retrieve game and team data
  const game = getCurrentGame(sessionId as string);

  const duoA = game?.teamA ? getDuoById(game.teamA.duoId) : undefined;
  const duoB = game?.teamB ? getDuoById(game.teamB.duoId) : undefined;

  const teamAPlayerNames = useMemo(() => {
    const teamAPlayerIds = duoA?.playerIds ?? [];
    return teamAPlayerIds.map((id) => getPlayerById(id)?.name ?? "");
  }, [duoA, getPlayerById]);

  const teamBPlayerNames = useMemo(() => {
    const teamBPlayerIds = duoB?.playerIds ?? [];
    return teamBPlayerIds.map((id) => getPlayerById(id)?.name ?? "");
  }, [duoB, getPlayerById]);

  // Score and server logic
  const [scoreA, setScoreA] = useState(game?.teamA.score ?? 0);
  const [scoreB, setScoreB] = useState(game?.teamB.score ?? 0);
  const [server, setServer] = useState<"A" | "B">("A");

  // Server index: even points = right court (1), odd = left court (0)
  const servingScore = server === "A" ? scoreA : scoreB;
  const serverIndex = servingScore % 2 === 0 ? 0 : 1;

  // Game completion logic
  const reachedMaxScore = scoreA >= 21 || scoreB >= 21;
  const reachedMinScoreWithDiff =
    (scoreA >= 15 || scoreB >= 15) && Math.abs(scoreA - scoreB) >= 2;
  const isGameComplete = reachedMaxScore || reachedMinScoreWithDiff;

  const teamApos = {
    top: teamAPlayerNames[0],
    bottom: teamAPlayerNames[1],
  };
  const teamBpos = {
    top: teamBPlayerNames[0],
    bottom: teamBPlayerNames[1],
  };

  const handleScore = (team: "A" | "B") => {
    if (isGameComplete) return;
    if (team !== server) {
      setServer(team);
    }
    if (team === "A") setScoreA((prev) => prev + 1);
    else setScoreB((prev) => prev + 1);
  };

  const handleEndGame = () => {
    router.push({
      pathname: "/session",
      params: { sessionId },
    });
  };

  if (!game) {
    return (
      <View className="flex-1 items-center justify-center bg-app-black">
        <Text className="text-white">No active game found.</Text>
      </View>
    );
  }

  if (!duoA || !duoB) {
    return (
      <View className="flex-1 items-center justify-center bg-app-black">
        <Text className="text-white">Team information missing.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-black p-5">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 flex-1">Game</Text>
        <TouchableOpacity
          onPress={handleEndGame}
          className="bg-red-600 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-bold">End Game</Text>
        </TouchableOpacity>
      </View>

      {/* Game Content */}
      <View className="mt-2 mx-2 flex-1 flex-row">
        {/* Left Scoreboard */}
        <Animated.View style={[leftScoreboardStyle]} className="mr-2">
          <Scoreboard
            teamName={isSwapped ? "Team B" : "Team A"}
            score={isSwapped ? scoreB : scoreA}
            onScore={() => handleScore(isSwapped ? "B" : "A")}
            disabled={isGameComplete}
          />
        </Animated.View>

        {/* Badminton Court */}
        <View className="flex-1">
          <BadmintonCourt
            leftTeam={teamApos}
            rightTeam={teamBpos}
            server={server}
            serverIndex={serverIndex}
            onSwapTeams={handleSwapTeams}
          />
        </View>

        {/* Right Scoreboard */}
        <Animated.View style={[rightScoreboardStyle]} className="ml-2">
          <Scoreboard
            teamName={isSwapped ? "Team A" : "Team B"}
            score={isSwapped ? scoreA : scoreB}
            onScore={() => handleScore(isSwapped ? "A" : "B")}
            disabled={isGameComplete}
          />
        </Animated.View>
      </View>

      {isGameComplete && (
        <View className="items-center mb-4">
          <Text className="text-app-success text-xl font-bold">
            Game Complete!
          </Text>
        </View>
      )}
    </View>
  );
}
