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

const app = express(feathers())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.configure(configuration())

console.log('Conectando neo4j...')
console.log('Neo4j Connection:', app.get('neo4j_url'), app.get('neo4j_user'), app.get('neo4j_pass'))

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(app.get('neo4j_url'), neo4j.auth.basic(app.get('neo4j_user'), app.get('neo4j_pass')));
console.log('Neo4j connected!')

global.neo4jDriver = driver

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
      message: `Feathers application started on ${host}:${port}`,
      badge: true
    }))
})

module.exports = app
