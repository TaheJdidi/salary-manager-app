import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FixedExpenseWithPayment } from '../../../types';
import { Colors } from '../../../constants/colors';
import { formatCurrency } from '../../../utils/currencyUtils';
import { FIXED_CATEGORIES } from '../../../constants/categories';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

interface Props {
  expense: FixedExpenseWithPayment;
  onTogglePaid: (isPaid: boolean) => void;
  onDelete: () => void;
}

export function FixedExpenseItem({ expense, onTogglePaid, onDelete }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const cat = FIXED_CATEGORIES.find(c => c.key === expense.category);

  return (
    <View style={[styles.card, expense.isPaid && styles.cardPaid]}>
      <View style={styles.left}>
        <Ionicons name={cat?.icon as any ?? 'ellipsis-horizontal'} size={20} color={Colors.textSecondary} />
        <View>
          <Text style={styles.name}>{expense.name}</Text>
          <Text style={styles.category}>{cat?.label ?? expense.category}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        <TouchableOpacity onPress={() => onTogglePaid(!expense.isPaid)} style={styles.checkBtn}>
          <Ionicons
            name={expense.isPaid ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={expense.isPaid ? Colors.success : Colors.border}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>
      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Expense"
        message={`Remove "${expense.name}" from fixed expenses?`}
        onConfirm={() => { setConfirmVisible(false); onDelete(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardPaid: { opacity: 0.7 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  category: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  amount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  checkBtn: {},
});
