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
      container.instance('foo', 'foo')

      const injectTest = container.make('stubs/InjectTest')

      expect(injectTest).to.be.instanceof(InjectTest)
      expect(injectTest.testFromResolve).to.be.instanceOf(Test)
      expect(injectTest.testFromResolve).to.be.instanceOf(Test)
      expect(injectTest.foo).to.equal('foo')
    })
  })

  describe('Extending objects', () => {
    it('allows to extend bound objects', () => {
      const container = createContainer()
      const extendFn = object => {
        object.foo = 'foo'
      }
      const spy = sinon.spy(extendFn)

      container.bind('test', () => new Test())
      container.extend('test', spy)

      const test = container.make('test')

      expect(test).to.be.instanceOf(Test)
      expect(test.foo).to.equal('foo')
      expect(spy).to.have.been.calledWith(test, container)
    })

    it('allows to extend singleton', () => {
      const container = createContainer()
      const spy = sinon.spy(test => {
        test.foo = Math.random()
      })

      container.singleton('test', () => new Test())
      container.extend('test', spy)

      const instance = container.make('test')
      const { foo } = instance

      const secondInstance = container.make('test')

      expect(secondInstance).to.equal(instance)
      expect(secondInstance.foo).to.equal(foo)
      expect(spy).to.have.been.calledOnce // eslint-disable-line
    })

    it('allows to extend unbound class factories', () => {
      const container = createContainer()
        .addResolveDir(__dirname)

      container.extend('stubs/Test', test => {
        test.foo = 'foo'
      })

      const test = container.make('stubs/Test')

      expect(test).to.be.instanceOf(Test)
      expect(test).to.have.property('foo', 'foo')
    })
  })
})
