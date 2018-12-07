'use strict';

var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        //TODO: obter os filtros de params para restringir o 
        //retorno
        return neo4j.create({ 
            query: 'MATCH (n:catechist) return n;' 
        })
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async get(id, params) {
        return neo4j.create({ 
            query: 'MATCH (n:catechist {id: {id}} return n);',
            params: { id: Number(id) }}
        )
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async create(data, params) {
        console.log("Criando catequista...");
        
        let query = 'CREATE (n:catechist {' + 
        ' id:{id},' + 
        ' name:{name},' + 
        ' phone:{phone}, ' +
        ' address:{address}})';
        
        return neo4j.create({ 
            query: query, 
            params: { 
                id: Number(data.id),
                name: data.name,
                phone: data.phone,
                address: data.address }
            })
            .then(res => res);
        },
        async update(id, data, params) {
            //    return neo4j.create(/*neo4j args here!*/)
            return data;
        },
        async patch(id, data, params) {
            //  return neo4j.create(/*neo4j args here!*/)
            return data;
        },
        async remove(id, params) {
            //  return neo4j.create(/*neo4j args here!*/)
            return {"removed":id};
        },
        setup(app, path) {
            //instantiate neo4j plugin here
            console.log("Iniciando serviço de catequistas...")
            feathersApp = app;
            neo4j = feathersApp.service('neo4jf')
        }
    }