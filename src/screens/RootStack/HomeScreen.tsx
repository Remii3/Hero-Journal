import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectuser } from "../../store/slices/userSlice";

export default function HomeScreen() {
  const userData = useSelector(selectuser);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
