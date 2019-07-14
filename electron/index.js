const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen } = require('@capacitor/electron');

const path = require('path');
const fs = require('fs');

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = true;

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [{
    label: 'Options',
    submenu: [{
        label: 'Open Dev Tools',
        click() {
            mainWindow.openDevTools();
        },
    }, ],
}, ];

async function createWindow() {
    // Define our main window size
    mainWindow = new BrowserWindow({
        height: 920,
        width: 1600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
        }
    });

    if (isDevMode) {
        // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
        // If we are developers we might as well open the devtools by default.
        mainWindow.webContents.openDevTools();
    }

    if (useSplashScreen) {
        splashScreen = new CapacitorSplashScreen(mainWindow);
        splashScreen.init(false);
    } else {
        mainWindow.loadURL(`file://${__dirname}/app/index.html`);
        mainWindow.webContents.on('dom-ready', () => {
            mainWindow.show();
        });
    }
    ipcMain.on('request-save-document', (event, document) => {
        let documentJson = JSON.parse(document);
        fs.writeFile('./documents/' + documentJson.id + '.json', document, function(err) {
            event.sender.send('reponse-save-document', "The file was saved");
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    })
    ipcMain.on('request-read-document', (event, documentName) => {
        console.log("request-read-document", documentName)
        fs.readFile('./documents/' + documentName + '.json', function read(err, data) {
            event.sender.send('reponse-read-document', JSON.parse(data));
            // if (err) {
            //     throw err;
            // }
            // event.sender.send('reponse-document', data);
        });
    });
    ipcMain.on('request-read-document-list', (event, data) => {
        fs.readFile('./documents/documentList.json', function read(err, data) {
            let documentList = data;
            if (documentList) {
                documentList = JSON.parse(data);
            }
            event.sender.send('reponse-read-document-list', documentList);
        });
    });

    ipcMain.on('request-save-document-list', (event, documentList) => {
        console.log('ddddddddddddddddddddddddddd')
        fs.writeFile('./documents/documentList.json', documentList, function(err) {
            event.sender.send('response-save-document-list', "The file was saved");
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// Define any IPC or other custom functionality below here