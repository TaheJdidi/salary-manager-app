import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavings } from '../../hooks/useSavings';
import { Colors } from '../../constants/colors';
import { formatCurrency, toCents } from '../../utils/currencyUtils';
import { getCurrentMonthKey } from '../../utils/dateUtils';
import { SavingsGoalCard } from './components/SavingsGoalCard';
import { EmptyState } from '../../components/EmptyState';
import { CurrencyInput } from '../../components/CurrencyInput';
import { fromCents } from '../../utils/currencyUtils';

export default function SavingsScreen({ navigation }: any) {
  const { goals, monthlyTarget, saveMonthlyTarget, removeGoal, contribute, reload } = useSavings();
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  const startEditTarget = () => {
    setTargetInput(fromCents(monthlyTarget).toFixed(2));
    setEditingTarget(true);
  };

  const saveTarget = async () => {
    const val = parseFloat(targetInput) || 0;
    await saveMonthlyTarget(toCents(val));
    setEditingTarget(false);
  };

  return (
    <View style={styles.container}>
      {/* Monthly Target Card */}
      <View style={styles.targetCard}>
        <Text style={styles.targetLabel}>Monthly Savings Target</Text>
        {editingTarget ? (
          <View style={styles.targetEdit}>
            <CurrencyInput value={targetInput} onChangeText={setTargetInput} />
            <TouchableOpacity style={styles.saveBtn} onPress={saveTarget}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={startEditTarget} style={styles.targetRow}>
            <Text style={styles.targetAmount}>{formatCurrency(monthlyTarget)}</Text>
            <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Long-term Goals</Text>
      </View>

      <FlatList
        data={goals}
        keyExtractor={g => g.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="wallet-outline" title="No savings goals" subtitle="Add a goal to start tracking" />
        }
        renderItem={({ item }) => (
          <SavingsGoalCard
            goal={item}
            onContribute={amount => contribute(item.id, toCents(amount), getCurrentMonthKey(), null)}
            onDelete={() => removeGoal(item.id)}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddGoal')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  targetCard: {
    margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  targetLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  targetAmount: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  targetEdit: { gap: 8 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
  sectionHeader: { paddingHorizontal: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  list: { paddingHorizontal: 16, paddingBottom: 100, gap: 12 },
  fab: {
    position: 'absolute', right: 20, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
