import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/colors';
import { BottomTabNavigator } from './BottomTabNavigator';
import IncomeSetupScreen from '../screens/Income/IncomeSetupScreen';

const Stack = createStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        name="IncomeSetup"
        component={IncomeSetupScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
