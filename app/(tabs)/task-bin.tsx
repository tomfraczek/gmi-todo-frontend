import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const BinScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  // const fetchTasks = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://yourapi.com/tasks?status=removed"
  //     );
  //     setTasks(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const permanentlyDeleteTask = async (id: number) => {
  //   try {
  //     await axios.delete(`https://yourapi.com/tasks/${id}`);
  //     fetchTasks();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <SafeAreaView>
      <Text>Bin</Text>
      {/* <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button
              title="Delete Permanently"
              // onPress={() => permanentlyDeleteTask(item.id)}
            />
          </View>
        )}
      /> */}
    </SafeAreaView>
  );
};

export default BinScreen;
