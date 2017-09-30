const resolver = require('./resolver')
const utils = require('./utils')
const curry = require('lodash.curry')
const pipe = require('lodash.flow')

const container = (bindings = {}) => {
  const classResolver = resolver()

  const bind = (name, factoryFn) => {
    bindings[name] = factoryFn
  }

  const make = function (name) {
    if (name in bindings) {
      return bindings[name](this)
    }

    return classResolver.createClassInstance(name, make)
  }

  const instance = curry((name, object) => bind(name, utils.always(object)))

  const singleton = (name, factoryFn) => bind(
    name,
    pipe(
      factoryFn,
      utils.tap(instance(name))
    )
  )

  const addResolveDir = function (dir) {
    classResolver.addDir(dir)
    return this
  }

  return { instance, bind, make, singleton, addResolveDir }
}

module.exports = container()

module.exports.createEmpty = _ => container()
