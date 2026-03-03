import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

// This is a reusable component for displaying a single script item in our list.
// We accept a 'script' object as a prop containing its details.
export default function ScriptCard({ script }) {
    const navigation = useNavigation();
    const { deleteScript } = useScripts();

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const iconRef = useRef(null);

    const openMenu = () => {
        if (iconRef.current) {
            iconRef.current.measureInWindow((x, y, width, height) => {
                // Position the menu slightly below the icon and aligned to its right edge
                setMenuPos({
                    top: y + height + 5,
                    right: Dimensions.get('window').width - x - width - 10,
                });
                setMenuVisible(true);
            });
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Script",
            `Are you sure you want to delete "${script.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteScript(script.id)
                }
            ]
        );
    };

    return (
        // Navigate to the Preview screen with this exact script's data when the card is pressed
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Preview', { script })}
        >

            {/* Icon Area: A small placeholder icon mimicking the design */}
            <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={20} color={Colors.textSecondary} />
            </View>

            {/* Content Area: Title and metadata (word count, date, etc) */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {script.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {script.wordCount} words • {script.time} • {script.date}
                </Text>
            </View>

            {/* 3-dot vertical menu icon on the right side of the card */}
            <TouchableOpacity ref={iconRef} style={styles.menuButton} onPress={openMenu}>
                <Ionicons name="ellipsis-vertical" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            {/* Anchored Dropdown Menu implemented with a transparent Modal */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                {/* Full screen overlay to detect taps outside the menu */}
                <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    {/* The actual dropdown menu positioned relative to the icon */}
                    <View style={[styles.dropdownMenu, { top: menuPos.top, right: menuPos.right }]}>
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('AddScript', { script });
                            }}
                        >
                            <Ionicons name="pencil" size={20} color={Colors.textPrimary} />
                            <Text style={styles.dropdownText}>Edit</Text>
                        </TouchableOpacity>

                        <View style={styles.dropdownDivider} />

                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setMenuVisible(false);
                                // Give the modal a tiny moment to close before showing the alert
                                setTimeout(() => handleDelete(), 100);
                            }}
                        >
                            <Ionicons name="trash" size={20} color="#FF5722" />
                            <Text style={[styles.dropdownText, { color: '#FF5722' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',     // Aligns the icon and text side-by-side
        alignItems: 'center',     // Vertically centers items in the row
        backgroundColor: Colors.card, // The lighter #1F253F from your screenshot
        borderRadius: 16,         // Generous smooth rounding exactly like the design
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,         // Space between cards
    },
    iconContainer: {
        marginRight: 16,          // Space between the icon and the text
        // The design shows a slightly distinct background for this icon if you look closely,
        // but we can just present it simply for now to match the general vibe.
    },
    textContainer: {
        flex: 1,                  // Takes up the remaining horizontal space
        justifyContent: 'center',
    },
    title: {
        color: Colors.textPrimary, // White bold text
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,          // Small gap between title and subtitle
    },
    subtitle: {
        color: Colors.textSecondary, // Grey text for metadata
        fontSize: 13,
    },
    menuButton: {
        padding: 8,
        marginLeft: 8, // Little space between text and icon
    },
    dropdownMenu: {
        position: 'absolute',
        backgroundColor: '#1E2235', // Match the deep slightly distinct card color from the screenshot
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        minWidth: 150,
        // Shadows for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 12, // Space between icon and text
    },
    dropdownText: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    dropdownDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 8,
    }
});
