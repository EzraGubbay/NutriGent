import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from './theme/ThemeContext';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {

  // Set navigation menu styling theme
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <DrawerContentScrollView style={styles.container} {...props} >
      <DrawerItem
        style={styles.header}
        label="Home"
        onPress={() => { props.navigation.navigate('Home') }}
      />
      <DrawerItem
        style={styles.header}
        label="Log Weight"
        onPress={() => { props.navigation.navigate('LogWeight') }}
      />
      <DrawerItem
        style={styles.header}
        label="Meal Log History"
        onPress={() => { props.navigation.navigate('MealLogHistory') }}
      />
      <DrawerItem
        style={styles.header}
        label="Settings"
        onPress={() => { props.navigation.navigate('SettingsScreen') }}
      />
      <DrawerItem
        style={styles.header}
        label="Logout"
        onPress={() => { console.log("No Logout functionality yet...") }}
      />
      <DrawerItem
        style={styles.header}
        label="Steps"
        onPress={() => { props.navigation.navigate('StepScreen') }}
      />

    </DrawerContentScrollView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: theme.background,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.sublabel,
  },
  item: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.headerBottomBorder,
  },
});

export default DrawerContent;