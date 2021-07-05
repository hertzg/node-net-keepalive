const Ref = require('ref-napi')
const { Library, errno } = require('ffi-napi')
const { _errnoException } = require('util')

const FN_GETSOCKOPT = 'getsockopt'
const FN_SETSOCKOPT = 'setsockopt'

const setSocketOption = (instance, fd, level, option, valueRef) =>
  invoke(
    instance,
    FN_SETSOCKOPT,
    fd,
    level,
    option,
    valueRef,
    valueRef.type.size
  )

const getSocketOption = (instance, fd, level, option, valueRef, lengthRef) =>
  invoke(instance, FN_GETSOCKOPT, fd, level, option, valueRef, lengthRef)

const invoke = (instance, method, ...args) => {
  const err = instance[method](...args)
  if (err !== 0) {
    return _errnoException(-errno(), method)
  }
  return err
}

const createForeignFunctionInterface = () => {
  const instance = Library(null, {
    // method         ret   1    2    3    4               5
    [FN_SETSOCKOPT]: [Ref.types.int, [Ref.types.int, Ref.types.int, Ref.types.int, Ref.refType(Ref.types["void"]), Ref.types.int]],
    [FN_GETSOCKOPT]: [Ref.types.int, [Ref.types.int, Ref.types.int, Ref.types.int, Ref.refType(Ref.types["void"]), Ref.refType(Ref.types.int)]],
  })

  return {
    setSocketOption: (...args) => setSocketOption(instance, ...args),
    getSocketOption: (...args) => getSocketOption(instance, ...args),
  }
}

const useForeignFunctionInterface = (() => {
  let ffi
  return () => {
    if (!ffi) {
      ffi = createForeignFunctionInterface()
    }
    return ffi
  }
})()

module.exports = {
  createForeignFunctionInterface,
  useForeignFunctionInterface,
}