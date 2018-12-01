const express = require('express')

const authorisation = new require('./modules/Authorisation')()
// const authorisation = new Authorisation()

// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

authorisation.registerStatements([
  {
    effect: 'allow',
    action: 'hoster:GetObject',
    resource: 'hoster:object:*'
  },
  {
    effect: 'allow',
    action: ['hoster:DeleteObject', 'hoster:UpdateObject'],
    resource: 'hoster:object:*',
    condition: {
      'owns hosted image': { $ensure: 'resource.owner._id == user._id' }
    }
  }
])

let resource = {
  type: 'hoster:object',
  owner: {
    _id: 'abc'
  }
}

let user = {
  _id: 'abc'
}

let action = 'hoster:DeleteObject'

console.time('Auth check')
for (let i = 0; i < 1000; i++) {
  if (i % 100 === 0) console.log(i)
  authorisation.check(resource, user, action)
}
console.timeEnd('Auth check')