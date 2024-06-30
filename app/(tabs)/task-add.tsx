import { View, Text, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createNewTask } from "@/store/taskSlice";
import ROUTES from "@/constants/routes";

const TaskAddScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reset, control, handleSubmit } = useForm();
  const router = useRouter();

  const submit: SubmitHandler<FieldValues> = (data) => {
    const tasksData = { ...data, status: "pending" };
    dispatch(createNewTask(tasksData));
    reset();
    router.push(ROUTES.TASK_LIST);
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
