import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Constants/firebaseConfig";
import CustomTextInput from "../../components/ui/CustomTextInput";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/userSlice";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const loginhandler = () => {
    signInWithEmailAndPassword(auth, email, password)
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
      <Button title="Login" onPress={loginhandler} />
      <Button
        title="No account yet?"
        onPress={() => navigation.navigate("Register")}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({});
