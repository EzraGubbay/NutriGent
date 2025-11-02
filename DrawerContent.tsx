import { DrawerContentComponentProps } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => (
    <View style={styles.container} >
        <Text style={styles.header}>Menu</Text>
        <Text style={styles.item}>Home</Text>
        <Text style={styles.item}>Settings</Text>
        <Text style={styles.item}>Logout</Text>
    </View>
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