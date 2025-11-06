import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => (
    <DrawerContentScrollView style={styles.container} {...props} >
        <DrawerItem 
          style={styles.header}
          label="Home"
          onPress={() => {props.navigation.navigate('Home')}}
        />
        <DrawerItem 
          style={styles.header}
          label="Log Weight"
          onPress={() => {props.navigation.navigate('LogWeight')}}
        />
        <DrawerItem 
          style={styles.header}
          label="Meal Log History"
          onPress={() => {props.navigation.navigate('MealLogHistory')}}
        />
        <DrawerItem 
          style={styles.header}
          label="Settings"
          onPress={() => {console.log("No Settings page yet...")}}
        />
        <DrawerItem 
          style={styles.header}
          label="Logout"
          onPress={() => {console.log("No Logout functionality yet...")}}
        />

    </DrawerContentScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default DrawerContent;