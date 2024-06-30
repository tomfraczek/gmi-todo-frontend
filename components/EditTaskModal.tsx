import { AppDispatch } from "@/store/store";
import { updateTaskThunk } from "@/store/taskSlice";
import { View, Text, TextInput } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

type EditTaskModalProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string | undefined;
  description: string | undefined;
  taskId: number;
};

const EditTaskModal = ({
  visible,
  title: initialTitle,
  description: initialDescription,
  onDismiss,
  taskId,
}: EditTaskModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [taskTitle, setTaskTitle] = useState<string>(initialTitle || "");
  const [taskDescription, setTaskDescription] = useState<string>(
    initialDescription || ""
  );

  useEffect(() => {
    setTaskTitle(initialTitle || "");
    setTaskDescription(initialDescription || "");
  }, [initialTitle, initialDescription]);

  const handleSave = async () => {
    try {
      await dispatch(
        updateTaskThunk({
          id: taskId,
          updateData: { title: taskTitle, description: taskDescription },
        })
      ).unwrap();
      onDismiss();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 24,
    marginRight: 24,
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={containerStyle}
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
          textColor="white"
        >
          Submit
        </Button>
      </Modal>
    </Portal>
  );
};

export default EditTaskModal;
