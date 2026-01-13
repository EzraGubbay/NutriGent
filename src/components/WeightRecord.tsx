import React from 'react';
import { Weight, ThemeType } from '@types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons/build/Icons';
import { bodyFatPercentage, BMI, saveWeightData } from '@utils';
import { MOCK_GENDER, MOCK_HEIGHT, width } from '@constants';
import { useTheme } from '@src/theme/ThemeContext';

interface WeightRecordProps {
    weight: Weight;
    weightData: Weight[];
    setWeightData: any;
}


export const WeightRecord: React.FC<WeightRecordProps> = ({ weight, weightData, setWeightData }) => {

    const { theme } = useTheme();
    const styles = getStyles(theme);

    const deleteWeightRecord = () => {
        const updatedData = weightData.filter(w => w !== weight);
        setWeightData(updatedData);
        saveWeightData(updatedData);
    }

    const dateString = `${weight.date.getDate()}/${weight.date.getMonth() + 1}/${weight.date.getFullYear()}`

    return (
        <>
            <View style={styles.weightRecordSeparator} />
            <View style={styles.inputTitleRow}>
                <Text style={styles.weightRecordText}>
                    {`${dateString}`}
                </Text>
                <Text style={styles.weightRecordText}>
                    {weight.weight}
                </Text>
                <Text style={styles.weightRecordText}>
                    {BMI(weight.weight, MOCK_HEIGHT).toFixed(2)}
                </Text>
                <Text style={styles.weightRecordText}>
                    {
                        weight.waistCircumference
                            && weight.neckCircumference
                            ? `${bodyFatPercentage(weight.waistCircumference, weight.neckCircumference, MOCK_HEIGHT, MOCK_GENDER).toFixed(2)}%`
                            : `-`
                    }
                </Text>
                <TouchableOpacity onPress={deleteWeightRecord}>
                    <Feather name="trash" color="#333" style={styles.weightRecordTrash} />
                </TouchableOpacity>
            </View>
            <View style={styles.weightRecordSeparator} />
        </>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    inputTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    weightRecordSeparator: {
        height: 1,
        backgroundColor: theme.background,
        alignSelf: 'center',
        width: width - 80,
    },
    weightRecordText: {
        fontSize: 18,
        marginVertical: 10,
        color: theme.label,
    },
    weightRecordTrash: {
        fontSize: 24,
        marginVertical: 10,
        color: theme.label,
    },
})
