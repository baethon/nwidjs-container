const container = () => {
  const instances = {}
  const bindings = {}

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

  return { instance, bind, make, singleton }
}

module.exports = container()

module.exports.createEmpty = container
