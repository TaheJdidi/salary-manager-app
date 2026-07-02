import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MonthlySnapshot } from '../../types';
import { getSnapshots } from '../../repositories/monthlySnapshotRepo';
import { Colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/currencyUtils';
import { monthKeyToLabel } from '../../utils/dateUtils';
import { EmptyState } from '../../components/EmptyState';

export default function HistoryScreen({ navigation }: any) {
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getSnapshots(24).then(s => {
        if (active) {
          setSnapshots(s);
          setLoading(false);
        }
      });
      return () => { active = false; };
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={snapshots}
        keyExtractor={s => s.monthKey}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="time-outline" title="No history yet" subtitle="History builds as you track expenses" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MonthDetail', { monthKey: item.monthKey })}
          >
            <View style={styles.cardTop}>
              <Text style={styles.monthLabel}>{monthKeyToLabel(item.monthKey)}</Text>
              <Text style={[styles.remaining, { color: item.remainingBalance >= 0 ? Colors.success : Colors.danger }]}>
                {formatCurrency(item.remainingBalance)}
              </Text>
            </View>
            <View style={styles.chips}>
              <Chip label="Income" value={item.totalIncome} color={Colors.success} />
              <Chip label="Fixed" value={item.fixedExpenseTotal} color={Colors.danger} />
              <Chip label="Variable" value={item.variableExpenseTotal} color={Colors.warning} />
              <Chip label="Saved" value={item.savingsTarget} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      <Text style={[styles.chipValue, { color }]}>{formatCurrency(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  remaining: { fontSize: 18, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  chipLabel: { fontSize: 10, fontWeight: '500' },
  chipValue: { fontSize: 12, fontWeight: '700' },
});
