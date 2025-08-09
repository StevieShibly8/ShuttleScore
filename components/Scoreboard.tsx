import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text, TouchableOpacity, View } from "react-native";

interface ScoreboardProps {
  teamName: string;
  score: number;
}

export default function Scoreboard({
  teamName,
  score,
}: ScoreboardProps) {
  return (
    <View className="w-36">
      <Card className="h-full p-2">
        <CardHeader className="items-center mb-2">
          <CardTitle className="text-lg font-bold">{teamName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 justify-start pt-4">
          <View className="items-center mb-6">
            <Text className="text-white text-5xl font-bold">{score}</Text>
          </View>
          <View className="items-center flex-1 justify-center">
            <TouchableOpacity
              className="bg-app-success-card w-24 h-20 rounded-lg items-center justify-center border border-app-primary-border"
              onPress={() => {
                // Increment logic will be added later
              }}
            >
              <Text className="text-white text-5xl leading-none">+</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
