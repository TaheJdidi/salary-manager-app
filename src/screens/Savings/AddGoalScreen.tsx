import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useSavings } from '../../hooks/useSavings';
import { CurrencyInput } from '../../components/CurrencyInput';
import { toCents, parseAmount } from '../../utils/currencyUtils';

export default function AddGoalScreen({ navigation }: any) {
  const { addGoal } = useSavings();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter a goal name.');
    const amt = parseAmount(target);
    if (!amt || amt <= 0) return Alert.alert('Error', 'Please enter a valid target amount.');
    await addGoal(name.trim(), toCents(amt), deadline.trim() || null);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Savings Goal</Text>
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
          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Emergency Fund, Vacation..."
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Target Amount</Text>
          <CurrencyInput value={target} onChangeText={setTarget} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Deadline (YYYY-MM-DD, optional)</Text>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="2026-12-31"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numbers-and-punctuation"
          />
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
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 10 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 12, fontSize: 16, color: Colors.textPrimary, backgroundColor: Colors.background,
  },
});
