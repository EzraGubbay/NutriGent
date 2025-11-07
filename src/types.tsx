import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Shared values.
export type DrawerNavProps = DrawerNavigationProp<ParamListBase>;

export type Meal = {
    id: string;
    label: string;
    content: string;
}

export type MealDataCache = Record<string, Meal[]>

export type Weight = {
    date: Date;
    day: number;
    weight: number;
    waistCircumference?: number;
    neckCircumference?: number;
}

export type DailyData = {
    mealDataStorageKey: string;
    drinkDataStorageKey: string;
}