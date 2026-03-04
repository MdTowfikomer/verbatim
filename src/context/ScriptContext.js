import React, { createContext, useState, useContext, useEffect } from 'react';
import { getScripts, saveScripts, getRecordings, saveRecordings } from '../utils/storage';
import { formatDate, formatTime } from '../utils/text';

const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
    const [scripts, setScripts] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const storedScripts = await getScripts();
            const storedRecordings = await getRecordings();

            if (storedScripts) {
                setScripts(storedScripts);
            } else {
                setScripts([
                    {
                        id: '1',
                        title: 'Welcome to Verbatim',
                        wordCount: 54,
                        time: '12:00 PM',
                        date: new Date().toLocaleDateString(),
                        content: 'Verbatim is a powerful teleprompter app for Android that allows users to display and auto-scroll scripts on-screen while recording or speaking, ensuring smooth and confident delivery. With customizable text settings, mirroring support, Picture-in-Picture mode, and professional recording features, it is ideal for content creators, live streamers, presenters, and anyone who wants polished, eye-contact–friendly speech.'
                    }
                ]);
            }

            if (storedRecordings) {
                setRecordings(storedRecordings);
            }
            setIsLoaded(true);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            saveScripts(scripts);
        }
    }, [scripts, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            saveRecordings(recordings);
        }
    }, [recordings, isLoaded]);

    const addScript = (script) => {
        const newScript = {
            ...script,
            id: script.id || Date.now().toString(),
        };
        setScripts(prevScripts => [newScript, ...prevScripts]);
    };

    const addRecording = (recording) => {
        const now = new Date();
        const newRecording = {
            ...recording,
            id: Date.now().toString(),
            date: formatDate(now),
            time: formatTime(now)
        };
        setRecordings(prev => [newRecording, ...prev]);
    };


    const editScript = (id, updatedScript) => {
        setScripts(prevScripts => prevScripts.map(script =>
            script.id === id ? { ...script, ...updatedScript } : script
        ));
    };

    const deleteScript = (id) => {
        setScripts(prevScripts => prevScripts.filter(script => script.id !== id));
    };

    const deleteRecording = (id) => {
        setRecordings(prevRecordings => prevRecordings.filter(rec => rec.id !== id));
    };

    return (
        <ScriptContext.Provider value={{ scripts, addScript, editScript, deleteScript, recordings, addRecording, deleteRecording }}>
            {children}
        </ScriptContext.Provider>
    );
};

export const useScripts = () => {
    return useContext(ScriptContext);
};

