import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

export default function RecordingsScreen() {
    const insets = useSafeAreaInsets();
    const { recordings, deleteRecording } = useScripts();

    const handleDelete = (id, title) => {
        Alert.alert(
            "Delete Recording",
            `Are you sure you want to delete the recording for "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteRecording(id)
                }
            ]
        );
    };

    const renderRecordingCard = ({ item }) => (
        <View style={styles.cardContainer}>
            {/* Video Icon Placeholder */}
            <View style={styles.iconContainer}>
                <Ionicons name="videocam" size={24} color={Colors.primary} />
            </View>

            {/* Recording Metadata */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {item.date} • {item.time}
                </Text>
            </View>

            {/* Play Button (Placeholder for Future Playback) */}
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Playback", "Video playback will be implemented in Phase 3 or with expo-video.")}>
                <Ionicons name="play-circle-outline" size={28} color={Colors.textPrimary} />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id, item.title)}>
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.headerTitle}>Gallery</Text>

            {recordings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="film-outline" size={64} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>No recordings yet.</Text>
                    <Text style={styles.emptySubtext}>Head to the teleprompter to record your first video.</Text>
                </View>
            ) : (
                <FlatList
                    data={recordings}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRecordingCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Space for bottom tab bar
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 87, 34, 0.1)', // Primary color with low opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -100, // visual center adjust
    },
    emptyText: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        color: Colors.textSecondary,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});
