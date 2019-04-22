const Statement = require('./Statement')

const StatementModel = require('../models/Statement')

// Group of statements
class Authorisation {
  constructor() {
    this.statements = []

    this.loadStatements()
  }

  async loadStatements() {
    const statements = await StatementModel.find({})

    for (let statement of statements) {
      const { id, effect, statementActions, statementResources, conditions } = statement

      this.statements.push(new Statement({
        id, effect, action: statementActions, resource: statementResources, condition: conditions
      }))
    }
  }

  async registerStatement(statement) {
    return this.registerStatements([statement])
  }

  async registerStatements(statements) {
    // TODO: allow the same statement to be written multiple times, overwrite previous.
    const newStatements = statements.map(statement =>
      statement instanceof Statement ? statement : new Statement(statement)
    )

    await Promise.all(newStatements.map(statement => {
      const { id, effect, statementActions, statementResources, originalConditions } = statement

      return StatementModel.findOneAndUpdate(
        { id },
        { id, effect, statementActions, statementResources, conditions: originalConditions },
        { upsert: true }
      )
    }))

    newStatements.forEach(newStatement => {
      const index = this.statements.findIndex(statement => statement.id === newStatement.id)

      if (index === -1) {
        this.statements.push(newStatement)
      } else {
        this.statements[index] = newStatement
      }
    })
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