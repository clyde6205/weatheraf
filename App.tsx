import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import dayjs from 'dayjs';
import axios from 'axios';

let db;

const openDatabase = async () => {
  db = await SQLite.openDatabaseAsync('weatheraf.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_location (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      latitude REAL,
      longitude REAL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE,
      temperature REAL,
      rainfall REAL,
      notes TEXT DEFAULT '',
      last_synced TEXT
    );

    INSERT OR IGNORE INTO daily_data (date, notes) VALUES ('${dayjs().format('YYYY-MM-DD')}', '');
  `);
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [todayData, setTodayData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    temperature: null,
    rainfall: null,
    notes: '',
    lastSynced: null,
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    openDatabase();
    checkNetwork();
    loadLocation();
    loadTodayData();

    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      if (online && location) syncWeather();
    });

    return unsubscribe;
  }, [location]);

  const checkNetwork = async () => {
    const state = await NetInfo.fetch();
    setIsOnline(state.isConnected && state.isInternetReachable);
  };

  const loadLocation = async () => {
    const row = await db.getFirstAsync('SELECT * FROM user_location WHERE id = 1');
    if (row) setLocation(row);
  };

  const loadTodayData = async () => {
    const today = dayjs().format('YYYY-MM-DD');
    const row = await db.getFirstAsync('SELECT * FROM daily_data WHERE date = ?', [today]);
    if (row) {
      setTodayData({
        date: row.date,
        temperature: row.temperature,
        rainfall: row.rainfall,
        notes: row.notes || '',
        lastSynced: row.last_synced,
      });
    }
  };

  const saveNotes = async (text) => {
    const today = dayjs().format('YYYY-MM-DD');
    await db.runAsync('UPDATE daily_data SET notes = ? WHERE date = ?', [text, today]);
    setTodayData(prev => ({ ...prev, notes: text }));
  };

  const setUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location for rural weather');
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
      const newLoc = {
        id: 1,
        name: 'My Farm',
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        updated_at: dayjs().toISOString(),
      };

      await db.runAsync(
        'INSERT OR REPLACE INTO user_location (id, name, latitude, longitude, updated_at) VALUES (?, ?, ?, ?, ?)',
        [1, newLoc.name, newLoc.latitude, newLoc.longitude, newLoc.updated_at]
      );

      setLocation(newLoc);
      Alert.alert('Farm location saved');
      syncWeather();
    } catch (e) {
      Alert.alert('Location error', 'Try when signal is better');
    }
  };

  const syncWeather = async () => {
    if (!location) return;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const response = await axios.get(url, { timeout: 12000 });
      const data = response.data.daily;

      const today = dayjs().format('YYYY-MM-DD');
      const todayIndex = data.time.indexOf(today);
      if (todayIndex !== -1) {
        const avgTemp = (data.temperature_2m_max[todayIndex] + data.temperature_2m_min[todayIndex]) / 2;
        const rain = data.precipitation_sum[todayIndex];

        await db.runAsync(
          'UPDATE daily_data SET temperature = ?, rainfall = ?, last_synced = ? WHERE date = ?',
          [avgTemp, rain, dayjs().toISOString(), today]
        );

        loadTodayData();
      }
    } catch (e) {
      console.log('Sync normal (offline)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>weatheraf</Text>
        <Text style={styles.subtitle}>Offline Rural Africa - SIM Only</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Farm Location:</Text>
          <Text>{location ? 'Set' : 'Not set'}</Text>
          <Button title="Set My Farm Location" onPress={setUserLocation} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Today: {todayData.date}</Text>
          <Text>Temperature: {todayData.temperature ? `${todayData.temperature.toFixed(1)}°C` : 'No data'}</Text>
          <Text>Rainfall: {todayData.rainfall !== null ? `${todayData.rainfall} mm` : 'No data'}</Text>
          {todayData.lastSynced && <Text style={styles.small}>Synced: {dayjs(todayData.lastSynced).format('HH:mm')}</Text>}
          <Text style={styles.small}>Mobile Data: {isOnline ? 'On' : 'Offline - Works'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>My Notes (edit offline):</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="e.g. Planted maize, soil dry..."
            value={todayData.notes}
            onChangeText={saveNotes}
          />
        </View>

        <Button
          title={isOnline ? "Sync Now" : "Sync When Data Returns"}
          onPress={syncWeather}
          disabled={!isOnline || !location}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 30 },
  section: { marginBottom: 25 },
  label: { fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, minHeight: 120, textAlignVertical: 'top' },
  small: { fontSize: 12, color: '#888', marginTop: 5 },
});
