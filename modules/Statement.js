const SafeExec = require('./SafeExec')
const Utils = require('./Utils')

class Statement {
  constructor({ effect, action, resource, condition }) {
    if (effect !== 'allow' && effect !== 'deny') throw `Statement has invalid effect value, ${effect}`
    if (typeof action === 'undefined') throw `Statement must have an action, given ${action}`
    if (typeof resource === 'undefined') throw `Statement must have a resource, given ${resource}`

    if (typeof action === 'string') action = [action]
    if (typeof resource === 'string') resource = [resource]
    if (typeof condition === 'undefined') condition = {}

    for (let rule in condition) {
      if ('$ensure' in condition[rule]) {
        condition[rule]['$ensure'] = SafeExec.compile(condition[rule]['$ensure'])
      }
    }

    this.effect = effect
    this.statementActions = action
    this.statementResources = resource
    this.conditions = Object.entries(condition)
  }

  check(resource, user, action) {
    // This statement doesn't affect the given resource.
    if (!this.statementResources.some(statementResource => Utils.matches(statementResource, resource.type))) {
      return false
    }

    // This statement doesn't affect the given action.
    if (!this.statementActions.some(statementAction => Utils.matches(statementAction, action))) {
      return false
    }

    for (let [name, condition] of this.conditions) {
      if ('$ensure' in condition) {
        if (!SafeExec.run(condition['$ensure'], { user, resource, action })) {
          // TODO: don't return false here, return which condition failed
          return false
        }
      }
    }

    return true
  }
}

module.exports = Statement