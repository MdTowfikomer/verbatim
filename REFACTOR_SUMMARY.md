# Verbatim Refactor Summary

This document summarizes the architectural and code-level improvements made to the Verbatim codebase to enhance maintainability, readability, and scalability.

## 🎯 High-Level Goals
- **Decouple Business Logic from UI**: Move complex logic out of screens and into custom hooks and services.
- **Component Decomposition**: Break down large "God Components" into smaller, reusable pieces.
- **Centralized Utilities**: Create shared utilities for common tasks like storage and text formatting.
- **Dry (Don't Repeat Yourself)**: Eliminate code duplication across different screens.

## 🏗️ New Project Structure
The `src` directory has been reorganized into a modular structure:
```text
src/
├── components/     # Reusable UI components
├── constants/      # App-wide constants (Colors, etc.)
├── context/        # React Context for state management
├── hooks/          # Custom React hooks for business logic
├── navigation/     # Navigation configuration
├── screens/        # Main application screens
├── services/       # External API integrations (PDF extraction)
└── utils/          # Pure utility functions (Storage, Text)
```

## 🛠️ Key Refactor Targets

### 1. Teleprompter Logic (`src/screens/TeleprompterScreen.js`)
**Before**: A 500+ line file managing camera, auto-scroll, layout, orientation, and controls.
**After**: A clean container component using specialized hooks:
- `useAutoScroll`: Manages the `requestAnimationFrame` loop and scroll positioning.
- `useCameraRecording`: Handles camera permissions and the video recording lifecycle.
- `useTeleprompterLayout`: Manages orientation changes and the resizable pan-responder logic.
- **New Components**: Extracted `TeleprompterHeader`, `TeleprompterControls`, `TeleprompterOverlay`, and `CountdownOverlay`.

### 2. File Picking & PDF Processing (`src/navigation/TabNavigator.js`)
**Before**: `TabNavigator` contained 100+ lines of PDF extraction and file system logic.
**After**: 
- `src/hooks/useFilePicker.js`: Centralizes file selection and data mapping.
- `src/services/pdfService.js`: Isolate the `fetch` call to the PDF extraction API.
- `TabNavigator` now only handles navigation and calls `pickAndProcessFile()`.

### 3. Data Persistence (`src/context/ScriptContext.js`)
**Before**: `AsyncStorage` calls were interleaved with state management.
**After**:
- `src/utils/storage.js`: A dedicated utility for all CRUD operations on local storage.
- `ScriptContext` now focuses purely on state distribution across the app.

### 4. Text & Date Formatting
**Problem**: Date formatting and word counting were duplicated in `AddScriptScreen` and `TabNavigator`.
**Solution**:
- `src/utils/text.js`: Contains `getWordCount`, `formatDate`, and `formatTime` helpers used throughout the app.

### 5. Video Playback
**Solution**:
- Created `src/components/VideoPlaybackModal.js` to encapsulate the `expo-video` implementation, making `RecordingsScreen` much cleaner and easier to maintain.

## 🚀 Impact
- **Maintenance**: Changes to the recording logic only require editing `useCameraRecording` instead of hunting through a UI file.
- **Stability**: Centralized storage and text logic reduce the risk of inconsistent data formatting.
- **Performance**: Improved hook usage ensures more predictable re-renders.
- **Readability**: File sizes for main screens have been reduced by ~60%.
