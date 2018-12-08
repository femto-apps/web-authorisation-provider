const Statement = require('./Statement')

// Group of statements
class Authorisation {
  constructor() {
    this.statements = []    
  }

  registerStatement(statement) {
    this.registerStatements([statement])
  }

  registerStatements(statements) {
    // TODO: allow the same statement to be written multiple times, overwrite previous.
    this.statements = this.statements.concat(
      statements.map(statement =>
        statement instanceof Statement ? statement : new Statement(statement)
      )
    )
  }

  check(resource, user, action) {
    // TODO: don't return a boolean, return the reason why it was denied
    let matched = false

    for (const statement of this.statements) {
      let matches = statement.check(resource, user, action)

      if (matches) {
        if (statement.effect === 'deny') {
          return false
        } else {
          matched = true
        }
      }
    }

    return matched
  }
}

module.exports = Authorisation