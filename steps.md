1. Install the Tauri CLI from the project root:
	```bash
	npm install --save-dev @tauri-apps/cli
	```
	This adds the CLI to `package.json` and installs the project dependencies.
2. Initialize the Tauri application:
	```bash
	npx tauri init --app-name "tauri-addition" --window-title "tauri-addition" --frontend-dist "../dist" --dev-url "http://localhost:5173" --before-dev-command "npm run dev" --before-build-command "npm run build"
	```
3. Generate the app icons. Put `app-icon.png` in the project root, alongside the `src` directory, then run:
	```bash
	npx tauri icon ./app-icon.png
	```
4. Apply the Tauri project configuration edits:
	Copy the following code into `src-tauri/tauri.conf.json`:
	```json
	{
	  "$schema": "../node_modules/@tauri-apps/cli/config.schema.json",
	  "productName": "Masar",
	  "version": "0.1.0",
	  "identifier": "com.tauri-testing.dev",
	  "build": {
	    "frontendDist": "../dist",
	    "devUrl": "http://localhost:5174",
	    "beforeDevCommand": "npm run dev",
	    "beforeBuildCommand": "npm run build"
	  },
	  "app": {
	    "windows": [
	      {
	        "title": "Masar - مسار",
	        "resizable": true,
	        "maximized": true,
	        "fullscreen": false,
	        "devtools": true
	      }
	    ],
	    "security": {
	      "csp": null
	    }
	  },
	  "bundle": {
	    "active": true,
	    "targets": "all",
	    "icon": [
	      "icons/32x32.png",
	      "icons/128x128.png",
	      "icons/128x128@2x.png",
	      "icons/icon.icns",
	      "icons/icon.ico"
	    ],
	    "android": {
	      "debugApplicationIdSuffix": ".debug"
	    }
	  }
	}
	```
	Copy the following code into `src-tauri/Cargo.toml`:
	```toml
	[package]
	name = "app"
	version = "0.1.0"
	description = "A Tauri App"
	authors = ["you"]
	license = ""
	repository = ""
	edition = "2024"
	rust-version = "1.90"

	[lib]
	name = "app_lib"
	crate-type = ["staticlib", "cdylib", "rlib"]

	[build-dependencies]
	tauri-build = { version = "2.7.0", features = [] }

	[dependencies]
	serde_json = "1.0"
	serde = { version = "1.0", features = ["derive"] }
	log = "0.4"
	tauri-plugin-log = "2"
	tauri = { version = "2.12.0", features = ["devtools"] }
	```
5. Add a build script to `package.json`:
    ```json
    "tauri:build": "tauri build"
    ```
6. Run the GitHub Actions workflow to build the application:
Push the project to GitHub, then open the repository's **Actions** tab and run the application build workflow. When it completes, download the generated application installers from the workflow run's artifacts.