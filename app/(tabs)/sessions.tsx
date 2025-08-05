import { TouchableOpacity, ScrollView, View, Text } from 'react-native';

export default function SessionsScreen() {
  const currentSession = {
    id: 'current',
    date: 'Today',
    players: ['Zubair Shibly', 'Nilin Reza', 'Junaid Wali', 'Tawsif Hasan'],
    gamesPlayed: 3,
    duration: '1h 45m',
    status: 'active'
  };

  const pastSessions = [
    {
      id: '1',
      date: 'Yesterday',
      players: ['Tahia Tasneem', 'Zerin Rumaly', 'Samin Zarif'],
      gamesPlayed: 5,
      duration: '2h 15m',
      status: 'completed'
    },
    {
      id: '2', 
      date: '2 days ago',
      players: ['Zubair Shibly', 'Rownak Haider', 'Junaid Wali', 'Nilin Reza'],
      gamesPlayed: 7,
      duration: '2h 30m',
      status: 'completed'
    },
    {
      id: '3',
      date: '5 days ago', 
      players: ['Tawsif Hasan', 'Tahia Tasneem', 'Samin Zarif'],
      gamesPlayed: 4,
      duration: '1h 50m',
      status: 'completed'
    }
  ];

  return (
    <ScrollView className="flex-1 bg-app-black">
      <View className="p-5 pt-20">
        <View className="items-center mb-8">
          <Text className="text-3xl text-white font-800 text-center tracking-tight">Sessions</Text>
        </View>

        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">Current Session</Text>
          <View className="p-5 rounded-xl-plus bg-app-primary-card border border-app-primary-border">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-app-primary text-lg font-bold">Live Session</Text>
              <View className="bg-app-primary px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">ACTIVE</Text>
              </View>
            </View>
            <Text className="text-app-text-secondary text-sm mb-2">{currentSession.date} • {currentSession.duration}</Text>
            <Text className="text-app-text-muted text-sm mb-3">{currentSession.players.join(', ')}</Text>
            <Text className="text-app-text-secondary text-sm">{currentSession.gamesPlayed} games played</Text>
          </View>
        </View>

        <View className="space-y-3">
          <Text className="text-white text-lg font-bold mb-2">Past Sessions</Text>
          {pastSessions.map((session) => (
            <TouchableOpacity key={session.id} className="p-5 rounded-xl-plus bg-app-card border border-app-card-border">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-semibold">{session.date}</Text>
                <Text className="text-app-text-muted text-xs">{session.duration}</Text>
              </View>
              <Text className="text-app-text-muted text-sm mb-2">{session.players.join(', ')}</Text>
              <Text className="text-app-text-secondary text-sm">{session.gamesPlayed} games completed</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
