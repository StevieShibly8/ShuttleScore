import { BadmintonCourt } from "@/components/BadmintonCourt";
import { ModalPopup } from "@/components/ModalPopup";
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

  const [showQuitGameModal, setShowQuitGameModal] = useState(false);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

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

  const gamePoint = game?.gamePoint ?? 21;
  const pointCap = game?.pointCap ?? 30;

  const leftScoreboardX = useSharedValue(0);
  const rightScoreboardX = useSharedValue(0);

  const leftScoreboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftScoreboardX.value }],
  }));

  const rightScoreboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightScoreboardX.value }],
  }));

  const isTeamSwapped = game?.isTeamSwapped ?? false;
  const isTeamASwapped = game?.isTeamASwapped ?? false;
  const isTeamBSwapped = game?.isTeamBSwapped ?? false;

  const handleSwapTeams = () => {
    if (!game) return;
    leftScoreboardX.value = withTiming(-400, { duration: 250 });
    rightScoreboardX.value = withTiming(400, { duration: 250 }, () => {
      leftScoreboardX.value = withTiming(0, { duration: 250 });
      rightScoreboardX.value = withTiming(0, { duration: 250 });
    });
    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        isTeamSwapped: !isTeamSwapped,
        server: game.server === "A" ? "B" : "A", // keep this to keep shuttlecock on same team
      },
    });
  };

  const server = game?.server ?? "A";

  const handleSwapServer = () => {
    if (!game) return;
    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        server: game.server === "A" ? "B" : "A",
      },
    });
  };

  // Server index: even points = right court (0), odd = left court (1)
  const servingScore = server === "A" ? scoreA : scoreB;
  const serverIndex = servingScore % 2 === 0 ? 0 : 1;

  // Game completion logic
  const reachedMaxScore = scoreA >= pointCap || scoreB >= pointCap;
  const reachedMinScore = scoreA >= gamePoint || scoreB >= gamePoint;
  const twoPointLead = Math.abs(scoreA - scoreB) >= 2;
  // Game is complete if max score reached or min score with 2-point lead reached
  const isGameComplete: boolean =
    reachedMaxScore || (reachedMinScore && twoPointLead);

  const gameStarted = scoreA !== 0 || scoreB !== 0;

  const handleScoreA = () => {
    if (isGameComplete) return;
    if (!game) return;

    const newUndo: ("A" | "B")[] = [...(game.undoqueue ?? []), "A"];
    const isFirstScore = (game.undoqueue?.length ?? 0) === 0;
    const initialServer = isFirstScore ? server : game.initialServer;
    // Clear redoqueue on new action
    if (server !== "A") {
      updateSession(sessionId as string, {
        currentGame: {
          ...game,
          server: "A",
          teamA: {
            ...game.teamA,
            score: scoreA + 1,
          },
          undoqueue: newUndo,
          redoqueue: [],
          initialServer,
        },
      });
    } else {
      updateSession(sessionId as string, {
        currentGame: {
          ...game,
          teamA: {
            ...game.teamA,
            score: scoreA + 1,
          },
          isTeamASwapped: !game.isTeamASwapped,
          undoqueue: newUndo,
          redoqueue: [],
          initialServer,
        },
      });
    }
  };

  const handleScoreB = () => {
    if (isGameComplete) return;
    if (!game) return;

    const newUndo: ("A" | "B")[] = [...(game.undoqueue ?? []), "B"];
    const isFirstScore = (game.undoqueue?.length ?? 0) === 0;
    const initialServer = isFirstScore ? server : game.initialServer;
    // Clear redoqueue on new action
    if (server !== "B") {
      updateSession(sessionId as string, {
        currentGame: {
          ...game,
          server: "B",
          teamB: {
            ...game.teamB,
            score: scoreB + 1,
          },
          undoqueue: newUndo,
          redoqueue: [],
          initialServer,
        },
      });
    } else {
      updateSession(sessionId as string, {
        currentGame: {
          ...game,
          teamB: {
            ...game.teamB,
            score: scoreB + 1,
          },
          isTeamBSwapped: !game.isTeamBSwapped,
          undoqueue: newUndo,
          redoqueue: [],
          initialServer,
        },
      });
    }
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
    const getStarCount = (rp1: number, rp2: number) => {
      const avgRp = Math.min(((rp1 ?? 0) + (rp2 ?? 0)) / 2, 100);
      return Math.max(1, Math.floor(avgRp / 20) + 1);
    };

    const getRpChange = (starDiff: number, didWin: boolean) => {
      // starDiff = opponentStars - yourStars
      if (starDiff === 0) return didWin ? 3 : -2;
      if (starDiff === 1) return didWin ? 4 : -1;
      if (starDiff === 2) return didWin ? 5 : 0;
      if (starDiff === 3) return didWin ? 6 : 1;
      if (starDiff >= 4) return didWin ? 7 : 2;
      if (starDiff === -1) return didWin ? 3 : -2;
      if (starDiff === -2) return didWin ? 2 : -4;
      if (starDiff === -3) return didWin ? 1 : -6;
      if (starDiff <= -4) return didWin ? 1 : -8;
      return 0;
    };

    if (!teamAPlayer1 || !teamAPlayer2 || !teamBPlayer1 || !teamBPlayer2)
      return;
    if (!isGameComplete) return;

    // Calculate average RP and stars for both teams
    const teamAStars = getStarCount(teamAPlayer1.rp ?? 0, teamAPlayer2.rp ?? 0);
    const teamBStars = getStarCount(teamBPlayer1.rp ?? 0, teamBPlayer2.rp ?? 0);

    const starDiffA = teamBStars - teamAStars;
    const starDiffB = teamAStars - teamBStars;
    if (scoreA > scoreB) {
      // Team A wins
      const rpChangeA = getRpChange(starDiffA, true);
      const rpChangeB = getRpChange(starDiffB, false);

      updatePlayer(teamAPlayer1.id, {
        wins: (teamAPlayer1.wins ?? 0) + 1,
        rp: Math.max(0, (teamAPlayer1.rp ?? 0) + rpChangeA),
      });
      updatePlayer(teamAPlayer2.id, {
        wins: (teamAPlayer2.wins ?? 0) + 1,
        rp: Math.max(0, (teamAPlayer2.rp ?? 0) + rpChangeA),
      });
      updatePlayer(teamBPlayer1.id, {
        losses: (teamBPlayer1.losses ?? 0) + 1,
        rp: Math.max(0, (teamBPlayer1.rp ?? 0) + rpChangeB),
      });
      updatePlayer(teamBPlayer2.id, {
        losses: (teamBPlayer2.losses ?? 0) + 1,
        rp: Math.max(0, (teamBPlayer2.rp ?? 0) + rpChangeB),
      });
    } else if (scoreB > scoreA) {
      // Team B wins
      const rpChangeA = getRpChange(starDiffA, false);
      const rpChangeB = getRpChange(starDiffB, true);

      updatePlayer(teamBPlayer1.id, {
        wins: (teamBPlayer1.wins ?? 0) + 1,
        rp: Math.max(0, (teamBPlayer1.rp ?? 0) + rpChangeB),
      });
      updatePlayer(teamBPlayer2.id, {
        wins: (teamBPlayer2.wins ?? 0) + 1,
        rp: Math.max(0, (teamBPlayer2.rp ?? 0) + rpChangeB),
      });
      updatePlayer(teamAPlayer1.id, {
        losses: (teamAPlayer1.losses ?? 0) + 1,
        rp: Math.max(0, (teamAPlayer1.rp ?? 0) + rpChangeA),
      });
      updatePlayer(teamAPlayer2.id, {
        losses: (teamAPlayer2.losses ?? 0) + 1,
        rp: Math.max(0, (teamAPlayer2.rp ?? 0) + rpChangeA),
      });
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

  const handleUndo = () => {
    if (!game || !game.undoqueue || game.undoqueue.length === 0) return;
    const undoqueue = game.undoqueue;
    const last = undoqueue[undoqueue.length - 1];
    const secondLast =
      undoqueue.length > 1 ? undoqueue[undoqueue.length - 2] : undefined;

    let newServer: "A" | "B";
    if (undoqueue.length === 1) {
      newServer = game.initialServer ?? "A";
    } else if (last === secondLast) {
      newServer = last;
    } else {
      newServer = secondLast ?? game.initialServer ?? "A";
    }

    let newTeamA = { ...game.teamA };
    let newTeamB = { ...game.teamB };
    if (last === "A" && newTeamA.score > 0) newTeamA.score -= 1;
    if (last === "B" && newTeamB.score > 0) newTeamB.score -= 1;

    let isTeamASwapped = game.isTeamASwapped;
    let isTeamBSwapped = game.isTeamBSwapped;
    const servingTeamBeforeMove = secondLast ?? game.initialServer ?? "A";
    if (last === "A" && servingTeamBeforeMove === "A") {
      isTeamASwapped = !isTeamASwapped;
    }
    if (last === "B" && servingTeamBeforeMove === "B") {
      isTeamBSwapped = !isTeamBSwapped;
    }

    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        teamA: newTeamA,
        teamB: newTeamB,
        server: newServer,
        undoqueue: undoqueue.slice(0, -1),
        redoqueue: [...(game.redoqueue ?? []), last],
        isTeamASwapped,
        isTeamBSwapped,
      },
    });
  };

  const handleRedo = () => {
    if (!game || !game.redoqueue || game.redoqueue.length === 0) return;
    const last = game.redoqueue[game.redoqueue.length - 1];
    let newTeamA = { ...game.teamA };
    let newTeamB = { ...game.teamB };
    if (last === "A") newTeamA.score += 1;
    if (last === "B") newTeamB.score += 1;

    let isTeamASwapped = game.isTeamASwapped;
    let isTeamBSwapped = game.isTeamBSwapped;
    if (last === "A" && game.server === "A") {
      isTeamASwapped = !isTeamASwapped;
    }
    if (last === "B" && game.server === "B") {
      isTeamBSwapped = !isTeamBSwapped;
    }

    updateSession(sessionId as string, {
      currentGame: {
        ...game,
        teamA: newTeamA,
        teamB: newTeamB,
        server: last,
        undoqueue: [...(game.undoqueue ?? []), last],
        redoqueue: game.redoqueue.slice(0, -1),
        isTeamASwapped,
        isTeamBSwapped,
      },
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
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View className="flex-1" />

        <View style={{ flexDirection: "row", gap: 16 }}>
          {/* Undo Button */}
          <TouchableOpacity
            onPress={handleUndo}
            className="bg-app-secondary py-2 px-4 rounded-xl-plus"
            disabled={!game?.undoqueue?.length}
            style={{
              opacity: !game?.undoqueue?.length ? 0.2 : 1,
            }}
          >
            <Ionicons
              name="arrow-undo"
              size={22}
              color={!game?.undoqueue?.length ? "#bbb" : "#fff"}
            />
          </TouchableOpacity>
          {/* Redo Button */}
          <TouchableOpacity
            onPress={handleRedo}
            className="bg-app-secondary py-2 px-4 rounded-xl-plus"
            disabled={!game?.redoqueue?.length}
            style={{
              opacity: !game?.redoqueue?.length ? 0.2 : 1,
            }}
          >
            <Ionicons
              name="arrow-redo"
              size={22}
              color={!game?.redoqueue?.length ? "#bbb" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Quit Game Button */}
        <TouchableOpacity
          onPress={() => setShowQuitGameModal(true)}
          className="bg-app-danger py-4 px-4 ml-16 rounded-xl-plus items-center shadow-lg"
        >
          <Text className="text-white font-bold">Quit Game</Text>
        </TouchableOpacity>
      </View>

      {/* Game Content */}
      <View className="mt-2 mx-2 flex-1 flex-row">
        {/* Left Scoreboard */}
        <Animated.View style={[leftScoreboardStyle]} className="mr-2">
          <Scoreboard
            teamName={isTeamSwapped ? "Team B" : "Team A"}
            score={isTeamSwapped ? scoreB : scoreA}
            onScore={() => (isTeamSwapped ? handleScoreB : handleScoreA)()}
            disabled={isGameComplete}
          />
        </Animated.View>

        {/* Badminton Court */}
        <View className="flex-1">
          <BadmintonCourt
            sessionId={sessionId as string}
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
            isTeamSwapped={isTeamSwapped}
            isTeamASwapped={isTeamASwapped}
            isTeamBSwapped={isTeamBSwapped}
            onSwapTeams={handleSwapTeams}
            onSwapServer={handleSwapServer}
          />
        </View>

        {/* Right Scoreboard */}
        <Animated.View style={[rightScoreboardStyle]} className="ml-2">
          <Scoreboard
            teamName={isTeamSwapped ? "Team A" : "Team B"}
            score={isTeamSwapped ? scoreA : scoreB}
            onScore={() => (isTeamSwapped ? handleScoreA : handleScoreB)()}
            disabled={isGameComplete}
          />
        </Animated.View>
      </View>

      {/* Game Complete Modal */}
      <ModalPopup
        visible={isGameComplete}
        messageTitle="Game Complete!"
        messageBody={
          <View className="flex-row items-center">
            <Text className="text-white text-lg mr-2">
              Winner:{" "}
              {scoreA > scoreB
                ? teamAPlayer1?.name + " & " + teamAPlayer2?.name
                : teamBPlayer1?.name + " & " + teamBPlayer2?.name}
            </Text>
            <Ionicons name="trophy" size={15} color="#F59E0B" />
          </View>
        }
        confirmText="Continue"
        confirmButtonColor="#6c935c"
        onConfirm={() => {
          updateDuoStats();
          updatePlayerStats();
          updateSessionStats();
          endCurrentGame(sessionId as string, isGameComplete);
          router.replace({
            pathname: "/gameDetails",
            params: { sessionId, gameId: game.id },
          });
        }}
      />

      {/* Quit Confirmation Popup */}
      <ModalPopup
        visible={showQuitGameModal}
        messageTitle="Quit Game?"
        messageBody="Your progress will be lost! Are you sure you want to continue?"
        cancelText="Cancel"
        confirmText="Quit"
        cancelButtonColor="#444"
        confirmButtonColor="#921721bc"
        // icon={<Ionicons name="alert-circle" size={40} color="#ff3333" />}
        onCancel={() => setShowQuitGameModal(false)}
        onConfirm={() => {
          setShowQuitGameModal(false);
          endCurrentGame(sessionId as string, isGameComplete);
          router.back();
        }}
      />
    </View>
  );
}
