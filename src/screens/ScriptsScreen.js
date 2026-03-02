import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import ScriptCard from '../components/ScriptCard';

export default function ScriptsScreen() {
    const insets = useSafeAreaInsets();

    // Simulated initial state: By default, we'll start with one demo script for testing, 
    // but let's toggle between empty and populated array to see both states later.
    const [scripts, setScripts] = useState([
        {
            id: '1',
            title: 'Demo Script',
            wordCount: 191,
            time: '01:09 PM',
            date: 'Feb 16, 2026',
        }
    ]);

    // This function renders the empty state when the `scripts` array is empty.
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Tap to start your first script</Text>
            {/* Visual cue arrow pointing towards the FAB */}
            <View style={styles.arrowContainer}>
                {/* We use a curved arrow icon to match the design's playful arrow */}
                <Ionicons name="arrow-undo-outline" style={{ transform: [{ rotate: '180deg' }] }} size={32} color={Colors.primary} />
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Top Header Row */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="settings-sharp" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Scripts</Text>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="diamond" size={24} color="#5E81FF" />
                </TouchableOpacity>
            </View>

            {/* Secondary Action Bar (Select, Filter, Add Folder) */}
            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.actionSquare}>
                    <Ionicons name="scan-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionSquare}>
                    <Ionicons name="filter" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionSquare}>
                    <Ionicons name="folder-open" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* List Area: Displays the custom cards or the empty state message */}
            <FlatList
                data={scripts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ScriptCard script={item} />}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    iconButton: {
        padding: 5,
    },
    headerTitle: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    actionBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    actionSquare: {
        width: 44,
        height: 44,
        backgroundColor: Colors.actionButton,
        borderRadius: 12, // Smooth rounded corners like the screenshot
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        flexGrow: 1, // Ensures empty state can center vertically
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Pushes the text towards the bottom tab bar
        alignItems: 'center',
        paddingBottom: 40,
    },
    emptyStateText: {
        color: Colors.textPrimary,
        fontSize: 16,
        marginBottom: 16,
    },
    arrowContainer: {
        // Styling to loosely match the curvy arrow
        alignItems: 'center',
    },
});
