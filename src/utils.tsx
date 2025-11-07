import AsyncStorage from '@react-native-async-storage/async-storage';
import { Weight } from '@types';
import { WEIGHT_STORAGE_KEY } from '@constants';

// Date formatting.
export const getFormattedDateString = (date: Date) => {
    const day = date.getDate();
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


export const loadWeightData = async (setWeightData: any) => {
    try {
        const jsonValue = await AsyncStorage.getItem(WEIGHT_STORAGE_KEY);
        if (jsonValue) {
            const parsedData = JSON.parse(jsonValue);
            // Convert date strings back to Date objects
            const weightDataWithDates = parsedData.map((weight: any) => ({
                ...weight,
                date: new Date(weight.date)
            }));
            setWeightData(weightDataWithDates);
        }
        return [];
    } catch(e) {
        console.error(`Error loading weight data. \nKey: ${WEIGHT_STORAGE_KEY}. \nERRMSG: ${e}`);
    }
}

export const saveWeightData = async (updatedWeightData: Weight[]) => {
    try {
        const jsonValue = JSON.stringify(updatedWeightData);
        await AsyncStorage.setItem(WEIGHT_STORAGE_KEY, jsonValue);
        console.log(`Saved weight data successfully: ${WEIGHT_STORAGE_KEY}`);
    } catch(e) {
        console.error(`Error saving weight data. \nKey: ${WEIGHT_STORAGE_KEY}. \nERRMSG: ${e}`);
    }
}

export const genDayPageKeyDates = (drinkCount: number, updateDrinkCount: any, RANGE_LIMIT: number) => {
    const date = new Date();
    const storageKeys: string[] = Array.from(
        {
            length: RANGE_LIMIT,
        },
        () => {
            const storageKey = getMealStorageKey(date);
            date.setDate(date.getDate() - 1);
            return storageKey;
        }
    );

    // Add beginning and end storage keys to simulate carousel loop.
    const startKey = storageKeys[0];
    const endKey = storageKeys[storageKeys.length - 1];
    storageKeys.push(startKey);
    storageKeys.unshift(endKey);

    date.setDate(date.getDate() + RANGE_LIMIT);

    const dates: Date[] = Array.from(
        {
            length: RANGE_LIMIT,
        },
        () => {
            const dateItem = date;
            date.setDate(date.getDate() - 1);
            return dateItem;
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

export const BMI = (weight: number, height: number) => {
    return weight / ((height / 100) ** 2);
}

export const bodyFatPercentage = (waist: number, neck: number, height: number, gender: string, hip?: number, ) => {
    const c1 = gender === 'M' ? 1.0324 : 1.29579;
    const c2 = gender === 'M' ? 0.19077 : 0.35004;
    const c3 = gender === 'M' ? waist - neck : hip ? waist + hip - neck : null; // If null, user is Female but did not provide hip value.
    const c4 = gender === 'M' ? 0.15456 : 0.221;

    return 495 / (c1 - c2 * Math.log10(c3!) + c4 * Math.log10(height)) - 450;
}
