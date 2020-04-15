require('./types');
const pm2 = require('pm2');
const io = require('@pm2/io');

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

/**
 * @param {number | string} idOrName - provide id (as number) or name (as string) of process
 * @param {Config} [config] - configuration of handler
 */
module.exports = async (idOrName, config = {}) => {
  const process = await getProcess(idOrName);
  if (!process) throw new Error('no such pm2 process found!');
  const processHandler = {
    lastTimeChecked: Date.now(),
    getSanitizedProсessData(prs) {
      const obj = {
        id: prs.pm_id,
        name: prs.name,
        pid: prs.pid,
        created_at: prs.pm2_env.created_at,
        uptime: Date.now() - prs.pm2_env.created_at,
        last_time_checked: ~~((Date.now() - this.lastTimeChecked) / 1000)
      }
      this.lastTimeChecked = Date.now();
      return obj;
    },
    data: process,
    fields: {},
    counters: {
      successCounter: io.counter({ name: 'successCounter' }),
      errorCounter: io.counter({ name: 'errorCounter' })
    },
    setField(name, val) {
      this.fields[name] = val;
    },
    getField(name) {
      if (this.fields[name] === undefined) throw new Error('field doesn\'t exist!');
      return this.fields[name]
    },
    incrementCounter(name) {
      if (!this.counters[name]) throw new Error('counter doesn\'n exist!');
      this.counters[name].inc();
    },
    getCounterValue(name) {
      if (!this.counters[name]) throw new Error('counter doesn\'n exist!');
      return this.counters[name].val();
    },
    addCounter(name) {
      this.counters[name] = io.counter({ name });
    },
    listAllCounters() {
      const obj = {}
      Object.entries(this.counters).forEach(e => {
        const [key, val] = e;
        obj[key] = val.val();
      });
      return obj;
    },
    getSanitizedData() {
      let data = this.getSanitizedProсessData(process);
      data = { ...data, ...this.fields, ...this.listAllCounters() }

      return data;
    },
    async update() {
      this.data = await getProcess(this.data.pm_id)
    },
    getPrtgObject() {
      let result = [];
      Object.entries(this.getSanitizedData()).forEach(el => {
        const [channel, value] = el;
        result.push({ channel, value })
      });
      return {
        prtg: {
          result
        }
      }
    }
  }

  const { counters } = config;
  if (counters && Array.isArray(counters) && counters.length > 0) {
    counters.forEach(e => {
      if (typeof e === 'string') processHandler.addCounter(e);
    })
  }

  const { fields } = config;
  if (fields && typeof fields === 'object' && !Array.isArray(fields))
    processHandler.fields = fields;

  return processHandler;
}
