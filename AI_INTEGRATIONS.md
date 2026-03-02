# AI Integration Roadmap: VerbAtim Teleprompter

Integrating AI into VerbAtim will transform it from a manual tool into an intelligent assistant, making it highly competitive in the creator economy market (YouTube, TikTok, LinkedIn).

---

## 🚀 1. AI Script Generation & Refinement (Phase 1)
Help users overcome "writer's block" by generating scripts directly within the app.

- **AI Topic-to-Script**: User enters a topic (e.g., "Benefits of Coffee"), and AI generates a structured 60-second script.
- **Tone Transformer**: Change the tone of a pasted script (e.g., "Make it more professional" or "Make it funny/Gen-Z style").
- **Script Summarizer**: Automatically shorten long articles into concise teleprompter-friendly bullet points.
- **Implementation**: Use **OpenAI (GPT-4o)** or **Google Gemini API** via a simple backend or Edge functions.

---

## 🎙️ 2. Smart Scroll: Voice-to-Text Sync (Phase 2)
The "Holy Grail" of teleprompters. The script should only scroll as the user speaks.

- **Voice-Follow Scrolling**: Instead of a fixed speed (1x, 2x), the AI listens to the microphone and advances the text only when the user says the words on screen.
- **Auto-Pause**: If the user stops to take a sip of water or goes off-script, the prompter pauses automatically.
- **Implementation**: Use **Whisper (OpenAI)** or **Google Cloud Speech-to-Text** for real-time transcription and string matching.

---

## 🎬 3. Post-Production & Branding (Phase 3)
Add value after the recording is finished to save the user hours of editing.

- **AI Auto-Captions**: Automatically burn subtitles into the recorded video with 99% accuracy.
- **Filler Word Removal**: Automatically detect and "jump-cut" out "umms," "ahhs," and long silences from the final video.
- **Eye-Contact Correction**: A deep-learning model that adjusts the user's pupils in the video to make it look like they are looking directly at the camera, even if they were reading the script.
- **Implementation**: **Captions.ai API** or **MediaPipe** for eye tracking.

---

## 📊 4. AI Speaking Coach (Analytics)
Help users become better public speakers.

- **Pace Analysis**: AI tells the user if they are speaking too fast (e.g., "You averaged 160 WPM, try to slow down to 130").
- **Sentiment Analysis**: Analyze the user's facial expressions during recording to ensure they look "approachable" or "energetic."
- **Confidence Score**: Provide a score based on fluency and eye contact frequency.
- **Implementation**: **Amazon Rekognition** for emotion or custom **TensorFlow.js** models for WPM calculation.

---

## 🌍 5. Intelligent Translation & Dubbing
Expand the user's reach to a global audience.

- **Instant Translation**: Translate a script into 50+ languages while maintaining the original meaning.
- **AI Dubbing**: If a user records in English, AI can overlay their voice in Spanish, matching their original tone and pitch.
- **Implementation**: **ElevenLabs API** for voice cloning and dubbing.

---

## 🛠️ Recommended MVP AI Feature
For the first AI integration, I recommend **AI Script Generation**. It is the easiest to implement and provides immediate value to users who don't know what to talk about.

**Tech Stack Suggestion:**
- **LLM**: Google Gemini Flash 1.5 (Fast and cheap).
- **Integration**: A simple `npx expo install axios` to call the API from the "Add Script" screen.
