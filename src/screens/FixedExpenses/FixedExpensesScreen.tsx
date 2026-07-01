import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFixedExpenses } from '../../hooks/useFixedExpenses';
import { getCurrentMonthKey, monthKeyToLabel } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { Colors } from '../../constants/colors';
import { FixedExpenseItem } from './components/FixedExpenseItem';
import { EmptyState } from '../../components/EmptyState';

export default function FixedExpensesScreen({ navigation }: any) {
  const monthKey = getCurrentMonthKey();
  const { expenses, loading, total, togglePaid, remove, reload } = useFixedExpenses(monthKey);

  return (
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Monthly Fixed Total</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        <Text style={styles.totalSub}>
          {expenses.filter(e => e.isPaid).length}/{expenses.length} paid this month
        </Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={e => e.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="home-outline" title="No fixed expenses" subtitle="Add rent, bills, and subscriptions" />
          ) : null
        }
        renderItem={({ item }) => (
          <FixedExpenseItem
            expense={item}
            onTogglePaid={isPaid => togglePaid(item.id, isPaid)}
            onDelete={() => remove(item.id)}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddFixedExpense')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  totalCard: {
    margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  totalLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  totalAmount: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  totalSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
