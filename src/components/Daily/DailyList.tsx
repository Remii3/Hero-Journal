import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { DailyTask, User } from '../../types/types';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/RootStack/RootStack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FirebaseError } from 'firebase/app';
import { ScrollView } from 'react-native-gesture-handler';
import { useRefetchUserData } from '../../hooks/useRefetchUserData';

type RootNavigationTypes = NativeStackNavigationProp<
  RootStackParamList,
  'DailyItem'
>;

type DailyListProps = {
  fetchDailyList: (user: User) => Promise<
    {
      id: string;
      title: string;
      status: DailyTask['status'];
      difficulty: DailyTask['difficulty'];
    }[]
  >;
  finishDaily: (id: string, status: DailyTask['status']) => Promise<void>;
};

export default function DailyList({
  fetchDailyList,
  finishDaily,
}: DailyListProps) {
  const user = useSelector(selectuser);
  const queryClient = useQueryClient();
  const navigation = useNavigation<RootNavigationTypes>();
  const { refetchUserData } = useRefetchUserData(user?.uid || '');
  const {
    data: dailyList,
    isLoading: isLoadingDailyList,
    isError: isErrorDailyList,
    error: errorDailyList,
  } = useQuery('dailyList', () => fetchDailyList(user!));

  const {
    mutate: mutateFinishDaily,
    isLoading: isLoadingFinishDaily,
    isError: isErrorFinishDaily,
    error: errorFinishDaily,
  } = useMutation(
    (params: { id: string; status: DailyTask['status'] }) =>
      finishDaily(params.id, params.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dailyList');
        refetchUserData();
      },
    },
  );

  const finishDailyHandler = async (
    id: string,
    newStatus: DailyTask['status'],
  ) => {
    const status = newStatus === 'done' ? 'pending' : 'done';
    mutateFinishDaily({ id, status });
  };

  return (
    <View>
      {isErrorDailyList && (
        <Text>{(errorDailyList as FirebaseError).message}</Text>
      )}
      {isLoadingDailyList && <Text>Loading...</Text>}
      {dailyList && (
        <View>
          {dailyList.length <= 0 && <Text>No daily</Text>}
          {dailyList.length > 0 && (
            <ScrollView>
              {dailyList.map((daily) => (
                <View key={daily.id}>
                  <Button
                    title={isLoadingFinishDaily ? 'Loading...' : 'Finish'}
                    disabled={isLoadingFinishDaily}
                    onPress={() => finishDailyHandler(daily.id, daily.status)}
                  />
                  {isErrorFinishDaily && (
                    <Text>{(errorFinishDaily as Error).message}</Text>
                  )}
                  <Button
                    title="Check it out!"
                    onPress={() =>
                      navigation.navigate('DailyItem', { id: daily.id })
                    }
                  />
                  <Text>{daily.title}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      <Text>DailyList</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
