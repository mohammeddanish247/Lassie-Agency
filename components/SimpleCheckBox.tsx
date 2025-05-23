import { TouchableOpacity, View } from "react-native";
import React from "react";

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ selected, onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={{
      height: 20,
      width: 20,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: selected ? '#4285F4' : '#eee',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4
    }}
  >
    {selected && (
      <View style={{
        height: 10,
        width: 10,
        borderRadius: 0,
        backgroundColor: '#4285F4'
      }} />
    )}
  </TouchableOpacity>
);

export default RadioButton;