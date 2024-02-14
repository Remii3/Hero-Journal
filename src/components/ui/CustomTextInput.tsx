import { StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import { TextInput } from "react-native-gesture-handler";

type CustomTextInputProps = {
  placeholder: string;
  value: string | "";
  onChange: (text: string) => void;
};

const CustomTextInput: FC<CustomTextInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
    />
  );
};

const styles = StyleSheet.create({});

export default CustomTextInput;
