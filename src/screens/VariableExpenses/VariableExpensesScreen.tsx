import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVariableExpenses } from '../../hooks/useVariableExpenses';
import { getCurrentMonthKey, monthKeyToLabel, getPreviousMonthKeys } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { Colors } from '../../constants/colors';
import { PRIORITIES } from '../../constants/categories';
import { ExpenseListItem } from './components/ExpenseListItem';
import { EmptyState } from '../../components/EmptyState';
import { VariableExpense } from '../../types';

const MONTHS = getPreviousMonthKeys(12);

export default function VariableExpensesScreen({ navigation }: any) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const { expenses, loading, total, totalsByPriority, remove } = useVariableExpenses(selectedMonth);

  return (
    <View style={styles.container}>
      {/* Month selector */}
      <View style={styles.monthRow}>
        <TouchableOpacity
          onPress={() => {
            const idx = MONTHS.indexOf(selectedMonth);
            if (idx < MONTHS.length - 1) setSelectedMonth(MONTHS[idx + 1]);
          }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthKeyToLabel(selectedMonth)}</Text>
        <TouchableOpacity
          onPress={() => {
            const idx = MONTHS.indexOf(selectedMonth);
            if (idx > 0) setSelectedMonth(MONTHS[idx - 1]);
          }}
        >
          <Ionicons name="chevron-forward" size={22} color={selectedMonth === MONTHS[0] ? Colors.border : Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Variable</Text>
        <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map(p => (
            <View key={p.key} style={styles.priorityStat}>
              <View style={styles.priorityStatHeader}>
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text style={styles.priorityStatLabel}>{p.label}</Text>
              </View>
              <Text style={[styles.priorityStatValue, { color: p.color }]}>
                {formatCurrency(totalsByPriority[p.key])}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={e => e.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="cart-outline" title="No expenses this month" subtitle="Tap + to log an expense" />
          ) : null
        }
        renderItem={({ item }: { item: VariableExpense }) => (
          <ExpenseListItem
            expense={item}
            onEdit={() => navigation.navigate('EditVariableExpense', { expense: item })}
            onDelete={() => remove(item.id)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddVariableExpense', { defaultMonth: selectedMonth })}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  monthRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  monthLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  totalCard: {
    marginHorizontal: 16, marginBottom: 8, backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  totalLabel: { fontSize: 12, color: Colors.textSecondary },
  totalAmount: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  priorityRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch',
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  priorityStat: { alignItems: 'center', gap: 4 },
  priorityStatHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  priorityDot: { width: 7, height: 7, borderRadius: 3.5 },
  priorityStatLabel: { fontSize: 11, color: Colors.textSecondary },
  priorityStatValue: { fontSize: 14, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 10 },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
