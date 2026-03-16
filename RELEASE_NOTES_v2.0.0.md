# 911: Dispatcher — Release Notes v2.0.0

## 🎙️ Immersive Mode (Voice Calls)

- **New main menu toggle** — Turn on Immersive Mode to hear callers speak with text-to-speech
- **Distressed voice effect** — TTS uses faster rate and higher pitch to simulate panic and urgency
- **No typewriter sound** — When Immersive Mode is on, the typewriter click is disabled so you only hear the voice
- Toggle is on the main menu (not in Settings) for quick access

## 💾 Save Code System

- **Replaced file-based saves** with a compact save code
- **7-character format** — Each character encodes game data (version, score, calls completed, correct dispatches, total dispatches)
- **Copy & paste** — Save your code to clipboard, paste it later to load
- **Works everywhere** — No file system access needed; works in browser and desktop
- **Shareable** — Send codes to friends or back up in notes

## 🐛 Fixes & Improvements

- Bumped TTS pitch and rate (1.35) for a more urgent, distressed caller voice
- Removed dependency on Electron file APIs for saving

---

*911: Dispatcher v2.0.0 — March 2025*
