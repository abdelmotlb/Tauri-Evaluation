# Steps to Work With Electron
Two parts: development and production build steps.
## Development Build

1. Install the normal project dependencies and add Electron tooling for dev/production:
   ```bash
   npm install
   npm install --save-dev electron
   npm install --save-dev electron-builder
   ```
   This keeps the project dependencies normal, adds Electron for development, and adds `electron-builder` for packaging the final app.

2. Create an `electron.cjs` file in the project root and add the startup code below:

   ```js
   // electron.cjs
   const { app, BrowserWindow } = require('electron');
   const path = require('path');

   function createWindow() {
     const win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         nodeIntegration: false,
         contextIsolation: true
       }
     });

     win.loadFile('dist/index.html');
   }

   app.whenReady().then(createWindow);

   app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') app.quit();
   });

   app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) createWindow();
   });
   ```

3. Add the two required lines to the `scripts` section so the development process is ready:
   ```json
   "electron:dev": "vite build && electron electron.cjs"
   ```
   This script let you run the Electron app directly and build the Vite app before launching it. ONE TIME BUILD.

4. In your `vite.config.js` file, set the base path to relative assets so Electron can load the app correctly:
   ```js
   import { defineConfig } from 'vite';

   export default defineConfig({
     base: './'
   });
   ```
   This ensures the app uses relative asset paths when launched from the Electron window.

## Production Build

1. Add build attributes to `package.json` to configure electron-builder and set the main file:

   ```json
   "main": "electron.cjs",
   "build": {
     "appId": "com.example.app",
     "productName": "Adding Electron Manually",
     "files": [
       "dist/**/*",
       "electron.cjs",
       "preload.js"
     ],
     "directories": {
       "buildResources": "assets"
     }
   }
   ```

2. Add the `dist` script in `package.json` for packaging the final app:

   ```json
   "electron:prod": "vite build && electron-builder"
   ```

3. For the production app build/package step, run:

   ```bash
   npm run dist
   ```
