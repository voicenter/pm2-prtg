const pm2 = require('pm2');
const io = require('@pm2/io');

let lastTimeChecked = Date.now();

const getProcesses = () => {
  return new Promise((resolve, reject) => {
    pm2.list((err, resp) => {
      if (err) reject(err);
      pm2.disconnect();
      resolve(resp);
    })
  })
}

const getProcess = async id_or_name => {
  const processes = await getProcesses();
  switch (typeof id_or_name) {
    case 'number':
      return processes.filter(e => e.pm_id === id_or_name)[0];
    case 'string':
      return processes.filter(e => e.name === id_or_name)[0];
  }
}

const getSanitizedProсessData = prs => {
  const obj = {
    id: prs.pm_id,
    name: prs.name,
    pid: prs.pid,
    created_at: prs.pm2_env.created_at,
    uptime: Date.now() - prs.pm2_env.created_at,
    last_time_checked: ~~((Date.now() - lastTimeChecked) / 1000)
  }
  lastTimeChecked = Date.now();
  return obj;
}

const successCounter = io.counter({ name: 'successCounter' });
const errorCounter = io.counter({ name: 'errorCounter' });

/**
 * provide id (as number) or name (as string) of process
 * @param {number | string} id_or_name
 */
module.exports = async id_or_name => {
  const process = await getProcess(id_or_name);
  if (!process) throw new Error('no such pm2 process found!');
  return {
    data: process,
    sanitizedData: getSanitizedProсessData(process),
    successCounter,
    errorCounter,
    async update() {
      this.data = await getProcess(this.sanitizedData.id);
      this.sanitizedData = getSanitizedProсessData(this.data);
    }
  }
}
