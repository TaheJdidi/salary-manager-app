import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../../constants/colors';
import SavingsScreen from '../../screens/Savings/SavingsScreen';
import AddGoalScreen from '../../screens/Savings/AddGoalScreen';

const Stack = createStackNavigator();

export function SavingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: Colors.primary, headerBackTitle: '' }}>
      <Stack.Screen name="SavingsHome" component={SavingsScreen} options={{ title: 'Savings' }} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
