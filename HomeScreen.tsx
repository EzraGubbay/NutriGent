import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styles } from './styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { MealCard } from './MealCard';
import { AddMealModal } from './addMealModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const STORAGE_KEY = '@meals_storage_key';

type DrawerNavProps = DrawerNavigationProp<ParamListBase>;

const initialMeals = [
      { id: 'breakfast', label: 'Breakfast', content: '' },
      { id: 'morningSnack', label: 'Morning Snack', content: '' },
      { id: 'lunch', label: 'Lunch', content: '' },
      { id: 'afternoonSnack', label: 'Afternoon Snack', content: '' },
      { id: 'dinner', label: 'Dinner', content: '' },
      { id: 'eveningSnack', label: 'Evening Snack', content: '' },
  ]

const HomeScreen = () => {

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

  const updateMealContent = (mealId: string, newContent: string) => {
    setMealsData((prevMeals: any) =>
      prevMeals.map((meal: any) =>
        meal.id === mealId
        ? {...meal, content: newContent}
        : meal
      )
    );
  };

  // Load meal data on app start.
  useEffect(() => {
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

    loadMeals();
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
  }, [mealsData]);

  return (
    <SafeAreaProvider style={styles.safeArea}>
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="share-2" size={24} color="#888" />
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={20} color="#333" />
            <Text style={styles.dateText}>29.10.2025</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
            <Ionicons name="chevron-back" size={20} color="#888" />
          </View>
          <TouchableOpacity onPress={toggleDrawer} >
            <Feather name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardGrid}>
          {mealsData.map((meal) => (
                <MealCard
                  key={meal.id}
                  label={meal.label}
                  content={meal.content}
                  onPress={() => {openMealModal(meal)}}/>
          ))}
        </View>
        
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

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            You must drink 19 cups of 180ml in a day
          </Text>
          <Text style={styles.footerText}>
            One more cup of water will bring you closer to your drinking goal
          </Text>
          <View style={styles.progressRow}>
            <TouchableOpacity 
                style={styles.minusButton}
                onPress={() => {
                    if (drinkCount > 0) {
                        updateDrinkCount(drinkCount - 1);
                    }
            }}>
              <Text style={styles.minusText}>-</Text>
            </TouchableOpacity>
            <View style={styles.progressPill}>
              <Text style={styles.progressText}>{drinkCount}/19</Text>
            </View>
            <TouchableOpacity
                style={styles.plusButton}
                onPress={ () => {
                    if (drinkCount < 19) {
                        updateDrinkCount(drinkCount + 1);
                    }
            }}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaProvider>
  );
}

export default HomeScreen;
