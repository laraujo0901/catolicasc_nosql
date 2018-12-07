
'use strict'

module.exports = function () {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this

  console.log("Carregando serviços...");

  app.use('/api/catechists', require('./catechists'))
  //app.use('/api/catechizings', require('./catechizings'))
  app.use('/api/groups', require('./groups'))
  app.use('/api/communities', require('./communities'))

  // register hooks
  // app.service('/api/locations').hooks(require('./locations-graph'))

  //TODO: incluir hooks para o redis. Mudar o nome do arquivo de hooks.
  //app.service('/api/catechists').hooks(require('./catechists-hook'))
}
