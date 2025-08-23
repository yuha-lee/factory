import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ThemeProvider } from './src/contexts/theme/ThemeContext';
import { TenantProvider } from './src/contexts/tenant/TenantContext';
import DynamicScreen from './src/screens/DynamicScreen';

export type RootStackParamList = {
  Dynamic: { screenName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TenantProvider>
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
    </TenantProvider>
  );
}