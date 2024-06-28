import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const BinScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks();
  }, []);

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
                    : item.status === "bin"
                    ? "Remove from the bin"
                    : "Move to Trash Bin"
                }
                onPress={() => {
                  if (item.status === "pending") {
                    updateTaskStatus(item.id, "inProgress");
                  } else if (item.status === "inProgress") {
                    updateTaskStatus(item.id, "done");
                  } else if (item.status === "done") {
                    updateTaskStatus(item.id, "bin");
                  } else if (item.status === "bin") {
                    deleteTaskPermanently(item.id);
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

  const deleteTaskPermanently = async (id: number) => {
    try {
      await axios.delete(`http://192.168.1.6:3000/api/tasks/${id}`);
      console.log(`Task with id ${id} deleted permanently.`);
      getTasks(); // Refresh the task list
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
