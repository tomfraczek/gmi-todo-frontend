import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "@/constants";
import { useFocusEffect } from "@react-navigation/native";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

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
      const response = await axios.put(
        `http://192.168.1.6:3000/api/tasks/${id}`,
        {
          status: status,
        }
      );
      console.log("Response from server:", response.data);
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

  const renderTasks = (status: string, title: string) => {
    const filteredTasks = tasks.filter((task) => task.status === status);
    return (
      <SafeAreaView className="mb-4 p-4">
        <Text className="text-2xl font-bold mb-2">{title}</Text>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((item) => (
            <View key={item.id} className="mb-4 p-4 bg-gray-200 rounded-lg">
              <Text className="text-xl font-semibold">{item.title}</Text>
              <Text>{item.description}</Text>
              <Button
                title={
                  item.status === "pending"
                    ? "Start Progressing"
                    : item.status === "inProgress"
                    ? "Mark as Complete"
                    : "Move to Trash Bin"
                }
                onPress={() => {
                  if (item.status === "pending") {
                    updateTaskStatus(item.id, "inProgress");
                  } else if (item.status === "inProgress") {
                    updateTaskStatus(item.id, "done");
                  } else if (item.status === "done") {
                    updateTaskStatus(item.id, "bin");
                  }
                }}
              />
              <Link href={`/screens/task-detail?id=${item.id}`}>
                <Text className="text-blue-500 mt-2">View Details</Text>
              </Link>
              <Link href={`/task-form?id=${item.id}`}>
                <Text className="text-blue-500 mt-2">Edit</Text>
              </Link>
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
            {!isDone ? (
              <Text className="text-white text-5xl font-bold">
                {percentage}%
              </Text>
            ) : (
              <></>
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
