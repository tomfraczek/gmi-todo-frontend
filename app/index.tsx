// app/index.ts
import { useEffect } from "react";
import { View, Text } from "react-native";
import { Link, SplashScreen } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useDispatch, useSelector } from "react-redux";
import { icon } from "@/constants";
import DashboardCard from "@/components/DashboardCard";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTasks } from "@/store/taskSlice";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
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

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (!fontsLoaded) {
    return null;
  }

  const countPending = tasks.filter((task) => task.status === "pending").length;
  const countDone = tasks.filter((task) => task.status === "done").length;

  return (
    <SafeAreaView className="flex items-center justify-between flex-1 font-pbold my-10 px-5">
      <Text className="justify-self-start text-3xl">Dashboard</Text>
      <View className="flex flex-wrap flex-row justify-evenly mb-auto w-full mt-3">
        <DashboardCard
          bgClass="bg-yellow-500"
          count={countPending}
          icon={icon.expired}
          title="Pending"
        />
        <DashboardCard
          bgClass="bg-green-400"
          count={countDone}
          icon={icon.checklist}
          title="Completed"
        />
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
