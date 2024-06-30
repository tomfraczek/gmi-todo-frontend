import { AppDispatch } from "@/store/store";
import { deleteTaskThunk, updateTaskThunk } from "@/store/taskSlice";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

type ConfirmModalProps = {
  visible: boolean;
  onDismiss: () => void;
  status: string | undefined;
  id: number | undefined;
};

const ConfirmModal = ({
  status,
  id,
  visible,
  onDismiss,
}: ConfirmModalProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 24,
    marginRight: 24,
  };

  const handleMoveToBin = async () => {
    try {
      if (status === "bin") {
        await dispatch(deleteTaskThunk(Number(id))).unwrap();
        router.back();
      } else {
        await dispatch(
          updateTaskThunk({ id: Number(id), updateData: { status: "bin" } })
        ).unwrap();
      }
      onDismiss();
    } catch (error) {
      console.error("Error moving task to bin:", error);
    }
  };

  const handleDeletePermanently = async () => {
    try {
      await dispatch(deleteTaskThunk(Number(id))).unwrap();
      router.back();
    } catch (error) {
      throw new Error("Error permanently deleting task");
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={containerStyle}
      >
        <Text className="text-xl mb-4">
          {status === "bin"
            ? "Are you sure you want to permanently remove this task?"
            : "Are you sure you want to move this task to the bin?"}
        </Text>
        <View className="flex flex-row justify-between">
          <Button
            className="mr-2"
            textColor="white"
            buttonColor="gray"
            onPress={() => onDismiss()}
          >
            Cancel
          </Button>
          <Button
            textColor="white"
            buttonColor="red"
            onPress={
              status === "bin" ? handleDeletePermanently : handleMoveToBin
            }
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default ConfirmModal;
