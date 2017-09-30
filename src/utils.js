const pipe = require('lodash.flow')

module.exports = {
  startsWith: search => string => string.startsWith(search),
  identity: _ => _,
  map: fn => array => array.map(fn),
  otherwise: _ => true,
  pipe
}
