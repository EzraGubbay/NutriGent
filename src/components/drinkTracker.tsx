import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DrinkTrackerProps {
    storageKey: string;
}

export const DrinkTracker: React.FC<DrinkTrackerProps> = ({ storageKey }) => {

    /**
     * TODO:
     *      1. Change prop for MealCardGrid to receive string storageKey. DONE
     *      2. Move data load and save management to MealCardGrid.
     *      3. Replicate with DrinkTracker.
     *      4. Create new parent component - DayPage to receive date and infer necessary storage key from that.
     *          *** DayPage must be compatible with PagerView for MealLogHistoryScreen ***
     *      5. Create new storageKey format to hold two storage keys - add load and save in DayPage.
     *      6. Add DrinkTracker to DayPage.
     *      7. Pass storage keys from DayPage to MealCardGrid and DrinkTracker.
     */

    const [ drinkCount, setDrinkCount ] = useState<number>(0);

    // Load drink data
    useEffect(() => {
        const loadDrinkData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(storageKey);
                if (jsonValue !== null) {
                    setDrinkCount(JSON.parse(jsonValue));
                }
            } catch(e) {
                console.warn(e);
            }
        }

        loadDrinkData()
    }, []);

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
                if (drinkCount > 0) {
                    setDrinkCount(drinkCount - 1);
                }
        }}>
            <Text style={styles.minusText}>-</Text>
        </TouchableOpacity>
        <View style={styles.progressPill}>
            <Text style={styles.progressText}>{drinkCount}/19</Text>
        </View>
        <TouchableOpacity
            style={styles.plusButton}
            onPress={ () => {
                if (drinkCount < 19) {
                    setDrinkCount(drinkCount + 1);
                }
        }}>
            <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
        </View>
        </View>
    );
}