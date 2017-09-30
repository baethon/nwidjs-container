const resolver = require('./resolver')

const container = (instances = {}, bindings = {}) => {
  const classResolver = resolver()

  const bind = (name, factoryFn) => {
    bindings[name] = factoryFn
  }

  const make = function (name) {
    if (name in instances) {
      return instances[name]
    }

    if (name in bindings) {
      return bindings[name](this)
    }

    return classResolver.createClassInstance(name, make)
  }

  const singleton = (name, factoryFn) => bind(
    name,
    container => {
      instances[name] = factoryFn(container)
      return instances[name]
    }
  )

  const instance = (name, object) => {
    instances[name] = object
  }

  const addResolveDir = function (dir) {
    classResolver.addDir(dir)
    return this
  }

  return { instance, bind, make, singleton, addResolveDir }
}

module.exports = container()

module.exports.createEmpty = _ => container()
