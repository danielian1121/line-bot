/**
 * Database settings.
 * @namespace
 * @readonly {string} username - Database server user account.
 * @readonly {string} password - Database server user password.
 * @readonly {string} host     - Database server host address.
 * @readonly {number} port     - Database server port.
 * @readonly {string} protocol - Which database server is used.
 * @readonly {string} url      - Get database server url.
 */

const config = {}

Object.defineProperties(config, {
  'database': {
    value: 'heroku_99477a45e613bc0'
  },
  'username': {
    value: 'be3b1275a7d19c'
  },
  'password': {
    value: 'da836e5b'
  },
  'host': {
    value: 'us-cdbr-iron-east-01.cleardb.net'
  },
  'dialect': {
    value: 'mysql'
  }
})
module.exports = config
