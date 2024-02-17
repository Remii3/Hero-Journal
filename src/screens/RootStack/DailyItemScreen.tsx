import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DailyTask } from '../../types/types';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { useQuery } from 'react-query';
import { FirebaseError } from 'firebase/app';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyItem'>;

const fetchDailyItem = async (id: string) => {
  const db = getFirestore();
  const todoRef = doc(db, 'daily', id);
  const docSnap = await getDoc(todoRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return Promise.reject(new Error('No such document!'));
  }
};

const deleteDailyItem = async (id: string) => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, 'todo', id));
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const editDailyItem = async (id: string, data: Partial<DailyTask>) => {
  const db = getFirestore();
  const docRef = doc(db, 'todo', id);
  try {
    await updateDoc(docRef, data);
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};
export default function DailyItemScreen({ route }: Props) {
  const { data, isLoading, isError, error } = useQuery<
    DailyTask,
    FirebaseError
  >('todoItem', () => fetchDailyItem(route.params.id) as Promise<DailyTask>);
  return (
    <View>
      {isError && <Text>Error: {error.message}</Text>}
      {isLoading && <Text>Loading...</Text>}
      {data && (
        <View>
          <Text>Title: {data.title}</Text>
          <Text>Status: {data.status}</Text>
          <Text>Description: {data.description}</Text>
          <Text>Difficulty: {data.difficulty}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
