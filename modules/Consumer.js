const fetch = require('node-fetch')
const config = require('@femto-apps/config')

function getConsumer(secret) {
    return fetch(`${config.get('authenticationProvider.uri')}/api/consumerBySecret/authorisation/${secret}`)
        .then(res => res.json())
        .then(({ consumer }) => consumer)
}

module.exports = {
    getConsumer
}
