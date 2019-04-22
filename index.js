const config = require('@femto-host/config')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')

const Authorisation = require('./modules/Authorisation')
const { getConsumer } = require('./modules/Consumer')

const authorisation = new Authorisation()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(config.get('logFormat')))

mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

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
 *     'owns hosted image': { %ensure: 'resource.owner._id == user._id' }
 *   }
 * }
 */
app.post('/api/statement', async (req, res) => {
  // TODO: verify that the site can effect the specified resource
  if (!req.body.secret) {
    return res.status(401).json({
      error: 'Unauthorised request'
    })
  }

  const consumer = await getConsumer(req.body.secret)

  if (!consumer) {
    return res.status(401).json({
      error: 'Invalid secret key'
    })
  }

  if (Array.isArray(req.body.statements)) {
    await authorisation.registerStatements(req.body.statements)
  } else {
    await authorisation.registerStatement(req.body.statements)
  }

  res.json({
    message: 'added authorisation successfully'
  })
})

/*
 * Checks whether a user can complete an action on the requested resource.
 */
app.post('/api/authorised', (req, res) => {
  res.json({
    authorised: authorisation.check(req.body.resource, req.body.user, req.body.action)
  })
})

app.listen(config.get('port'), () => console.log(`Example app listening on port ${config.get('port')}!`))