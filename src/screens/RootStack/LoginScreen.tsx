import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Constants/firebaseConfig';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import CustomButton from '../../components/ui/CustomButton';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { User } from '../../types/types';
import { useMutation } from 'react-query';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const fetchUserData = async (user: any) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log('No such document!');
  }
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const {} = useMutation('fetchUserData');

  const loginhandler = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        return docSnap.data();
      })
      .then((user) => {
        if (user) {
          dispatch(
            login({
              user: {
                ...user,
              },
            }),
          );
          navigation.navigate('Home');
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const changeEmail = (text: string) => {
    setEmail(text);
  };

  const changePassword = (text: string) => {
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsConatainer}>
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
      </View>
      <View style={styles.btnsContainer}>
        <CustomButton title="Login" onPress={loginhandler} />

        <CustomButton
          title="No account yet?"
          onPress={() => navigation.navigate('Register')}
          type="outline"
        />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  inputsConatainer: {
    gap: 10,
  },
  btnsContainer: {
    gap: 10,
  },
});
