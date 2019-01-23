const config = require('@femto-host/config')
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')

const Authorisation = require('./modules/Authorisation')

const authorisation = new Authorisation()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(config.get('logFormat')))

/* 
 * Register one or more statements for authentication.
 * 
 * @example <caption>Simple resource authentication</caption>
 * {
 *   effect: 'allow',
 *   action: 'hoster:GetObject',
 *   resource: 'hoster:object:*'
 * }
 * 
 * @example <caption>Conditional resource authentication</caption>
 * {
 *   effect: 'allow',
 *   action: ['hoster:DeleteObject', 'hoster:UpdateObject'],
 *   resource: 'hoster:object:*',
 *   condition: {
 *     'owns hosted image': { $ensure: 'resource.owner._id == user._id' }
 *   }
 * }
 */
app.post('/api/v1/statement', (req, res) => {
  // TODO: verify that the request came from a site
  // TODO: verify that the site can effect the specified resource

  if (Array.isArray(req.body)) {
    authorisation.registerStatements(req.body)
  } else {
    authorisation.registerStatement(req.body)
  }

  res.json({
    message: 'added authorisation successfully'
  })
})

/*
 * Checks whether a user can complete an action on the requested resource.
 */
app.post('/api/v1/authorised', (req, res) => {
  res.json({
    authorised: authorisation.check(req.body.resource, req.body.user, req.body.action)
  })
})

app.listen(config.get('port'), () => console.log(`Example app listening on port ${config.get('port')}!`))