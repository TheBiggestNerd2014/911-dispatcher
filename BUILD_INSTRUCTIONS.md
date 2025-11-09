# Building 911: Dispatcher Desktop Application

## Quick Start

1. **Install Node.js** (if you haven't already):
   - Download from https://nodejs.org/
   - Version 18 or higher required

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run in Development**:
   ```bash
   npm start
   ```

4. **Build Windows .exe**:
   ```bash
   npm run build
   ```

## Detailed Build Instructions

### First Time Setup

1. Open a terminal/command prompt in the game directory
2. Run: `npm install`
   - This will download Electron and electron-builder (~300MB)
   - Takes 2-5 minutes depending on your internet speed

### Testing During Development

```bash
npm start
```

This opens the game in Electron without building an installer. Perfect for testing changes!

### Building the Installer

```bash
npm run build
```

**What happens:**
1. electron-builder packages your game
2. Creates Windows installer (NSIS format)
3. Output goes to `dist/` folder
4. Look for: `911 Dispatcher Setup X.X.X.exe`

**Build time:** 2-5 minutes

**Output size:** ~150-200 MB (includes Electron runtime)

### Building for Multiple Platforms

```bash
npm run build-all
```

Builds for:
- Windows (.exe installer)
- macOS (.dmg disk image)
- Linux (.AppImage)

**Note:** Some platforms require specific OS to build (e.g., macOS .dmg needs macOS)

## Distribution

After building, share the installer from `dist/`:
- `911 Dispatcher Setup X.X.X.exe` - Windows installer
- Users run this to install the game
- No other files needed!

## Save Game Location

When users install your game, saves are stored in:
- **Windows**: `C:\Users\[Username]\AppData\Roaming\911-dispatcher\saves\`
- **macOS**: `~/Library/Application Support/911-dispatcher/saves/`
- **Linux**: `~/.config/911-dispatcher/saves/`

## Troubleshooting

### "npm not found"
- Install Node.js from nodejs.org
- Restart your terminal after installing

### "electron-builder failed"
- Make sure you have at least 2GB free disk space
- Try: `npm cache clean --force` then `npm install` again

### Build is slow
- First build downloads dependencies (~300MB)
- Subsequent builds are much faster
- Consider using `npm start` for testing instead

### Can't find the .exe
- Check the `dist/` folder
- File name: `911 Dispatcher Setup X.X.X.exe`
- If missing, check terminal for error messages

## File Sizes

- **Development (`node_modules/`)**: ~300MB
- **Built installer**: ~150-200MB
- **Installed game**: ~200-250MB
- **Single save file**: ~1KB

## Advanced Configuration

Edit `package.json` to customize:
- App name: `"productName": "911 Dispatcher"`
- Version: `"version": "1.0.0"`
- Icon: `"icon": "logo.png"`
- Build targets: See `"build"` section

## Need Help?

Common issues:
1. Make sure Node.js is installed
2. Run `npm install` first
3. Use `npm start` to test before building
4. Check `dist/` folder for output files

For more info on electron-builder: https://www.electron.build/

