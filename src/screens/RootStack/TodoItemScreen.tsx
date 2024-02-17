import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import { useQuery } from 'react-query';
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { TodoTask } from '../../types/types';
import { FirebaseError } from 'firebase/app';
import { convertTimestampToDate } from '../../utils/convertTimestampToDate';

type Props = NativeStackScreenProps<RootStackParamList, 'TodoItem'>;

const fetchTodoItem = async (id: string) => {
  const db = getFirestore();
  const todoRef = doc(db, 'todo', id);
  const docSnap = await getDoc(todoRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return Promise.reject(new Error('No such document!'));
  }
};

const deleteTodoItem = async (id: string) => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, 'todo', id));
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const editTodoItem = async (id: string, data: Partial<TodoTask>) => {
  const db = getFirestore();
  const docRef = doc(db, 'todo', id);
  try {
    await updateDoc(docRef, data);
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

export default function TodoItemScreen({ route }: Props) {
  const { data, isLoading, isError, error } = useQuery<TodoTask, FirebaseError>(
    'todoItem',
    () => fetchTodoItem(route.params.id) as Promise<TodoTask>,
  );

  return (
    <View>
      {isError && <Text>Error: {error.message}</Text>}
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <View>
          <Text>
            Deadline: {convertTimestampToDate(data.deadline as Timestamp)}
          </Text>
          <Text>Title: {data.title}</Text>
          <Text>Status: {data.status}</Text>
          <Text>Description: {data.description}</Text>
          <Text>Difficulty: {data.difficulty}</Text>

          <Text>Checklist:</Text>
          <ScrollView>
            {data &&
              data.checkList.map((item) => (
                <Text key={item.id}>{item.text}</Text>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
