const { expect, use } = require('chai')
const { createEmpty } = require('../src/container')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

use(sinonChai)

describe('Container', () => {
  it('resolves bound instances', () => {
    const container = createEmpty()
    const instance = {}

    container.instance('test', instance)
    expect(container.make('test')).to.equal(instance)
  })

  it('binds instance factories', () => {
    const container = createEmpty()
    const spy = sinon.stub()
    const expectedResult = {}

    spy.returns(expectedResult)

    container.bind('test', spy)

    expect(container.make('test')).to.equal(expectedResult)
    expect(spy).to.have.been.calledWith(container)
  })

  it('binds singleton factory', () => {
    const container = createEmpty()

    container.singleton('test', Math.random)

    const result = container.make('test')

    expect(result).to.exist // eslint-disable-line no-unused-expressions
    expect(container.make('test')).to.equal(result)
  })
})
