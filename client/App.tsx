import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/theme/ThemeContext';
import DynamicScreen from './src/screens/DynamicScreen';

export type RootStackParamList = {
  Dynamic: { screenName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dynamic"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Dynamic"
            component={DynamicScreen}
            initialParams={{ screenName: 'home' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
