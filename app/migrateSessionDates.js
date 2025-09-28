import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

function toISOStringFromLocale(dateStr) {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString();
  return dateStr;
}

export default function MigrateSessionsScreen() {
  useEffect(() => {
    async function migrate() {
      const raw = await AsyncStorage.getItem("session-store");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data.state || !Array.isArray(data.state.sessions)) return;

      let updated = false;
      data.state.sessions = data.state.sessions.map((session) => {
        if (
          typeof session.date === "string" &&
          !session.date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        ) {
          console.log("Migrating session date:", session.date);
          const iso = toISOStringFromLocale(session.date);
          if (iso !== session.date) {
            updated = true;
            return { ...session, date: iso };
          }
        }
        return session;
      });

      if (updated) {
        await AsyncStorage.setItem("session-store", JSON.stringify(data));
        alert("Session dates migrated to ISOString format.");
      } else {
        alert("No session dates needed migration.");
      }
    }
    migrate();
  }, []);

  return null; // Or a simple <Text>Migration running...</Text>
}
