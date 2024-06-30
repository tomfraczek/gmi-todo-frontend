import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { icon } from "@/constants";
import TabIcon from "@/components/TabIcon";

export default function Layout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="task-list"
          options={{
            title: "Tasks",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icon.gear}
                color={color}
                name="Tasks"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="task-add"
          options={{
            title: "Add a new task",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icon.plus}
                color={color}
                name="Add Task"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="task-bin"
          options={{
            title: "Trash Bin",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icon.bin}
                color={color}
                name="Trash Bin"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
