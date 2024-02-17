import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import ProfileScreen from './ProfileScreen';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Constants/firebaseConfig';
import { logout } from '../../store/slices/userSlice';
import TasksBottom from '../TasksBottom/TasksBottom';

export type HomeDrawerParamList = {
  Tasks: undefined;
  Profile: undefined;
};

const drawerNavigator = createDrawerNavigator<HomeDrawerParamList>();

export default function HomeDrawer() {
  const CustomDrawerContent = (props: any) => {
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const handleLogout = () => {
      signOut(auth)
        .then(() => {
          dispatch(logout());
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={{ padding: 20 }}>
          <Button title="Logout" onPress={handleLogout} />
          {error && <Text>{error}</Text>}
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <drawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <drawerNavigator.Screen name="Tasks" component={TasksBottom} />
      <drawerNavigator.Screen name="Profile" component={ProfileScreen} />
    </drawerNavigator.Navigator>
  );
}

const styles = StyleSheet.create({});
