# My Electron App – Angular + Electron + Express + System Monitor

**Author:** [SebasRaul2503](https://github.com/SebasRaul2503)
**License:** MIT

Desktop application built with **Electron**, **Angular**, and **Express** that displays real-time CPU and RAM usage.

---

## Project Structure

```
.
├── src/                # Electron source code (main.ts, preload.ts, etc.)
│   ├── assets/          # Resources such as icons, images, etc.
│   └── main.ts          # Electron main process
│
├── test-app/           # Angular project (SPA)
│   ├── src/
│   └── angular.json
│
├── dist/               # Compiled Electron code (generated after build)
└── package.json
```

---

## 📋 Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Angular 17 CLI** installed globally:

  ```bash
  npm install -g @angular/cli@17
  ```

- **Windows** (the copy script uses `xcopy`; for other OS, replace it with `cp` or use [`cpx`](https://www.npmjs.com/package/cpx)).

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SebasRaul2503/my-electron-app.git
   cd my-electron-app
   ```

2. **Install project dependencies (Main Project and Angular)**

   ```bash
   npm run install:all
   ```

---

## Available Scripts

From the project root:

| Script                   | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `npm run install:all`    | Install all project dependencies                                      |
| `npm run build:frontend` | Builds the Angular project (`test-app/dist/test-app/browser`)         |
| `npm run copy-assets`    | Copies `src/assets` into `dist/assets`                                |
| `npm run build:electron` | Compiles Electron TypeScript, copies assets, and builds the frontend  |
| `npm run start:electron` | Starts the Electron app using the existing build                      |
| `npm start`              | **(Recommended)** Builds everything and starts the app in one command |

---

## Technical Notes

- The embedded **Express server** serves the Angular build from `dist/test-app/browser`.
- IPC endpoints (`get-cpu` and `get-ram`) use [`systeminformation`](https://www.npmjs.com/package/systeminformation) to fetch system metrics.
- The **HTTP port** is chosen randomly (`listen(0)`) to avoid conflicts with other processes.
- **Assets** are manually copied to `dist/assets` so they are available when packaging.
- For production, it is recommended to set `contextIsolation`, `nodeIntegration: false`, and use a Content Security Policy for better security.
