import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  title?: string;
  options: RadioOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  styles?: Partial<RadioGroupStyles>;
}

type RadioGroupStyles = {
  container: ViewStyle;
  title: TextStyle;
  optionsContainer: ViewStyle;
  option: ViewStyle;
  radioOuter: ViewStyle;
  radioOuterSelected: ViewStyle;
  radioOuterDisabled: ViewStyle;
  radioInner: ViewStyle;
  label: TextStyle;
  labelSelected: TextStyle;
  labelDisabled: TextStyle;
};

export const RadioGroup = ({
  title,
  options,
  selectedValue,
  onValueChange,
  style,
  titleStyle,
  styles: customStyles = {},
}: RadioGroupProps) => {
  const styles = {
    ...defaultRadioGroupStyles,
    ...customStyles,
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => !option.disabled && onValueChange(option.value)}
            disabled={option.disabled}
            activeOpacity={0.7}
          >
            <View style={[
              styles.radioOuter,
              selectedValue === option.value && styles.radioOuterSelected,
              option.disabled && styles.radioOuterDisabled
            ]}>
              {selectedValue === option.value && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={[
              styles.label,
              option.disabled && styles.labelDisabled,
              selectedValue === option.value && styles.labelSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const defaultRadioGroupStyles = StyleSheet.create<RadioGroupStyles>({
    container: {
      marginTop: 24,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 16,
      color: '#333',
    },
    optionsContainer: {
      gap: 16,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radioOuter: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#ccc',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    radioOuterSelected: {
      borderColor: '#4285F4',
    },
    radioOuterDisabled: {
      borderColor: '#eee',
    },
    radioInner: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#4285F4',
    },
    label: {
      fontSize: 16,
      color: '#333',
    },
    labelSelected: {
      color: '#4285F4',
    },
    labelDisabled: {
      color: '#999',
    },
  });