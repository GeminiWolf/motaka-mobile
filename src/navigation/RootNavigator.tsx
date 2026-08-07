import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Car, Settings as SettingsIcon, Wallet } from 'lucide-react-native';

import type { GarageStackParamList, RootTabParamList } from './types';
import { AddPartScreen } from '../screens/AddPartScreen';
import { AddVehicleScreen } from '../screens/AddVehicleScreen';
import { BudgetCarScreen } from '../screens/BudgetCarScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { CarDashboardScreen } from '../screens/CarDashboardScreen';
import { FindPartScreen } from '../screens/FindPartScreen';
import { GarageHomeScreen } from '../screens/GarageHomeScreen';
import { PartDetailScreen } from '../screens/PartDetailScreen';
import { PartsTrackerScreen } from '../screens/PartsTrackerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme';
import Header from './components/Header';
import { CarDashboardHeaderRight } from './components/CarDashboardHeaderRight';
import { PartsChecklistHeaderRight } from './components/PartsChecklistHeaderRight';
import { PartsChecklistHeaderTitle } from './components/PartsChecklistHeaderTitle';
import { PartsChecklistScreen } from '../screens/PartsChecklistScreen';
import DataAndStorageScreen from '../screens/DataAndStorageScreen';
import ExportScreen from '../screens/ExportScreen';
import AboutScreen from '../screens/AboutScreen';
import LicensesScreen from '../screens/LicensesScreen';
import ApiConnectionScreen from '../screens/ApiConnectionScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const GarageStack = createNativeStackNavigator<GarageStackParamList>();

const renderTabHeader = (props: React.ComponentProps<typeof Header>) => (
  <Header {...props} />
);

type TabIconProps = { color: string; size: number; focused?: boolean };

function GarageTabIcon({ color, size }: TabIconProps) {
  return <Car color={color} size={size} />;
}

function BudgetTabIcon({ color, size }: TabIconProps) {
  return <Wallet color={color} size={size} />;
}

function SettingsTabIcon({ color, size }: TabIconProps) {
  return <SettingsIcon color={color} size={size} />;
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.borderSubtle,
    primary: colors.accent,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: renderTabHeader,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.slate400,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tab.Screen
        name="GarageTab"
        component={GarageHomeScreen}
        options={{
          title: 'Garage',
          tabBarIcon: GarageTabIcon,
        }}
      />
      <Tab.Screen
        name="BudgetTab"
        component={BudgetScreen}
        options={{
          title: 'Budget',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          tabBarIcon: BudgetTabIcon,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <GarageStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <GarageStack.Screen
          name="GarageHome"
          component={MainTabs}
          options={{ title: 'Garage', headerShown: false }}
        />
        <GarageStack.Screen
          name="AddVehicle"
          component={AddVehicleScreen}
          options={{
            title: 'Add vehicle',
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            gestureDirection: 'vertical',
          }}
        />
        <GarageStack.Screen
          name="CarDashboard"
          component={CarDashboardScreen}
          options={({ navigation, route }) => ({
            title: '',
            headerRight: () => CarDashboardHeaderRight({ navigation, route }),
          })}
        />
        <GarageStack.Screen
          name="PartsTracker"
          component={PartsTrackerScreen}
          options={{ title: 'Parts tracker' }}
        />
        <GarageStack.Screen
          name="AddPart"
          component={AddPartScreen}
          options={{
            title: 'Add part',
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            gestureDirection: 'vertical',
          }}
        />
        <GarageStack.Screen
          name="PartsChecklist"
          component={PartsChecklistScreen}
          options={({ navigation, route }) => ({
            title: '',
            headerTitleAlign: 'left',
            headerStyle: { backgroundColor: colors.surface },
            headerTitle: () => PartsChecklistHeaderTitle({ route }),
            headerRight: () => PartsChecklistHeaderRight({ navigation, route }),
          })}
        />
        <GarageStack.Screen
          name="PartDetail"
          component={PartDetailScreen}
          options={{ title: 'Part detail' }}
        />
        <GarageStack.Screen
          name="FindPart"
          component={FindPartScreen}
          options={{ title: 'Find part' }}
        />
        <GarageStack.Screen
          name="BudgetCar"
          component={BudgetCarScreen}
          options={{ title: 'Budget' }}
        />
        <GarageStack.Screen
          name="DataAndStorage"
          component={DataAndStorageScreen}
          options={{ title: 'Data & Storage' }}
        />
        <GarageStack.Screen
          name="Export"
          component={ExportScreen}
          options={{ title: 'Export' }}
        />
        <GarageStack.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: '',
            headerStyle: { backgroundColor: colors.bg },
          }}
        />
        <GarageStack.Screen
          name="Licenses"
          component={LicensesScreen}
          options={{
            title: 'Licenses',
            headerStyle: { backgroundColor: colors.bg },
          }}
        />
        <GarageStack.Screen
          name="ApiConnection"
          component={ApiConnectionScreen}
          options={{
            title: 'API Connection',
            headerStyle: { backgroundColor: colors.bg },
          }}
        />
      </GarageStack.Navigator>
    </NavigationContainer>
  );
}
