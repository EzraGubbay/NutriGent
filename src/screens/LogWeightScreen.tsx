import { View, ScrollView, TouchableOpacity, Text, TextInput, Keyboard } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DrawerNavProps } from "@utils";
import { logWeightStyles, styles } from "@styles";
import React, { useState } from "react";
import { Alert } from "react-native";
import { CartesianChart, Line } from 'victory-native';

const mockData = [
    { day: 1, weight: 155 },
    { day: 2, weight: 154 },
    { day: 3, weight: 154.5 },
    { day: 4, weight: 153 },
    { day: 5, weight: 153.5 },
  ];

const LogWeightScreen = () => {

    // Navigation Menu
    const navigation = useNavigation<DrawerNavProps>();
    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const [ inputWeight, setInputWeight ] = useState<string>('');
    const [ inputWaistCircumference, setInputWaistCircumference ] = useState<string>('');
    const [ inputNeckCircumference, setInputNeckCircumference ] = useState<string>('');
    const [ weightInputContent, setWeightInputContent ] = useState('');

    const handleLogWeight = () => {
        Keyboard.dismiss();
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
    }

    const emptyInput = () => {
        setInputWeight('');
        setInputWaistCircumference('');
        setInputNeckCircumference('');
    }

    useFocusEffect(
        React.useCallback(() => {
            emptyInput();
        }, [])
    );

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
                    {/**
                     * View
                     *  Text with title
                     *  CartesianChart - data, xKey, yKey
                     *      Line - points, color, strokeWidth, animate(type, duration)
                     */}

                     <View style={styles.safeArea}>
                        <Text style={styles.dateText}>
                            Weight History
                        </Text>
                        <CartesianChart data={mockData} xKey="day" yKeys={["weight"]}>
                            {({ points }) => (
                                <Line
                                    points={points.weight}
                                    color="blue"
                                    strokeWidth={2}
                                    animate={{ type: "timing", duration: 300 }}
                                />
                            )}
                        </CartesianChart>
                     </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default LogWeightScreen;