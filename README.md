[![NPM][npm_shield]][npm_url]
[![Node][node_shield]][node_url]
[![OS][os_shield]][npm_url]
[![Codecov][codecov_shield]][codecov_url]
[![CI][travis_shield]][travis_url]
[![Dependencies][daviddm_shield]][daviddm_url]
[![Code Quality][codacy_shield]][codacy_url]
[![License][license_shield]][license_url]

[codacy_url]: https://www.codacy.com/app/hertzg/node-net-keepalive
[codacy_shield]: https://api.codacy.com/project/badge/Grade/d191b6408086432586e6c60577485c6f
[npm_url]: https://www.npmjs.com/package/net-keepalive
[npm_shield]: https://img.shields.io/npm/v/net-keepalive.svg?style=flat
[node_url]: https://dist.nodejs.org
[node_shield]: https://img.shields.io/badge/node-%3E%3D10.20.0-green.svg
[os_shield]: https://img.shields.io/badge/os-linux%2Cosx%2Cbsd-green.svg
[travis_url]: https://travis-ci.org/hertzg/node-net-keepalive
[travis_shield]: https://travis-ci.org/hertzg/node-net-keepalive.svg?branch=master
[daviddm_url]: https://david-dm.org/hertzg/node-net-keepalive
[daviddm_shield]: https://david-dm.org/hertzg/node-net-keepalive.svg
[license_url]: https://raw.githubusercontent.com/hertzg/node-net-keepalive/master/LICENSE
[license_shield]: https://img.shields.io/badge/license-MIT-blue.svg
[codecov_url]: https://codecov.io/gh/hertzg/node-net-keepalive
[codecov_shield]: https://codecov.io/gh/hertzg/node-net-keepalive/branch/master/graph/badge.svg
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# 🔗 net-keepalive

