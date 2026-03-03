import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Create the Context
const ScriptContext = createContext();

// 2. Create the Provider component
export const ScriptProvider = ({ children }) => {
    // Global state for our scripts. We start with an empty array.
    // We will load the saved scripts from AsyncStorage when the app starts.
    const [scripts, setScripts] = useState([]);

    // -- New State for Video Recordings --
    const [recordings, setRecordings] = useState([]);

    // Track if we have finished loading the initial data
    const [isLoaded, setIsLoaded] = useState(false);

    // Load scripts and recordings from device storage when the app first opens
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedScripts = await AsyncStorage.getItem('@verbatim_scripts');
                const storedRecordings = await AsyncStorage.getItem('@verbatim_recordings');

                if (storedScripts !== null) {
                    setScripts(JSON.parse(storedScripts));
                } else {
                    // If no scripts exist, load a demo script
                    setScripts([
                        {
                            id: '1',
                            title: 'Welcome to VerbAtim',
                            wordCount: 191,
                            time: '12:00 PM',
                            date: new Date().toLocaleDateString(),
                            content: 'VerbAtim is a powerful teleprompter app for Android that allows users to display and auto-scroll scripts on-screen while recording or speaking, ensuring smooth and confident delivery. With customizable text settings, mirroring support, Picture-in-Picture mode, and professional recording features, it is ideal for content creators, live streamers, presenters, and anyone who wants polished, eye-contact–friendly speech.'
                        }
                    ]);
                }

                if (storedRecordings !== null) {
                    setRecordings(JSON.parse(storedRecordings));
                }
            } catch (e) {
                console.error('Failed to load data from storage', e);
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, []);

    // Save scripts to device storage whenever the `scripts` array changes
    useEffect(() => {
        if (isLoaded) { // Only save after we've initially loaded, so we don't overwrite with []
            const saveScripts = async () => {
                try {
                    await AsyncStorage.setItem('@verbatim_scripts', JSON.stringify(scripts));
                } catch (e) {
                    console.error('Failed to save scripts to storage', e);
                }
            };
            saveScripts();
        }
    }, [scripts, isLoaded]);

    // Save recordings to device storage whenever the `recordings` array changes
    useEffect(() => {
        if (isLoaded) {
            const saveRecordings = async () => {
                try {
                    await AsyncStorage.setItem('@verbatim_recordings', JSON.stringify(recordings));
                } catch (e) {
                    console.error('Failed to save recordings to storage', e);
                }
            };
            saveRecordings();
        }
    }, [recordings, isLoaded]);

    // Function to add a new script to our global list
    const addScript = (script) => {
        // Generate a simple unique ID and add it to the beginning of the list
        const newScript = {
            ...script,
            id: Date.now().toString(),
        };
        setScripts(prevScripts => [newScript, ...prevScripts]);
    };

    // Function to add a new recording to our gallery
    const addRecording = (recording) => {
        const newRecording = {
            ...recording,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setRecordings(prev => [newRecording, ...prev]);
    };

    // Function to edit an existing script by ID
    const editScript = (id, updatedScript) => {
        setScripts(prevScripts => prevScripts.map(script =>
            script.id === id ? { ...script, ...updatedScript } : script
        ));
    };

    // Function to delete a script by ID
    const deleteScript = (id) => {
        setScripts(prevScripts => prevScripts.filter(script => script.id !== id));
    };

    // Function to delete a recording by ID
    const deleteRecording = (id) => {
        setRecordings(prevRecordings => prevRecordings.filter(rec => rec.id !== id));
    };

    return (
        <ScriptContext.Provider value={{ scripts, addScript, editScript, deleteScript, recordings, addRecording, deleteRecording }}>
            {children}
        </ScriptContext.Provider>
    );
};

// 3. Custom Hook for easy access in our components
export const useScripts = () => {
    return useContext(ScriptContext);
};
