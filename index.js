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
      successCounter: { value: io.counter({ name: 'successCounter' }), group: 'general' },
      errorCounter: { value: io.counter({ name: 'errorCounter' }), group: 'general' }
    },
    histograms: {},
    time_stamps: {},
    startTimer(name) {
      this.time_stamps[name] = Date.now();
    },
    getTimerValue(name) {
      const val = Date.now() - this.time_stamps[name];
      delete this.time_stamps[name];
      return val;
    },
    getHistogram(name) {
      return this.histograms[name].value.val();
    },
    addHistogram(name, group) {
      this.histograms[name] = { value: io.histogram({ name }) };
      if (group) this.histograms[name].group = group;
    },
    updateHistogram(name, value) {
      this.histograms[name].value.update(value);
    },
    setField(name, value, group = null) {
      this.fields[name] = { value };
      if (group) this.fields[name].group = group;
    },
    getField(name) {
      if (this.fields[name] === undefined) throw new Error('field doesn\'t exist!');
      return this.fields[name].value;
    },
    incrementCounter(name) {
      if (!this.counters[name]) throw new Error('counter doesn\'t exist!');
      this.counters[name].value.inc();
    },
    getCounterValue(name) {
      if (!this.counters[name]) throw new Error('counter doesn\'t exist!');
      return this.counters[name].value.val();
    },
    addCounter(name, group = null) {
      this.counters[name] = { value: io.counter({ name }) }
      if (group) this.counters[name].group = group;
    },
    listAllCounters(group = null) {
      const obj = {};
      Object.entries(this.counters).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        obj[key] = val.value.val();
      });
      return obj;
    },
    listAllFields(group = null) {
      const obj = {};
      Object.entries(this.fields).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        obj[key] = val.value;
      });
      return obj;
    },
    listAllHistograms(group = null) {
      const obj = {};
      Object.entries(this.histograms).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        obj[key] = val.value.val();
      });
      return obj;
    },
    getSanitizedData(group = null) {
      let data;
      if (!group || group.toLocaleLowerCase() === 'general') data = this.getSanitizedProсessData(process);
      data = {
        ...data,
        ...this.listAllFields(group),
        ...this.listAllCounters(group),
        ...this.listAllHistograms(group)
      }

      return data;
    },
    async update() {
      this.data = await getProcess(this.data.pm_id)
    },
    getPrtgObject(group = null) {
      let result = [];
      Object.entries(this.getSanitizedData(group)).forEach(el => {
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

  const { counters, fields, histogrms } = config;

  if (Array.isArray(counters))
    counters.forEach(e => {
      if (typeof e === 'string') processHandler.addCounter(e);
      else if (typeof e === 'object' && e.name) processHandler.addCounter(e.name, e.group);
    });

  if (Array.isArray(fields))
    fields.forEach(e => {
      if (e.value) processHandler.setField(e.name, e.value, e.group);
    });

  if (Array.isArray(histogrms))
    histogrms.forEach(e => {
      if (e.name) processHandler.addHistogram(e.name, e.group);
    });

  return processHandler;
}
