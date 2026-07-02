import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Category { key: string; label: string; icon: string }

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (key: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function CategoryPicker({ categories, selected, onSelect, visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select Category</Text>
          <FlatList
            data={categories}
            keyExtractor={i => i.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, selected === item.key && styles.itemSelected]}
                onPress={() => { onSelect(item.key); onClose(); }}
              >
                <Ionicons name={item.icon as any} size={20} color={selected === item.key ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.itemLabel, selected === item.key && { color: Colors.primary }]}>{item.label}</Text>
                {selected === item.key && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10 },
  itemSelected: { backgroundColor: Colors.primaryLight },
  itemLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },
});
