const noop = _ => {}

const container = () => {
  return {
    singleton: noop,

    bind: noop,

    make: noop,

    instance: noop
  }
}

module.exports = container()

module.exports.createEmpty = container
