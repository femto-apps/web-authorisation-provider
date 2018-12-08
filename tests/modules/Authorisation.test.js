const Authorisation = require('../../modules/Authorisation')
const authorisation = new Authorisation()

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

const SIMPLE_RESOURCE = {
    type: 'hoster:object',
    owner: { _id: 'abc' },
    someRecord: true
}

const SIMPLE_SAME_USER = {
    _id: 'abc'
}

const SIMPLE_DIFFERENT_USER = {
    _id: 'xyz'
}

test('basic success', () => {
    expect(authorisation.check(SIMPLE_RESOURCE, SIMPLE_SAME_USER, 'hoster:GetObject')).toBeTruthy()
})

test('basic failure', () => {
    expect(authorisation.check(SIMPLE_RESOURCE, SIMPLE_SAME_USER, 'hoster:PutObject')).toBeFalsy()
})

test('conditional success', () => {
    expect(authorisation.check(SIMPLE_RESOURCE, SIMPLE_SAME_USER, 'hoster:DeleteObject')).toBeTruthy()
})

test('conditional failure', () => {
    expect(authorisation.check(SIMPLE_RESOURCE, SIMPLE_DIFFERENT_USER, 'hoster:DeleteObject')).toBeFalsy()
})