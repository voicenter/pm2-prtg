const exec = require("util").promisify(require("child_process").exec);

/**@returns {Promise<any[]>} */
exports.getProcesses = () => exec("pm2 jlist").then(({ stdout }) => JSON.parse(stdout));

exports.getProcess = id_or_name => this.getProcesses().then(processes => {
  switch (typeof id_or_name) {
    case 'number':
      return processes.find(e => e.pm_id === id_or_name);
    case 'string':
      return processes.find(e => e.name === id_or_name);
  }
});
