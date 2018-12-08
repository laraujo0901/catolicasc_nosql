
module.exports = {
    after: {
      create(context) {
          //TODO: usar o service neo4jf
        var session = neo4jDriver.session();
        console.log('Criando nó...')
        session
          .run('CREATE (n:Catechist { id : {id}, name : {nameParam},  phone : {phoneParam} }) RETURN n AS catechist', 
            {
              id: context.result._id.toString(),
              nameParam: context.result.name,
              phoneParam: context.result.phone,
            })
          .then(result => {
            console.log('terminou:', result)
            // console.log('Graph node created:', result.records)
            session.close();
          })
          .catch(function (error) {
            console.log('Error creating node:', error)
          });
      },
  
      update(context) {
        // if(context.result.schedules && context.result.schedules.length > 0) {
        //   var updateRoutes = 'MATCH (n_from:Catechist {id: {id}}), \n'
        //   updateSchedules += context.result.routes.map(r => '(n_' + r.target.toString() + ':Location {mongo_id: {n_' + r.target.toString() + '}})').join(',\n')
        //   updateSchedules += '\n' + context.result.routes.map(r => 'MERGE (n_from)-[:ACCESS {distance: {d_' + r.target.toString() + '}}]-(n_' + r.target.toString() + ')').join('\n')
        //   updateSchedules += '\nRETURN n_from, ' + context.result.routes.map(r => 'n_' + r.target.toString()).join(', ')
  
        //   var params =  {
        //     mongo_id: context.result._id.toString()
        //   }
        //   context.result.routes.forEach(r => {
        //     params['n_' + r.target.toString()] = r.target.toString()
        //     params['d_' + r.target.toString()] = r.distance
        //   })
  
        //   // console.log('stmt:', updateRoutes)
        //   // console.log('params:', params)
  
        //   var session = neo4jDriver.session();
        //   session
        //     .run(updateRoutes, params)
        //     .then(result => {
        //       // console.log('Graph node created:', result.records)
        //       session.close();
        //     })
        //     .catch(function (error) {
        //       console.log('Error creating node:', error)
        //     });
        // }
      },
    },
  
    error(context) {
      console.error(`Error in ${context.path} calling ${context.method} method`, context.error);
    }
  }