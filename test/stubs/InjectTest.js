class InjectTest {
  constructor (testFromResolve, testFromRelative) {
    this.testFromResolve = testFromResolve
    this.testFromRelative = testFromRelative
  }

  static get $inject () {
    return ['stubs/Test', './Test']
  }
}

module.exports = InjectTest