[![NPM](https://nodei.co/npm/net-keepalive.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/net-keepalive/)

The Missing (`TCP_KEEPINTVL` and `TCP_KEEPCNT`) `SO_KEEPALIVE` socket option setters and getters for Node using [`ffi-napi`](https://www.npmjs.com/package/ffi-napi) module.

Tested on 🐧 `linux` & 🍏 `osx` (both `amd64` and `arm64`), should work on 😈 `freebsd` and others. 
Installs on 🐄 `win32` 🎉 but methods are no-ops (pull requests welcome).

There's also support for getting & setting the `TCP_USER_TIMEOUT` (🐧 `linux`  and 🍏 `osx` only) option, which is closely related to keep-alive.


## Platform support

| Platform     | TCP_KEEPINTVL | TCP_KEEPCNT | TCP_USER_TIMEOUT            |
| ------------ | ------------- | ----------- | --------------------------- |
| 🐧 `linux`   | ✅            | ✅          | ✅                          |
| 🍏 `osx`     | ✅            | ✅          | ✅ (`TCP_RXT_CONNDROPTIME`) |
| 😈 `freebsd` | ✅            | ✅          | ❌                          |
| 🐄 `win32`   | ➖            | ➖          | ➖                          |

Legend:

- ✅ - Supported
- ➖ - No operation 
- ❌ - Unsupported (throws)

## Install

```bash
npm install --save net-keepalive
```

## Documentation

You can find the [full API Reference Document (JSDoc)](https://hertzg.github.io/node-net-keepalive) published on our github pages.

The project includes TypeScript definitions file (`index.d.ts`) which gives an overview of the API exposed.

Documentation gets generated from JSDoc comments, feel free to improve them by sending pull requests.

## Demo

```javascript
const Net = require('net'),
  NetKeepAlive = require('net-keepalive')
// or
import * as Net from 'net'
import * as NetKeepAlive from 'net-keepalive'

// Create a TCP Server
const srv = Net.createServer((s) => {
  console.log('Connected %j', s.address())
  // Doesn't matter what it does
  s.pipe(s)
})

// Start on some port
srv.listen(1337, () => {
  console.log('Listening on %j', srv.address())
})

// Connect to that server
const s = Net.createConnection({ port: 1337 }, () => {
  console.log('Connected to %j', s.address())

  //IMPORTANT: KeepAlive must be enabled for this to work
  s.setKeepAlive(true, 1000)

  // Set TCP_KEEPINTVL for this specific socket
  NetKeepAlive.setKeepAliveInterval(s, 1000)

  // Get TCP_KEEPINTVL for this specific socket
  NetKeepAlive.getKeepAliveInterval(s) // 1000

  // Set TCP_KEEPCNT for this specific socket
  NetKeepAlive.setKeepAliveProbes(s, 1)

  // Get TCP_KEEPCNT for this specific socket
  NetKeepAlive.getKeepAliveProbes(s) // 1
})
```

Now using `iptables` add rule to drop all `tcp` packets on `INPUT` chain to port `1337`.

```bash
iptables -I INPUT -m tcp -p tcp --dport 1337 -j DROP
```

If you were monitoring packets on `loopback` with `tcp.srcport == 1337 || tcp.dstport == 1337` filter in `wireshark`. You will see the following output:

[![Wireshark screenshot KEEPALIVE](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)](http://hertzg.github.io/node-net-keepalive/images/wireshark.jpg)

Have fun!

More info about `SO_KEEPALIVE` here: [TCP Keepalive HOWTO](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/)
`C` Code examples here: [Examples](http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/programming.html#examples)

## Sample

**_Note: For these methods to work you must enable `SO_KEEPALIVE` and set the `TCP_KEEPIDLE` options for socket using `Net.Socket`-s built in method [`socket.setKeepAlive([enable][, initialDelay])`](https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay) !_**

    TCP_KEEPIDLE (since Linux 2.4) The time (in seconds) the connection needs to remain idle before TCP starts sending keepalive probes, if the socket option SO_KEEPALIVE has been set on this socket. This option should not be used in code intended to be portable.

```JavaScript
const NetKeepAlive = require('net-keepalive')
// or
import * as NetKeepAlive from 'net-keepalive'

// .....

const enable = true                                             // enable SO_KEEPALIVE
const initialDuration = 1000                                    // start probing after 1 second of inactivity
socket.setKeepAlive(enable, initialDuration)                    // sets SO_KEEPALIVE and TCP_KEEPIDLE

const probeInterval = 1000                                      // after initialDuration send probes every 1 second
NetKeepAlive.setKeepAliveInterval(socket, probeInterval)        //sets TCP_KEEPINTVL

const maxProbesBeforeFail = 10                                  // after 10 failed probes connection will be dropped
NetKeepAlive.setKeepAliveProbes(socket, maxProbesBeforeFail)    // sets TCP_KEEPCNT

// ....
```

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://hertz.gg"><img src="https://avatars3.githubusercontent.com/u/1886698?v=4?s=100" width="100px;" alt=""/><br /><sub><b>George Hertz</b></sub></a><br /><a href="#maintenance-hertzg" title="Maintenance">🚧</a> <a href="https://github.com/hertzg/node-net-keepalive/commits?author=hertzg" title="Code">💻</a> <a href="https://github.com/hertzg/node-net-keepalive/commits?author=hertzg" title="Documentation">📖</a> <a href="https://github.com/hertzg/node-net-keepalive/commits?author=hertzg" title="Tests">⚠️</a> <a href="#platform-hertzg" title="Packaging/porting to new platform">📦</a> <a href="#question-hertzg" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/mildsunrise"><img src="https://avatars0.githubusercontent.com/u/1177304?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alba Mendez</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/commits?author=mildsunrise" title="Code">💻</a> <a href="https://github.com/hertzg/node-net-keepalive/commits?author=mildsunrise" title="Documentation">📖</a> <a href="https://github.com/hertzg/node-net-keepalive/commits?author=mildsunrise" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/pfcastro/"><img src="https://avatars3.githubusercontent.com/u/15091591?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Paulo Castro</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Apdcastro" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.immersiveapplications.com/"><img src="https://avatars1.githubusercontent.com/u/481412?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jacob Jewell</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Ajakesjews" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RMutharaju"><img src="https://avatars0.githubusercontent.com/u/37263240?v=4?s=100" width="100px;" alt=""/><br /><sub><b>RMutharaju</b></sub></a><br /><a href="#security-RMutharaju" title="Security">🛡️</a></td>
    <td align="center"><a href="https://github.com/borger"><img src="https://avatars0.githubusercontent.com/u/5930158?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rafael Borges</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Aborger" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/selient"><img src="https://avatars2.githubusercontent.com/u/3947590?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Calvin</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Aselient" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ggsubs"><img src="https://avatars2.githubusercontent.com/u/2170237?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ggsubs</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Aggsubs" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://mario.kozjak.io/"><img src="https://avatars1.githubusercontent.com/u/3506172?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mario Kozjak</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/issues?q=author%3Amkozjak" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://codeisland.org/"><img src="https://avatars2.githubusercontent.com/u/692211?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lukas Knuth</b></sub></a><br /><a href="https://github.com/hertzg/node-net-keepalive/commits?author=LukasKnuth" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
