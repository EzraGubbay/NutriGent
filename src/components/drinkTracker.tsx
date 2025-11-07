import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkData } from '@types';

export interface DrinkTrackerProps {
    storageKey: string;
    refreshToken?: number;
}

export const DrinkTracker: React.FC<DrinkTrackerProps> = ({ storageKey, refreshToken }) => {

    const [ drinkCount, setDrinkCount ] = useState<DrinkData>({ value: 0 });

    // Load drink data
    useEffect(() => {
        const loadDrinkData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(storageKey);
                if (jsonValue !== null) {
                    setDrinkCount(JSON.parse(jsonValue));
                } else {
                    setDrinkCount({ value: 0 });
                }
            } catch(e) {
                console.warn(e);
            }
        }

        loadDrinkData()
    }, [storageKey, refreshToken]);

    const saveDrinkData = async (updatedDrinkCount: DrinkData) => {
        try {
            const jsonValue = JSON.stringify(updatedDrinkCount);
            await AsyncStorage.setItem(storageKey, jsonValue);
        } catch(e) {
            console.warn(e);
        }
    }

    const updateData = (value: number) => {
        const updatedDrinkCount: DrinkData = {
            value: value,
        }
        setDrinkCount(updatedDrinkCount);
        saveDrinkData(updatedDrinkCount);
    }

    return (
        <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
        You must drink 19 cups of 180ml in a day
        </Text>
        <Text style={styles.footerText}>
        One more cup of water will bring you closer to your drinking goal
        </Text>
        <View style={styles.progressRow}>
        <TouchableOpacity 
            style={styles.minusButton}
            onPress={() => {
                if (drinkCount.value > 0) {
                    updateData(drinkCount.value - 1);
                }
        }}>
            <Text style={styles.minusText}>-</Text>
        </TouchableOpacity>
        <View style={styles.progressPill}>
            <Text style={styles.progressText}>{drinkCount.value}/19</Text>
        </View>
        <TouchableOpacity
            style={styles.plusButton}
            onPress={ () => {
                if (drinkCount.value < 19) {
                    updateData(drinkCount.value + 1);
                }
        }}>
            <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        </View>
        </View>
    );
}