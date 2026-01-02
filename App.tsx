import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as Font from 'expo-font';

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // ---- Load custom fonts (optional) ----
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        // Example: 'Roboto': require('./assets/fonts/Roboto-Regular.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // ---- Request location permission and fetch current position ----
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading fonts…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WeatherAF</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
      {location ? (
        <Text>
          Latitude: {location.coords.latitude}{'\n'}
          Longitude: {location.coords.longitude}
        </Text>
      ) : (
        <Text>Fetching location…</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
