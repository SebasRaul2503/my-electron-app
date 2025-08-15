import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getCpu: () => ipcRenderer.invoke("get-cpu"),
  getRam: () => ipcRenderer.invoke("get-ram"),
});
