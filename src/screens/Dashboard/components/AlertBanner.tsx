import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/colors';
import { formatCurrency } from '../../../utils/currencyUtils';

interface Props {
  remaining: number;
  totalIncome: number;
  threshold: number;
  onDismiss: () => void;
}

export function AlertBanner({ remaining, totalIncome, threshold, onDismiss }: Props) {
  return (
    <View style={styles.banner}>
      <Ionicons name="warning" size={20} color={Colors.warning} />
      <Text style={styles.text}>
        Only {formatCurrency(remaining)} left ({threshold}% threshold reached)
      </Text>
      <TouchableOpacity onPress={onDismiss}>
        <Ionicons name="close" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#F59E0B',
  },
  text: { flex: 1, fontSize: 13, color: '#92400E' },
});
