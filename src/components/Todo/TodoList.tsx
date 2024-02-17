import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { TodoTask, User } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/RootStack/RootStack';

type TodoListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TodoItem'
>;

type ToDoListProps = {
  fetchTodos: (user: User) => Promise<
    {
      id: string;
      title: string;
      status: TodoTask['status'];
      difficulty: TodoTask['difficulty'];
    }[]
  >;
  finishTodo: (id: string, status: TodoTask['status']) => Promise<void>;
};

export default function ToDoList({ fetchTodos, finishTodo }: ToDoListProps) {
  const user = useSelector(selectuser);
  const queryClient = useQueryClient();
  const navigation = useNavigation<TodoListNavigationProp>();
  const {
    data: todoList,
    isLoading: isLoadingTodoList,
    isError: isErrorTodoList,
    error: errorTodoList,
  } = useQuery('todos', () => fetchTodos(user.user!));

  const {
    mutate: mutateFinishTodo,
    isLoading: isLoadingFinishTask,
    isError: isErrorFinishTask,
    error: errorFinishTask,
  } = useMutation(
    (params: { id: string; status: TodoTask['status'] }) =>
      finishTodo(params.id, params.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
      },
    },
  );

  const finishTodoHandler = async (
    id: string,
    newStatus: TodoTask['status'],
  ) => {
    const status = newStatus === 'done' ? 'pending' : 'done';
    mutateFinishTodo({ id, status });
  };

  return (
    <View>
      {isErrorTodoList && <Text>{(errorTodoList as Error).message}</Text>}
      {isLoadingTodoList && <Text>Loading...</Text>}
      {todoList && (
        <View>
          {todoList.length === 0 && <Text>No tasks</Text>}
          <ScrollView>
            {todoList.map((todo) => (
              <View key={todo.id}>
                <Button
                  title={isLoadingFinishTask ? 'Loading...' : 'Finish'}
                  disabled={isLoadingFinishTask}
                  onPress={() => finishTodoHandler(todo.id, todo.status)}
                />
                {isErrorFinishTask && (
                  <Text>{(errorFinishTask as Error).message}</Text>
                )}
                <Button
                  title="Check it out!"
                  onPress={() =>
                    navigation.navigate('TodoItem', { id: todo.id })
                  }
                />
                <Text>{todo.title}</Text>
                <Text>{todo.status}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
