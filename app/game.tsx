import BadmintonCourt from "@/components/BadmintonCourt";
import Scoreboard from "@/components/Scoreboard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";

export default function GameScreen() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Game state management
  const [leftTeam, setLeftTeam] = useState({ 
    name: "Team A", 
    score: 21, 
    players: { top: "Alice", bottom: "Charlie" } 
  });
  const [rightTeam, setRightTeam] = useState({ 
    name: "Team B", 
    score: 18, 
    players: { top: "Bob", bottom: "Dana" } 
  });

  // Swap functions
  const swapLeftTeamPlayers = () => {
    setLeftTeam(prev => ({
      ...prev,
      players: { top: prev.players.bottom, bottom: prev.players.top }
    }));
  };

  const swapRightTeamPlayers = () => {
    setRightTeam(prev => ({
      ...prev,
      players: { top: prev.players.bottom, bottom: prev.players.top }
    }));
  };

  const swapTeams = () => {
    const tempLeft = leftTeam;
    setLeftTeam(rightTeam);
    setRightTeam(tempLeft);
  };

  return (
    <View className="flex-1 bg-app-black p-5">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl text-white font-800 flex-1">Game</Text>
        <TouchableOpacity
          onPress={() => {
            /* end game logic here */
          }}
          className="bg-red-600 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-bold">End Game</Text>
        </TouchableOpacity>
      </View>
      

      {/* Game Content */}
      <View className="mt-2 mx-2 flex-1 flex-row">
        {/* Left Scoreboard */}
        <View className="mr-2">
          <Scoreboard 
            teamName={leftTeam.name}
            score={leftTeam.score}
          />
        </View>

        {/* Badminton Court */}
        <View className="flex-1">
          <BadmintonCourt 
            leftTeam={leftTeam.players}
            rightTeam={rightTeam.players}
            onSwapLeftTeam={swapLeftTeamPlayers}
            onSwapRightTeam={swapRightTeamPlayers}
            onSwapTeams={swapTeams}
          />
        </View>

        {/* Right Scoreboard */}
        <View className="ml-2">
          <Scoreboard 
            teamName={rightTeam.name}
            score={rightTeam.score}
          />
        </View>
      </View>
    </View>
  );
}
