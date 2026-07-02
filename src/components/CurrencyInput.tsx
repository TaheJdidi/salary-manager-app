import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { normalizeAmountInput } from '../utils/currencyUtils';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  symbol?: string;
}

export function CurrencyInput({ value, onChangeText, placeholder = '0.00', symbol = '$' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={text => onChangeText(normalizeAmountInput(text))}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: Colors.background,
  },
  symbol: { fontSize: 16, color: Colors.textSecondary, marginRight: 4 },
  input: { flex: 1, fontSize: 18, fontWeight: '600', color: Colors.textPrimary, paddingVertical: 12 },
});
