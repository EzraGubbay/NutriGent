import React, { useEffect } from 'react';
import { useRef } from 'react';
import { styles } from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import HomeScreen from './HomeScreen';
import { registerForPushNotificationsAsync } from './notificationHandler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent'

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;