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
        
        let db_queries = [];
        let query_prefer = null;
        let params_prefer = null;
        let query_restr = null;
        let params_restr = null;
    
        db_queries.push({
            query: query_cat,
            params: params_cat
        });
            
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

            let id_list = pref_scheds.map(elem => {
                return elem.id;
            });
            
            // Relacionar estes horarios ao catequista
            // (cat)-[:prefer]->(sch)
            query_prefer = 'match (cat:catechist),(sch:schedule)' 
                + ' where cat.id={cat_id} and sch.id in {id_list}'
                + ' create (cat)-[:prefer]->(sch) return (cat),(sch)';

            params_prefer = {
                cat_id: data.id,
                id_list: id_list
            };

            //console.log(query_prefer);
            //console.log(params_prefer);
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

            let id_list = restr_scheds.map(elem => {
                return elem.id;
            });
            
            // Relacionar estes horarios ao catequista
            // (cat)-[:restrict]->(sch)
            query_restr = 'match (cat:catechist),(sch:schedule)' 
                + ' where cat.id={cat_id} and sch.id in {id_list}'
                + ' create (cat)-[:restrict]->(sch) return (cat),(sch)';

            params_restr = {
                cat_id: data.id,
                id_list: id_list
            };

            //console.log(query_restr);
            //console.log(params_restr);
        }

        //console.log(pref_scheds);
        //console.log(restr_scheds);        
        
        let params_sched = {};
        let query_sched = null;
        let j = 0;
        let str_j = "";

        if (pref_scheds.length > 0) {
            query_sched = 'CREATE ';
            pref_scheds.forEach(function(value, i){
                if (i > 0) query_sched += ',';
                
                str_j = String(j++);

                query_sched += '(n' + str_j + ':schedule {'
                    + ' id: {sched_id_' + str_j + ' },'
                    + ' week_day: {week_day_' + str_j + '},'
                    + ' begining_time: {begining_time_' + str_j + '}})';
    
                params_sched["sched_id_" + str_j] = value.id;
                params_sched['week_day_' + str_j] = value.week_day;
                params_sched['begining_time_' + str_j] = value.begining_time;
            });
        }

        if (restr_scheds.length > 0) {
            if (!query_sched) { 
                query_sched = 'CREATE ';
            } else {
                query_sched += ',';
            }
            restr_scheds.forEach(function(value, i){
                if (i > 0) query_sched += ',';
                
                str_j = String(j++);

                query_sched += '(n' + str_j + ':schedule {'
                    + ' id: {sched_id_' + str_j + ' },'
                    + ' week_day: {week_day_' + str_j + '},'
                    + ' begining_time: {begining_time_' + str_j + '}})';
    
                params_sched["sched_id_" + str_j] = value.id;
                params_sched['week_day_' + str_j] = value.week_day;
                params_sched['begining_time_' + str_j] = value.begining_time;
            });
        }

        //console.log(query_sched);
        //console.log(params_sched);

        if (query_sched) {
            db_queries.push({
                query: query_sched,
                params: params_sched
            });

            if (query_prefer) {
                db_queries.push({
                    query: query_prefer,
                    params: params_prefer
                });
            }
            if (query_restr) {
                db_queries.push({
                    query: query_restr,
                    params: params_restr
                });
            }
        }

        //console.log(db_queries);

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
