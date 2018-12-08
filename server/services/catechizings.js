'use strict';

var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        //TODO: obter os filtros de params para restringir o 
        //retorno
        return neo4j.create({ 
            query: 'MATCH (n:catechizing) RETURN n;' 
        })
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async get(id, params) {
        return neo4j.create({ 
            query: 'MATCH (n:catechizing {id: {id}}) RETURN n;',
            params: { id: Number(id) }}
        )
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async create(data, params) {
        console.log("Criando catequisando...");
        
        let query = 'CREATE (n:catechizing { ' 
            + 'id:{id},'
            + 'name:{name},'
            + 'phone:{phone},'
            + 'birth_date:{birth_date},'
            + 'father_name:{father_name},'
            + 'mother_name:{mother_name},'
            + 'baptism_date:{mother_name},'
            + 'eucharist_date:{eucharist_date},'
            + 'address:{address}})';
        
        return neo4j.create({ 
            query: query, 
            params: { 
                id: Number(data.id),
                name: data.name,
                phone: data.phone,
                birth_date: data.birth_date,
                father_name: data.father_name,
                mother_name: data.mother_name,
                baptism_date: data.mother_name,
                eucharist_date: data.eucharist_date,
                address: data.address }
            })
            .then(res => {
                return data;
            });
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
            console.log("Iniciando serviço de catequisandos...")
            feathersApp = app;
            neo4j = feathersApp.service('neo4jf')
        }
    }
