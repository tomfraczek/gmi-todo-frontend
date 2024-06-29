import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SwipeableRow from "@/components/SwipeableRow";
import { Icon, MD3Colors } from "react-native-paper";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const { data } = await axios.get("http://192.168.1.6:3000/api/tasks/");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await axios.put(`http://192.168.1.6:3000/api/tasks/${id}`, { status });
      getTasks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating task status:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const deleteTaskPermanently = async (id: number) => {
    try {
      await axios.delete(`http://192.168.1.6:3000/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error deleting task:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const renderTasks = (status: string, title: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    return (
      <SafeAreaView className="mb-4 p-4">
        <Text className="text-2xl font-bold mb-2">{title}</Text>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((item, i) => (
            <View className="mb-4" key={item.title + i}>
              <SwipeableRow
                key={item.id}
                leftActionText={
                  item.status === "pending"
                    ? "Start Progressing"
                    : item.status === "inProgress"
                    ? "Move to Done"
                    : "Move to Bin"
                }
                rightActionText={
                  item.status === "inProgress"
                    ? "Stop Progressing"
                    : item.status === "done"
                    ? "Start Progressing"
                    : "Move to Bin"
                }
                onLeftAction={() =>
                  updateTaskStatus(
                    item.id,
                    item.status === "pending" ? "inProgress" : "done"
                  )
                }
                onRightAction={() =>
                  updateTaskStatus(
                    item.id,
                    item.status === "pending"
                      ? "bin"
                      : item.status === "inProgress"
                      ? "pending"
                      : "inProgress"
                  )
                }
              >
                <TouchableWithoutFeedback
                  onPress={() => router.push(`/task/${item.id}`)}
                >
                  <View
                    className={`p-4 rounded-lg flex flex-row items-center justify-between ${
                      item.status === "pending"
                        ? "bg-yellow-500"
                        : item.status === "inProgress"
                        ? "bg-blue-600"
                        : "bg-green-400"
                    }`}
                  >
                    <View className=" w-10/12">
                      <Text className="text-white text-xl font-semibold">
                        {item.title}
                      </Text>
                      <Text className="text-white">{item.description}</Text>
                    </View>

                    <Icon source="chevron-right" size={50} color="#fff" />
                  </View>
                </TouchableWithoutFeedback>
              </SwipeableRow>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">No tasks in this category</Text>
        )}
      </SafeAreaView>
    );
  };

  const calculateCompletionPercentage = () => {
    const activeTasks = tasks.filter((task) => task.status !== "bin");
    const completedTasks = activeTasks.filter(
      (task) => task.status === "done"
    ).length;
    const totalTasks = activeTasks.length;
    return totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);
  };

  const percentage = calculateCompletionPercentage();

  const getBackgroundColor = () => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-400";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const isDone = tasks.filter((task) => task.status !== "bin").length === 0;
  const activeTasks = tasks.filter((task) => task.status !== "bin").length;

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView>
        <View className="w-screen z-10 bg-primary h-64 flex justify-center items-center">
          <Text className="text-2xl px-4 text-center text-white">
            {isDone
              ? "Add new tasks to start progressing"
              : `You Have ${activeTasks} Tasks to Complete`}
          </Text>
          <View
            className={`flex justify-center items-center rounded-full relative -bottom-16 w-48 h-48 mx-auto border-primary border-[23px] ${getBackgroundColor()} ${
              isDone && "bg-white"
            }`}
          >
            {!isDone && (
              <View className="flex flex-col justify-center items-center">
                <Text className="text-white text-5xl font-bold ">
                  {percentage}%
                </Text>
                {/* <Text className="text-sm text-white">DONE</Text> */}
              </View>
            )}
          </View>
        </View>
        <View className="rounded-3xl bg-white z-0">
          {renderTasks("pending", "Todo")}
          {renderTasks("inProgress", "In Progress")}
          {renderTasks("done", "Completed")}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskListScreen;
