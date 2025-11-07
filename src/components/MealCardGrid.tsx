import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { MealCard } from '@components/MealCard';
import { styles } from '@styles';
import { Meal } from '@types';
import { initialMeals } from '@constants';
import { AddMealModal } from '@src/components/AddMealModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MealCardGridProps {
    storageKey: string;
    refreshToken?: number;
}

export const MealCardGrid: React.FC<MealCardGridProps> = ({ storageKey, refreshToken }) => {

    const [ data, setData ] = useState<Meal[]>(initialMeals);

    useEffect(() => {
        const loadMealData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(storageKey);
                if (jsonValue !== null) {
                    setData(JSON.parse(jsonValue));
                } else {
                    setData(initialMeals);
                }
            } catch(e) {
                console.error(`Error loading saved meals with key: ${storageKey}. \nERRMSG: ${e}`);
            }
        };

        loadMealData();
    }, [storageKey, refreshToken]);

    const saveMealData = async (updatedData: Meal[]) => {
        try {
            const jsonValue = JSON.stringify(updatedData);
            await AsyncStorage.setItem(storageKey, jsonValue);
        } catch(e) {
            console.warn(e);
        }
    }

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ editingMealId, setEditingMealId ] = useState('');
    const updateMealContent = (mealId: string, newContent: string) => {
        const updatedData: Meal[] =
            data.map((meal) => (
            meal.id === mealId ? {...meal, content: newContent} : meal
        ));

        setData(updatedData);
        saveMealData(updatedData);
    };

    const openMealModal = (mealItem: Meal) => {
          setEditingMealId(mealItem.id);
          setModalVisible(true);
    }

    return (
        <>
            <View style={styles.cardGrid}>
                {data.map((meal) => (
                    <MealCard
                        key={meal.id}
                        label={meal.label}
                        content={meal.content}
                        onPress={() => {openMealModal(meal)}}
                    />
                ))}
            </View>
            <AddMealModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                mealLabel={data.find(m => m.id === editingMealId)?.label || 'ERROR'}
                initialText={data.find(m => m.id === editingMealId)?.content || ''}
                onClose={() => setModalVisible(false)}
                onSave={(newContent: string) => {
                    updateMealContent(editingMealId, newContent);
                    setModalVisible(false);
                }}
            />
        </>
    )
}