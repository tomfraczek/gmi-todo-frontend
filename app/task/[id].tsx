import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Icon, Provider as PaperProvider } from "react-native-paper";
import EditModal from "@/components/Modal";
import useTask from "@/hooks/useTask";
import { Task } from "../(tabs)/task-list";
import { getTask, deleteTask, updateTask } from "@/helpers/api";

const TaskScreen: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { id } = useLocalSearchParams();
  const { getTasks, loading, error } = useTask();
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await getTask(Number(id));
        setTask(taskData);
      } catch (error) {
        console.error("Błąd podczas pobierania zadania:", error);
      }
    };

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (task) {
      setTaskDescription(task.description);
      setTaskTitle(task.title);
    }
  }, [task]);

  const handleRestore = async () => {
    try {
      await updateTask(Number(id), { status: "pending" });
      router.back();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleSave = async () => {
    try {
      await updateTask(Number(id), {
        title: taskTitle,
        description: taskDescription,
      });
      setShowEditModal(false);
      getTasks(Number(id)).then((data) => setTask(data));
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      if (task?.status === "bin") {
        await deleteTask(Number(id));
        router.back();
      } else {
        await updateTask(Number(id), { status: "bin" });
      }
      setShowConfirmModal(false);
      getTasks(Number(id)).then((data) => setTask(data));
    } catch (error) {
      console.error("Error moving task to bin:", error);
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

      <EditModal
        visible={showEditModal}
        onDismiss={() => setShowEditModal(false)}
      >
        <Text className="text-2xl text-black">Edit Task</Text>
        <TextInput
          className="mt-4 p-2 w-full bg-gray-200 text-gray-900 border border-gray-300 rounded-md"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TextInput
          multiline
          className="mt-4 max-h-40 p-2 w-full bg-gray-200 text-gray-900 border border-gray-300 rounded-md"
          value={taskDescription}
          onChangeText={setTaskDescription}
        />
        <Button
          className="bg-blue-600 mt-4"
          onPress={handleSave}
          disabled={loading}
          textColor="white"
        >
          Submit
        </Button>
        {error && <Text className="text-red-500 mt-2">{error}</Text>}
      </EditModal>

      <EditModal
        visible={showConfirmModal}
        onDismiss={() => setShowConfirmModal(false)}
      >
        <Text className="text-xl mb-4">
          {task?.status === "bin"
            ? "Are you sure you want to permanently remove this task?"
            : "Are you sure you want to move this task to the bin?"}
        </Text>
        <View className="flex flex-row justify-between">
          <Button
            className="mr-2"
            textColor="white"
            buttonColor="gray"
            onPress={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button textColor="white" buttonColor="red" onPress={handleConfirm}>
            Confirm
          </Button>
        </View>
      </EditModal>
    </PaperProvider>
  );
};

export default TaskScreen;
