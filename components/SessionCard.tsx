import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useSessionStore } from "@/stores/sessionStore";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface SessionCardProps {
  sessionId: string;
  variant?: "default" | "primary";
  active?: boolean;
}

export const SessionCard = ({
  sessionId,
  variant = "default",
  active = false,
}: SessionCardProps) => {
  const router = useRouter();
  const session = useSessionStore((state) => state.getSessionById(sessionId));

  return (
    <TouchableOpacity
      onPress={() =>
        active
          ? router.push({ pathname: "/currentSession", params: { sessionId } })
          : router.push({
              pathname: "/sessionDetails",
              params: { sessionId },
            })
      }
    >
      <Card variant={variant} className={!active ? "mb-2 py-2 px-4" : ""}>
        <CardTitle
          className={
            variant === "primary"
              ? "text-app-primary"
              : "text-white font-semibold text-lg"
          }
        >
          {active ? "Live Session" : session?.date}
        </CardTitle>
        <CardHeader>
          <Text className="text-app-text-secondary text-sm mb-2">
            {active
              ? session?.date
              : `${session?.pastGames.length} ${session?.pastGames.length === 1 ? "game" : "games"} completed`}
          </Text>
        </CardHeader>
        {active && (
          <CardContent>
            <Text className="text-app-text-secondary text-sm">
              {session?.pastGames.length}
              {session?.pastGames.length === 1 ? " game" : " games"} played
            </Text>
          </CardContent>
        )}
        <CardFooter>
          {active && (
            <View className="flex-row justify-between items-center">
              <View className="bg-app-primary px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">ACTIVE</Text>
              </View>
            </View>
          )}
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
};
