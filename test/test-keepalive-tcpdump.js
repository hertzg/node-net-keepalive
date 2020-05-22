"use strict"

const Assert = require('assert')
  , OS = require('os')
  , Net = require('net')
  , Lib = require('../lib')
  , ChildProcess = require('child_process')
;

describe('tcp-dump', function () {
  it('should send keepalive packets on the wire', function (done) {
    this.timeout(10000)

    var ifaces = OS.networkInterfaces()
      , tcpDumpIface = null
    ;
    for (var ifaceName in ifaces) {
      var iface = ifaces[ifaceName]
        , found = false;
      for (var i = 0; i < iface.length; i++) {
        if (iface[i].internal) {
          found = true;
          break;
        }
      }

      if (found) {
        tcpDumpIface = ifaceName;
        break;
      }
    }

    Assert.ok(tcpDumpIface, 'could not detect internal (loopback) interface name');

    Net.createServer().listen(0, function () {
      var addr = this.address()
        , srv = this;
      ;
      var s = Net.createConnection(addr, function () {
        var clientAddr = s.address()
          , tcpdumpFilter =
          '(port ' + addr.port + ' or port ' + clientAddr.port + ')'
          + ' and tcp[tcpflags] == tcp-ack'
        ;

        s.setKeepAlive(true, 1000);
        Lib.setKeepAliveInterval(s, 1000);
        Lib.setKeepAliveProbes(s, 10);

        var tcpdump = ChildProcess.spawn(
          'sudo', ['tcpdump', '-c', '10', '-i', tcpDumpIface, tcpdumpFilter],
          {stdio: 'inherit'}
          )
        ;

        tcpdump.on('exit', function (code, signal) {
          Assert.strictEqual(code, 0)
          s.destroy();
          srv.close(done);
        });
      });
    });
  })
})
