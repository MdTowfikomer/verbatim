import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import ScriptsScreen from '../screens/ScriptsScreen';
import RecordingsScreen from '../screens/RecordingsScreen';

const Tab = createBottomTabNavigator();

// Custom Floating Action Button (FAB) component
const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={onPress}
    >
        <View style={styles.fabContainer}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: Colors.background,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 70,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: Colors.textSecondary,
            }}
        >
            <Tab.Screen
                name="Scripts"
                component={ScriptsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="document-text" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Add"
                component={ScriptsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="add" size={32} color="#FFFFFF" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen
                name="Recordings"
                component={RecordingsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="videocam-outline" size={28} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    }
});
