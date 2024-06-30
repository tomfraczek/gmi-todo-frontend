import { View, Text } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";

type TutorialModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

const TutorialModal = ({ visible, onDismiss }: TutorialModalProps) => {
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
        <View className="flex flex-col gap-5">
          <Text>
            <Text className="font-bold">Swipe Right (Incomplete Task)</Text>: If
            you swipe a task to the right, it will be moved to the "Completed"
            list.
          </Text>
          <Text>
            <Text className="font-bold">Swipe Right (Completed Task)</Text>: If
            you swipe a completed task to the right, it will be moved back to
            the "To-Do" list.
          </Text>
          <Text>
            <Text className="font-bold">Swipe Left (Any Task)</Text>: If you
            swipe any task to the left, it will be moved to the "Trash.
          </Text>
          <Text>
            <Text className="font-bold">Click on a Task</Text>: Click on a task
            to open its details.
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};

export default TutorialModal;
