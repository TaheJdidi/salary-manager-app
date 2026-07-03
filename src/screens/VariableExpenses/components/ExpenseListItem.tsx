import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VariableExpense } from '../../../types';
import { Colors } from '../../../constants/colors';
import { formatCurrency } from '../../../utils/currencyUtils';
import { VARIABLE_CATEGORIES, PRIORITIES } from '../../../constants/categories';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

interface Props {
  expense: VariableExpense;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExpenseListItem({ expense, onEdit, onDelete }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const cat = VARIABLE_CATEGORIES.find(c => c.key === expense.category);
  const prio = PRIORITIES.find(p => p.key === expense.priority);

  return (
    <View style={styles.card}>
      <View style={[styles.iconBg, { backgroundColor: Colors.primaryLight }]}>
        <Ionicons name={cat?.icon as any ?? 'cart'} size={18} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.category}>{cat?.label ?? expense.category}</Text>
          {prio ? (
            <View style={[styles.priorityBadge, { backgroundColor: prio.color + '22' }]}>
              <View style={[styles.priorityDot, { backgroundColor: prio.color }]} />
              <Text style={[styles.priorityText, { color: prio.color }]}>{prio.label}</Text>
            </View>
          ) : null}
        </View>
        {expense.note ? <Text style={styles.note}>{expense.note}</Text> : null}
        <Text style={styles.date}>{expense.date}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      <TouchableOpacity onPress={onEdit} style={styles.btn}>
        <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setConfirmVisible(true)} style={styles.btn}>
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
      </TouchableOpacity>
      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Expense"
        message="Remove this expense?"
        onConfirm={() => { setConfirmVisible(false); onDelete(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  iconBg: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  category: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  priorityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  priorityDot: { width: 6, height: 6, borderRadius: 3 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  note: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  date: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  btn: { padding: 4 },
});
