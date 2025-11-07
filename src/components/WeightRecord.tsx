import React from 'react';
import { Weight } from '@types';
import { logWeightStyles } from '@styles';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons/build/Icons';
import { bodyFatPercentage, BMI, saveWeightData } from '@utils';
import { MOCK_GENDER, MOCK_HEIGHT } from '@constants';

interface WeightRecordProps {
    weight: Weight;
    weightData: Weight[];
    setWeightData: any;
}

export const WeightRecord: React.FC<WeightRecordProps> = ({ weight, weightData, setWeightData }) => {

    const deleteWeightRecord = () => {
        const updatedData = weightData.filter(w => w!== weight);
        setWeightData(updatedData);
        saveWeightData(updatedData);
    }

    const dateString = `${weight.date.getDate()}/${weight.date.getMonth()}/${weight.date.getFullYear()}`

    return (
        <>
            <View style={logWeightStyles.weightRecordSeparator} />
            <View style={logWeightStyles.inputTitleRow}>
                <Text style={logWeightStyles.weightRecordText}>
                    {`${dateString}`}
                </Text>
                <Text style={logWeightStyles.weightRecordText}>
                    {weight.weight}
                </Text>
                <Text style={logWeightStyles.weightRecordText}>
                    {BMI(weight.weight, MOCK_HEIGHT).toFixed(2)}
                </Text>
                <Text style={logWeightStyles.weightRecordText}>
                    {
                        weight.waistCircumference
                        && weight.neckCircumference
                        ? `${bodyFatPercentage(weight.waistCircumference, weight.neckCircumference, MOCK_HEIGHT, MOCK_GENDER).toFixed(2)}%`
                        : `-`
                    }
                </Text>
                <TouchableOpacity onPress={deleteWeightRecord}>
                    <Feather name="trash" color="#333" style={logWeightStyles.weightRecordTrash} />
                </TouchableOpacity>
            </View>
            <View style={logWeightStyles.weightRecordSeparator} />
        </>
    )
} 