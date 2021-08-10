const Ref = require('ref-napi')
const FFI = require('ffi-napi')
const Util = require('util')
const lazySingleton = require('./lazySingleton')

const FN_GETSOCKOPT = 'getsockopt'
const FN_SETSOCKOPT = 'setsockopt'

const setSocketOption = (instance, fd, level, option, valueRef, valueLength) =>
  invoke(
    instance,
    FN_SETSOCKOPT,
    fd,
    level,
    option,
    valueRef,
    valueLength
  )

const getSocketOption = (instance, fd, level, option, valueRef, lengthRef) =>
  invoke(instance, FN_GETSOCKOPT, fd, level, option, valueRef, lengthRef)

const invoke = (instance, method, ...args) => {
  const err = instance[method](...args)
  if (err !== 0) {
    return Util._errnoException(err, method)
  }
  return err
}

const createForeignFunctionInterface = () => {
  const instance = FFI.Library(null, {
    [FN_SETSOCKOPT]: [
      Ref.types.int,
      [
        Ref.types.int,
        Ref.types.int,
        Ref.types.int,
        Ref.refType(Ref.types['void']),
        Ref.types.int,
      ],
    ],
    [FN_GETSOCKOPT]: [
      Ref.types.int,
      [
        Ref.types.int,
        Ref.types.int,
        Ref.types.int,
        Ref.refType(Ref.types['void']),
        Ref.refType(Ref.types.int),
      ],
    ],
  })

  return {
    setSocketOption: (...args) => setSocketOption(instance, ...args),
    getSocketOption: (...args) => getSocketOption(instance, ...args),
  }
}

const useForeignFunctionInterface = lazySingleton(
  createForeignFunctionInterface
)

module.exports = {
  createForeignFunctionInterface,
  useForeignFunctionInterface,
}
