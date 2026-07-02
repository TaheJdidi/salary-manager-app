import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  dialog: { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, width: '80%', gap: 12 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  message: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancel: { padding: 10 },
  cancelText: { fontSize: 15, color: Colors.textSecondary },
  confirm: { backgroundColor: Colors.danger, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  confirmText: { fontSize: 15, color: '#FFF', fontWeight: '600' },
});
