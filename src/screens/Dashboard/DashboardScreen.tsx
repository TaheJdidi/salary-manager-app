import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDashboard } from '../../hooks/useDashboard';
import { Colors } from '../../constants/colors';
import { formatCurrency } from '../../utils/currencyUtils';
import { getCurrentMonthKey, monthKeyToLabel } from '../../utils/dateUtils';
import { BalanceCard } from './components/BalanceCard';
import { BudgetPieChart } from './components/BudgetPieChart';
import { AlertBanner } from './components/AlertBanner';

export default function DashboardScreen({ navigation }: any) {
  const monthKey = getCurrentMonthKey();
  const { data, loading, reload } = useDashboard(monthKey);
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{monthKeyToLabel(monthKey)}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('IncomeSetup')}>
          <Ionicons name="settings-outline" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
      >
        {data && data.isUnderAlert && !alertDismissed && (
          <AlertBanner
            remaining={data.remaining}
            totalIncome={data.totalIncome}
            threshold={data.alertThreshold}
            onDismiss={() => setAlertDismissed(true)}
          />
        )}

        <BalanceCard
          remaining={data?.remaining ?? 0}
          totalIncome={data?.totalIncome ?? 0}
        />

        {data && data.totalIncome > 0 && (
          <BudgetPieChart
            fixedTotal={data.fixedTotal}
            variableTotal={data.variableTotal}
            savingsTarget={data.savingsTarget}
            remaining={data.remaining}
          />
        )}

        <View style={styles.breakdown}>
          <BreakdownRow label="Income" amount={data?.totalIncome ?? 0} color={Colors.success} icon="arrow-down-circle" />
          <BreakdownRow label="Fixed Expenses" amount={data?.fixedTotal ?? 0} color={Colors.danger} icon="home" />
          <BreakdownRow label="Variable Expenses" amount={data?.variableTotal ?? 0} color={Colors.warning} icon="cart" />
          <BreakdownRow label="Savings" amount={data?.savingsTarget ?? 0} color={Colors.primary} icon="wallet" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BreakdownRow({ label, amount, color, icon }: { label: string; amount: number; color: string; icon: any }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={[styles.rowAmount, { color }]}>{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: 16, gap: 16 },
  breakdown: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowLabel: { fontSize: 15, color: Colors.textSecondary },
  rowAmount: { fontSize: 15, fontWeight: '600' },
});
