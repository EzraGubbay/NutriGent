import React, { useEffect } from 'react';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';
import HomeScreen from '@screens/HomeScreen';
import MealLogHistoryScreen from '@screens/MealLogHistoryScreen';
import LogWeightScreen from '@screens/LogWeightScreen';
import { registerForPushNotificationsAsync } from './notificationHandler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './src/DrawerContent'

const Drawer = createDrawerNavigator();

const RootNavigator = () => {

  const notifListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
        }}
        >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
        >
        </Drawer.Screen>
        <Drawer.Screen
          name="LogWeight"
          component={LogWeightScreen}
        >
        </Drawer.Screen>
        <Drawer.Screen
          name="MealLogHistory"
          component={MealLogHistoryScreen}
        >
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;