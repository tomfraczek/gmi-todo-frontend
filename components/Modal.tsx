import React from "react";
import { TextInput } from "react-native";
import { Modal, Portal, Text, Button } from "react-native-paper";

interface EditModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    marginLeft: 24,
    marginRight: 24,
  };

  return (
    <Portal>
      <Modal
        // style={{ marginLeft: 16, marginRight: 16 }}
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={containerStyle}
      >
        {children}
      </Modal>
    </Portal>
  );
};

export default EditModal;
