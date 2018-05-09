var Mockery = require('mockery')
  , Should = require('should')
  , Sinon = require('sinon')

describe('constants', function(){

    var sandbox
    beforeEach(function(){
        Mockery.enable({
            warnOnReplace: true,
            warnOnUnregistered: true,
            useCleanCache: true
        })
        Mockery.registerAllowable('../lib/constants')
        sandbox = Sinon.createSandbox()
    })
    
    afterEach(function(){
        sandbox.restore()
        Mockery.deregisterAllowable('../lib/constants')
        Mockery.deregisterAll()
        Mockery.disable()
    })
    
    function mockPlatform(platform) {
        var mock = sandbox.mock()
        Mockery.registerMock('os', {
            platform: mock.returns(platform)
        })
    }

    it('should define darwin specific constants', function(){
        mockPlatform('darwin')

        require('../lib/constants')
            .should.have.properties({
              SOL_TCP: 6,
              TCP_KEEPINTVL: 0x101,
              TCP_KEEPCNT: 0x102
            })
    })
    
    it('should define freebsd specific constants', function(){
        mockPlatform('freebsd')

        require('../lib/constants')
            .should.have.properties({
              SOL_TCP: 6,
              TCP_KEEPINTVL: 512,
              TCP_KEEPCNT: 1024
            })
    })
    
    it('should define linux specific constants', function(){
        mockPlatform('linux')

        require('../lib/constants')
            .should.have.properties({
              SOL_TCP: 6,
              TCP_KEEPINTVL: 5,
              TCP_KEEPCNT: 6
            })
    })
    
    it('should use linux specific constants for other platforms', function(){
        mockPlatform('unknown')

        require('../lib/constants')
            .should.have.properties({
              SOL_TCP: 6,
              TCP_KEEPINTVL: 5,
              TCP_KEEPCNT: 6
            })
    })

})
