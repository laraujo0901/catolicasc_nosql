'use strict';

var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        //TODO: obter os filtros de params para restringir o 
        //retorno
        return neo4j.create({ 
            query: 'MATCH (n:catechist) RETURN n;' 
        })
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async get(id, params) {
        return neo4j.create({ 
            query: 'MATCH (n:catechist {id: {id}}) RETURN n;',
            params: { id: Number(id) }}
        )
        .then(res => {
            console.log("Resultado:", res);
            return res;
        });
    },
    async create(data, params) {
        console.log("Criando catequista...");
        
        let query_cat = 'CREATE (n:catechist {'
            + ' id:{cat_id},' 
            + ' name:{name},' 
            + ' phone:{phone}, ' 
            + ' address:{address}})';        

        // Separando o objeto em vários objetos
        let params_cat = {
            cat_id: data.id,
            name: data.name,
            phone: data.phone,
            address: data.address
        }

        let sched_id = data.id + 1;

        let pref_scheds = [];
        if (data.preferred_schedules && data.preferred_schedules.length > 0) {
            data.preferred_schedules.forEach(element => {
                pref_scheds.push({
                    id: sched_id++,
                    week_day: element.week_day,
                    begining_time: element.begining_time
                });
            });
        }

        let restr_scheds = [];
        if (data.restricted_schedules && data.restricted_schedules.length > 0) {
            data.restricted_schedules.forEach(element => {
                restr_scheds.push({
                    id: sched_id++,
                    week_day: element.week_day,
                    begining_time: element.begining_time
                });
            });
        }
        console.log(pref_scheds);
        console.log(restr_scheds);
        
        let db_queries = [];

        db_queries.push({
            query: query_cat,
            params: params_cat
        });
        
        let params_sched = {};
        let query_sched = 'CREATE ';

        if (pref_scheds.length > 0) {
            pref_scheds.forEach(function(value, i){
                if (i > 0) query_sched = query_sched + ',';
                
                query_sched = query_sched + '(n' + String(i) + ':schedule {'
                + ' id: {sched_id_' + String(i) + ' },'
                + ' week_day: {week_day_' + String(i) + '},'
                + ' begining_time: {begining_time_' + String(i) + '}})'
                ;
    
                params_sched["sched_id_" + String(i)] = value.id;
                params_sched['week_day_' + String(i)] = value.week_day;
                params_sched['begining_time_' + String(i)] = value.begining_time;
            });
        }

        if (restr_scheds.length > 0) {
            restr_scheds.forEach(function(value, i){
                if (i > 0) query_sched = query_sched + ',';
                
                query_sched = query_sched + '(n' + String(i) + ':schedule {'
                + ' id: {sched_id_' + String(i) + ' },'
                + ' week_day: {week_day_' + String(i) + '},'
                + ' begining_time: {begining_time_' + String(i) + '}})'
                ;
    
                params_sched["sched_id_" + String(i)] = value.id;
                params_sched['week_day_' + String(i)] = value.week_day;
                params_sched['begining_time_' + String(i)] = value.begining_time;
            });
        }

        console.log(query_sched);
        console.log(params_sched);

        db_queries.push({
            query: query_sched,
            params: params_sched
        });

        return neo4j.create(db_queries)
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
        console.log("Iniciando serviço de catequistas...")
        feathersApp = app;
        neo4j = feathersApp.service('neo4jf')
    }
}
