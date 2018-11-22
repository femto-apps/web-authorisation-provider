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
    this.statements = this.statements.concat(
      statements.map(statement =>
        statement instanceof Statement ? statement : new Statement(statement)
      )
    )
  }

  check(resource, user, action) {
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