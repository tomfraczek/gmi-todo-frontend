import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import TaskCard from "@/components/TaskCard";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const BinScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    getTasks();
  }, []);

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

  const getTasks = async () => {
    try {
      const { data } = await axios.get("http://192.168.1.6:3000/api/tasks/");
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return <SafeAreaView>{renderTasks("bin", "Trash Bin")}</SafeAreaView>;
};

export default BinScreen;
