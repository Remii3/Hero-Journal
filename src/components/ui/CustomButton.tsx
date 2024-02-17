import {
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ButtonProps,
} from 'react-native';
import React from 'react';

interface CustomButtonProps extends ButtonProps {}

export default function CustomButton({
  title,
  onPress,
  color = '#32f',
  disabled = false,
}: CustomButtonProps) {
  const content = (
    <View
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </View>
  );

  return Platform.OS === 'android' ? (
    <TouchableNativeFeedback
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
      ]}
    >
      {content}
    </TouchableNativeFeedback>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: color }}
      disabled={disabled}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: 'grey',
  },
});
