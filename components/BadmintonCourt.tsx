import { TouchableOpacity, View } from "react-native";

export default function BadmintonCourt() {
  return (
    <View className="flex-1 bg-app-primary rounded-xl-plus p-6">
      <View className="flex-1 border-2 border-white rounded-lg p-2">
        <View className="flex-1 flex-col relative">
          {/* Net line (now vertical) */}
          <View className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-80" style={{
            borderStyle: 'dashed',
            borderLeftWidth: 2,
            borderLeftColor: 'white',
            backgroundColor: 'transparent'
          }} />
          
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
          
          {/* Top row */}
          <View className="flex-1 flex-row mb-1">
            <TouchableOpacity 
              className="flex-1 mr-1" 
              activeOpacity={0.3}
              onPress={() => console.log('Top Left')}
            >
              
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1" 
              activeOpacity={0.3}
              onPress={() => console.log('Top Right')}
            >
              
            </TouchableOpacity>
          </View>
          
          {/* Bottom row */}
          <View className="flex-1 flex-row">
            <TouchableOpacity 
              className="flex-1 mr-1" 
              activeOpacity={0.3}
              onPress={() => console.log('Bottom Left')}
            >
              
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1" 
              activeOpacity={0.3}
              onPress={() => console.log('Bottom Right')}
            >
              
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}