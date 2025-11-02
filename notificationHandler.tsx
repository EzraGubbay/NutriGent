import { useEffect, useRef } from 'react';
import { Button, Platform, View, Text } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if ( finalStatus !== 'granted' ) {
        alert('Failed to get token for push notification')
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    return token
}

export async function scheduleLocalNotification(data: { key: string | number}) {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== 'granted') {
        alert('Failed to schedule notification - lacking permissions')
        return;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'TEST TITLE',
            body: `You have drunk: ${data.key} cups of water so far`,
            data: data,
            sound: 'default',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
        }
    })
}