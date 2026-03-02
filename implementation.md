# Implementation Roadmap: VerbAtim Teleprompter

This document provides a comprehensive analysis of the current codebase and a structured plan to transform VerbAtim into a fully functional, professional teleprompter application.

---

## 🔍 Codebase Analysis

### 1. Current Architecture
- **Framework**: React Native (Expo SDK 54).
- **Navigation**: `@react-navigation/native` with a Bottom Tab layout (Scripts & Recordings) and a Stack for overlays (Add Script, Teleprompter).
- **State Management**: React Context (`ScriptContext.js`) for global script handling.
- **UI/UX**: Custom styled components using a centralized `Colors.js` constant. Icons provided by `@expo/vector-icons (Ionicons)`.

### 2. Implemented Features ✅
- **Script Management**: 
    - List view for saved scripts.
    - Functional "Add Script" screen with title and content input.
- **Professional Teleprompter Engine**:
    - **Camera Integration**: Live front/back camera feed using `expo-camera`.
    - **Auto-Scroll**: Smooth 60fps scrolling engine using `requestAnimationFrame`.
    - **Draggable Resize**: "TextArea-style" draggable handle to dynamically resize the script overlay.
    - **Speed Control**: Real-time scrolling speed adjustment (0.5x to 5x).
    - **Safe Area Support**: Optimized for notched and "island" displays.

---

## 🛠 Features to Implement (Prioritized)

### Phase 1: Core Functionality & Persistence
| Feature | Description | Implementation Detail |
| :--- | :--- | :--- |
| **Data Persistence** | Keep scripts after app close. | Integrate `@react-native-async-storage/async-storage` into `ScriptContext.js`. |
| **Video Recording** | Actually save the camera feed. | Use `CameraView.recordAsync()` to save `.mp4` files to device storage. |
| **Recording Gallery** | View previous recordings. | Implement a list in `RecordingsScreen.js` that reads from the app's document directory. |
| **Script Deletion** | Remove unwanted scripts. | Add a "Delete" function to the `ScriptContext`. |

### Phase 2: Professional Customization
| Feature | Description | Implementation Detail |
| :--- | :--- | :--- |
| **Text Styling** | User-adjustable font size & colors. | Add a "Style" menu to `TeleprompterScreen` to adjust `fontSize` and `lineHeight`. |
| **Mirror Mode** | Flip text for physical rigs. | Apply a CSS transform `scaleX(-1)` to the `ScrollView` or `Text` component. |
| **Countdown Timer** | 3-2-1 timer before scroll starts. | Simple overlay state that triggers the `isPlaying` state after 3 seconds. |

### Phase 3: Advanced Features
| Feature | Description | Implementation Detail |
| :--- | :--- | :--- |
| **PiP Mode** | Use prompter over other apps. | Use `expo-video` or native Android PiP modules for overlay support. |
| **Voice Activation** | Scroll based on voice detection. | (Experimental) Integrate Speech-to-Text to sync scroll speed with speech. |
| **Premium Tier** | Monetization. | Integrate `react-native-purchases` (RevenueCat) for subscriptions. |

---

## 🚀 How to Make the App Fully Functional

### 1. Enable Data Persistence
Currently, scripts disappear when you reload.
- **Action**: Run `npx expo install @react-native-async-storage/async-storage`.
- **Logic**: Update `ScriptContext.js` to `useEffect` load data on mount and `save` data whenever `scripts` state changes.

### 2. Activate the Record Button
The big orange button in `TeleprompterScreen` needs logic.
- **Action**: Use the `cameraRef` to call `recordAsync()`.
- **Logic**: 
    - Start recording when the button is pressed.
    - Stop and save the URI to the `Recordings` list when pressed again.

### 3. Implement Mirroring
Essential for professional "glass" teleprompters.
- **Action**: Add a toggle in the bottom controls.
- **Logic**: 
  ```javascript
  <Animated.View style={{ transform: [{ scaleX: isMirrored ? -1 : 1 }] }}>
     <Text>...</Text>
  </Animated.View>
  ```

### 4. Refine the "Scripts" UI
Add "Edit" and "Delete" buttons to the `ScriptCard` to give users full control over their library.

---

**VerbAtim** is currently a strong prototype. By following this roadmap, it will become a market-ready tool for creators.
