import { ScrollView, View, Text} from 'react-native';
import { styles } from '@styles';
import { MealCardGrid } from '@components/MealCardGrid';
import { Meal } from '@utils';

interface DayPageProps {
    key: number;
    meals: Meal[];
    formattedDate: string;

}

export const DayPage: React.FC<DayPageProps> = ({ key, meals, formattedDate }) => {
    return (
        <ScrollView  key={key}>
            <View style={styles.safeArea}>
                <Text style={styles.dateText}>
                    {formattedDate}
                </Text>
                <View style={styles.cardGrid}>
                    <MealCardGrid
                        data={meals}
                    />
                </View>
            </View>
        </ScrollView>
    )
}