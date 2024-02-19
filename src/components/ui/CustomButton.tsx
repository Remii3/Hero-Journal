import {
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ButtonProps,
  Pressable,
} from 'react-native';
import React from 'react';
import { colors } from '../../../Constants/colors';

interface CustomButtonProps extends ButtonProps {
  type?: 'primary' | 'outline';
}

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  type = 'primary',
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
        type === 'primary' ? styles.primary : styles.outline,
      ]}
    >
      <Text
        style={type === 'primary' ? styles.textPrimary : styles.textOutline}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 3,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.white,
  },
  textPrimary: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  textOutline: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    backgroundColor: 'grey',
  },
});
