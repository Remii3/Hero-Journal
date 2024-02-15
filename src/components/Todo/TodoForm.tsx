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
import DateTimePicker from '@react-native-community/datetimepicker';

type TodoFormProps = {
  showNewTask: boolean;
  newTaskFormVisibilityHandler: (visible: boolean) => void;
};

export default function TodoForm({
  showNewTask,
  newTaskFormVisibilityHandler,
}: TodoFormProps) {
  const db = getFirestore();
  const user = useSelector(selectuser);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    error: '',
  });

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDifficulty, setTaskDifficulty] = useState('easy');
  const [taskCheckListItem, setTaskCheckListItem] = useState('');
  const [taskCheckList, setTaskCheckList] = useState(
    [] as { id: string; text: string }[],
  );

  const changeTaskTitle = (text: string) => {
    setTaskTitle(text);
  };

  const changeTaskDescription = (text: string) => {
    setTaskDescription(text);
  };

  const addTodoHandler = async () => {
    const task = {
      title: taskTitle,
      userId: user.user?.uid ?? '',
      description: taskDescription,
      status: 'pending',
      difficulty: taskDifficulty,
      deadline: date,
      checkList: taskCheckList,
    } as TodoTask;

    try {
      setUploadStatus({ loading: true, error: '' });
      const docRef = await addDoc(collection(db, 'todo'), task);
      console.log('Document written with ID: ', docRef.id);
      setUploadStatus({ loading: false, error: '' });
      newTaskFormVisibilityHandler(false);
    } catch (err) {
      setUploadStatus({ loading: false, error: err.message });
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <Modal animationType="slide" visible={showNewTask}>
      {!uploadStatus.loading && (
        <View>
          <View>
            <CustomTextInput
              onChange={(text) => changeTaskTitle(text)}
              value={taskTitle}
              placeholder="Title"
            />
          </View>
          <View>
            <CustomTextInput
              onChange={(text) => changeTaskDescription(text)}
              value={taskDescription}
              placeholder="Description"
            />
          </View>
          <View>
            <Picker
              selectedValue={taskDifficulty}
              onValueChange={(itemValue, itemIndex) =>
                setTaskDifficulty(itemValue as string)
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
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
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
                <Button
                  title="+"
                  onPress={() =>
                    setTaskCheckList((prev) => [
                      ...prev,
                      { id: Math.random().toString(), text: taskCheckListItem },
                    ])
                  }
                />
              </View>
              {taskCheckList.map((item) => (
                <View key={item.id}>
                  <Button
                    title={item.text}
                    onPress={() => {
                      const newList = taskCheckList.filter(
                        (i) => i.id !== item.id,
                      );
                      setTaskCheckList(newList);
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
      {!uploadStatus.loading && (
        <Button title="Add" onPress={() => addTodoHandler()} />
      )}
      {uploadStatus.loading && <Button title="Loading..." disabled />}
      <Button
        title="Back"
        onPress={() => newTaskFormVisibilityHandler(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
