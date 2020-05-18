const io = require('@pm2/io');
const { getProcess } = require('../helpers/pm2Helpers');
const { resolveKey } = require('../util/unitResolver');
class PM2_PRTG_HANDLER {
  constructor(_process) {
    this.lastTimeChecked = Date.now();
    this.getSanitizedProсessData = prs => {
      const obj = {
        id: prs.pm_id,
        pid: prs.pid,
        created_at: prs.pm2_env.created_at,
        uptime: Date.now() - prs.pm2_env.created_at,
        last_time_checked: ~~((Date.now() - this.lastTimeChecked) / 1000)
      }
      this.lastTimeChecked = Date.now();
      return obj;
    };
    this.data = _process;
    this.fields = {};
    this.counters = {
      successCounter: {
        value: io.counter({ name: 'successCounter' }),
        group: 'general',
        unit: 'count'
      },
      errorCounter: {
        value: io.counter({ name: 'errorCounter' }),
        group: 'general',
        unit: 'count'
      }
    };
    this.histograms = {};
    this.time_stamps = {};
    this.startTimer = name => this.time_stamps[name] = Date.now();
    this.getTimerValue = name => {
      const val = Date.now() - this.time_stamps[name];
      delete this.time_stamps[name];
      return val;
    };
    this.getHistogram = name => this.histograms[name].value.val();
    this.addHistogram = (name, group, unit) => {
      this.histograms[name] = { value: io.histogram({ name }) };
      if (group) this.histograms[name].group = group;
      if (unit) {
        const unitKey = resolveKey(unit);
        this.histograms[name].value[unitKey] = unit;
      }
    };
    this.updateHistogram = (name, value) => this.histograms[name].value.update(value);
    this.setField = (name, value, group = null, unit) => {
      this.fields[name] = { value };
      if (group) this.fields[name].group = group;
      if (unit) {
        const unitKey = resolveKey(unit);
        this.fields[name][unitKey] = unit;
      }
    };
    this.getField = name => {
      if (this.fields[name] === undefined) throw new Error('field doesn\'t exist!');
      return this.fields[name].value;
    };
    this.incrementCounter = name => {
      if (!this.counters[name]) throw new Error('counter doesn\'t exist!');
      this.counters[name].value.inc();
    };
    this.getCounterValue = name => {
      if (!this.counters[name]) throw new Error('counter doesn\'t exist!');
      return this.counters[name].value.val();
    };
    this.addCounter = (name, group = null) => {
      this.counters[name] = { value: io.counter({ name }) }
      this.counters[name].value.unit = 'count';
      if (group) this.counters[name].group = group;
    };
    this.listAllCounters = (group = null) => {
      const obj = {};
      Object.entries(this.counters).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        obj[key] = val;
      });
      return obj;
    };
    this.listAllFields = (group = null) => {
      const obj = {};
      Object.entries(this.fields).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        if (typeof val === 'object') {
          obj[key] = {
            value: val.value,
            unit: val.unit,
            customunit: val.customunit
          };
        } else {
          obj[key] = val.value;
        }
      });
      return obj;
    };
    this.listAllHistograms = (group = null) => {
      const obj = {};
      Object.entries(this.histograms).forEach(e => {
        const [key, val] = e;
        if (group && group !== val.group) return;
        obj[key] = val.value;
      });
      return obj;
    };
    this.getSanitizedData = (group = null) => {
      let data;
      if (!group || group.toLocaleLowerCase() === 'general') data = this.getSanitizedProсessData(_process);
      data = {
        ...data,
        ...this.listAllFields(group),
        ...this.listAllCounters(group),
        ...this.listAllHistograms(group)
      }

      return data;
    };
    this.update = async () => this.data = await getProcess(this.data.pm_id);
    this.getPrtgObject = (group = null) => {
      let result = [];
      Object.entries(this.getSanitizedData(group)).forEach(el => {
        const [channel, val] = el;
        const value = typeof val !== 'object' ? val :
          (!!val.val ? val.val() : void 0) !== void 0 ?
            val.val() : typeof val.value === 'object' ?
              val.value.val() : val.value;
        const item = { channel, value };
        const unit = typeof val === 'object' ? val.unit : null;
        const customunit = typeof val === 'object' ? val.customunit : null;
        if (unit) item.unit = unit;
        else if (customunit) item.customunit = customunit;
        result.push(item);
      });
      result = JSON.parse(JSON.stringify(result));
      return {
        prtg: {
          result
        }
      }
    };
  }
}

/**@typedef {PM2_PRTG_HANDLER} PM2_PRTG_HANDLER*/

module.exports = PM2_PRTG_HANDLER;