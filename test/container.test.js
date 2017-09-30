const { expect, use } = require('chai')
const createContainer = require('../src/container')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const Test = require('./stubs/Test')
const InjectTest = require('./stubs/InjectTest')

use(sinonChai)

describe('Container', () => {
  it('resolves bound instances', () => {
    const container = createContainer()
    const instance = {}

    container.instance('test', instance)
    expect(container.make('test')).to.equal(instance)
  })

  it('binds instance factories', () => {
    const container = createContainer()
    const spy = sinon.stub()
    const expectedResult = {}

    spy.returns(expectedResult)

    container.bind('test', spy)

    expect(container.make('test')).to.equal(expectedResult)
    expect(spy).to.have.been.calledWith(container)
  })

  it('binds singleton factory', () => {
    const container = createContainer()

    container.singleton('test', Math.random)

    const result = container.make('test')

    expect(result).to.exist // eslint-disable-line no-unused-expressions
    expect(container.make('test')).to.equal(result)
  })

  describe('Automatic class resolving', () => {
    const container = createContainer()
        .addResolveDir(__dirname)

    it('resolves class', () => {
      const test = container.make('stubs/Test')
      expect(test).to.be.instanceOf(Test)
    })

    it('injects resolved instances', () => {
      const injectTest = container.make('stubs/InjectTest')

      expect(injectTest).to.be.instanceof(InjectTest)
      expect(injectTest.testFromResolve).to.be.instanceOf(Test)
      expect(injectTest.testFromResolve).to.be.instanceOf(Test)
    })
  })
})
