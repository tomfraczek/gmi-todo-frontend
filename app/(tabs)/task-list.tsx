import { useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SwipeableRow from "@/components/SwipeableRow";
import TaskCard from "@/components/TaskCard";
import { AppDispatch, RootState } from "@/store/store";
import { fetchTasks, updateTaskThunk } from "@/store/taskSlice";

const TaskListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

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
                  item.status === "pending" ? "Completed" : "Todo"
                }
                rightActionText="Move to Bin"
                onLeftAction={() =>
                  dispatch(
                    updateTaskThunk({
                      id: item.id,
                      updateData: {
                        status: item.status === "pending" ? "done" : "pending",
                      },
                    })
                  )
                }
                onRightAction={() =>
                  dispatch(
                    updateTaskThunk({
                      id: item.id,
                      updateData: { status: "bin" },
                    })
                  )
                }
              >
                <TaskCard
                  onPress={() => router.push(`/task/${item.id}`)}
                  item={item}
                />
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

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">{error}</Text>
      </SafeAreaView>
    );
  }

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
              <View className="flex flex-col justify-center items-center relative top-2">
                <Text className="text-white text-5xl font-bold ">
                  {percentage}%
                </Text>
                <Text className="text-sm text-white">DONE</Text>
              </View>
            )}
          </View>
        </View>
        <View className="rounded-3xl bg-white z-0">
          {renderTasks("pending", "Todo")}
          {renderTasks("done", "Completed")}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskListScreen;
