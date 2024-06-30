import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TaskCard from "@/components/TaskCard";
import useTask from "@/hooks/useTask";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const BinScreen: React.FC = () => {
  const { tasks } = useTask();
  const router = useRouter();

  const renderTasks = (status: string, title: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    return (
      <SafeAreaView className="mb-4 p-4">
        <Text className="text-2xl font-bold mb-2">{title}</Text>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((item, i) => (
            <View className="mb-4" key={item.title + i}>
              <TaskCard
                onPress={() => router.push(`/task/${item.id}`)}
                item={item}
              />
            </View>
          ))
        ) : (
          <Text className="text-gray-500">No tasks in this category</Text>
        )}
      </SafeAreaView>
    );
  };

  return <SafeAreaView>{renderTasks("bin", "Trash Bin")}</SafeAreaView>;
};

export default BinScreen;
