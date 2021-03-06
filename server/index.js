'use strict'
const path = require('path')
const consola = require('consola')

// Check configuration
const conf_path = path.join(__dirname, './config')
console.log('Configuration:', conf_path)
process.env['NODE_CONFIG_DIR'] = conf_path

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const middleware = require('./middleware')
const redisClient = require('feathers-hooks-rediscache').redisClient;
const neo4jfeathers = require('feathers-neo4j-driver')

const app = express(feathers())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.configure(configuration());

// Neo4J driver setup
app.use('neo4jf',neo4jfeathers({
  uri: process.env.neo4j_uri || app.get('neo4j_uri'),
  user: process.env.neo4j_user || app.get('neo4j_user'),
  pass: process.env.neo4j_pass || app.get('neo4j_pass')
}));
/*
console.log('Conectando neo4j...')
console.log('Neo4j Connection:', app.get('neo4j_url'), 
                                 app.get('neo4j_user'), 
                                 app.get('neo4j_pass'))

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(app.get('neo4j_url'), 
             neo4j.auth.basic(app.get('neo4j_user'), 
                              app.get('neo4j_pass')));
console.log('Neo4j connected!')

global.neo4jDriver = driver
*/

app
  .configure(express.rest())
  .configure(middleware)
  .configure(redisClient)
  .configure(require('./services'))

const host = process.env.HOSTNAME || app.get('host')
const port = process.env.PORT || app.get('port')

process.on('nuxt:build:done', (err) => {
  if (err) {
    consola.error(err)
    process.exit(1)
  }
  const server = app.listen(port)
  server.on('listening', () => consola.ready({
      message: `Katecheo application started on ${host}:${port}`,
      badge: true
    }))
})

module.exports = app
