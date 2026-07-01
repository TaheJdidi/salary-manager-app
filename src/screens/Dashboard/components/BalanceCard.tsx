import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { formatCurrency } from '../../../utils/currencyUtils';

interface Props {
  remaining: number;
  totalIncome: number;
}

export function BalanceCard({ remaining, totalIncome }: Props) {
  const pct = totalIncome > 0 ? (remaining / totalIncome) * 100 : 100;
  const color = pct > 30 ? Colors.success : pct > 10 ? Colors.warning : Colors.danger;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Remaining Balance</Text>
      <Text style={[styles.amount, { color }]}>{formatCurrency(remaining)}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.sub}>{pct.toFixed(0)}% of {formatCurrency(totalIncome)} income</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, alignItems: 'center',
  },
  label: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  amount: { fontSize: 40, fontWeight: '800', marginBottom: 16 },
  barBg: { width: '100%', height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 4 },
  sub: { fontSize: 13, color: Colors.textSecondary },
});
