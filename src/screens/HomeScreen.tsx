import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    AppState,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styles } from '../styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import { MealCard } from '@components/MealCard';
import { AddMealModal } from '@src/components/AddMealModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  getFormattedDateString,
  getDayString,
  loadMealData,
  saveMealData,
} from '@utils';
import { MealCardGrid } from '@components/MealCardGrid';
import { DrawerNavProps } from '@types';
import { initialMeals } from '@constants';

const STORAGE_KEY = '@meals_storage_key';

const HomeScreen = () => {

  const lastKnownDayRef = useRef(getDayString(new Date()));

  // Navigation Menu
  const navigation = useNavigation<DrawerNavProps>();
  const toggleDrawer = () => {
    navigation.toggleDrawer();
  }

  const [ drinkCount, updateDrinkCount ] = useState<number>(0);

  const [ modalVisible, setModalVisible ] = useState(false);
  const mealModalProps = {
      modalVisible: modalVisible,
      setModalVisible: setModalVisible,
  }
  const [ editingMealId, setEditingMealId ] = useState('')

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
        ? {...meal, content: newContent}
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
      } catch(e) {
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
      } catch(e) {
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
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <Text style={styles.dateText}>{getFormattedDateString(new Date())}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
            <Ionicons name="chevron-back" size={20} color="#888" />
          </View>
          <TouchableOpacity onPress={toggleDrawer} >
            <Feather name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <MealCardGrid
          data={mealsData}
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
