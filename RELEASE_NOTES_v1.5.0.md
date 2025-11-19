# 911 Dispatcher - Version 1.5.0 Release Notes

**Release Date:** November 19, 2025

## 🎉 Major Features

### 🔊 Audio Enhancements
- **Typewriter Sound Effects**: Authentic typewriter sounds now play as caller dialogue appears on screen, creating an immersive 911 dispatch experience
- **Telephone Ring Sound**: Realistic phone ringing when incoming calls arrive, loops until answered
- **Dispatcher Greeting Audio**: Professional "911, what is your emergency?" voice line plays when answering calls
- **Sound Effects Volume Control**: Adjust all sound effects independently from music in the new Settings menu

### ⚙️ Settings System
A comprehensive settings menu has been added to the main menu with the following options:
- **🎵 Music Volume**: Independent volume control for background music (0-100%)
- **🔊 Sound Effects Volume**: Control volume for typewriter, phone ring, and voice effects (0-100%)
- **⌨️ Typing Speed**: Choose between Fast (40ms), Normal (80ms), or Slow (120ms) character speeds
- **⏱️ Skip Loading Screen**: Toggle to bypass the 15-second loading screen on startup
- **Settings Persistence**: All settings are automatically saved and restored between sessions using localStorage

### ⏰ Time-Based Scoring System
Performance is now tracked in real-time with penalties for slow response:

#### Phone Pickup Penalties
- **Grace Period**: 3 seconds to answer incoming calls
- **Penalty**: -5 points deducted every second after the grace period
- **Real-Time Feedback**: Watch your score decrease in the HUD if you're too slow
- **Notification**: "Slow pickup! Points deducted!" message appears if you take too long

#### Question Response Penalties
- **Grace Period**: 10 seconds to ask follow-up questions or dispatch units
- **Penalty**: -3 points per second after the grace period
- **Smart Timing**: Timer resets after each question asked
- **Exemption**: "Stay calm, help is on the way" option doesn't trigger penalties

### 🎮 Improved User Experience

#### Enhanced Call System
- **Realistic Dispatcher Greeting**: "911, what is your emergency?" appears instantly (no typing animation) with voice audio
- **Improved Typing Animation**: Caller dialogue types out at a more realistic pace with 500ms pauses after each sentence
- **Phone State Management**: Phone can only be picked up when actively ringing, preventing accidental clicks

#### UI/UX Improvements
- **Custom In-Game Modals**: All browser alerts and confirms replaced with themed, immersive in-game dialogs
  - Save system warnings
  - Delete confirmations
  - Quit game confirmation
- **Skip Loading Button**: Press "SKIP ⏩" during the loading screen to jump straight to the menu
- **Auto-Skip Loading**: Enable in settings to always bypass the loading screen

#### Navigation
- **Quit Game Button**: New red-themed exit button on main menu with confirmation dialog
- **Proper Electron Integration**: Cleanly quits the application when running as desktop app

## 🔧 Technical Improvements

### Performance
- **Smooth Music Fading**: Replaced interval-based fading with `requestAnimationFrame` for stutter-free audio transitions
- **Easing Curves**: Fade-in uses ease-in curve, fade-out uses ease-out curve for professional audio mixing

### Code Quality
- **Score Protection**: Score can never go below 0, preventing negative values
- **Settings Architecture**: Modular settings system with validation and defaults
- **Audio Management**: Proper cleanup of audio resources and penalty timers
- **Typing Speed Integration**: Settings now properly control all typing animations

## 🎨 Visual Updates
- **Custom Modal Styling**: Green-glowing borders and smooth bounce animations matching the dispatcher aesthetic
- **Quit Button Styling**: Red-themed button with hover effects to clearly indicate exit action
- **Settings Menu Design**: Clean, organized layout with sliders, toggles, and dropdowns
- **Skip Button**: Yellow-themed button on loading screen with hover effects

## 📊 Gameplay Balance
- **Pickup Penalty**: More aggressive timing (3 seconds grace period) encourages faster emergency response
- **Question Penalty**: 10 second grace period provides time to read caller information while maintaining urgency
- **Score Floor**: Score cannot go negative, ensuring fair gameplay
- **Continuous Deduction**: Real-time point loss creates tension and urgency

## 🐛 Bug Fixes
- Fixed music stuttering during fade-out transitions
- Fixed typing speed not respecting user settings
- Fixed dispatcher greeting playing typewriter sounds inappropriately
- Fixed phone being pickable when not ringing
- Fixed penalty timers not clearing properly on call end

## 🎯 Known Issues
None reported for this version.

## 📝 Notes for Players
- **Recommended Settings**: Start with Normal typing speed and default volumes for the intended experience
- **Quick Start**: Enable "Skip Loading Screen" in settings if you play frequently
- **Challenge Mode**: Try Fast typing speed for a more difficult experience
- **Accessibility**: Slow typing speed available for players who need more time to read

## 🔜 Coming Soon
Have suggestions? Let us know what features you'd like to see in future updates!

---

**Installation**: 
- Desktop version: Run the installer and launch the game
- Web version: Simply load index.html in your browser

**System Requirements**:
- Windows 10/11, macOS 10.14+, or modern Linux
- Chrome/Edge/Firefox (latest versions)
- Audio output device recommended for full experience

**Save Game Compatibility**: 
Saves from v1.0.0 are compatible with v1.5.0

---

*Thank you for playing 911: Dispatcher! Stay sharp, dispatcher.*

