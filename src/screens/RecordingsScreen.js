import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

// A dedicated component for video playback due to how the useVideoPlayer hook works
const VideoPlaybackModal = ({ video, onClose }) => {
    // Initialize the video player with the provided URI
    const player = useVideoPlayer(video?.uri, player => {
        player.play(); // Auto-play when opened
    });

    if (!video) return null;

    return (
        <Modal
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View style={modalStyles.container}>
                {/* Header / Dismiss Button */}
                <View style={modalStyles.header}>
                    <Text style={modalStyles.title} numberOfLines={1}>{video.title}</Text>
                    <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* The actual Video Player component from expo-video */}
                <VideoView
                    style={modalStyles.videoView}
                    player={player}
                    fullscreenOptions={{ enable: true }}
                    allowsPictureInPicture
                    showsTimecodes
                />
            </View>
        </Modal>
    );
};

export default function RecordingsScreen() {
    const insets = useSafeAreaInsets();
    const { recordings, deleteRecording } = useScripts();

    // State to track which video is currently being viewed
    const [activeVideo, setActiveVideo] = useState(null);

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
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.7}
            onPress={() => setActiveVideo(item)}
        >
            {/* Video Icon */}
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

            {/* Play Button */}
            <TouchableOpacity style={styles.actionButton} onPress={() => setActiveVideo(item)}>
                <Ionicons name="play-circle" size={32} color={Colors.primary} />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id, item.title)}>
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
        </TouchableOpacity>
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

            {/* Render the Playback Modal if a video is active */}
            <VideoPlaybackModal
                video={activeVideo}
                onClose={() => setActiveVideo(null)}
            />
        </View>
    );
}

const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background for cinematic feel
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50, // Safe area top margin
        paddingBottom: 20,
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoView: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
});

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
        paddingBottom: 20,
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
        backgroundColor: 'rgba(255, 87, 34, 0.1)',
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
        marginTop: -100,
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
