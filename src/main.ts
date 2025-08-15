import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import express, { Request, Response } from "express";
import si from "systeminformation";

let mainWindow: BrowserWindow;

function createWindow() {
  const server = express();

  // This was made to serve an Angular SPA on the directory ./../test-app/dist/test-app/browser (Angular default build folder)
  const distPath = path.join(
    __dirname,
    "..",
    "test-app",
    "dist",
    "test-app",
    "browser"
  );
  server.use(express.static(distPath)); // Serves static files from distPath

  server.get(/^(?!\/api).*/, (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  }); // returns index.html in case Angular's Routing Module is used

  // creates a localhost:RANDOM_PORT Server just to be able to save cookies normally
  const listener = server.listen(0, () => {
    const port = (listener.address() as any).port;
    console.log(`Angular Server running on http://localhost:${port}`);

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 700,
      icon: path.join(__dirname, "assets", "icon.ico"),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    mainWindow.loadURL(`http://localhost:${port}`);
  });
}

ipcMain.handle("get-cpu", async () => {
  // async handler to get CPU's load
  const cpu = await si.currentLoad();
  return cpu;
});

ipcMain.handle("get-ram", async () => {
  // same for memory
  const mem = await si.mem();
  return {
    total: mem.total,
    used: mem.active,
    free: mem.available,
  };
});

app.on("ready", createWindow); // starts the app (shows the window)
