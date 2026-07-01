import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useIncome } from '../../hooks/useIncome';
import { fromCents, toCents } from '../../utils/currencyUtils';
import { CurrencyInput } from '../../components/CurrencyInput';

export default function IncomeSetupScreen({ navigation }: any) {
  const { income, save } = useIncome();
  const [salary, setSalary] = useState('');
  const [other, setOther] = useState('');

  useEffect(() => {
    if (income) {
      setSalary(fromCents(income.monthlySalary).toFixed(2));
      setOther(fromCents(income.otherIncome).toFixed(2));
    }
  }, [income]);

  const handleSave = async () => {
    const s = parseFloat(salary) || 0;
    const o = parseFloat(other) || 0;
    await save(toCents(s), toCents(o));
    Alert.alert('Saved', 'Income updated successfully.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Income Setup</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Monthly Salary (net)</Text>
          <CurrencyInput value={salary} onChangeText={setSalary} placeholder="0.00" />
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Other Monthly Income</Text>
          <CurrencyInput value={other} onChangeText={setOther} placeholder="0.00" />
          <Text style={styles.hint}>Freelance, bonuses, side income, etc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  cancel: { fontSize: 16, color: Colors.textSecondary },
  save: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  hint: { fontSize: 12, color: Colors.textSecondary },
});
