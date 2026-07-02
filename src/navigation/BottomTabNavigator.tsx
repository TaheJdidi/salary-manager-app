import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ExpensesStack } from './stacks/ExpensesStack';
import { SavingsStack } from './stacks/SavingsStack';
import { HistoryStack } from './stacks/HistoryStack';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Dashboard: ['home', 'home-outline'],
            Expenses: ['receipt', 'receipt-outline'],
            Savings: ['wallet', 'wallet-outline'],
            History: ['time', 'time-outline'],
            Settings: ['settings', 'settings-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { borderTopColor: Colors.border, backgroundColor: Colors.surface },
        headerShown: false,
        // Reset each tab's stack (and unsaved forms) when navigating away.
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesStack} />
      <Tab.Screen name="Savings" component={SavingsStack} />
      <Tab.Screen name="History" component={HistoryStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
