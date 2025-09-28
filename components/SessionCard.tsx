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
  showPaidProgressBar?: boolean;
}

export const SessionCard = ({
  sessionId,
  variant = "default",
  active = false,
  showPaidProgressBar = false,
}: SessionCardProps) => {
  const router = useRouter();
  const session = useSessionStore((state) => state.getSessionById(sessionId));
  const pastGames = session?.pastGames ?? [];
  const pastGamesCount = pastGames.length;
  const date = session?.date ?? "Unknown Date";
  const dateStr = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const players = session?.players ?? {};
  const playerIds = Object.keys(players);
  const playerCount = playerIds.length;
  const paidCount = playerIds.filter((pid) => players[pid]?.paid).length;
  const totalCount = playerIds.length;

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
          {active ? "Live Session" : dateStr}
        </CardTitle>
        <CardHeader>
          <Text className="text-app-text-secondary text-sm">
            {active
              ? dateStr
              : `${pastGamesCount} ${pastGamesCount === 1 ? "game" : "games"} | ${playerCount} players`}
          </Text>
        </CardHeader>
        {active ? (
          <CardContent>
            <Text className="text-app-text-secondary text-sm">
              {pastGamesCount}
              {pastGamesCount === 1 ? " game" : " games"} played
            </Text>
          </CardContent>
        ) : (
          showPaidProgressBar && (
            <View>
              <View
                style={{
                  height: 3,
                  backgroundColor: "#333a44",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${(paidCount / totalCount) * 100}%`,
                    height: "100%",
                    backgroundColor:
                      paidCount === totalCount ? "#6C935C" : "#F59E0B",
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text
                style={{
                  color: paidCount === totalCount ? "#6C935C" : "#F59E0B",
                  fontWeight: "bold",
                  fontSize: 12,
                  textAlign: "right",
                }}
              >
                {paidCount}/{totalCount} paid
              </Text>
            </View>
          )
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
