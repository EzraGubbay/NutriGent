import { useState, useEffect } from 'react';
import { ScrollView, View, Text} from 'react-native';
import { styles } from '@styles';
import { MealCardGrid } from '@components/MealCardGrid';
import { Meal, DailyData } from '@types';
import { getDayString, getFormattedDateString } from '@utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkTracker } from './drinkTracker';

interface DayPageProps {
    key: number;
    date: Date;
}

export const DayPage: React.FC<DayPageProps> = ({ key, date }) => {

    const storageKey = `@${getDayString(date)}-dailyData`;
    const formattedDate = getFormattedDateString(date);
    const [ data, setData ] = useState<DailyData>({mealDataStorageKey: '', drinkDataStorageKey: ''});

    useEffect(() => {
        const loadDailyData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(storageKey);
                if (jsonValue !== null) {
                    setData(JSON.parse(jsonValue));
                }
            } catch(e) {
                console.warn(e);
            }
        }
        loadDailyData();
    }, []);

    return (
        <ScrollView  key={key}>
            <View style={styles.safeArea}>
                <Text style={styles.dateText}>
                    {formattedDate}
                </Text>
                <View style={styles.cardGrid}>
                    <MealCardGrid
                        storageKey={data.mealDataStorageKey}
                    />
                </View>
                <DrinkTracker
                    storageKey={data.drinkDataStorageKey}
                />
            </View>
        </ScrollView>
    )
}