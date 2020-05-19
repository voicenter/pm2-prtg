// @ts-check
const { PM2_PRTG_HANDLER_type } = require('./types.js');
const { getProcess } = require('./helpers/pm2Helpers');
const PM2_PRTG_HANDLER = require('./classes/PM2_PRTG_HANDLER.js');

/**
 * @typedef Config
 * @type {object}
 * @property {Array<{name: string, group: string}>} [counters] - optional Array of counter names
 * @property {Array<{name: string, value: any, group: string, unit: string}>} [fields] - optional Array of field names.
 * @property {Array<{name: string, group: string, unit: string}>} [histogrms] - optional Array of histograms
 */

/**
 * @param {number | string} idOrName - provide id (as number) or name (as string) of process
 * @param {Config} [config] - configuration of handler
 * @returns {Promise<PM2_PRTG_HANDLER_type>}
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
