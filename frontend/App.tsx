import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './screens/auth/AuthContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import HomeScreen from './screens/src/HomeScreen';
import EditProfileScreen from './screens/src/EditProfileScreen';
import CompanyPage1 from './screens/src/CompanyPage1';
import CompanyForm from './screens/src/CompanyForm';
import LogoForm from './screens/src/LogoForm';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={EditProfileScreen} />
          <Stack.Screen name="CompanyPage1" component={CompanyPage1} />
          <Stack.Screen name="CompanyForm" component={CompanyForm} />
          <Stack.Screen name="LogoForm" component={LogoForm} />
          {/* Add other screens like Home, etc. */}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
};

export default App;
