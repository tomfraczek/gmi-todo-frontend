import React, { useState, useEffect, useCallback } from "react";
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

const motivationalPhrases = [
  "The journey of a thousand miles begins with one step.",
  "Don’t watch the clock; do what it does. Keep going.",
  "The only way to achieve the impossible is to believe it is possible.",
  "The future depends on what you do today.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "You don’t have to be great to start, but you have to start to be great.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "The key to success is to focus on goals, not obstacles.",
  "Start where you are. Use what you have. Do what you can.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Dream big and dare to fail.",
  "Don’t wait. The time will never be just right.",
  "Start each day with a positive thought and a grateful heart.",
  "Small daily improvements over time lead to stunning results.",
  "Motivation gets you going, but discipline keeps you growing.",
  "The secret to getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Hard work beats talent when talent doesn’t work hard.",
  "The best way to predict the future is to create it.",
  "Don’t limit your challenges. Challenge your limits.",
  "It always seems impossible until it’s done.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Push yourself, because no one else is going to do it for you.",
  "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
  "The only place where success comes before work is in the dictionary.",
  "Keep your eyes on the stars, and your feet on the ground.",
  "You are never too old to set another goal or to dream a new dream.",
  "Quality is not an act, it is a habit.",
  "Success usually comes to those who are too busy to be looking for it.",
];

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [motivationalPhrase, setMotivationalPhrase] = useState<string>("");

  useEffect(() => {
    getTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Generate a random index to select a phrase
      const randomIndex = Math.floor(
        Math.random() * motivationalPhrases.length
      );
      setMotivationalPhrase(motivationalPhrases[randomIndex]);
    }, [])
  );

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
  console.log(isDone);

  return (
    <SafeAreaView className="bg-primary flex-1">
      {/* <ScrollView>
        <View className="w-screen z-10 bg-primary h-64">
          <Text className="text-2xl mt-7 px-4 text-center text-white">
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
              <Link
                href="/(tabs)/task-add"
                className="flex justify-center items-center"
              >
                <Image
                  source={icons.plus}
                  resizeMode="contain"
                  className="w-10"
                />
              </Link>
            )}
          </View>
        </View>
        <View className="rounded-3xl bg-white z-0">
          {renderTasks("pending", "Todo")}
          {renderTasks("inProgress", "In Progress")}
          {renderTasks("done", "Completed")}
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default TaskListScreen;
