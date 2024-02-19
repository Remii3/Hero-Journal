import {
  StyleSheet,
  Text,
  ButtonProps,
  TouchableHighlight,
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
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled,
        type === 'primary' ? styles.primary : styles.secondary,
      ]}
      underlayColor="#0056b3"
    >
      <Text
        style={type === 'primary' ? styles.textPrimary : styles.textSecondary}
      >
        {title}
      </Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    textTransform: 'uppercase',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  textPrimary: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  textSecondary: {
    color: colors.secondaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
