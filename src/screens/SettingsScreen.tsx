import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
    ScrollView,
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DrawerNavProps, ThemeType, UserSettings } from '@types';
import { useTheme } from '@src/theme/ThemeContext';
import { CARD_MARGIN } from '@src/constants';

const SettingsScreen = () => {

    // Settings to add:
    // Height
    // Gender
    // Notification scheduling

    // Retrieve current user settings and populate

    const { theme } = useTheme();
    const styles = getStyles(theme);

    // Toggle Drawer Navigator
    const navigation = useNavigation<DrawerNavProps>();
    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const storageKey = "@settings";
    const [settings, setSettings] = useState<UserSettings>(() => {
        return {
            name: 'Foo',
            gender: 'M',
            height: 0,
            darkMode: false,
            notificationSchedule: null,
        }
    });

    const [username, setUsername] = useState<string>('Ezra');
    const [gender, setGender] = useState<'M' | 'F' | ''>('M');
    const [height, setHeight] = useState<number>(173);
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
    const [notificationsSchedule, setNotificationsSchedule] = useState(null);

    const updateSettings = () => {
        const updatedSettings: UserSettings = {
            name: username,
            gender: gender,
            height: height,
            darkMode: darkModeEnabled,
            notificationSchedule: notificationsSchedule,
        }
    }

    const unpackSettings = (settingsToUnpack: UserSettings) => {
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
        } catch (e) {
            console.warn(e);
        }
    }

    const saveSettings = async (updatedSettings: UserSettings | undefined) => {
        try {
            const jsonValue = JSON.stringify(updatedSettings);
            await AsyncStorage.setItem(storageKey, jsonValue);
        } catch (e) {
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
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View />
                        <Text style={styles.sectionTitle}>
                            Settings
                        </Text>
                        <TouchableOpacity onPress={toggleDrawer}>
                            <Feather name="menu" size={28} color={theme.label} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 20 }}>
                        <Text style={styles.sectionTitle}>
                            {username}
                        </Text>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>
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
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
};

export default SettingsScreen;

const getStyles = (theme: ThemeType) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.globalBackground,
        paddingVertical: 40,
    },
    container: {
        flex: 1,
        paddingHorizontal: CARD_MARGIN,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.headerBottomBorder,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: theme.label,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.headerBottomBorder,
    },
    settingLabel: {
        fontSize: 16,
        color: theme.label,
        fontWeight: '500',
    },
})