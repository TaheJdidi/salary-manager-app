import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../../constants/colors';
import ExpensesHomeScreen from '../../screens/Expenses/ExpensesHomeScreen';
import AddFixedExpenseScreen from '../../screens/FixedExpenses/AddFixedExpenseScreen';
import AddVariableExpenseScreen from '../../screens/VariableExpenses/AddVariableExpenseScreen';
import EditVariableExpenseScreen from '../../screens/VariableExpenses/EditVariableExpenseScreen';

const Stack = createStackNavigator();

export function ExpensesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: Colors.primary, headerBackTitle: '' }}>
      <Stack.Screen name="ExpensesHome" component={ExpensesHomeScreen} options={{ title: 'Expenses' }} />
      <Stack.Screen name="AddFixedExpense" component={AddFixedExpenseScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddVariableExpense" component={AddVariableExpenseScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditVariableExpense" component={EditVariableExpenseScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
