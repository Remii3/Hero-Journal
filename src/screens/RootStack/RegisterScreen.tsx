import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';
import {
  createUserWithEmailAndPassword,
  auth,
} from '../../../Constants/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import CustomButton from '../../components/ui/CustomButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  const onRegister = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            todos: {
              done: {
                quantity: {
                  easy: 0,
                  medium: 0,
                  hard: 0,
                },
                tasks: [],
              },
            },
          });
        } else {
          console.log('User document exists.');
        }

        return userCredential;
      })
      .then(async (userCredential) => {
        const user = userCredential.user;

        dispatch(
          login({
            user: {
              email: user.email,
              uid: user.uid,
              displayName: user.displayName,
            },
          }),
        );
        navigation.navigate('Home');
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const changeEmail = (text: string) => {
    setEmail(text);
  };

  const changePassword = (text: string) => {
    setPassword(text);
  };

  return (
    <View>
      <View>
        <CustomTextInput
          placeholder="Email"
          value={email}
          onChangeText={changeEmail}
        />
      </View>
      <View>
        <CustomTextInput
          placeholder="Password"
          value={password}
          onChangeText={changePassword}
        />
      </View>
      <CustomButton title="Register" onPress={onRegister} disabled={loading} />
      <CustomButton
        title="Already have an account"
        onPress={() => navigation.navigate('Login')}
      />
      {error && <Text>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({});
