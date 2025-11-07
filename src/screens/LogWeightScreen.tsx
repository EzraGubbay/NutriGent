import { View, ScrollView, TouchableOpacity, Text, TextInput, Keyboard, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loadWeightData, saveWeightData } from "@utils";
import { DrawerNavProps, Weight } from '@types';
import { logWeightStyles, styles } from "@styles";
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { Circle, useFont, Text as SKText, matchFont } from '@shopify/react-native-skia';
import { useDerivedValue } from "react-native-reanimated";
import { WeightRecord } from "@components/WeightRecord";

const LogWeightScreen = () => {

    const robotoSemiBold = require('../../Roboto-SemiBold.ttf');
    const robotoBold = require('../../Roboto-Bold.ttf');
    const font = useFont(robotoSemiBold, 12)
    const systemFont = matchFont({
        fontFamily: Platform.select({
            ios: 'Helvetica',           // iOS default
            android: 'Roboto',          // Android default
            default: 'sans-serif',
        }),
        fontSize: 24,
        fontWeight: 'bold',
    });
    const labelColor = "black";
    const lineColor = "black"

    // Navigation Menu
    const navigation = useNavigation<DrawerNavProps>();
    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const [ inputWeight, setInputWeight ] = useState<string>('');
    const [ inputWaistCircumference, setInputWaistCircumference ] = useState<string>('');
    const [ inputNeckCircumference, setInputNeckCircumference ] = useState<string>('');

    const handleLogWeight = () => {
        Keyboard.dismiss();

        // Input validation
        if (inputWeight === '') {
            Alert.alert('Missing Field', 'You must enter a weight');
            return;
        }
        if (inputWaistCircumference !== '') {
            if (inputNeckCircumference === '') {
                Alert.alert('Missing Field', 'You must enter a neck circumference as well');
                return;
            }
        }
        if (inputNeckCircumference !== '') {
            if (inputWaistCircumference === '') {
                Alert.alert('Missing Field', 'You must enter a waist circumference as well');
                return;
            }
        }

        const circumferenceProvided = inputWaistCircumference !== '' && inputWaistCircumference !== '';
        const today = new Date();
        const weightInputContent: Weight = {
            date: today,
            day: today.getDate(),
            weight: Number(inputWeight),
            waistCircumference: circumferenceProvided ? Number(inputWaistCircumference) : undefined,
            neckCircumference: circumferenceProvided ? Number(inputNeckCircumference) : undefined,

        }
        const data = [...weightData];
        data.push(weightInputContent);
        setWeightData(data);
        saveWeightData(data);
        Alert.alert('Success', 'Weight logged successfully!')
        emptyInput();

    }

    const emptyInput = () => {
        setInputWeight('');
        setInputWaistCircumference('');
        setInputNeckCircumference('');
    }

    const [ weightData, setWeightData ] = useState<Weight[]>([]);

    useEffect(() => {
        loadWeightData(setWeightData);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            emptyInput();
        }, [])
    );

    // Cartesian Chart Tooltip
    const { state, isActive } = useChartPressState({ x: 0, y: { weight: 0 }});
    const value = useDerivedValue(() => {
        return state.y.weight.value.value.toFixed(2) + " kg";
    }, [state]);

    return (
        <SafeAreaProvider style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Feather name="share-2" size={24} color="#888" />
                        <Text style={styles.dateText}>
                            Log Your Weight
                        </Text>
                        <TouchableOpacity onPress={toggleDrawer}>
                            <Feather name="menu" size={28} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.safeArea}>
                    <View style={logWeightStyles.inputTitleRow}>
                        <Text style={logWeightStyles.weightScreenTitle}>
                            Enter New Weight:
                        </Text>
                        <TouchableOpacity onPress={emptyInput}>
                            <Feather name="trash" size={28} color="#333" style={logWeightStyles.logWeightTrashButton} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={logWeightStyles.weightInputField}
                        placeholder='Enter your current weight...'
                        placeholderTextColor="#A9A9A9"
                        onChangeText={setInputWeight}
                        keyboardType="decimal-pad"
                    >
                        {inputWeight}
                    </TextInput>
                    <TextInput 
                        style={logWeightStyles.weightInputField}
                        placeholder='Waist Circumference (optional)'
                        placeholderTextColor="#A9A9A9"
                        onChangeText={setInputWaistCircumference}
                        keyboardType="decimal-pad"
                    >
                        {inputWaistCircumference}
                    </TextInput>
                    <TextInput 
                        style={logWeightStyles.weightInputField}
                        placeholder='Neck Circumference (optional)'
                        placeholderTextColor="#A9A9A9"
                        onChangeText={setInputNeckCircumference}
                        keyboardType="decimal-pad"
                    >
                        {inputNeckCircumference}
                    </TextInput>
                    <TouchableOpacity onPress={handleLogWeight}>
                        <Text style={logWeightStyles.logWeightButtonText}>
                            {`Log Weight ${'\u2192'}`}
                        </Text>
                    </TouchableOpacity>

                    {weightData.length !== 0 && font ? (
                    <>
                     {/* Weight Cartesian Chart */}
                     <View style={logWeightStyles.weightGraphContainer}>
                        <View style={logWeightStyles.inputTitleRow}>
                            <Text style={logWeightStyles.weightGraphTitle}>
                                Weight History
                            </Text>
                        </View>
                        <View style={logWeightStyles.chartContainer}>
                            <CartesianChart
                                data={weightData}
                                xKey="day"
                                yKeys={["weight"]}
                                domainPadding={{ top: 60, left: 10, bottom: 5, right: 10 }}
                                axisOptions={{
                                    font,
                                    labelColor,
                                    lineColor,
                                }}
                                chartPressState={state}
                            >
                                {({ points, chartBounds }) => (
                                    <>
                                    <SKText
                                        x={chartBounds.left + 10}
                                        y={30}
                                        font={systemFont}
                                        text={value}
                                        color={labelColor}
                                        style={"fill"}
                                    />
                                    <Line
                                        points={points.weight}
                                        color="#007AFF"
                                        strokeWidth={3}
                                        curveType="natural"
                                    />
                                    {isActive && (
                                        <Circle
                                            r={8}
                                            cx={state.x.position}
                                            cy={state.y.weight.position}
                                            color={"gray"}
                                            opacity={0.8}
                                        />
                                    )}
                                    </>
                                )}
                            </CartesianChart>
                        </View>
                     </View>
                     <View style={logWeightStyles.weightRecordsList}>
                        <Text style={logWeightStyles.weightGraphTitle}>
                            Weight Records
                        </Text>
                        <View style={logWeightStyles.weightRecordListHeaderContainer}>
                            <Text style={logWeightStyles.weightRecordListHeader}>
                                Date
                            </Text>
                            <Text style={logWeightStyles.weightRecordListHeader}>
                                Weight
                            </Text>
                            <Text style={logWeightStyles.weightRecordListHeader}>
                                BMI
                            </Text>
                            <Text style={logWeightStyles.weightRecordListHeader}>
                                %
                            </Text>
                        </View>
                        {weightData.map((weight, index) => (
                                <WeightRecord
                                    key={index}
                                    weight={weight}
                                    weightData={weightData}
                                    setWeightData={setWeightData}
                                />
                            ))}
                     </View>
                    </>
                    ): null}
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default LogWeightScreen;