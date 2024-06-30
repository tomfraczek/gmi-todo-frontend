import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icon } from "@/constants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ROUTES from "@/constants/routes";
import { useRouter } from "expo-router";

type WelcomeProps = {
  count: number;
};

const Welcome = ({ count }: WelcomeProps) => {
  const router = useRouter();

  return (
    <SafeAreaView className="w-full p-5 mb-5 h-full border-2 border-primary flex justify-center">
      <Image
        source={icon.settings}
        className="w-32 h-32 mb-10"
        resizeMode="contain"
      />
      <Text className="text-5xl font-bold w-3/5 capitalize font-pbold">
        The best <Text className="text-orange-500 font-bold">todo</Text> to look
        for your tasks <Text className="text-blue-400">easily</Text>
      </Text>

      <TouchableWithoutFeedback
        className="rounded-full bg-black w-full h-16 flex justify-center items-center mt-20"
        onPress={() => router.push(ROUTES.TASK_LIST)}
      >
        <Text className="text-white text-2xl uppercase">
          Open the clipboard
        </Text>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Welcome;
