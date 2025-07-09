import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface AnimatedInputProps {
  colors: {
    primary: string;
    white: string;
    secondary?: string;
  };
  onSearch?: (searchText: string) => void;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({ colors, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSearchButton, setShowSearchButton] = useState(false);
  const animatedWidth = useRef(new Animated.Value(42)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const expandInput = () => {
    setIsExpanded(true);
    setShowSearchButton(true)
    Animated.timing(animatedWidth, {
      toValue: screenWidth - 32,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 200,
      delay: 100,
      useNativeDriver: false,
    }).start(() => {
      inputRef.current?.focus();
    });
  };

  const collapseInput = () => {
    inputRef.current?.blur();
    setShowSearchButton(false);
    
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedWidth, {
      toValue: 42,
      duration: 300,
      delay: 50,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
      setInputValue('');
    });
  };

  const handleIconPress = () => {
    if (isExpanded) {
      collapseInput();
    } else {
      expandInput();
    }
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
    setShowSearchButton(text.trim().length > 0);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch?.(inputValue.trim());
      // console.log('Search:', inputValue.trim());
      // collapseInput();
      Keyboard.dismiss()
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            width: animatedWidth,
            backgroundColor: colors.primary,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleIconPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isExpanded ? "close-outline" : "search-outline"} 
            size={24} 
            color={colors.white}
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <Animated.View 
            style={[
              styles.inputContainer,
              { opacity: animatedOpacity }
            ]}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={[styles.textInput, { color: colors.white }]}
                value={inputValue}
                onChangeText={handleTextChange}
                placeholder="Search options..."
                placeholderTextColor={colors.white + '80'}
                // onBlur={collapseInput}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
            </View>
            
            {/* More prominent search button */}
            {showSearchButton && (
              <TouchableOpacity
               style={{marginRight: 10}}
                onPress={handleSearch}
              >
                <Ionicons 
                  name="search-outline" 
                  size={22} 
                  color={colors.white}
                />
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginRight: 30
  },
  animatedContainer: {
    height: 42,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  inputWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 8,
    minHeight: 32,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AnimatedInput;