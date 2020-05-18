const avalibleUnits = new Set([
  'bytesbandwidth',
  'bytesdisk',
  'temperature',
  'percent',
  'timeresponse',
  'timeseconds',
  'custom',
  'count',
  'cpu',
  'bytesfile',
  'speeddisk',
  'speednet',
  'timehours'
]);

const resolveKey = unitKey => avalibleUnits.has(`${unitKey}`.toLowerCase()) ? 'unit' : 'customunit';

module.exports = {
  avalibleUnits,
  resolveKey
}
