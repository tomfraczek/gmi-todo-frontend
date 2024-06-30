import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Icon, Provider as PaperProvider } from "react-native-paper";
import ConfirmModal from "@/components/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchTask, updateTaskThunk } from "@/store/taskSlice";
import EditTaskModal from "@/components/EditTaskModal";

const TaskScreen: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const task = useSelector((state: RootState) => state.tasks.currentTask);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchTask(Number(id)));
    }
  }, [dispatch, id]);

  const handleRestore = async () => {
    try {
      await dispatch(
        updateTaskThunk({ id: Number(id), updateData: { status: "pending" } })
      ).unwrap();
      router.back();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const status =
    task?.status === "pending"
      ? "Pending"
      : task?.status === "inProgress"
      ? "In Progress"
      : task?.status === "done"
      ? "Done"
      : "In Trash Bin";

  return (
    <PaperProvider>
      <ScrollView className="h-full p-4">
        <View className="flex flex-col items-start justify-center rounded-3xl bg-white w-full p-4">
          <View className="flex flex-row justify-between items-center w-full">
            <Text className="text-2xl font-bold">
              {task ? task.title : "Loading..."}
            </Text>
            <View>
              <TouchableWithoutFeedback onPress={() => setShowEditModal(true)}>
                <View>
                  <Icon source="pencil" size={24} color="#000" />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <Text className="mt-4">{task?.description}</Text>
          <Text className="mt-4">Status: {status}</Text>
        </View>
        {task?.status === "bin" ? (
          <View>
            <Button
              className="mt-4"
              textColor="white"
              buttonColor="blue"
              onPress={handleRestore}
            >
              Restore from Recycle Bin
            </Button>
            <Button
              className="mt-4"
              textColor="white"
              buttonColor="red"
              onPress={() => setShowConfirmModal(true)}
            >
              Remove Permanently
            </Button>
          </View>
        ) : (
          <Button
            className="mt-4"
            textColor="white"
            buttonColor="red"
            onPress={() => setShowConfirmModal(true)}
          >
            Move to bin
          </Button>
        )}
      </ScrollView>

      <EditTaskModal
        visible={showEditModal}
        onDismiss={() => setShowEditModal(false)}
        title={task?.title}
        description={task?.description}
        taskId={Number(id)}
      />
      <ConfirmModal
        visible={showConfirmModal}
        onDismiss={() => setShowConfirmModal(false)}
        id={task?.id}
        status={task?.status}
      />
    </PaperProvider>
  );
};

export default TaskScreen;
