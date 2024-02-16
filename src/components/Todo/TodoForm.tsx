import {
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useState } from 'react';
import CustomTextInput from '../ui/CustomTextInput';
import { TodoTask } from '../../types/types';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMutation } from 'react-query';

type TodoFormProps = {
  showNewTask: boolean;
  newTaskFormVisibilityHandler: (visible: boolean) => void;
};

const uploadNewTodo = async (todo: TodoTask) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, 'todo'), todo);
    return docRef.id;
  } catch (err: unknown) {
    return Promise.reject(new Error((err as Error).message));
  }
};

export default function TodoForm({
  showNewTask,
  newTaskFormVisibilityHandler,
}: TodoFormProps) {
  const user = useSelector(selectuser);
  const [todoData, setTodoData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    deadline: new Date(),
    status: 'pending',
    checkList: [],
    userId: user.user?.uid ?? '',
  } as TodoTask);
  const [show, setShow] = useState(false);
  const [taskCheckListItem, setTaskCheckListItem] = useState('');

  const { mutate, isLoading, isError, error } = useMutation(uploadNewTodo, {
    onSuccess: () => {
      newTaskFormVisibilityHandler(false);
    },
  });

  const changeTodoData = (key: keyof TodoTask, value: string) => {
    setTodoData((prev) => ({ ...prev, [key]: value }));
  };

  const onAddCheckListItem = () => {
    setTodoData((prev) => ({
      ...prev,
      checkList: [
        ...prev.checkList,
        { id: Date.now().toString(), text: taskCheckListItem },
      ],
    }));
    setTaskCheckListItem('');
  };

  const onRemoveCheckListItem = (id: string) => {
    setTodoData((prev) => ({
      ...prev,
      checkList: prev.checkList.filter((item) => item.id !== id),
    }));
  };

  const onChangeDeadline = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || todoData.deadline;
    setShow(Platform.OS === 'ios');
    setTodoData((prev) => ({ ...prev, deadline: currentDate }));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const addTodoHandler = async () => {
    mutate(todoData);
  };

  return (
    <Modal animationType="slide" visible={showNewTask}>
      {!isLoading && (
        <View>
          <View>
            <CustomTextInput
              onChange={(text) => changeTodoData('title', text)}
              value={todoData.title}
              placeholder="Title"
            />
          </View>
          <View>
            <CustomTextInput
              onChange={(text) => changeTodoData('description', text)}
              value={todoData.description}
              placeholder="Description"
            />
          </View>
          <View>
            <Picker
              selectedValue={todoData.difficulty}
              onValueChange={(itemValue) =>
                changeTodoData('difficulty', itemValue)
              }
            >
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Hard" value="hard" />
            </Picker>
          </View>
          <View>
            <View>
              <Button onPress={showDatepicker} title="Show date picker!" />
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={todoData.deadline}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDeadline}
              />
            )}
          </View>
          <View>
            <ScrollView>
              <View>
                <CustomTextInput
                  onChange={(text) => setTaskCheckListItem(text)}
                  value={taskCheckListItem}
                  placeholder="Add a subtask"
                />
                <Button title="+" onPress={() => onAddCheckListItem()} />
              </View>
              {todoData.checkList.map((item) => (
                <View key={item.id}>
                  <Button
                    title={item.text}
                    onPress={() => onRemoveCheckListItem(item.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          {isError && <View>{(error as Error).message}</View>}
        </View>
      )}
      {!isLoading && <Button title="Add" onPress={() => addTodoHandler()} />}
      {isLoading && <Button title="Loading..." disabled />}
      <Button
        title="Back"
        onPress={() => newTaskFormVisibilityHandler(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
