import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskAddScreen: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const { id } = useLocalSearchParams<{ id?: string }>();

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `https://192.168.1.6:3000/api/tasks/${id}`
      );
      const { title, description, status } = response.data;
      setTitle(title);
      setDescription(description);
      setStatus(status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await axios.put(`https://192.168.1.6:3000/api/tasks/${id}`, {
          title,
          description,
          status,
        });
      } else {
        await axios.post("https://192.168.1.6:3000/api/tasks", {
          title,
          description,
          status,
        });
      }
      useRouter().back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title={status === "done" ? "Mark as Pending" : "Mark as Done"}
        onPress={() => setStatus(status === "done" ? "pending" : "done")}
      />
      <Button title="Save Task" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
  },
});

export default TaskAddScreen;
