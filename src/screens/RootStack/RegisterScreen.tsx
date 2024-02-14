import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../../components/ui/CustomTextInput";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/userSlice";
import {
  createUserWithEmailAndPassword,
  auth,
} from "../../../Constants/firebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(
          login({
            user: {
              email: user.email,
              uid: user.uid,
              displayName: user.displayName,
            },
          })
        );
        navigation.navigate("Home");
      })
      .catch((error) => {
        setError(error.message);
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
          onChange={changeEmail}
        />
      </View>
      <View>
        <CustomTextInput
          placeholder="Password"
          value={password}
          onChange={changePassword}
        />
      </View>
      <Button title="Register" onPress={onRegister} />
      <Button
        title="Already have an account"
        onPress={() => navigation.navigate("Login")}
      />
      {error && <Text>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({});
