import { View, Text, Image } from "react-native";

type TabIconProps = {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => (
  <View className="flex items-center justify-center gap-2">
    <Image
      source={icon}
      resizeMode="contain"
      style={{ tintColor: color }}
      className="w-6 h-6"
    />
    <Text
      className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
      style={{ color }}
    >
      {name}
    </Text>
  </View>
);

export default TabIcon;
