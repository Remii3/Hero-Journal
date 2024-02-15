import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { User } from '../../types/types';

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

export default function ToDoList() {
  const user = useSelector(selectuser);

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery('todos', () => fetchTodos(user.user!));

  if (isLoading) return <Text>Loading...</Text>;
  if (error instanceof Error)
    return <Text>An error occurred: {error.message}</Text>;

  return (
    <View>
      <ScrollView>
        {todos &&
          todos.map((todo) => (
            <View key={todo.id}>
              <Text>{todo.title}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
