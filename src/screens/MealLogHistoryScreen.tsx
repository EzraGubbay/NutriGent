import React, { useRef, useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DrawerNavProps, MealDataCache } from '@types';
import { styles } from "@styles";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { loadMealData, saveMealData, genDayPageKeyDates} from "@utils";
import PagerView from 'react-native-pager-view';
import { DayPage } from '@components/DayPage';

const RANGE_LIMIT = 31;

const MealLogHistoryScreen = () => {

    // Navigation Menu
    const navigation = useNavigation<DrawerNavProps>();
    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const [ drinkCount, updateDrinkCount ] = useState<number>(0);
    const [ loadedMeals, setLoadedMeals ] = useState<MealDataCache>({});
    const [ dayPageRefreshToken, setDayPageRefreshToken ] = useState(0);

    const { storageKeys, dates } = genDayPageKeyDates(drinkCount, updateDrinkCount, RANGE_LIMIT);
    const pageRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(2);

    const onPageSelected = async (event: any) => {
        const newPage = event.nativeEvent.position;

        if (newPage === RANGE_LIMIT + 1) {
            pageRef.current?.setPageWithoutAnimation(1);
            setCurrentPage(1);
        } else if (newPage === 0) {
            pageRef.current?.setPageWithoutAnimation(RANGE_LIMIT);
            setCurrentPage(RANGE_LIMIT);
        }

        // Load meal data (if exists) from storage, and set to currently displayed meal data.
        const currentKey = storageKeys[newPage];
        if (currentKey && !loadedMeals[currentKey]) {
            const newData = await loadMealData(currentKey);
            setLoadedMeals(prevMeals => ({
                ...prevMeals,
                ...newData,
            }))
        }
    }

    useFocusEffect((
        useCallback(() => {
            setDayPageRefreshToken((prev) => prev + 1);
            return () => {
                pageRef.current?.setPageWithoutAnimation(2);
                setCurrentPage(2);
            };
    }, [])
    ));

    return (
        <SafeAreaProvider style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Feather name="share-2" size={24} color="#888" />
                        <Text style={pagerStyle.dateText}>
                            Meal Log History
                        </Text>
                        <TouchableOpacity onPress={toggleDrawer}>
                            <Feather name="menu" size={28} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <PagerView
                        style={pagerStyle.pagerView}
                        initialPage={2}
                        layoutDirection={'rtl'}
                        overdrag={true}
                        ref={pageRef}
                        onPageSelected={onPageSelected}
                    >
                        {storageKeys.map((value, index) => (
                            <DayPage
                                key={`${value}-${index}-${dayPageRefreshToken}`}
                                date={dates[index]}
                                refreshToken={dayPageRefreshToken}
                            />
                        ))}
                    </PagerView>
                </View>
        </SafeAreaProvider>
    );
}

const pagerStyle = StyleSheet.create(
    {
        pagerView: {
            flex: 1,
        },
        container: {
            // flex: 1,
            height: 50,
            paddingHorizontal: 50,//CARD_MARGIN,
            // Note: The vertical lines on the side suggest a repeated background image or texture
            // which cannot be done with simple background color.
        },
        dateText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginHorizontal: -100,
        },
    }
);

export default MealLogHistoryScreen;