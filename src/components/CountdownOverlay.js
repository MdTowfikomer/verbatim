import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CountdownOverlay = ({ countdown }) => {
    if (countdown === null) return null;

    return (
        <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    countdownOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    countdownText: {
        color: '#FFFFFF',
        fontSize: 120,
        fontWeight: 'bold',
    },
});

export default CountdownOverlay;
