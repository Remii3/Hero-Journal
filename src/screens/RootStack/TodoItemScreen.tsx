import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../../components/ui/CustomButton';
import CustomTextInput from '../../components/ui/CustomTextInput';

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

const editTodoItem = async (id: string, data: Partial<TodoTask>) => {
  const db = getFirestore();
  const docRef = doc(db, 'todo', id);
  try {
    await updateDoc(docRef, data);
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const deleteTodoItem = async (id: string) => {
  const db = getFirestore();
  try {
    return await deleteDoc(doc(db, 'todo', id));
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

export default function TodoItemScreen({ route, navigation }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<TodoTask, FirebaseError>(
    'todoItem',
    () => fetchTodoItem(route.params.id) as Promise<TodoTask>,
  );

  const [editFormData, setEditFormData] = useState<Partial<TodoTask>>({
    title: data?.title || '',
    status: (data?.status || 'pending') as TodoTask['status'],
    description: data?.description || '',
    difficulty: (data?.difficulty || '') as TodoTask['difficulty'],
    deadline: data?.deadline || new Date(),
    checkList: data?.checkList || [],
  });

  const {
    mutate,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation(deleteTodoItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('todoList');
      setShowDeleteModal(false);
      navigation.goBack();
    },
  });

  const {
    mutate: mutateEdit,
    isLoading: isLoadingEdit,
    isError: isErrorEdit,
    error: errorEdit,
  } = useMutation(
    ({ id, data }: { id: string; data: Partial<TodoTask> }) =>
      editTodoItem(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todoList');
        queryClient.invalidateQueries('todoItem');
        setShowEditModal(false);
      },
    },
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data ? data.title : 'Loading...',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="create" size={24} color={'#222'} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoadingDelete}
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="trash" size={24} color={'#222'} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, data, isLoadingDelete, showDeleteModal, showEditModal]);

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
      <Modal animationType="slide" visible={showEditModal}>
        <View style={{ padding: 20 }}>
          <Text>Edit Task</Text>
          <CustomTextInput
            value={editFormData.title}
            onChangeText={(text) =>
              setEditFormData({ ...editFormData, title: text })
            }
            placeholder="Title"
          />
          <CustomButton
            title="Save Changes"
            onPress={() => {
              mutateEdit({ id: route.params.id, data: editFormData });
            }}
          />
          <CustomButton
            title="Cancel"
            onPress={() => {
              setShowEditModal(false);
            }}
          />
        </View>
      </Modal>
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
