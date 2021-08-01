const { app, BrowserWindow } = require("electron");
require("dotenv").config();
const { ipcMain } = require("electron");

// Keep a reference for dev mode
let dev = false;

let win = BrowserWindow;

if (
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

const path = require("path");
const url = require("url");

function createWindow() {
  win = new BrowserWindow({
    backgroundColor: "white",
    transparent: true,
    frame: false,
    minWidth: 600,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  let indexPath;

  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  win.loadURL(indexPath);

  // Open the DevTools.
  //win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  require("./src/services/sqlservice");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const reloadWindow = () => {
  win.reload();
};

ipcMain.handle("reloadWindow", reloadWindow);

const minimizeWindow = () => {
  win.minimize();
};

ipcMain.handle("minimizeWindow", minimizeWindow);

const maximizeWindow = () => {
  win.maximize();
};

ipcMain.handle("maximizeWindow", maximizeWindow);

const quitApp = () => {
  app.quit();
};

ipcMain.handle("quitApp", quitApp);
