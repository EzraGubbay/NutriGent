import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CARD_MARGIN, CARD_SIZE } from '@src/constants';
import { useTheme } from '@src/theme/ThemeContext';
import { ThemeType } from '@types';

interface MealCardProps {
    label: string;
    onPress: (label: string) => void;
    content?: string;
}

export const MealCard: React.FC<MealCardProps> = ({ label, onPress, content }) => {

    // Get styling theme
    const { theme } = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);

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

const getStyles = (theme: ThemeType) => StyleSheet.create({
    mealContentContainer: {
    // Ensure this container fills the card and handles alignment
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealLabelSmall: {
      fontSize: 12,
      color: theme.sublabel, // Grayed-out label
      textAlign: 'center',
  },
  mealContentText: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
      color: theme.label, // Use a dark color for readability
  },
  iconBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // The icon is a complex shape, best done with SVG or absolute positioning
  },
  crosshairSquare: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: theme.crosshair, // Light green
    borderRadius: 5,
  },
  crosshairVertical: {
    position: 'absolute',
    width: 15,
    height: 2,
    backgroundColor: theme.crosshair,
  },
  crosshairHorizontal: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: theme.crosshair,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    color: theme.label,
  },
  mealCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 15,
    margin: CARD_MARGIN / 2, // Half margin to space them out
    backgroundColor: theme.background,
    // Green border on hover/tap (active state)
    borderWidth: 2,
    borderColor: theme.cardBorder, // Very light green border for non-active state
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow (might need a dedicated shadow style for true iOS look)
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 20,
  },
})
