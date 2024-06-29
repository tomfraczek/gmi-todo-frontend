import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Button, Icon, Provider as PaperProvider } from "react-native-paper";
import EditModal from "@/components/Modal";
import useTask from "@/hooks/useTask";

const TaskScreen: React.FC = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { id } = useLocalSearchParams();
  const { getTasks, updateTask, loading, error } = useTask();

  useEffect(() => {
    if (id) {
      getTasks(Number(id))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTask(data[0]);
          } else {
            setTask(data); // Assuming data is a single task when id is provided
          }
        })
        .catch((error) => {
          console.error("Error fetching task:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (task) {
      setTaskDescription(task.description);
      setTaskTitle(task.title);
    }
  }, [task]);

  const handleSave = async () => {
    try {
      await updateTask({
        id: Number(id),
        title: taskTitle,
        description: taskDescription,
      });
      setShowEditModal(false);
      getTasks(Number(id)).then((data) => setTask(data));
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleMoveToBin = async () => {
    try {
      await updateTask({ id: Number(id), status: "bin" });
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
            <TouchableWithoutFeedback onPress={() => setShowEditModal(true)}>
              <Icon name="pencil" size={24} color="#000" />
            </TouchableWithoutFeedback>
          </View>
          <Text className="mt-4">{task?.description}</Text>
          <Text className="mt-4">Status: {status}</Text>
        </View>
        <Button
          className="mt-4"
          textColor="white"
          buttonColor="red"
          onPress={() => setShowConfirmModal(true)}
        >
          Move to bin
        </Button>
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
          Are you sure you want to move this task to the bin?
        </Text>
        <View className="flex flex-row justify-between">
          <Button
            className="mr-2"
            textColor="white"
            buttonColor="gray"
            onPress={() => setShowConfirmModal(false)}
          >
            No
          </Button>
          <Button textColor="white" buttonColor="red" onPress={handleMoveToBin}>
            Yes
          </Button>
        </View>
      </EditModal>
    </PaperProvider>
  );
};

export default TaskScreen;
