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
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from 'react-query';

type TodoFormProps = {
  showNewTodo: boolean;
  newTodoFormVisibilityHandler: (visible: boolean) => void;
  uploadNewTodo: (todo: TodoTask) => Promise<string>;
};

export default function TodoForm({
  showNewTodo,
  newTodoFormVisibilityHandler,
  uploadNewTodo,
}: TodoFormProps) {
  const queryClient = useQueryClient();
  const user = useSelector(selectuser);
  const [todoData, setTodoData] = useState<TodoTask>({
    title: '',
    description: '',
    difficulty: 'easy',
    deadline: new Date(),
    status: 'pending',
    checkList: [],
    userId: user.user?.uid ?? '',
    createdAt: new Date(),
  });
  const [show, setShow] = useState(false);
  const [taskCheckListItem, setTaskCheckListItem] = useState('');

  const {
    mutate: mutateUploadTodo,
    isLoading: isLoadingUploadTodo,
    isError: isErrorUploadTodo,
    error: errorUploadTodo,
  } = useMutation(uploadNewTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todoList');
      newTodoFormVisibilityHandler(false);
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
    mutateUploadTodo(todoData);
  };

  return (
    <Modal animationType="slide" visible={showNewTodo}>
      {!isLoadingUploadTodo && (
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
                value={todoData.deadline as Date}
                mode="date"
                minimumDate={new Date(Date.now() + 86400000)} // 24 hours from now
                display="calendar"
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
          {isErrorUploadTodo && (
            <View>{(errorUploadTodo as Error).message}</View>
          )}
        </View>
      )}
      <Button
        title={isLoadingUploadTodo ? 'Loading' : 'Upload'}
        onPress={() => addTodoHandler()}
        disabled={isLoadingUploadTodo}
      />
      <Button
        title="Back"
        onPress={() => newTodoFormVisibilityHandler(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
