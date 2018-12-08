module.exports = {
    after: {
        find(context) {            
            if (context.result) {
                var modified = [];
                console.log("Hook after find: ",context.result);
                context.result.forEach(element => {
                    var catechizing = element.n.properties;
                    var schoolclass = element.s.properties;
                    var merged = Object.assign(catechizing,schoolclass);
                    modified.push(merged);
                });
                context.dispatch = modified;
                console.log("Modified result: ", modified);
            }
        },
        get(context) {
            if (context.result) {
                var modified = [];
                //console.log("Hook after get: ",context.result);
                context.result.forEach(element => {
                    var catechizing = element.n.properties;
                    var schoolclass = element.s.properties;
                    var merged = Object.assign(catechizing,schoolclass);
                    modified.push(merged);
                });
                context.dispatch = modified[0];
                //console.log("Modified result: ", modified[0]);
            }
        }
    }
};