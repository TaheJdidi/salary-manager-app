import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { getAllSettings, setSetting } from '../../repositories/settingsRepo';
import { Ionicons } from '@expo/vector-icons';

const THRESHOLD_OPTIONS = [5, 10, 15, 20, 25];

export default function SettingsScreen() {
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [threshold, setThreshold] = useState(10);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllSettings().then(s => {
      setNotifEnabled(s['notifications_enabled'] === '1');
      setThreshold(parseInt(s['alert_threshold'] ?? '10', 10));
      setLoaded(true);
    });
  }, []);

  const toggleNotif = async (val: boolean) => {
    setNotifEnabled(val);
    await setSetting('notifications_enabled', val ? '1' : '0');
    if (val) {
      Alert.alert('Notifications enabled', 'You will receive budget alerts and reminders.');
    }
  };

  const setThresholdVal = async (val: number) => {
    setThreshold(val);
    await setSetting('alert_threshold', val.toString());
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.rowLabel}>Enable Notifications</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={toggleNotif}
              trackColor={{ true: Colors.primary }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Budget Alert Threshold</Text>
          <Text style={styles.sectionSub}>Alert when remaining balance is below this % of income</Text>
          <View style={styles.thresholdRow}>
            {THRESHOLD_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.thresholdBtn, threshold === opt && styles.thresholdBtnActive]}
                onPress={() => setThresholdVal(opt)}
              >
                <Text style={[styles.thresholdText, threshold === opt && styles.thresholdTextActive]}>
                  {opt}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.about}>Salary Manager v1.0{'\n'}Local storage · No account needed</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: 20, paddingVertical: 12 },
  content: { padding: 16, gap: 16 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  sectionSub: { fontSize: 13, color: Colors.textSecondary, marginTop: -6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 15, color: Colors.textPrimary },
  thresholdRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  thresholdBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background,
  },
  thresholdBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  thresholdText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  thresholdTextActive: { color: '#FFF' },
  about: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
