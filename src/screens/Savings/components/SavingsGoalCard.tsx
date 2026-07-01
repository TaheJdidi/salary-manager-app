import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavingsGoal } from '../../../types';
import { Colors } from '../../../constants/colors';
import { formatCurrency } from '../../../utils/currencyUtils';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

interface Props {
  goal: SavingsGoal;
  onContribute: (amount: number) => void;
  onDelete: () => void;
}

export function SavingsGoalCard({ goal, onContribute, onDelete }: Props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [contributing, setContributing] = useState(false);
  const [contribInput, setContribInput] = useState('');

  const pct = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;

  const handleContrib = () => {
    const val = parseFloat(contribInput);
    if (!val || val <= 0) return Alert.alert('Error', 'Enter a valid amount.');
    onContribute(val);
    setContributing(false);
    setContribInput('');
  };

  return (
    <View style={[styles.card, goal.isCompleted && styles.completed]}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{goal.name}</Text>
          {goal.deadline && <Text style={styles.deadline}>By {goal.deadline}</Text>}
        </View>
        {goal.isCompleted && <Ionicons name="checkmark-circle" size={22} color={Colors.success} />}
        <TouchableOpacity onPress={() => setConfirmVisible(true)}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.amtRow}>
        <Text style={styles.current}>{formatCurrency(goal.currentAmount)}</Text>
        <Text style={styles.sep}>/</Text>
        <Text style={styles.target}>{formatCurrency(goal.targetAmount)}</Text>
      </View>

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>{pct.toFixed(0)}% complete</Text>

      {!goal.isCompleted && (
        contributing ? (
          <View style={styles.contribRow}>
            <TextInput
              style={styles.contribInput}
              value={contribInput}
              onChangeText={setContribInput}
              placeholder="Amount"
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.textSecondary}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleContrib}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setContributing(false)}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.contribTrigger} onPress={() => setContributing(true)}>
            <Ionicons name="add-circle-outline" size={16} color={Colors.primary} />
            <Text style={styles.contribTriggerText}>Add contribution</Text>
          </TouchableOpacity>
        )
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Goal"
        message={`Remove goal "${goal.name}"?`}
        onConfirm={() => { setConfirmVisible(false); onDelete(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  completed: { opacity: 0.8, borderWidth: 1, borderColor: Colors.success },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  deadline: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  amtRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  current: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  sep: { fontSize: 14, color: Colors.textSecondary },
  target: { fontSize: 14, color: Colors.textSecondary },
  barBg: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  pct: { fontSize: 12, color: Colors.textSecondary },
  contribRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contribInput: {
    flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 8,
    padding: 8, fontSize: 15, color: Colors.textPrimary, backgroundColor: Colors.background,
  },
  addBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  contribTrigger: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  contribTriggerText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
});
