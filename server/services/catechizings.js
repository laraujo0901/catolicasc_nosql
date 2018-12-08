'use strict';

var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        var query = 'MATCH (n:catechizing)-[:has]->(s:schoolclass)'
        
        if (params && params.query.school) {
            query += ' WHERE s.school = "' 
                  + params.query.school + '"';
        }

        query += ' RETURN n,s;'

        console.log(query);

        return neo4j.create({ 
            query: query
        })
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async get(id, params) {
        var query = 'MATCH (n:catechizing)-[:has]->(s:schoolclass)'
                  + ' WHERE n.id = {id}'
                  + ' RETURN n,s;';
        return neo4j.create({ 
            query: query,
            params: { id: Number(id) }}
        )
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async create(data, params) {
        console.log("Criando catequisando...");
        
        let query = 'CREATE (n:catechizing {' 
            + 'id:{id},'
            + 'name:{name},'
            + 'phone:{phone},'
            + 'birth_date:{birth_date},'
            + 'father_name:{father_name},'
            + 'mother_name:{mother_name},'
            + 'baptism_date:{baptism_date},'
            + 'eucharist_date:{eucharist_date},'
            + 'address:{address}'
            + '})'
            + ' MERGE (s:schoolclass {'
            + 'school:{school},'
            + 'school_class:{school_class}'
            + '})'
            + ' CREATE (n)-[:has]->(s)';
        
        console.log(query);
        console.log(data);

        return neo4j.create({ 
            query: query, 
            params: { 
                id: Number(data.id),
                name: data.name,
                phone: data.phone,
                birth_date: data.birth_date,
                father_name: data.father_name,
                mother_name: data.mother_name,
                baptism_date: data.baptism_date,
                eucharist_date: data.eucharist_date,
                address: data.address,
                school: data.school,
                school_class: data.school_class }
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
