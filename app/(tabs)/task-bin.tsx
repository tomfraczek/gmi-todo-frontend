import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TaskCard from "@/components/TaskCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTasks, updateTaskThunk } from "@/store/taskSlice";
import { useEffect, useState } from "react";
import SwipeableRow from "@/components/SwipeableRow";
import ConfirmModal from "@/components/ConfirmModal";

const BinScreen: React.FC = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    id: number;
    status: string;
  } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleRightAction = (id: number, status: string) => {
    setSelectedTask({ id, status });
    setShowConfirmModal(true);
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
                leftActionText="Restore from Recycle Bin"
                rightActionText="Delete permanently"
                onLeftAction={() =>
                  dispatch(
                    updateTaskThunk({
                      id: item.id,
                      updateData: { status: "pending" },
                    })
                  )
                }
                onRightAction={() => handleRightAction(item.id, item.status)}
              >
                <TaskCard
                  onPress={() => router.push(`/task/${item.id}`)}
                  item={item}
                />
              </SwipeableRow>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">The bin is empty</Text>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView>
      {renderTasks("bin", "Trash Bin")}
      <ConfirmModal
        visible={showConfirmModal}
        onDismiss={() => setShowConfirmModal(false)}
        status={selectedTask?.status}
        id={selectedTask?.id}
      />
    </SafeAreaView>
  );
};

export default BinScreen;
