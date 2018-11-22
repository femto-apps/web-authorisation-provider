const { VM, VMScript } = require('vm2')

class SafeExec {
  constructor() {}

  static run(code, environment) {
    const vm = new VM({
      timeout: 1000
    })

    for (let variable in environment) {
      vm.freeze(environment[variable], variable)
    }

    return vm.run(code)
  }

  static compile(code, args) {
    const vm = new VM({
      timeout: 1000
    })

    return new VMScript(code).compile()
  }
}

module.exports = SafeExec