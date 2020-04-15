class PM2_PRTG_HANDLER {
  /**@type {Object} */
  fields
  /**@param {string} name 
   * @param {any} val
  */
  setField(name, val) { }
  /**@param {string} name */
  getField(name) { }
  /**@param {string} name */
  incrementCounter(name) { }
  /**@param {string} name */
  getCounterValue(name) { }
  /**@param {string} name */
  addCounter(name) { }
  listAllCounters() { }
  getSanitizedData() { }
  async update() { }
  getPrtgObject() { }
}

/**@typedef {PM2_PRTG_HANDLER} PM2_PRTG_HANDLER */

/**
 * @typedef Config
 * @type {object}
 * @property {Array<string>} [counters] - optional Array of counter names
 * @property {Object} [fields] - optional Object of field names.
 */
