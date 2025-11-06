import { useState } from 'react';
import { View } from 'react-native';
import { MealCard } from '@components/MealCard';
import { styles } from '@styles';
import { Meal, initialMeals } from '@utils';
import { AddMealModal } from './addMealModal';

interface MealCardGridProps {
    data:
    {
        id: string;
        label: string;
        content: string;
    }[];

}

export const MealCardGrid: React.FC<MealCardGridProps> = ({ data }) => {

    // const toShow = data ? data : initialMeals;
    const [ toShow, setToShow ] = useState(data ? data : initialMeals);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ editingMealId, setEditingMealId ] = useState('');
    const updateMealContent = (mealId: string, newContent: string) => {
        setToShow((prevMeals: any) =>
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
                {toShow.map((meal) => (
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
                mealLabel={toShow.find(m => m.id === editingMealId)?.label || 'ERROR'}
                initialText={toShow.find(m => m.id === editingMealId)?.content || ''}
                onClose={() => setModalVisible(false)}
                onSave={(newContent: string) => {
                    updateMealContent(editingMealId, newContent);
                    setModalVisible(false);
                }}
            />
        </>
    )
}