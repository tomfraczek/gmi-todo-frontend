import { useEffect } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { SplashScreen, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTasks } from "@/store/taskSlice";
import ROUTES from "@/constants/routes";
import Welcome from "@/components/Welcome";
import { useFonts } from "expo-font";

const Dashboard = () => {
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

  const dispatch = useDispatch<AppDispatch>();
  const route = useRouter();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

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

  return (
    <SafeAreaView className="flex items-center justify-center flex-1 my-10 px-5">
      <TouchableWithoutFeedback
        onPress={() => route.push(ROUTES.TASK_LIST)}
        className="flex-row justify-evenly w-full mt-3 relative"
      >
        <Welcome count={countPending} />
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Dashboard;
