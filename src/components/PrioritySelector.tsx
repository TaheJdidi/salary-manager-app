import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { PRIORITIES } from '../constants/categories';
import { Priority } from '../types';

interface Props {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PrioritySelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {PRIORITIES.map((p) => {
        const active = value === p.key;
        return (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.segment,
              active && { backgroundColor: p.color, borderColor: p.color },
            ]}
            onPress={() => onChange(p.key)}
          >
            <View style={[styles.dot, { backgroundColor: active ? '#FFF' : p.color }]} />
            <Text style={[styles.label, active && styles.labelActive]}>{p.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 12, backgroundColor: Colors.background,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  labelActive: { color: '#FFF' },
});
