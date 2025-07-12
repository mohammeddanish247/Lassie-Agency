import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const Chip = ({ label, selected = false, onPress }: ChipProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.chipText,
        selected ? styles.selectedText : styles.unselectedText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 5,
    marginBottom: 8,
    borderWidth: 1,
  },
  unselectedChip: {
    backgroundColor: '#E1EDFC',
    borderColor: '#e0e0e0',
  },
  selectedChip: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  chipText: {
    fontSize: 14,
  },
  unselectedText: {
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
});