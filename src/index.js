const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    maxWidth: 1000,
    maxHeight: 700,
    minWidth: 700,
    minHeight: 500,
    // frame: false,//关闭原生导航栏
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/html/index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

Menu.setApplicationMenu(null);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log("----1 退出quit。。。。")
    app.quit()
  } else {
    console.log("----2 退出else  quit。。。。")
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log("----3 创建窗口crete。。。。")
    createWindow()
  } else {
    console.log("----4 否则输出else。。。。")
  }
})
