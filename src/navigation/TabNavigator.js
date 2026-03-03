import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../constants/Colors';
import ScriptsScreen from '../screens/ScriptsScreen';
import RecordingsScreen from '../screens/RecordingsScreen';
import { useScripts } from '../context/ScriptContext';

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
    const { addScript } = useScripts();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleAddManually = () => {
        setModalVisible(false);
        navigation.navigate('AddScript');
    };

    const handleUpload = async () => {
        try {
            // Allow both text and pdf files
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain', 'application/pdf'],
                copyToCacheDirectory: true,
            });

            if (result.canceled === false && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                let content = '';

                if (file.mimeType === 'application/pdf') {
                    // It's a PDF, we need to send it to our local API
                    setModalVisible(false); // Close modal immediately so UI doesn't hang

                    // FOR ANDROID EMULATOR: Use 10.0.2.2
                    // FOR PHYSICAL DEVICES: Use your computer's IP (e.g., 192.168.1.XX)
                    const computerIp = process.env.EXPO_PUBLIC_COMPUTER_IP;
                    const apiUrl = `http://${computerIp}:3000/extract-pdf`;

                    const formData = new FormData();
                    formData.append('file', {
                        uri: file.uri,
                        name: file.name,
                        type: file.mimeType
                    });

                    try {
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) throw new Error('API response was not ok');

                        const data = await response.json();
                        content = data.text;
                    } catch (e) {
                        console.error("PDF Parsing error:", e);
                        alert("Failed to parse PDF. Make sure your local extraction API is running on port 3000 (node index.js).");
                        return;
                    }

                } else {
                    // It's a text file, process locally
                    content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
                }

                // create a script object
                const now = new Date();
                const wordCount = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
                const newScript = {
                    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    content: content,
                    wordCount: wordCount,
                    date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    id: Date.now().toString(),
                };

                // Add to context
                addScript(newScript);
                setModalVisible(false); // In case it wasn't closed already

                // Navigate to Preview
                navigation.navigate('Preview', { script: newScript });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to read the file.");
        }
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

                    <TouchableOpacity style={styles.modalOption} onPress={handleUpload}>
                        <Ionicons name="cloud-upload-outline" size={20} color={Colors.primary} style={styles.modalIcon} />
                        <Text style={styles.modalOptionText}>Upload file (TXxT or PDF)</Text>
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
