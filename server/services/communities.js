'use strict'

//const neo4jService = require('feathers-neo4j-driver');
//const neo4j = neo4jService({
//    uri: 'http://localhost:7474',
//    user: 'neo4j',
//    pass: 'teste'
//});
var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        return neo4j.create({
            query: 'MATCH (n:community) RETURN (n);'
        })
        .then(res => {
            console.log("Resultado:",res)
            return res;
        });
    },
    async get(id, params) {
        console.log("Procurando comunidade com id ", id, typeof(id));
        return neo4j.create({
            query: 'MATCH (n:community{id:{id}}) RETURN (n);',
            params: {id: Number(id)}
        })
        .then(res => {
            console.log("Resultado:",res)
            return res;
        });
    },
    async create(data, params) {
        let query = 'CREATE (n:community {' 
            + ' id:{id},'
            + ' name:{name},'
            + ' address:{address}})';
        
        return neo4j.create({ 
                query: query, 
                params: {
                    id: Number(data.id),
                    name: data.name,
                    address: data.address 
                }
            })
            .then(res => {
                return data;
            })
            .catch(function (error) {
                console.log("Erro ao criar comunidade.");
            });
    },
    async update(id, data, params) {},
    async patch(id, data, params) {},
    async remove(id, params) {},
    setup(app, path) {
        console.log("Setup de comunidades!");
        feathersApp = app;
        neo4j = feathersApp.service('neo4jf');
    }
};