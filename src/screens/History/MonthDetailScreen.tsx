import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MonthlySnapshot } from '../../types';
import { getSnapshot } from '../../repositories/monthlySnapshotRepo';
import { getVariableExpensesByCategory } from '../../repositories/variableExpenseRepo';
import { Colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/currencyUtils';
import { monthKeyToLabel } from '../../utils/dateUtils';
import { VARIABLE_CATEGORIES } from '../../constants/categories';

export default function MonthDetailScreen({ route }: any) {
  const monthKey: string = route.params.monthKey;
  const [snapshot, setSnapshot] = useState<MonthlySnapshot | null>(null);
  const [byCategory, setByCategory] = useState<{ category: string; total: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getSnapshot(monthKey), getVariableExpensesByCategory(monthKey)]).then(([s, c]) => {
        if (active) {
          setSnapshot(s);
          setByCategory(c);
        }
      });
      return () => { active = false; };
    }, [monthKey])
  );

  if (!snapshot) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  const spent = snapshot.fixedExpenseTotal + snapshot.variableExpenseTotal;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.month}>{monthKeyToLabel(monthKey)}</Text>

      <View style={styles.card}>
        <Row label="Total Income" value={snapshot.totalIncome} color={Colors.success} />
        <Row label="Fixed Expenses" value={snapshot.fixedExpenseTotal} color={Colors.danger} />
        <Row label="Variable Expenses" value={snapshot.variableExpenseTotal} color={Colors.warning} />
        <Row label="Savings Target" value={snapshot.savingsTarget} color={Colors.primary} />
        <View style={styles.divider} />
        <Row
          label="Remaining"
          value={snapshot.remainingBalance}
          color={snapshot.remainingBalance >= 0 ? Colors.success : Colors.danger}
          bold
        />
      </View>

      {byCategory.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Variable by Category</Text>
          {byCategory.map((c, i) => {
            const cat = VARIABLE_CATEGORIES.find(v => v.key === c.category);
            return (
              <View key={i} style={styles.catRow}>
                <Text style={styles.catLabel}>{cat?.label ?? c.category}</Text>
                <Text style={styles.catValue}>{formatCurrency(c.total)}</Text>
                <Text style={styles.catPct}>
                  {snapshot.variableExpenseTotal > 0
                    ? `${((c.total / snapshot.variableExpenseTotal) * 100).toFixed(0)}%`
                    : '—'}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

function Row({ label, value, color, bold = false }: { label: string; value: number; color: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && { fontWeight: '700', color: Colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color }, bold && { fontSize: 18 }]}>{formatCurrency(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16 },
  month: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: Colors.textSecondary },
  rowValue: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.border },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  catRow: { flexDirection: 'row', alignItems: 'center' },
  catLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
  catValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginRight: 8 },
  catPct: { fontSize: 13, color: Colors.textSecondary, width: 36, textAlign: 'right' },
});
