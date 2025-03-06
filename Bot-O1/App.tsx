// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import BotO1 from './screens/ChatScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BotO1 />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
