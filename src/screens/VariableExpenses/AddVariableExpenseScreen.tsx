import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { VARIABLE_CATEGORIES } from '../../constants/categories';
import { useVariableExpenses } from '../../hooks/useVariableExpenses';
import { CurrencyInput } from '../../components/CurrencyInput';
import { CategoryPicker } from '../../components/CategoryPicker';
import { PrioritySelector } from '../../components/PrioritySelector';
import { toCents, parseAmount } from '../../utils/currencyUtils';
import { todayISO, toMonthKey } from '../../utils/dateUtils';
import { VariableCategory, Priority } from '../../types';

export default function AddVariableExpenseScreen({ route, navigation }: any) {
  const defaultMonth: string = route?.params?.defaultMonth ?? toMonthKey(new Date());
  const { add } = useVariableExpenses(defaultMonth);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<VariableCategory>('groceries');
  const [priority, setPriority] = useState<Priority>('medium');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSave = async () => {
    const amt = parseAmount(amount);
    if (!amt || amt <= 0) return Alert.alert('Error', 'Please enter a valid amount.');
    await add(toCents(amt), category, priority, date, note.trim() || null);
    navigation.goBack();
  };

  const selectedCat = VARIABLE_CATEGORIES.find(c => c.key === category);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <CurrencyInput value={amount} onChangeText={setAmount} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity style={styles.catButton} onPress={() => setPickerVisible(true)}>
            <Ionicons name={selectedCat?.icon as any} size={18} color={Colors.primary} />
            <Text style={styles.catLabel}>{selectedCat?.label}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Priority</Text>
          <PrioritySelector value={priority} onChange={setPriority} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="2026-07-01"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Weekend trip to beach"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </ScrollView>

      <CategoryPicker
        categories={VARIABLE_CATEGORIES as any}
        selected={category}
        onSelect={k => setCategory(k as VariableCategory)}
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
      />
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
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 10 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 12, fontSize: 16, color: Colors.textPrimary, backgroundColor: Colors.background,
  },
  catButton: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 12, backgroundColor: Colors.background,
  },
  catLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },
});
