import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';

export default function ShortSummary() {
  const { user } = useSelector(selectuser);
  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text>Profile img</Text>
      </View>
      <View style={styles.awardsContainer}>
        <View>
          <View></View>
          <Text>Easy: {user.todos.done.quantity.easy}</Text>
        </View>
        <View>
          <View></View>
          <Text>Medium: {user.todos.done.quantity.medium}</Text>
        </View>
        <View>
          <View></View>
          <Text>Hard: {user.todos.done.quantity.hard}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  profileContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#CCCCCC',
  },
  awardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
