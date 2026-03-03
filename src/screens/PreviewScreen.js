import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';

export default function PreviewScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();

    // We expect the script object to be passed as a navigation parameter
    const { script } = route.params;

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

            {/* Top Navigation Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Tabs')} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.headerRight}>
                    {/* <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="pencil" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            navigation.navigate('AddScript', { script });
                        }}
                    >
                        <Ionicons name="pencil" size={20} color={Colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Script Title & Metadata */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{script.title}</Text>
                <Text style={styles.metadata}>
                    {script.wordCount} words • {script.time} • {script.date}
                </Text>
            </View>

            {/* Main Content Area (Scrollable) */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.textAreaContainer}>
                    <Text style={styles.scriptContent}>
                        {script.content}
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-sharp" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.recordButton}
                    onPress={() => navigation.navigate('Teleprompter', { script })}
                >
                    <Ionicons name="recording-outline" size={20} color="#FFFFFF" style={styles.recordIcon} />
                    <Text style={styles.recordButtonText}>Start recording</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    iconButton: {
        padding: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    metadata: {
        color: '#8A7CE5', // Distinct Purple/Grey metadata color from the screenshot
        fontSize: 14,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    textAreaContainer: {
        backgroundColor: Colors.card,
        borderRadius: 20,
        padding: 24,
        minHeight: 400, // Ensure it looks like a large page even if content is short
    },
    scriptContent: {
        color: Colors.textPrimary,
        fontSize: 28, // Large, readable font for a teleprompter
        lineHeight: 38,
        fontFamily: 'sans-serif', // We can update this when custom fonts are added
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },
    settingsButton: {
        width: 60,
        height: 60,
        backgroundColor: '#F5ECEB', // The light colored settings square
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 30, // Pill shape
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordIcon: {
        marginRight: 8,
    },
    recordButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    }
});
