import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styles } from '@styles';
import {
    ScrollView,
    View,
    Text,
    Switch,
} from 'react-native';
import { UserSettings } from '@types';

const SettingsScreen = () => {

    // Settings to add:
    // Height
    // Gender
    // Notification scheduling

    // Retrieve current user settings and populate

    const storageKey = "@settings";
    const [ settings, setSettings ] = useState<UserSettings>(() => {
        return {
        name: 'Foo',
        gender: 'M',
        height: 0,
        darkMode: false,
        notificationSchedule: null,
    }});

    const [ username, setUsername ] = useState<string>('Ezra');
    const [ gender, setGender ] = useState<'M' | 'F' | ''>('M');
    const [ height, setHeight ] = useState<number>(173);
    const [ darkModeEnabled, setDarkModeEnabled ] = useState<boolean>(false);
    const [ notificationsSchedule, setNotificationsSchedule ] = useState(null);

    const updateSettings = () => {
        const updatedSettings: UserSettings = {
            name: username,
            gender: gender,
            height: height,
            darkMode: darkModeEnabled,
            notificationSchedule: notificationsSchedule,
        }
    }

    const unpackSettings = (settingsToUnpack : UserSettings) => {
        setUsername(settingsToUnpack.name);
        setGender(settingsToUnpack.gender);
        setHeight(settingsToUnpack.height);
        setDarkModeEnabled(settingsToUnpack.darkMode);
        setNotificationsSchedule(settingsToUnpack.notificationSchedule);
    }

    const loadSettings = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(storageKey);
            if (jsonValue !== null) {
                const loadedSettings = JSON.parse(jsonValue);
                setSettings(loadedSettings);
                unpackSettings(loadedSettings);
            } else {
                unpackSettings(settings);
            }
        } catch(e) {
            console.warn(e);
        }
    }

    const saveSettings = async (updatedSettings: UserSettings | undefined) => {
        try {
            const jsonValue = JSON.stringify(updatedSettings);
            await AsyncStorage.setItem(storageKey, jsonValue);
        } catch(e) {
            console.warn(e);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadSettings();
            return () => {
                const updatedSettings: UserSettings | undefined = settings;
                saveSettings(updatedSettings);
            }
        }, []))

    return (
        <SafeAreaProvider style={styles.safeArea}>
            <ScrollView>
                <View style={{ padding: 20 }}>
                    <Text>
                        {username}
                    </Text>
                    <View style={{
                        'flexDirection': 'row',
                    }}>
                        <Text>
                            Dark Mode 
                        </Text>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={setDarkModeEnabled}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor="white"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

export default SettingsScreen;