const pm2 = require('pm2');

/**@returns {Promise<any[]>} */
exports.getProcesses = () => {
  return new Promise((resolve, reject) => {
    pm2.list((err, resp) => {
      if (err) reject(err);
      pm2.disconnect();
      resolve(resp);
    })
  })
}

exports.getProcess = async id_or_name => {
  const processes = await this.getProcesses();
  switch (typeof id_or_name) {
    case 'number':
      return processes.find(e => e.pm_id === id_or_name);
    case 'string':
      return processes.find(e => e.name === id_or_name);
  }
}
