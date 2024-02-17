import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { DailyTask, User } from '../../types/types';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import DailyList from '../../components/Daily/DailyList';
import DailyForm from '../../components/Daily/DailyForm';

const fetchDailyTasks = async (user: User) => {
  try {
    const db = getFirestore();
    const q = query(
      collection(db, 'daily'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);
    const daily = querySnapshot.docs.map((doc) => {
      const docData = doc.data() as DailyTask;
      return {
        id: doc.id,
        title: docData.title,
        status: docData.status,
        difficulty: docData.difficulty,
      };
    });
    return daily;
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const uploadNewDailyTask = async (daily: any) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, 'daily'), daily);
    return docRef.id;
  } catch (err: unknown) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const finishDaily = async (id: string, status: DailyTask['status']) => {
  const db = getFirestore();
  const todoRef = doc(db, 'daily', id);
  await updateDoc(todoRef, {
    status: status,
  });
};

export default function DailyScreen() {
  const [showNewDaily, setShowNewDaily] = useState(false);

  const newDailyFormVisibilityHandler = (visible: boolean) => {
    setShowNewDaily(visible);
  };
  return (
    <View>
      <DailyForm
        uploadNewDaily={uploadNewDailyTask}
        showNewDaily={showNewDaily}
        newDailyFormVisibility={newDailyFormVisibilityHandler}
      />
      <View>
        <Button title="+" onPress={() => newDailyFormVisibilityHandler(true)} />
      </View>
      <View>
        <DailyList fetchDailyList={fetchDailyTasks} finishDaily={finishDaily} />
      </View>
      <Text>DailyScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
