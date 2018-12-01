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

console.log('Conectando neo4j...')
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver(process.env.NEO4JADDR, neo4j.auth.basic(process.env.NEO4JUSER, process.env.NEO4JPASS));
console.log('Neo4j connected!')
global.neo4jDriver = driver

const app = express(feathers())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app
  .configure(configuration())
  .configure(express.rest())
  .configure(middleware)
  .configure(require('./services'))

const host = app.get('host')
const port = app.get('port')

process.on('nuxt:build:done', (err) => {
  if (err) {
    consola.error(err)
    process.exit(1)
  }
  const server = app.listen(port)
  server.on('listening', () =>
    consola.ready({
      message: `Feathers application started on ${host}:${port}`,
      badge: true
    })
  )
})

module.exports = app
