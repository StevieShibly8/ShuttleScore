import BadmintonCourt from "@/components/BadmintonCourt";
import QuitConfirmPopup from "@/components/QuitConfirmPopup";
import { Scoreboard } from "@/components/Scoreboard";
import { useDuoStore } from "@/stores/duoStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSessionStore } from "@/stores/sessionStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function GameScreen() {
  const { sessionId } = useLocalSearchParams();
  const getSessionById = useSessionStore((state) => state.getSessionById);
  const updateSession = useSessionStore((state) => state.updateSession);
  const getDuoById = useDuoStore((state) => state.getDuoById);
  const getPlayerById = usePlayerStore((state) => state.getPlayerById);
  const endCurrentGame = useSessionStore((state) => state.endCurrentGame);
  const updatePlayer = usePlayerStore((state) => state.updatePlayer);
  const updateDuo = useDuoStore((state) => state.updateDuo);

  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

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
    leftScoreboardX.value = withTiming(-400, { duration: 250 });
    rightScoreboardX.value = withTiming(400, { duration: 250 }, () => {
      // Swap teams after out animation
      runOnJS(setIsSwapped)(!isSwapped);
      leftScoreboardX.value = withTiming(0, { duration: 250 });
      rightScoreboardX.value = withTiming(0, { duration: 250 });
    });
  };

  const game = useSessionStore((state) =>
    state.getCurrentGame(sessionId as string)
  );

  const teamA = game?.teamA;
  const teamB = game?.teamB;

  const duoA = teamA ? getDuoById(teamA.duoId) : undefined;
  const duoB = teamB ? getDuoById(teamB.duoId) : undefined;

  const scoreA = teamA?.score ?? 0;
  const scoreB = teamB?.score ?? 0;

  const teamAPlayer1 = duoA?.playerIds?.[0]
    ? getPlayerById(duoA.playerIds[0])
    : undefined;
  const teamAPlayer2 = duoA?.playerIds?.[1]
    ? getPlayerById(duoA.playerIds[1])
    : undefined;
  const teamBPlayer1 = duoB?.playerIds?.[0]
    ? getPlayerById(duoB.playerIds[0])
    : undefined;
  const teamBPlayer2 = duoB?.playerIds?.[1]
    ? getPlayerById(duoB.playerIds[1])
    : undefined;

  const [server, setServer] = useState<"A" | "B">("A");
  const handleSwapServer = () =>
    setServer((prev) => (prev === "A" ? "B" : "A"));

  // Server index: even points = right court (0), odd = left court (1)
  const servingScore = server === "A" ? scoreA : scoreB;
  const serverIndex = servingScore % 2 === 0 ? 0 : 1;

  // Game completion logic
  const reachedMaxScore = scoreA >= 21 || scoreB >= 21;
  const reachedMinScoreWithDiff =
    (scoreA >= 15 || scoreB >= 15) && Math.abs(scoreA - scoreB) >= 2;
  const isGameComplete: boolean = reachedMaxScore || reachedMinScoreWithDiff;

  const [gameStarted, setGameStarted] = useState(false);

  const handleScoreA = () => {
    if (isGameComplete) return;
    if (!gameStarted) setGameStarted(true);
    if (server !== "A") setServer("A");

    if (!game) return;

    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        teamA: {
          ...game.teamA,
          score: scoreA + 1,
        },
      },
    });
  };

  const handleScoreB = () => {
    if (isGameComplete) return;
    if (!gameStarted) setGameStarted(true);
    if (server !== "B") setServer("B");

    if (!game) return;

    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        teamB: {
          ...game.teamB,
          score: scoreB + 1,
        },
      },
    });
  };

  const updateDuoStats = () => {
    if (!duoA || !duoB) return;
    if (!isGameComplete) return;

    if (scoreA > scoreB) {
      updateDuo(duoA.id, { wins: (duoA.wins ?? 0) + 1 });
      updateDuo(duoB.id, { losses: (duoB.losses ?? 0) + 1 });
    } else if (scoreB > scoreA) {
      updateDuo(duoB.id, { wins: (duoB.wins ?? 0) + 1 });
      updateDuo(duoA.id, { losses: (duoA.losses ?? 0) + 1 });
    }
  };

  const updatePlayerStats = () => {
    if (!teamAPlayer1 || !teamAPlayer2 || !teamBPlayer1 || !teamBPlayer2)
      return;
    if (!isGameComplete) return;

    if (scoreA > scoreB) {
      updatePlayer(teamAPlayer1.id, { wins: (teamAPlayer1.wins ?? 0) + 1 });
      updatePlayer(teamAPlayer2.id, { wins: (teamAPlayer2.wins ?? 0) + 1 });
      updatePlayer(teamBPlayer1.id, { losses: (teamBPlayer1.losses ?? 0) + 1 });
      updatePlayer(teamBPlayer2.id, { losses: (teamBPlayer2.losses ?? 0) + 1 });
    } else if (scoreB > scoreA) {
      updatePlayer(teamBPlayer1.id, { wins: (teamBPlayer1.wins ?? 0) + 1 });
      updatePlayer(teamBPlayer2.id, { wins: (teamBPlayer2.wins ?? 0) + 1 });
      updatePlayer(teamAPlayer1.id, { losses: (teamAPlayer1.losses ?? 0) + 1 });
      updatePlayer(teamAPlayer2.id, { losses: (teamAPlayer2.losses ?? 0) + 1 });
    }
  };

  const updateSessionStats = () => {
    const session = getSessionById(sessionId as string);
    if (
      !session ||
      !duoA ||
      !duoB ||
      !teamAPlayer1 ||
      !teamAPlayer2 ||
      !teamBPlayer1 ||
      !teamBPlayer2
    )
      return;
    if (!isGameComplete) return;

    // Prepare updated stats
    const gamesPlayedPerPlayer = {
      ...session.gamesPlayedPerPlayer,
      [teamAPlayer1.id]:
        (session.gamesPlayedPerPlayer[teamAPlayer1.id] ?? 0) + 1,
      [teamAPlayer2.id]:
        (session.gamesPlayedPerPlayer[teamAPlayer2.id] ?? 0) + 1,
      [teamBPlayer1.id]:
        (session.gamesPlayedPerPlayer[teamBPlayer1.id] ?? 0) + 1,
      [teamBPlayer2.id]:
        (session.gamesPlayedPerPlayer[teamBPlayer2.id] ?? 0) + 1,
    };
    const gamesPlayedPerDuo = {
      ...session.gamesPlayedPerDuo,
      [duoA.id]: (session.gamesPlayedPerDuo[duoA.id] ?? 0) + 1,
      [duoB.id]: (session.gamesPlayedPerDuo[duoB.id] ?? 0) + 1,
    };

    let gamesWonPerPlayer = { ...session.gamesWonPerPlayer };
    let gamesWonPerDuo = { ...session.gamesWonPerDuo };
    let priorityPickPlayerIds: string[] = [];

    if (scoreA > scoreB) {
      gamesWonPerPlayer = {
        ...gamesWonPerPlayer,
        [teamAPlayer1.id]: (gamesWonPerPlayer[teamAPlayer1.id] ?? 0) + 1,
        [teamAPlayer2.id]: (gamesWonPerPlayer[teamAPlayer2.id] ?? 0) + 1,
      };
      gamesWonPerDuo = {
        ...gamesWonPerDuo,
        [duoA.id]: (gamesWonPerDuo[duoA.id] ?? 0) + 1,
      };
      const newPicks = [teamAPlayer1.id, teamAPlayer2.id].filter(
        (id) => !(session.priorityPickPlayerIds ?? []).includes(id)
      );
      priorityPickPlayerIds = newPicks;
    } else if (scoreB > scoreA) {
      gamesWonPerPlayer = {
        ...gamesWonPerPlayer,
        [teamBPlayer1.id]: (gamesWonPerPlayer[teamBPlayer1.id] ?? 0) + 1,
        [teamBPlayer2.id]: (gamesWonPerPlayer[teamBPlayer2.id] ?? 0) + 1,
      };
      gamesWonPerDuo = {
        ...gamesWonPerDuo,
        [duoB.id]: (gamesWonPerDuo[duoB.id] ?? 0) + 1,
      };
      const newPicks = [teamBPlayer1.id, teamBPlayer2.id].filter(
        (id) => !(session.priorityPickPlayerIds ?? []).includes(id)
      );
      priorityPickPlayerIds = newPicks;
    }

    updateSession(sessionId as string, {
      ...session,
      gamesPlayedPerPlayer,
      gamesPlayedPerDuo,
      gamesWonPerPlayer,
      gamesWonPerDuo,
      priorityPickPlayerIds,
    });
  };

  if (!game) {
    return (
      <View className="flex-1 items-center justify-center bg-app-background">
        <Text className="text-white">No active game found.</Text>
      </View>
    );
  }

  if (!duoA || !duoB) {
    return (
      <View className="flex-1 items-center justify-center bg-app-background">
        <Text className="text-white">Team information missing.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-background p-5">
      {/* Header */}
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 flex-1">Session</Text>
        <TouchableOpacity
          onPress={() => setShowQuitConfirm(true)}
          className="bg-app-danger py-4 px-4 rounded-xl-plus items-center shadow-lg"
        >
          <Text className="text-white font-bold">Quit Game</Text>
        </TouchableOpacity>
      </View>

      {/* Quit Confirmation Popup */}
      <QuitConfirmPopup
        visible={showQuitConfirm}
        messageTitle="Are you sure you want to quit the game?"
        messageBody="Your progress will be lost!"
        cancelText="Cancel"
        confirmText="Quit"
        cancelButtonColor="#444"
        confirmButtonColor="#921721bc"
        onCancel={() => setShowQuitConfirm(false)}
        onQuit={() => {
          setShowQuitConfirm(false);
          endCurrentGame(sessionId as string, isGameComplete);
          router.back();
        }}
      />

      {/* Game Content */}
      <View className="mt-2 mx-2 flex-1 flex-row">
        {/* Left Scoreboard */}
        <Animated.View style={[leftScoreboardStyle]} className="mr-2">
          <Scoreboard
            teamName={isSwapped ? "Team B" : "Team A"}
            score={isSwapped ? scoreB : scoreA}
            onScore={() => (isSwapped ? handleScoreB : handleScoreA)()}
            disabled={isGameComplete}
          />
        </Animated.View>

        {/* Badminton Court */}
        <View className="flex-1">
          <BadmintonCourt
            teamA={{
              player1Name: teamAPlayer1?.name ?? "",
              player2Name: teamAPlayer2?.name ?? "",
            }}
            teamB={{
              player1Name: teamBPlayer1?.name ?? "",
              player2Name: teamBPlayer2?.name ?? "",
            }}
            server={server}
            serverIndex={serverIndex}
            gameStarted={gameStarted}
            onSwapTeams={handleSwapTeams}
            onSwapServer={handleSwapServer}
          />
        </View>

        {/* Right Scoreboard */}
        <Animated.View style={[rightScoreboardStyle]} className="ml-2">
          <Scoreboard
            teamName={isSwapped ? "Team A" : "Team B"}
            score={isSwapped ? scoreA : scoreB}
            onScore={() => (isSwapped ? handleScoreA : handleScoreB)()}
            disabled={isGameComplete}
          />
        </Animated.View>
      </View>

      {/* Game Complete Overlay */}
      {isGameComplete && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <View
            style={{
              backgroundColor: "#222",
              padding: 32,
              borderRadius: 16,
              alignItems: "center",
              minWidth: 280,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Game Complete!
            </Text>
            <TouchableOpacity
              onPress={() => {
                updateDuoStats();
                updatePlayerStats();
                updateSessionStats();
                endCurrentGame(sessionId as string, isGameComplete);
                router.replace({
                  pathname: "/pastGame",
                  params: { sessionId, gameId: game.id },
                });
              }}
              style={{
                backgroundColor: "#4ade80",
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
