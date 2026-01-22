const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(require('os').homedir(), 'timesheet-data.json');

// Helper function to read data
function readData() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading data:', error);
  }
  return {};
}

// Helper function to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => readData(),
  saveData: (data) => writeData(data),
  getDataPath: () => dataPath
});

