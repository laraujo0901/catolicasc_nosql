module.exports = {
    after: {
        find(context) {            
            if (context.result) {
                var modified = [];
                //console.log("Hook after find: ",context.result);
                context.result.forEach(element => {
                    modified.push(element.n.properties);
                });
                context.dispatch = modified;
                //console.log("Modified result: ", modified);
            }
        },
        get(context) {
            if (context.result) {
                var modified = [];
                //console.log("Hook after get: ",context.result);
                context.result.forEach(element => {
                    modified.push(element.n.properties);
                });
                context.dispatch = modified[0];
                //console.log("Modified result: ", modified[0]);
            }
        }
    }
};