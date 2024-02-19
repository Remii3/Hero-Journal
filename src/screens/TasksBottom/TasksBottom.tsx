import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DailyScreen from './DailyScreen';
import TodoScreen from './TodoScreen';
import ShortSummary from '../../components/Todo/ShortSummary';

export type TasksBottomParamList = {
  Todo: undefined;
  Daily: undefined;
};

const bottomTabNavigator = createBottomTabNavigator<TasksBottomParamList>();

export default function TasksBottom() {
  return (
    <View style={styles.container}>
      <ShortSummary />
      <bottomTabNavigator.Navigator>
        <bottomTabNavigator.Screen
          name="Todo"
          options={{ headerShown: false }}
          component={TodoScreen}
        />
        <bottomTabNavigator.Screen
          name="Daily"
          options={{ headerShown: false }}
          component={DailyScreen}
        />
      </bottomTabNavigator.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
