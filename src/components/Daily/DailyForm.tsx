import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { DailyTask } from '../../types/types';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import CustomTextInput from '../ui/CustomTextInput';
import { Picker } from '@react-native-picker/picker';

type DailyFormProps = {
  showNewDaily: boolean;
  newDailyFormVisibility: (visible: boolean) => void;
  uploadNewDaily: (daily: DailyTask) => Promise<string>;
};

export default function DailyForm({
  newDailyFormVisibility,
  showNewDaily,
  uploadNewDaily,
}: DailyFormProps) {
  const queryClient = useQueryClient();
  const user = useSelector(selectuser);
  const [dailyData, setDailyData] = useState<DailyTask>({
    title: '',
    description: '',
    status: 'pending',
    difficulty: 'easy',
    userId: user.user?.uid ?? '',
    finishTime: null,
    createdAt: new Date(),
  });

  const {
    mutate: mutateUploadDaily,
    isLoading: isLoadingUploadDaily,
    isError: isErrorUploadDaily,
    error: errorUploadDaily,
  } = useMutation(uploadNewDaily, {
    onSuccess: () => {
      queryClient.invalidateQueries('dailyList');
      newDailyFormVisibility(false);
    },
  });

  const changeDailyData = (key: keyof DailyTask, value: string) => {
    setDailyData((prev) => ({ ...prev, [key]: value }));
  };

  const addDailyHandler = async () => {
    mutateUploadDaily(dailyData);
  };

  return (
    <Modal animationType="slide" visible={showNewDaily}>
      {!isLoadingUploadDaily && (
        <View>
          <View>
            <CustomTextInput
              onChange={(text) => changeDailyData('title', text)}
              value={dailyData.title}
              placeholder="Title"
            />
          </View>
          <View>
            <CustomTextInput
              onChange={(text) => changeDailyData('description', text)}
              value={dailyData.description}
              placeholder="Description"
            />
          </View>
          <View>
            <Picker
              selectedValue={dailyData.difficulty}
              onValueChange={(itemValue) =>
                changeDailyData('difficulty', itemValue)
              }
            >
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Hard" value="hard" />
            </Picker>
          </View>
          {isErrorUploadDaily && (
            <View>{(errorUploadDaily as Error).message}</View>
          )}
        </View>
      )}
      <Button
        title={isLoadingUploadDaily ? 'Loading' : 'Upload'}
        onPress={() => addDailyHandler()}
        disabled={isLoadingUploadDaily}
      />
      <Button title="Back" onPress={() => newDailyFormVisibility(false)} />
    </Modal>
  );
}

const styles = StyleSheet.create({});
