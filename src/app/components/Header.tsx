import React from "react";
import { ipcRenderer as ipc } from "electron";

export default function Header() {
  const reloadWindow = () => {
    ipc.invoke("reloadWindow");
  };

  const maxWindow = () => {
    ipc.invoke("maximizeWindow");
  };

  const minWindow = () => {
    ipc.invoke("minimizeWindow");
  };

  const quitApp = () => {
    ipc.invoke("quitApp");
  };

  return (
    <header>
      <div className="header-container">
        <div className="nav-button-row">
          <button className="nav-button" type="button" onClick={reloadWindow}>
            <i className="fas fa-redo"></i>
          </button>
          <button className="nav-button" type="button" onClick={minWindow}>
            <i className="fas fa-window-minimize"></i>
          </button>
          <button className="nav-button" type="button" onClick={maxWindow}>
            <i className="far fa-window-maximize"></i>
          </button>
          <button className="nav-button" onClick={quitApp}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
