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

}

export const MealCardGrid: React.FC<MealCardGridProps> = ({ storageKey }) => {

    const [ data, setData ] = useState<Meal[]>(initialMeals);

    useEffect(() => {
        const loadMealData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem(storageKey);
                if (jsonValue !== null) {
                    setData(JSON.parse(jsonValue));
                }
            } catch(e) {
                console.error(`Error loading saved meals with key: ${storageKey}. \nERRMSG: ${e}`);
            }
        loadMealData();
    }}, []);

    const [ modalVisible, setModalVisible ] = useState(false);
    const [ editingMealId, setEditingMealId ] = useState('');
    const updateMealContent = (mealId: string, newContent: string) => {
        setData((prevMeals: any) =>
            prevMeals.map((meal: any) =>
            meal.id === mealId
            ? {...meal, content: newContent}
            : meal
            )
        );
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