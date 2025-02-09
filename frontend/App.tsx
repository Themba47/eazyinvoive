import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './screens/auth/AuthContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import HomeScreen from './screens/src/HomeScreen';
import EditProfileScreen from './screens/src/EditProfileScreen';
import CompanyProfileScreen from './screens/src/CompanyProfileScreen';
import CompanyPage1 from './screens/src/CompanyPage1';
import CompanyForm from './screens/src/CompanyForm';
import AddressForm from './screens/src/AddressForm';
import LogoUploadScreen from './screens/src/LogoUploadScreen';
import TaxToggleScreen from './screens/src/TaxToggleScreen';
import AddService from './screens/src/AddService';
import MyJobsListScreen from './screens/src/MyJobsListScreen';
import InvoiceSetup from './screens/src/InvoiceSetup';
import PreviewScreen from './screens/src/PreviewScreen';
import CreateInvoice from './screens/src/CreateInvoice';
import ViewInvoice from './screens/src/ViewInvoice';
import ManageProfile from './screens/src/ManageProfile';
import EditAddressScreen from './screens/src/EditAddressScreen';
import ScanDocumentScreen from './screens/src/ScanDocumentScreen';
import SignatureScreen from './screens/src/SignatureScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'My Jobs') iconName = 'briefcase';
        else if (route.name === 'Signature') iconName = 'camera';
        else if (route.name === 'Create Invoice') iconName = 'create';
        else if (route.name === 'Profile') iconName = 'person';

        return <Ionicons name={iconName as string} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1854b5',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: true }}/>
    <Tab.Screen name="My Jobs" component={MyJobsListScreen} options={{ headerShown: true }} />
    <Tab.Screen name="Signature" component={SignatureScreen} options={{ headerShown: false}} />
    <Tab.Screen name="Create Invoice" component={CreateInvoice} options={{ headerShown: true }}/>
    <Tab.Screen name="Profile" component={ManageProfile} options={{ headerShown: true }}/>
  </Tab.Navigator>
);

const DrawNavigator = () => {
  return (
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'right', // Makes the drawer slide in from the right
        }}
      >
        <Drawer.Screen name="My Profile" component={EditProfileScreen} options={{ headerShown: true }} />
        <Drawer.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true }} />
      </Drawer.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }}/>
          <Stack.Screen name="CompanyPage1" component={CompanyPage1} options={{ headerShown: false }}/>
          <Stack.Screen name="CompanyForm" component={CompanyForm} options={{ headerShown: false }}/>
          <Stack.Screen name="AddressForm" component={AddressForm} options={{ headerShown: false }}/>
          <Stack.Screen name="LogoForm" component={LogoUploadScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="TaxToggleScreen" component={TaxToggleScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Create Invoice" component={CreateInvoice} options={{ headerShown: true }} />
          <Stack.Screen name="Preview" component={PreviewScreen} options={{ headerShown: true }} />
          <Stack.Screen name="AddService" component={AddService} options={{ headerShown: true }} />
          <Stack.Screen name="ViewInvoice" component={ViewInvoice} options={{ headerShown: true }} />
          <Stack.Screen name="My Profile" component={EditProfileScreen} options={{ headerShown: true }} />
          <Stack.Screen name="My Company" component={CompanyProfileScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Edit Address" component={EditAddressScreen} options={{ headerShown: true }} />
          {/* <Stack.Screen name="Scanner" component={ScanDocumentScreen} options={{ headerShown: false }}/> */}
          {/* Add other screens like Home, etc. */}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AuthProvider>
  );
};

export default App;
