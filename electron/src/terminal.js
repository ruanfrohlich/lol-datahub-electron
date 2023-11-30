const { exec } = require('child_process');

class Terminal {
  
  /**
   * Retrieves the League of Legends process information.
   *
   * @return {Promise} A promise that resolves with an object containing the appPort and authToken.
   */
  static getLeagueOfLegendsProccessInfo() {
    return new Promise((resolve, reject) => {
      exec("wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline", (error, stdout, stderr) => {
        if (error) {
            reject(`Erro: ${error}`);
            return;
        }
        if (stderr) {
            reject(`Erro no stderr: ${stderr}`);
            return;
        }

        const appPortRegex = /--app-port=([0-9]*)/;
        const authTokenRegex = /--remoting-auth-token=([\w-]*)/;

        const appPortMatch = stdout.match(appPortRegex);
        const authTokenMatch = stdout.match(authTokenRegex);

        resolve({
          appPort: appPortMatch ? appPortMatch[1] : undefined,
          authToken: authTokenMatch ? authTokenMatch[1] : undefined,
        });
      });
    });
  }
}

module.exports = Terminal;