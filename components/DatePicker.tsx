import { View, Text } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";

type DatePickerType = {
    doShow: boolean,
    onDateChange: (date: Date) => void
}

export const DatePicker = ({ doShow, onDateChange }: DatePickerType) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (doShow) {
            setDate(new Date()); // Reset to current date when shown
        }
    }, [doShow]);

    const handleChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            onDateChange(selectedDate);
        }
    };

    return (
        <View>
            {doShow && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                />
            )}
        </View>
    );
};