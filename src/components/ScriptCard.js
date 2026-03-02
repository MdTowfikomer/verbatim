import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

// This is a reusable component for displaying a single script item in our list.
// We accept a 'script' object as a prop containing its details.
export default function ScriptCard({ script }) {
    const navigation = useNavigation();
    const { deleteScript } = useScripts();

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

            {/* The 3-dot vertical menu icon on the right side of the card */}
            <TouchableOpacity style={styles.menuButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

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
    }
});
