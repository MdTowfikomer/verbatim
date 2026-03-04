import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    SCRIPTS: '@verbatim_scripts',
    RECORDINGS: '@verbatim_recordings',
};

export const getScripts = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.SCRIPTS);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to get scripts from storage', e);
        return null;
    }
};

export const saveScripts = async (scripts) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
    } catch (e) {
        console.error('Failed to save scripts to storage', e);
    }
};

export const getRecordings = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.RECORDINGS);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to get recordings from storage', e);
        return null;
    }
};

export const saveRecordings = async (recordings) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings));
    } catch (e) {
        console.error('Failed to save recordings to storage', e);
    }
};
