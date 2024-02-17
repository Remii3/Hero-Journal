import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { TodoStatus, User } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/RootStack/RootStack';

type TodoListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TodoItem'
>;

const fetchTodos = async (user: User) => {
  try {
    const db = getFirestore();
    const q = query(collection(db, 'todo'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        title: docData.title,
        status: docData.status,
        difficulty: docData.difficulty,
      };
    });
    return todos;
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const finishTodo = async (id: string, status: TodoStatus) => {
  const db = getFirestore();
  const todoRef = doc(db, 'todo', id);
  await updateDoc(todoRef, {
    status: status,
  });
};
export default function ToDoList() {
  const user = useSelector(selectuser);
  const queryClient = useQueryClient();
  const navigation = useNavigation<TodoListNavigationProp>();
  const {
    data: todoList,
    isLoading: todoListIsLoading,
    isError: todoListIsError,
    error: todoListError,
  } = useQuery('todos', () => fetchTodos(user.user!));

  const {
    mutate,
    isLoading: finishTaskIsLoading,
    isError: finishTaskIsError,
    error: finishTaskError,
  } = useMutation(
    (params: { id: string; status: TodoStatus }) =>
      finishTodo(params.id, params.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todos');
      },
    },
  );

  const addTodoHandler = async (id: string, newStatus: TodoStatus) => {
    const status = newStatus === 'done' ? 'pending' : 'done';
    mutate({ id, status });
  };

  if (todoListIsLoading) return <Text>Loading...</Text>;
  if (todoListIsError)
    return <Text>An error occurred: {(todoListError as Error).message}</Text>;

  return (
    <View>
      <ScrollView>
        {todoList &&
          todoList.map((todo) => (
            <View key={todo.id}>
              <Button
                title="Finish"
                disabled={finishTaskIsLoading}
                onPress={() => addTodoHandler(todo.id, todo.status)}
              />
              {finishTaskIsError && (
                <Text>{(finishTaskError as Error).message}</Text>
              )}
              <Button
                title="Check it out!"
                onPress={() => navigation.navigate('TodoItem', { id: todo.id })}
              />
              <Text>{todo.title}</Text>
              <Text>{todo.status}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
