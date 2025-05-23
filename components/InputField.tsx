import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { TextInput, Text, View, StyleSheet, useColorScheme, TouchableOpacity, KeyboardTypeOptions } from "react-native";

type InputFieldType = {
    lable?: string,
    placeholder: string,
    onChangeValue?: (value : string) => void
    value? :string
    hasModal?: boolean
    icon?: keyof typeof Ionicons.glyphMap
    itemClicked?: () => void
    keyboardType?: KeyboardTypeOptions
    editable?: boolean
    multiline?:boolean
    numberOfLines?:number
    maxLength? : number
    secureTextEntry? : boolean
  }
  
  // Reusable BottomSheet component
  export const InputField = ({lable, placeholder, onChangeValue, value, hasModal, icon, itemClicked, keyboardType, editable = true, multiline = false, numberOfLines = 1, maxLength, secureTextEntry} : InputFieldType) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getStyles(colorScheme ?? 'light');

    return(
        <>
        {hasModal ? (
            <>
            <Text style={styles.inputLabel}>{lable}</Text>
            <TouchableOpacity 
                style={styles.uploadButton}
                onPress={itemClicked}>
                <Ionicons name={icon} style={styles.Icon}></Ionicons>
                <Text style={styles.textInput}>
                {!value ? `${placeholder}` : `${value}`}
                </Text>
            </TouchableOpacity>
            </>
        ) :(
            <View>
            <Text style={[styles.inputLabel]}>{lable}</Text>
            <View style={styles.InputContainer}>
                <TextInput
                    style={[styles.textInput, !editable && styles.disabledInput, multiline && styles.multilineInput]}
                    editable = {editable}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    maxLength={maxLength}
                    onChangeText={onChangeValue}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry = {secureTextEntry}
                />
            </View>
        </View>
        )}
        </>
    );
  }

const getStyles = (colorScheme: 'light' | 'dark') => {
    const colors = Colors[colorScheme];
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      inputLabel: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 8,
        marginTop: 25,
        fontWeight : '500',
      },
      InputContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        minHeight: 52,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.card,
        overflow: 'hidden',
    
        // Shadow for iOS
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
    
          // Shadow for Android
          elevation: 1,
      },
      textInput: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 16,
        color: colors.text
      },
      uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      Icon: {
        fontSize: 26,
        marginRight: 10,
        color: colors.primary,
      },
      multilineInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
      },
      fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
        marginBottom: 8,
        marginTop: 16,
      },
      disabledInput: {
        backgroundColor: colors.disabled,  // Light gray background when disabled
        color: colors.disabledText,           // Dimmed text color when disabled
        borderColor: colors.border,   
          // Lighter border when disabled
    },
  })
}