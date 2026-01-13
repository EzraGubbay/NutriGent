import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkData } from '@types';
import { useTheme } from '@src/theme/ThemeContext';
import { ThemeType } from '@types';

export interface DrinkTrackerProps {
    storageKey: string;
    refreshToken?: number;
}

export const DrinkTracker: React.FC<DrinkTrackerProps> = ({ storageKey, refreshToken }) => {

    // Get styling theme
    const { theme } = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

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
            <View style={[styles.filler, { width: `${(drinkCount.value / 19) * 100}%`}]} />
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

const getStyles = (theme: ThemeType) => StyleSheet.create({
    footerContainer: {
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.footerBackground, // Lightest green background for the footer
        padding: 20,
        borderRadius: 20,
        alignItems: 'flex-start', // Align text to the left (LTR language)
    },
    footerText: {
        fontSize: 14,
        color: theme.footerText,
        lineHeight: 20,
        textAlign: "left",
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
    },
    minusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: theme.minusBorder,
        borderWidth: 1,
    },
    minusText: {
        fontSize: 24,
        color: theme.minusText,
    },
    plusButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.plusBackground, // Primary green color
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow if desired
    },
    plusText: {
        fontSize: 24,
        color: theme.background,
        lineHeight: 30, // Adjust line height to center the plus sign
    },
    progressPill: {
        flex: 1, // Takes up the remaining space
        height: 30,
        marginHorizontal: 15,
        borderRadius: 15,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden",
    },
    filler: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.filler,
        borderRadius: 15,
    },
    progressText: {
        color: theme.label,
        fontWeight: 'bold',
    },
})
