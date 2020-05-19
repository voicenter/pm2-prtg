const PM2_PRTG_HANDLER_class = require('./classes/PM2_PRTG_HANDLER');

/**
 * @typedef PM2_PRTG_HANDLER
 * @type {PM2_PRTG_HANDLER_class}
 */

/**
 * @typedef Config
 * @type {object}
 * @property {Array<{name: string, group: string}>} [counters] - optional Array of counter names
 * @property {Array<{name: string, value: any, group: string, unit: string}>} [fields] - optional Array of field names.
 * @property {Array<{name: string, group: string, unit: string}>} [histogrms] - optional Array of histograms
 */


/**@type {PM2_PRTG_HANDLER} */ const PM2_PRTG_HANDLER_type;
/**@type {Config} */ const Config_type;

module.exports = {
  PM2_PRTG_HANDLER_type,
  Config_type
}
