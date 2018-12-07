'use strict'

var feathersApp = null;
var neo4j = null;

module.exports = {
    async find(params) {
        var query = "MATCH (n:group) RETURN (n)";
        console.log("Recuperando todos os grupos...");
        return neo4j.create({
            query: query
        })
        .then(result => {
            console.log("Retornando grupos!", result);
            return result; 
        })
        .catch(function (error) {
            console.log("Erro ao buscar grupos");
            return [];
        });
    },
    async get(id, param) {
        var query = "MATCH (n:group {id:{id}}) RETURN (n)";
        console.log("Recuperando grupo com id ", id);
        return neo4j.create({
            query: query, 
            params: {id: Number(id)}
        })
        .then(result => {
            console.log("Retornando grupo!",result);
            return result;
        })
        .catch(function (error) {
            console.log("Erro ao buscar o grupo ", id);
            return {};
        });
    },
    async create(data, params) {
        var query = "CREATE (n:group { "
            + "id: {id}, "
            + "begining_time: {begining_time}, "
            + "duration: {duration}, "
            + "week_day: {week_day},"
            + "type: {type},"
            + "room: {room} })"
            + "RETURN (n)";
        console.log("Criando novo grupo! ", data);
        return neo4j.create({
            query: query,
            params: {
                id: Number(data.id),
                begining_time: data.begining_time,
                duration: Number(data.duration),
                week_day: Number(data.week_day),
                type: Number(data.type),
                room: data.room
            }})
            .then(result => {
                console.log("Grupo criado!");
                return data;
            })
            .catch(function (error) {
                console.log("Erro ao buscar o grupo ", id);
                return {};
            });
    },
    async update(id, data, params) {
        console.log("Fazendo UPDATE");
        return {"return":"OK"};
    },
    async patch(id, data, params) {
        console.log("Fazendo PATCH");
        return {"return":"OK"};
    },
    async remove(id, params) {
        console.log("Fazendo REMOVE");
        return {"return":"OK"};
    },
    setup(app, path) {
        feathersApp = app;
        neo4j = feathersApp.service('neo4jf');
    }
};