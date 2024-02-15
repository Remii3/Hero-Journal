import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DailyScreen from "./DailyScreen";
import TasksScreen from "./ToDoScreen";

const bottomTabNavigator = createBottomTabNavigator();

export type HeroBottomParamList = {
  Tasks: undefined;
  Daily: undefined;
};

export default function HeroBottom() {
  return (
    <bottomTabNavigator.Navigator>
      <bottomTabNavigator.Screen
        name="ToDo"
        options={{ headerShown: false }}
        component={TasksScreen}
      />
      <bottomTabNavigator.Screen
        name="Daily"
        options={{ headerShown: false }}
        component={DailyScreen}
      />
    </bottomTabNavigator.Navigator>
  );
}

const styles = StyleSheet.create({});
