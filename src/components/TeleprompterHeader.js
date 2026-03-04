import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

const TeleprompterHeader = ({ onBack, onToggleOrientation, isHorizontalMode, insets }) => {
    return (
        <View style={[styles.header, {
            paddingTop: isHorizontalMode ? 20 : insets.top + 10,
            paddingHorizontal: isHorizontalMode ? insets.left + 20 : 20,
        }]}>
            <TouchableOpacity style={styles.iconButton} onPress={onBack}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={onToggleOrientation}>
                <Ionicons
                    name={isHorizontalMode ? "phone-portrait-outline" : "phone-landscape-outline"}
                    size={24}
                    color={isHorizontalMode ? Colors.primary : "#FFFFFF"}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TeleprompterHeader;
