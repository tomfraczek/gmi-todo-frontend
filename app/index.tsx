import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import axios from "axios";
import { Link, SplashScreen } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { icons } from "@/constants";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  tags: string[];
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const getTasks = async () => {
    try {
      const { data } = await axios.get<Task[]>(
        "http://192.168.1.6:3000/api/tasks/"
      );
      setTasks(data);
      calculateTaskCounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTaskCounts = (tasks: Task[]) => {
    const pending = tasks.filter((task) => task.status === "pending").length;
    const inProgress = tasks.filter(
      (task) => task.status === "inProgress"
    ).length;
    const done = tasks.filter((task) => task.status === "done").length;
    setPendingCount(pending);
    setInProgressCount(inProgress);
    setDoneCount(done);
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex items-center justify-between flex-1 font-pbold my-10 px-5">
      <Text className="justify-self-start text-3xl">Dashboard</Text>
      <View className="flex flex-wrap flex-row justify-evenly mb-auto w-full gap-5 mt-3">
        <View className="overflow-hidden over relative w-full bg-yellow-500 rounded-2xl h-32 p-5">
          <Text className="text-white text-xl">Pending: {pendingCount}</Text>
          <Image
            source={icons.expired}
            resizeMode="contain"
            className="w-24 h-24 absolute -right-8 -bottom-2"
          />
        </View>
        <View className="overflow-hidden relative w-full bg-blue-600 rounded-2xl h-32 p-5">
          <Text className="text-white text-xl">
            In progress: {inProgressCount}
          </Text>
          <Image
            source={icons.settings}
            resizeMode="contain"
            className="w-24 h-24 absolute -right-5 -bottom-2"
          />
        </View>
        <View className="overflow-hidden over relative w-full bg-green-400 rounded-2xl h-32 p-5">
          <Text className="text-white text-xl">Completed: {doneCount}</Text>
          <Image
            source={icons.checklist}
            resizeMode="contain"
            className="w-24 h-24 absolute -right-5 -bottom-2"
          />
        </View>
      </View>

      <View className="flex flex-row justify-between items-center w-full">
        <Link
          href="/(tabs)/task-list"
          className="w-28 h-28 bg-green-400 rounded-xl flex justify-center items-center"
        >
          <Text>Tasks List</Text>
        </Link>
        <Link
          href="/(tabs)/task-form"
          className="w-28 h-28 bg-green-400 rounded-xl flex justify-center items-center"
        >
          <Text>Add Task</Text>
        </Link>
        <Link
          href="/(tabs)/bin"
          className="w-28 h-28 bg-green-400 rounded-xl flex justify-center items-center"
        >
          <Text>Bin</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
