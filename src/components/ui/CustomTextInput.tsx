import {
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { colors } from '../../../Constants/colors';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  labelStyle?: TextStyle;
  style?: ViewStyle;
}
const CustomTextInput: FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.textInput}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
  },
  textInput: {
    height: 48,
    fontSize: 16,
  },
});

export default CustomTextInput;
