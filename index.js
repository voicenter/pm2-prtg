require('./types');
const { getProcess } = require('./helpers/pm2Helpers');
const PM2_PRTG_HANDLER = require('./classes/PM2_PRTG_HANDLER');

/**
 * @param {number | string} idOrName - provide id (as number) or name (as string) of process
 * @param {Config} [config] - configuration of handler
 */
module.exports = async (idOrName, config = {}) => {
  const _process = await getProcess(idOrName);
  if (!_process) throw new Error('no such pm2 process found!');
  const processHandler = new PM2_PRTG_HANDLER(_process);

  const { counters, fields, histogrms } = config;

  if (Array.isArray(counters))
    counters.forEach(e => {
      if (typeof e === 'string') processHandler.addCounter(e);
      else if (typeof e === 'object' && e.name) processHandler.addCounter(e.name, e.group);
    });

  if (Array.isArray(fields))
    fields.forEach(e => {
      if (e.value) processHandler.setField(e.name, e.value, e.group, e.unit);
    });

  if (Array.isArray(histogrms))
    histogrms.forEach(e => {
      if (e.name) processHandler.addHistogram(e.name, e.group, e.unit);
    });

  return processHandler;
}
