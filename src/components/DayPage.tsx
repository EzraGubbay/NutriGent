import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MealCardGrid } from '@components/MealCardGrid';
import { DailyData } from '@types';
import { getDayString, getFormattedDateString } from '@utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkTracker } from '@components/DrinkTracker';
import { Theme, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@src/theme/ThemeContext';
import { ThemeType } from '@types';

interface DayPageProps {
    date: Date;
    refreshToken?: number;
}

export const DayPage: React.FC<DayPageProps> = ({ date, refreshToken }) => {

    // Get styling theme
    const { theme } = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

    const storageDate = `@${getDayString(date)}`
    const storageKey = `${storageDate}-dailyData`;
    const formattedDate = getFormattedDateString(date);
    const [ data, setData ] = useState<DailyData>({mealDataStorageKey: `${storageDate}-mealsData`, drinkDataStorageKey: `${storageDate}-drinkData`});

    const loadDailyData = useCallback(async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(storageKey);
            if (jsonValue !== null) {
                setData(JSON.parse(jsonValue));
            } else {
                setData({mealDataStorageKey: `${storageDate}-mealsData`, drinkDataStorageKey: `${storageDate}-drinkData`});
            }
        } catch(e) {
            console.warn(e);
        }
    }, [storageDate, storageKey]);

    useEffect(() => {
        setData({mealDataStorageKey: `${storageDate}-mealsData`, drinkDataStorageKey: `${storageDate}-drinkData`});
        loadDailyData();
    }, [loadDailyData, refreshToken, storageDate]);

    useFocusEffect(
        useCallback(() => {
            loadDailyData();
            return () => {};
        }, [loadDailyData])
    );

    return (
        <ScrollView>
            <View style={styles.safeArea}>
                <Text style={styles.dateText}>
                    {formattedDate}
                </Text>
                <MealCardGrid
                    storageKey={data.mealDataStorageKey}
                    refreshToken={refreshToken}
                />
                <DrinkTracker
                    storageKey={data.drinkDataStorageKey}
                        refreshToken={refreshToken}
                />
            </View>
        </ScrollView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.globalBackground,
        paddingVertical: 40,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: theme.label,
    },
})
