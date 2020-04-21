class PM2_PRTG_HANDLER {
  /**@param {string} name 
   * @param {any} value
   * @param {string} [group]
  */
  setField(name, value, group) { }
  /**@param {string} name 
   * @param {string} [group]
  */
  getField(name, group) { }
  /**@param {string} name */
  incrementCounter(name) { }
  /**@param {string} name */
  getCounterValue(name) { }
  /**@param {string} name 
   * @param {string} [group]
  */
  addCounter(name, group) { }
  /**@param {string} [group] */
  listAllCounters(group) { }
  /**@param {string} [group] */
  listAllFields(group) { }
  /**@param {string} [group] */
  getSanitizedData(group) { }
  async update() { }
  /**@param {string} [group] */
  getPrtgObject(group) { }
}

/**@typedef {PM2_PRTG_HANDLER} PM2_PRTG_HANDLER */

/**
 * @typedef Config
 * @type {object}
 * @property {Array<{name: string, group: string}>} [counters] - optional Array of counter names
 * @property {Array<{name: string, value: any, group: string}>} [fields] - optional Object of field names.
 */
