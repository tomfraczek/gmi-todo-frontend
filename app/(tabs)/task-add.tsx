import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { Button } from "react-native-paper";
import { Task, getAllTasks, createTask } from "@/helpers/api";

const TaskAddScreen: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const submit: SubmitHandler<FieldValues> = async (data) => {
    const tasksData = { ...data, status: "pending" };
    const newTask = await createTask(tasksData);
    router.push("/(tabs)/task-list");
  };

  return (
    <SafeAreaView className="p-4">
      <View className="flex justify-center items-center rounded-3xl bg-white p-4">
        <Text className="text-2xl font-bold mb-2">Create a new task</Text>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="mt-4 p-2 w-full bg-gray-200 text-gray-900 border border-gray-300 rounded-md"
              placeholder="Title"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              multiline
              className="mt-4 p-2 w-full bg-gray-200 text-gray-900 border border-gray-300 rounded-md"
              placeholder="Description"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />

        <Button
          className="mt-4 w-full"
          textColor="white"
          buttonColor="blue"
          onPress={handleSubmit(submit)}
        >
          Submit
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default TaskAddScreen;
