class Utils {
  /**
   * Closes the OSX app if the current platform is not 'darwin'.
   *
   * @return {void}
   */
  static closeOSXApp() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
}

module.exports = Utils