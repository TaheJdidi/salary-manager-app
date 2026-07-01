import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import FixedExpensesScreen from '../FixedExpenses/FixedExpensesScreen';
import VariableExpensesScreen from '../VariableExpenses/VariableExpensesScreen';

export default function ExpensesHomeScreen({ navigation }: any) {
  const [tab, setTab] = useState<'fixed' | 'variable'>('fixed');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'fixed' && styles.tabActive]}
          onPress={() => setTab('fixed')}
        >
          <Text style={[styles.tabText, tab === 'fixed' && styles.tabTextActive]}>Fixed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'variable' && styles.tabActive]}
          onPress={() => setTab('variable')}
        >
          <Text style={[styles.tabText, tab === 'variable' && styles.tabTextActive]}>Variable</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'fixed' ? (
          <FixedExpensesScreen navigation={navigation} />
        ) : (
          <VariableExpensesScreen navigation={navigation} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: 15, fontWeight: '500', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '600' },
  content: { flex: 1 },
});
