import { View, Text, Image, ImageSourcePropType } from "react-native";

type DashboardCardProps = {
  bgClass: string;
  count: number;
  icon: ImageSourcePropType;
  title: string;
};

const DashboardCard = ({ bgClass, count, icon, title }: DashboardCardProps) => {
  return (
    <View
      className={`overflow-hidden over relative w-full ${bgClass} rounded-2xl h-32 p-5 mb-5`}
    >
      <Text className="text-white text-xl">
        {title}: {count}
      </Text>
      <Image
        source={icon}
        resizeMode="contain"
        className="w-24 h-24 absolute -right-8 -bottom-2"
      />
    </View>
  );
};

export default DashboardCard;
