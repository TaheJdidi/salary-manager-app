import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';

interface Props {
  fixedTotal: number;
  variableTotal: number;
  savingsTarget: number;
  remaining: number;
}

export function BudgetPieChart({ fixedTotal, variableTotal, savingsTarget, remaining }: Props) {
  const total = fixedTotal + variableTotal + savingsTarget + Math.max(0, remaining);
  if (total === 0) return null;

  const segments = [
    { label: 'Fixed', value: fixedTotal, color: Colors.danger },
    { label: 'Variable', value: variableTotal, color: Colors.warning },
    { label: 'Savings', value: savingsTarget, color: Colors.primary },
    { label: 'Free', value: Math.max(0, remaining), color: Colors.success },
  ].filter(s => s.value > 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Budget Breakdown</Text>
      <View style={styles.bar}>
        {segments.map((s, i) => (
          <View
            key={i}
            style={[styles.segment, { flex: s.value / total, backgroundColor: s.color }]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((s, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel}>{s.label}</Text>
            <Text style={styles.legendPct}>{((s.value / total) * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  bar: { flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  segment: { height: '100%' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, color: Colors.textSecondary },
  legendPct: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
});
