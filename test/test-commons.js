"use strict"

const Mockery = require('mockery')
  , Should = require('should')
  , Sinon = require('sinon')

describe('commons', () => {

  let sandbox
  beforeEach(() => {
        Mockery.enable({
            warnOnReplace: true,
            warnOnUnregistered: true,
            useCleanCache: true
        })
        Mockery.registerAllowable('../lib/commons')
        sandbox = Sinon.createSandbox()
    })

  afterEach(() => {
        sandbox.restore()
        Mockery.deregisterAllowable('../lib/commons')
        Mockery.disable()
    })

  it('should export errnoException function and return exception', () => {
        Mockery.registerAllowable('util')
        require('../lib/commons').should.have.property('errnoException')
            .which.is.a.Function()
        Mockery.deregisterAllowable('util')
    })

  it('should return errnoException style Error', () => {
    Mockery.registerAllowable('util')
        require('../lib/commons').errnoException(999, 'test_syscall_name', 'original')
            .should.be.instanceOf(Error)
            .and.have.properties(['message', 'code', 'errno', 'syscall'])
            .and.have.properties({
                syscall: 'test_syscall_name'
            })
        Mockery.deregisterAllowable('util')
    })

  it('should use util._errnoException when available', () => {

    const _errnoExceptionStub = sandbox.stub()


        Mockery.registerMock('util', {
            _errnoException: _errnoExceptionStub
        })

        require('../lib/commons').errnoException(999, 'TEST_SYSCALL_NAME', 'original')

        Mockery.deregisterMock('util')

    sandbox.assert.calledOnce(_errnoExceptionStub)
        sandbox.assert.calledWith(_errnoExceptionStub, -999, 'TEST_SYSCALL_NAME', 'original')
    })

  it('should try use libuv.errname otherwise', () => {

        Mockery.registerMock('util', {})

    sandbox.stub(process, 'binding')
    const uvErrnameStub = Sinon.stub()

        process.binding.withArgs('uv')
            .returns({errname: uvErrnameStub})

    require('../lib/commons').errnoException(999, 'TEST_SYSCALL_NAME', 'original')

    sandbox.assert.calledOnce(process.binding)
        sandbox.assert.calledWith(process.binding, 'uv')

    Sinon.assert.calledOnce(uvErrnameStub)
        Sinon.assert.calledWith(uvErrnameStub, -999)

    Mockery.deregisterMock('util')
    })

})
