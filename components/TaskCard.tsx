import { Task } from "@/helpers/api";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Icon } from "react-native-paper";

type TaskCardProps = {
  item: Task;
  onPress: () => void;
};

const TaskCard = ({ item, onPress }: TaskCardProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        className={`p-4 flex flex-row items-center justify-between ${
          item.status === "pending"
            ? "bg-yellow-500"
            : item.status === "inProgress"
            ? "bg-blue-600"
            : "bg-green-400"
        }`}
      >
        <View className=" w-10/12">
          <Text className="text-white text-xl font-semibold">{item.title}</Text>
          <Text className="text-white">{item.description}</Text>
        </View>

        <Icon source="chevron-right" size={50} color="#fff" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TaskCard;
