import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { User } from '../../types/types';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../screens/RootStack/RootStack';
import { useQuery } from 'react-query';
import { FirebaseError } from 'firebase/app';
import { ScrollView } from 'react-native-gesture-handler';

type RootNavigationTypes = NativeStackNavigationProp<
  RootStackParamList,
  'DailyItem'
>;

type DailyListProps = {
  fetchDailyList: (user: User) => Promise<{ id: string; title: string }[]>;
};

export default function DailyList({ fetchDailyList }: DailyListProps) {
  const user = useSelector(selectuser);
  const navigation = useNavigation<RootNavigationTypes>();
  const {
    data: dailyList,
    isLoading: isLoadingDailyList,
    isError: isErrorDailyList,
    error: errorDailyList,
  } = useQuery('dailyList', () => fetchDailyList(user.user!));

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
