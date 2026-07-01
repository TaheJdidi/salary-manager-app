import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../../constants/colors';
import HistoryScreen from '../../screens/History/HistoryScreen';
import MonthDetailScreen from '../../screens/History/MonthDetailScreen';

const Stack = createStackNavigator();

export function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: Colors.primary, headerBackTitle: '' }}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="MonthDetail" component={MonthDetailScreen} options={{ title: 'Month Details' }} />
    </Stack.Navigator>
  );
}
