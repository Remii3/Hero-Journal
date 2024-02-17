import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectuser } from '../../store/slices/userSlice';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import DrawerNavigation from '../HomeDrawer/HomeDrawer';
import TodoItemScreen from './TodoItemScreen';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;
  TodoItem: { id: string };
  DailyItem: { id: string };
};

const stackNavigator = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const user = useSelector(selectuser);
  return (
    <stackNavigator.Navigator>
      {user ? (
        <>
          <stackNavigator.Screen
            name="Home"
            options={{ headerShown: false }}
            component={DrawerNavigation}
          />
          <stackNavigator.Screen name="TodoItem" component={TodoItemScreen} />
        </>
      ) : (
        <>
          <stackNavigator.Screen name="Register" component={RegisterScreen} />
          <stackNavigator.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </stackNavigator.Navigator>
  );
}

const styles = StyleSheet.create({});
