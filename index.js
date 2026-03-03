import { registerRootComponent } from 'expo';
import { BackHandler } from 'react-native';

// Polyfill BackHandler.removeEventListener for newer React Native versions
if (BackHandler && !BackHandler.removeEventListener) {
    BackHandler.removeEventListener = (eventName, handler) => {
        // In newer versions, addEventListener returns a subscription with a .remove() method.
        // This polyfill is a no-op to prevent crashes in libraries like react-native-modal.
    };
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
