import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { TodoTask, User } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/RootStack/RootStack';
import { useRefetchUserData } from '../../hooks/useRefetchUserData';

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
  finishTodo: (
    id: string,
    uid: string,
    status: TodoTask['status'],
    difficulty: TodoTask['difficulty'],
  ) => Promise<void>;
};

export default function ToDoList({ fetchTodos, finishTodo }: ToDoListProps) {
  const user = useSelector(selectuser);
  const queryClient = useQueryClient();
  const navigation = useNavigation<TodoListNavigationProp>();
  const { refetchUserData } = useRefetchUserData(user?.uid || '');
  const {
    data: todoList,
    isLoading: isLoadingTodoList,
    isError: isErrorTodoList,
    error: errorTodoList,
  } = useQuery('todoList', () => fetchTodos(user!));

  const {
    mutate: mutateFinishTodo,
    isLoading: isLoadingFinishTodo,
    isError: isErrorFinishTodo,
    error: errorFinishTodo,
  } = useMutation(
    (params: {
      id: string;
      uid: string;
      status: TodoTask['status'];
      difficulty: TodoTask['difficulty'];
    }) => finishTodo(params.id, params.uid, params.status, params.difficulty),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todoList');
        refetchUserData();
      },
    },
  );

  const finishTodoHandler = async (
    id: string,
    uid: string,
    newStatus: TodoTask['status'],
    difficulty: TodoTask['difficulty'],
  ) => {
    const status = newStatus === 'done' ? 'pending' : 'done';
    mutateFinishTodo({ id, uid, status, difficulty });
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
                  title={isLoadingFinishTodo ? 'Loading...' : 'Finish'}
                  disabled={isLoadingFinishTodo}
                  onPress={() =>
                    finishTodoHandler(
                      todo.id,
                      user?.uid || '',
                      todo.status,
                      todo.difficulty,
                    )
                  }
                />
                {isErrorFinishTodo && (
                  <Text>{(errorFinishTodo as Error).message}</Text>
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
