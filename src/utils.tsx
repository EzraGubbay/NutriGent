import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MealCard } from './components/MealCard';
import { styles } from './styles';
import { View, Text, ScrollView } from 'react-native';
import { MealCardGrid } from '@components/MealCardGrid';
import { DayPage } from '@components/DayPage';

// Date formatting.
export const getFormattedDateString = (date: Date) => {
    const day = date.getDate()
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'short' })

    if (day > 3 && day < 21) {
        return `${weekday}, ${month} ${day}th`;
    }

    switch(day % 10) {
        case 1: return `${weekday}, ${month} ${day}st`;
        case 2: return `${weekday}, ${month} ${day}nd`;
        case 3: return `${weekday}, ${month} ${day}rd`;
        default: return `${weekday}, ${month} ${day}th`
    }
}

export const getDayString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getYesterdayString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDayString(yesterday);
}

export const getFormattedYesterdayString = (yesterday: Date) => {
    yesterday.setDate(yesterday.getDate() - 1);
    return getFormattedDateString(yesterday);
}

// Shared values.
export type DrawerNavProps = DrawerNavigationProp<ParamListBase>;

export type Meal = {
    id: string;
    label: string;
    content: string;
}

export type MealDataCache = Record<string, Meal[]>

export type Weight = {
    date: string;
    weight: number;
    waistCircumference?: number;
    neckCircumference?: number;
}

export const initialMeals = [
      { id: 'breakfast', label: 'Breakfast', content: '' },
      { id: 'morningSnack', label: 'Morning Snack', content: '' },
      { id: 'lunch', label: 'Lunch', content: '' },
      { id: 'afternoonSnack', label: 'Afternoon Snack', content: '' },
      { id: 'dinner', label: 'Dinner', content: '' },
      { id: 'eveningSnack', label: 'Evening Snack', content: '' },
]

// Meal data file I/O.
export const loadMealData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue);
      }
    } catch(e) {
      console.error(`Error loading saved meals with key: ${key}. \nERRMSG: ${e}`);
    }
  }

export const saveMealData = async (
    key: string,
    value: {
      id: string,
      label: string,
      content: string,
    }[]
   ) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`Saved meals successfully: ${key}`);
    } catch(e) {
      console.error(`Error saving meals into key: ${key}. \nERRMSG: ${e}`);
    }
};

export const getMealStorageKey = (date: Date) => {
    return `@${getDayString(date)}`;
}

export const genDayPageKeyDates = (drinkCount: number, updateDrinkCount: any, RANGE_LIMIT: number) => {
    const date = new Date();
    const storageKeys: string[] = Array.from(
        {
            length: RANGE_LIMIT,
        },
        (_, index) => {
            const storageKey = getMealStorageKey(date);
            date.setDate(date.getDate() - 1);
            return storageKey;
        }
    );

    const formattedDate = () => {
        const dateString = getFormattedDateString(date);
        date.setDate(date.getDate() - 1);
        return dateString;
    }

    // Add beginning and end storage keys to simulate carousel loop.
    const startKey = storageKeys[0];
    const endKey = storageKeys[storageKeys.length - 1];
    storageKeys.push(startKey);
    storageKeys.unshift(endKey);

    date.setDate(date.getDate() + RANGE_LIMIT);

    const dates: string[] = Array.from(
        {
            length: RANGE_LIMIT,
        },
        () => {
            const dateString = getFormattedDateString(date);
            date.setDate(date.getDate() - 1);
            return dateString;
        }
    );

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    dates.push(startDate);
    dates.unshift(endDate);

    return {
        storageKeys,
        dates,
    }
}
