import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { useScripts } from '../context/ScriptContext';

export default function AddScriptScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { addScript, editScript } = useScripts(); // Pull functions from Context

    const existingScript = route.params?.script;

    const [title, setTitle] = useState(existingScript ? existingScript.title : 'Untitled script - 1');
    const [content, setContent] = useState(existingScript ? existingScript.content : '');

    // Count words by splitting on whitespace
    const wordCount = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;

    const handleSave = () => {
        // Basic validation
        if (!content.trim()) return;

        // Create a beautifully formatted date string like "Mar 02, 2026"
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        // Prepare the script data
        const scriptData = {
            title,
            content,
            wordCount,
            date: dateStr,
            time: timeStr
        };

        if (existingScript) {
            editScript(existingScript.id, scriptData);
            navigation.navigate('Preview', { script: { ...existingScript, ...scriptData } });
        } else {
            // Generate ID here so Preview receives it immediately, or Context will handle it if we sync
            const newScript = { ...scriptData, id: Date.now().toString() };
            addScript(newScript);
            navigation.navigate('Preview', { script: newScript });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

                {/* Header Area */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.contentContainer}>
                    {/* Title Input area */}
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Script Title"
                        placeholderTextColor={Colors.textSecondary}
                    />
                    <Text style={styles.wordCount}>{wordCount} words</Text>

                    <View style={styles.divider} />

                    {/* Editor Area */}
                    <TextInput
                        style={styles.editorInput}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Type your text or paste your text on long press"
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>

                {/* Bottom Formatting Toolbar Area */}
                <View style={styles.formattingToolbarContainer}>
                    <View style={styles.formattingToolbar}>
                        <TouchableOpacity style={styles.formatAction}>
                            <Text style={styles.formatTextBold}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.formatAction}>
                            <Text style={styles.formatTextItalic}>I</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.formatAction}>
                            <Text style={styles.formatTextUnderline}>U</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.formatAction}>
                            <Text style={styles.formatTextStrikethrough}>S</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </KeyboardAvoidingView>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    diamondIcon: {
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleInput: {
        color: "white",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    wordCount: {
        color: Colors.textSecondary,
        fontSize: 14,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 20,
    },
    editorInput: {
        color: 'white',
        fontSize: 18,
        lineHeight: 28, // Matches screenshot text styling
        minHeight: 300,
    },
    formattingToolbarContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formattingToolbar: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 20,
    },
    formatAction: {
        padding: 4,
    },
    formatTextBold: {
        color: Colors.textSecondary,
        fontSize: 18,
        fontWeight: '900',
    },
    formatTextItalic: {
        color: Colors.textSecondary,
        fontSize: 18,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    formatTextUnderline: {
        color: Colors.textSecondary,
        fontSize: 18,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    formatTextStrikethrough: {
        color: Colors.textSecondary,
        fontSize: 18,
        textDecorationLine: 'line-through',
        fontWeight: 'bold',
    }
});
