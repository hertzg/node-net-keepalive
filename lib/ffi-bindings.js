var Ref = require('ref')
  , FFI = require('ffi')
  , Commons = require('./commons')


var ffi = FFI.Library(null, {
  //   name     ret      1      2      3        4        5
  setsockopt: ['int', ['int', 'int', 'int', 'pointer', 'int']]
});

function setsockopt(fd, level, name, value, valueLength) {
	var err = ffi.setsockopt(fd, level, name, value, valueLength)
		, errno

	if(err !== 0) {
		errno = FFI.errno()
		throw Commons.errnoException(errno, 'setsockopt')
	}
	
	return true
}

module.exports = {
	setsockopt: setsockopt
}