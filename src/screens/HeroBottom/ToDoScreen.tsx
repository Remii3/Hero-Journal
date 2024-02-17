import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import TodoForm from '../../components/Todo/TodoForm';
import ToDoList from '../../components/Todo/TodoList';

export default function TodoScreen() {
  const [showNewTask, setShowNewTask] = useState(false);

  const newTaskFormVisibilityHandler = (visible: boolean) => {
    setShowNewTask(visible);
  };

  return (
    <View>
      <TodoForm
        newTaskFormVisibilityHandler={newTaskFormVisibilityHandler}
        showNewTask={showNewTask}
      />
      <View>
        <Button title="+" onPress={() => newTaskFormVisibilityHandler(true)} />
      </View>
      <View>
        <ToDoList />
      </View>
      <Text>TasksScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
