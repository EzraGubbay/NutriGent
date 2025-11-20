import { useEffect, useState } from 'react';
import AppleHealthKit, { HealthValue, HealthKitPermissions, HealthInputOptions } from 'react-native-health';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@styles';
import { Feather } from '@expo/vector-icons';
import { DrawerNavProps } from '@types';
import { useNavigation } from '@react-navigation/native';

const StepScreen = () => {

    // Navigation Menu
    const navigation = useNavigation<DrawerNavProps>();
    const toggleDrawer = () => {
        navigation.toggleDrawer();
    }

    const [stepCount, setStepCount] = useState<number>(0);

    useEffect(() => {
        const permissions = {
        permissions: {
            read: [
                AppleHealthKit.Constants.Permissions.Steps,
            ],
            write: [
                AppleHealthKit.Constants.Permissions.Steps,
            ],
        },
        } as HealthKitPermissions

        // Initialize HealthKit
        AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
            console.warn(`[WARN] AppleHealthKit Permissions not granted.\nReceived error: ${error}`);
            return;
        }

        // Get steps after successful initialization
        getSteps();
        });
    }, []); // Run once on mount

    const getSteps = () => {
        const options: HealthInputOptions = {
        date: new Date().toISOString(),
        includeManuallyAdded: false,
        };

        AppleHealthKit.getStepCount(
        options,
        (err: Object, results: HealthValue) => {
            if (err) {
            console.error('Error getting steps:', err);
            return;
            }
            setStepCount(results.value);
        }
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={toggleDrawer} >
                        <Feather name="menu" size={28} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
            <Text>Steps: {stepCount}</Text>
            </View>
        </>
    );
};

export default StepScreen;