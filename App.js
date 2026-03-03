import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabNavigator from './src/navigation/TabNavigator';
import AddScriptScreen from './src/screens/AddScriptScreen';
import PreviewScreen from './src/screens/PreviewScreen';
import TeleprompterScreen from './src/screens/TeleprompterScreen';
import { ScriptProvider } from './src/context/ScriptContext';
import { Colors } from './src/constants/Colors';

const Stack = createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ScriptProvider>
        <NavigationContainer theme={AppTheme}>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            {/* Modal for creating a script */}
            <Stack.Screen
              name="AddScript"
              component={AddScriptScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            {/* Standard slide-in screen for previewing a script */}
            <Stack.Screen
              name="Preview"
              component={PreviewScreen}
            />
            {/* Full screen camera recording view */}
            <Stack.Screen
              name="Teleprompter"
              component={TeleprompterScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ScriptProvider>
    </SafeAreaProvider>
  );
}
