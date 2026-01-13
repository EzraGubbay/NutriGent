import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  AppState,
  StyleSheet
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { AddMealModal } from '@src/components/AddMealModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getDayString,
  saveMealData,
} from '@utils';
import { DrawerNavProps } from '@types';
import { initialMeals, CARD_MARGIN } from '@constants';
import { DayPage } from '@src/components/DayPage';
import { useTheme } from '@src/theme/ThemeContext';
import { ThemeType } from '@types';

const STORAGE_KEY = '@meals_storage_key';

const HomeScreen = () => {

  // Get style theme
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const lastKnownDayRef = useRef(getDayString(new Date()));

  // Navigation Menu
  const navigation = useNavigation<DrawerNavProps>();
  const toggleDrawer = () => {
    navigation.toggleDrawer();
  }

  const [drinkCount, updateDrinkCount] = useState<number>(0);
  const [dayPageRefreshToken, setDayPageRefreshToken] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setDayPageRefreshToken((prev) => prev + 1);
      return () => { };
    }, [])
  );


  const [modalVisible, setModalVisible] = useState(false);
  const mealModalProps = {
    modalVisible: modalVisible,
    setModalVisible: setModalVisible,
  }
  const [editingMealId, setEditingMealId] = useState('')

  const openMealModal = (mealItem: any) => {
    setEditingMealId(mealItem.id);
    setModalVisible(true);
  }

  const [mealsData, setMealsData] = useState(initialMeals);
  const mealsDataRef = useRef(mealsData);

  const updateMealContent = (mealId: string, newContent: string) => {
    setMealsData((prevMeals: any) =>
      prevMeals.map((meal: any) =>
        meal.id === mealId
          ? { ...meal, content: newContent }
          : meal
      )
    );
  };

  // Function for loading meals or initial meal data.
  const loadMeals = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        const savedMeals = JSON.parse(jsonValue);
        setMealsData(savedMeals);
      } else {
        // No saved data.
        setMealsData(initialMeals);
      }
    } catch (e) {
      console.error('Error loading saved meals: ', e);
      setMealsData(initialMeals);
    }
  };

  // Load meal data on app start.
  useEffect(() => {
    console.log("Hello!")
    loadMeals();

    // Set app state listener.
    const listener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {

        const newDay = getDayString(new Date());
        const lastKnownDay = lastKnownDayRef.current;
        console.log(`newDay: ${newDay}, lastKnownDay: ${lastKnownDay}`);

        if (newDay !== lastKnownDay) {

          // Confirm by logging that refresh logic is activated on date change.
          console.log(`Day changed from ${lastKnownDay} to ${newDay}. Refreshing...`);
          // ##############DEBUG

          // Update last known day reference to today.
          lastKnownDayRef.current = newDay;

          const oldTodayMeals = mealsDataRef.current;
          const saveKey = `${lastKnownDay}-mealData`;
          saveMealData(saveKey, oldTodayMeals);
          saveMealData(STORAGE_KEY, initialMeals);
          loadMeals();
        }
      }
    });

    // Clean up AppState event listener
    return () => {
      listener.remove();
    };

  }, [])

  // Save changed meal data.
  useEffect(() => {
    const saveMeals = async () => {
      try {
        const jsonValue = JSON.stringify(mealsData);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log('Meals data saved successfully.')
      } catch (e) {
        console.error('Error saving meals data: ', e);
      }
    };

    if (mealsData.length > 0) {
      saveMeals();
    }

    mealsDataRef.current = mealsData;
  }, [mealsData]);

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Feather name="share-2" size={24} color="#888" />
            <View style={styles.dateContainer}>
              {/* <Ionicons name="calendar-outline" size={20} color="#333" /> */}
              <Text style={styles.dateText}>Home</Text>
              {/* <Ionicons name="chevron-forward" size={20} color="#888" /> */}
              {/* <Ionicons name="chevron-back" size={20} color="#888" /> */}
            </View>
            <TouchableOpacity onPress={toggleDrawer} >
              <Feather name="menu" size={28} color={theme.label} />
            </TouchableOpacity>
          </View>

          <DayPage
            key={`home-daypage-${dayPageRefreshToken}`}
            date={new Date()}
            refreshToken={dayPageRefreshToken}
          />

          <AddMealModal
            modalVisible={mealModalProps.modalVisible}
            setModalVisible={mealModalProps.setModalVisible}
            mealLabel={mealsData.find(m => m.id === editingMealId)?.label || 'ERROR'}
            initialText={mealsData.find(m => m.id === editingMealId)?.content || ''}
            onClose={() => setModalVisible(false)}
            onSave={(newContent: string) => {
              updateMealContent(editingMealId, newContent);
              setModalVisible(false);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default HomeScreen;

const getStyles = (theme: ThemeType) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.globalBackground, // Light background for the overall screen
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
    // Note: The vertical lines on the side suggest a repeated background image or texture
    // which cannot be done with simple background color.
  },

  // === A. Header Styles ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1, // Subtle line under the header
    borderBottomColor: theme.headerBottomBorder,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // The date itself seems to be clickable, with chevrons for navigation
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: theme.label,
  },
});
