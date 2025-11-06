import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles';

interface MealCardProps {
    label: string;
    onPress: (label: string) => void;
    content?: string;
}

export const MealCard: React.FC<MealCardProps> = ({ label, onPress, content }) => {

    const mealIsLogged = !!content;

    const cardContent = mealIsLogged ? (
        <View style={styles.mealContentContainer}>
            {/* Display the label/meal type smaller above the content */}
            <Text style={styles.mealLabelSmall}>{label}</Text>
            {/* Display the provided meal content, centered and prominent */}
            <Text style={styles.mealContentText}>{content}</Text>            
        </View>
    ) : (
        <>
            <View style={styles.iconBox}>
                <View style={styles.crosshairSquare} />
                <View style={styles.crosshairVertical} />
                <View style={styles.crosshairHorizontal} />
            </View>
            <Text style={styles.mealLabel}>{label}</Text>
        </>
    );

    return (
        <TouchableOpacity style={styles.mealCard} onPress={() => { onPress(label) }}>
            {cardContent}
        </TouchableOpacity>
    )
};