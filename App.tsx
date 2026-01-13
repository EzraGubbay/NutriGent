import React, { useEffect } from 'react';
import { useRef } from 'react';
import * as Notifications from 'expo-notifications';
import HomeScreen from '@screens/HomeScreen';
import MealLogHistoryScreen from '@screens/MealLogHistoryScreen';
import LogWeightScreen from '@screens/LogWeightScreen';
import { registerForPushNotificationsAsync } from './notificationHandler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './src/DrawerContent'
import SettingsScreen from '@src/screens/SettingsScreen';
import StepScreen from '@screens/StepScreen';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@src/theme/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

if (__DEV__) {
  require("config/reactotron");
}

const Drawer = createDrawerNavigator();

const RootNavigator = () => {

  const scheme = useColorScheme();

  const notifListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
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
          />
          <Drawer.Screen
            name="LogWeight"
            component={LogWeightScreen}
          />
          <Drawer.Screen
            name="MealLogHistory"
            component={MealLogHistoryScreen}
          />
          <Drawer.Screen
            name="SettingsScreen"
            component={SettingsScreen}
          />
          <Drawer.Screen
            name="StepScreen"
            component={StepScreen}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default RootNavigator;