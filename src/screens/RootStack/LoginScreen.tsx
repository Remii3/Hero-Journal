import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Constants/firebaseConfig';
import CustomTextInput from '../../components/ui/CustomTextInput';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../store/slices/userSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStack';
import CustomButton from '../../components/ui/CustomButton';
import { fetchUserData } from '../../services/userService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const loginhandler = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid;
        const userData = await fetchUserData(uid);
        dispatch(updateUserData(userData));
        navigation.navigate('Home');
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
