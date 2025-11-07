import { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text} from 'react-native';
import { styles } from '@styles';
import { MealCardGrid } from '@components/MealCardGrid';
import { DailyData } from '@types';
import { getDayString, getFormattedDateString } from '@utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkTracker } from './drinkTracker';
import { useFocusEffect } from '@react-navigation/native';

interface DayPageProps {
    date: Date;
    refreshToken?: number;
}

export const DayPage: React.FC<DayPageProps> = ({ date, refreshToken }) => {

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
                <View style={styles.cardGrid}>
                    <MealCardGrid
                        storageKey={data.mealDataStorageKey}
                        refreshToken={refreshToken}
                    />
                </View>
                <DrinkTracker
                    storageKey={data.drinkDataStorageKey}
                        refreshToken={refreshToken}
                />
            </View>
        </ScrollView>
    )
}