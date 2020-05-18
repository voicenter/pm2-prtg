const PM2_PRTG_HANDLER = require('./classes/PM2_PRTG_HANDLER');

/**@typedef {PM2_PRTG_HANDLER} PM2_PRTG_HANDLER */

/**
 * @typedef Config
 * @type {object}
 * @property {Array<{name: string, group: string}>} [counters] - optional Array of counter names
 * @property {Array<{name: string, value: any, group: string}>} [fields] - optional Array of field names.
 * @property {Array<{name: string, group: string}>} [histogrms] - optional Array of histograms
 */
