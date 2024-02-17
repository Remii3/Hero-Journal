import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { DailyTask } from '../../types/types';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FirebaseError } from 'firebase/app';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../../components/ui/CustomButton';

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
    return await deleteDoc(doc(db, 'daily', id));
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const editDailyItem = async (id: string, data: Partial<DailyTask>) => {
  const db = getFirestore();
  const docRef = doc(db, 'daily', id);
  try {
    await updateDoc(docRef, data);
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};
export default function DailyItemScreen({ route, navigation }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<
    DailyTask,
    FirebaseError
  >('todoItem', () => fetchDailyItem(route.params.id) as Promise<DailyTask>);

  const {
    mutate,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation(deleteDailyItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('dailyList');
      setShowDeleteModal(false);
      navigation.goBack();
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data ? data.title : 'Loading...',
      headerRight: () => (
        <TouchableOpacity
          disabled={isLoadingDelete}
          onPress={() => setShowDeleteModal(true)}
        >
          <Ionicons name="trash" size={24} color={'#222'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, data, isLoadingDelete, showDeleteModal]);

  return (
    <View>
      <Modal animationType="slide" visible={showDeleteModal}>
        <View>
          <Text>Are you sure you want to delete this task?</Text>
          {isErrorDelete && (
            <Text>Error: {(errorDelete as FirebaseError).message}</Text>
          )}
          <CustomButton
            title="Yes"
            onPress={() => {
              mutate(route.params.id);
            }}
          />
          <CustomButton
            title="No"
            onPress={() => {
              setShowDeleteModal(false);
            }}
          />
        </View>
      </Modal>
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
