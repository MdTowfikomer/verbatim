import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Colors } from '../constants/Colors';
import ScriptsScreen from '../screens/ScriptsScreen';
import RecordingsScreen from '../screens/RecordingsScreen';

const Tab = createBottomTabNavigator();

// Custom Floating Action Button (FAB) component
const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -10,
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
    const [isModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleAddManually = () => {
        setModalVisible(false);
        navigation.navigate('AddScript');
    };

    return (
        <>
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
                    component={ScriptsScreen} // Mock component
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name="add" size={32} color="#FFFFFF" />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} onPress={toggleModal} />
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

            {/* Bottom Sheet Modal */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                onSwipeComplete={toggleModal}
                swipeDirection={['down']}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalDragIndicator} />

                    <TouchableOpacity style={styles.modalOption} onPress={handleAddManually}>
                        <Ionicons name="pencil" size={20} color={Colors.primary} style={styles.modalIcon} />
                        <Text style={styles.modalOptionText}>Add script manually</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalOption} onPress={() => { }}>
                        <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} style={styles.modalIcon} />
                        <Text style={styles.modalOptionText}>Upload files from device</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
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
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: Colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    modalDragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    modalIcon: {
        marginRight: 16,
    },
    modalOptionText: {
        color: Colors.textPrimary,
        fontSize: 16,
    },
});
