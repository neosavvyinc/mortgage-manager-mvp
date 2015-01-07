var React = require('react');
var router = require('./routes/routes');
var Q = require('q');

router.run(function(Handler, state){
    var promises = state.routes.filter(function(route){
        return route.handler.data;
    }).reduce(function(promises, route){
        promises[route.name] = route.handler.data(state.params);
        return promises;
    }, {});

    Q.all(promises).then(function(data){
        React.render(<Handler data={data} />, document.body);
    }).catch(function(err){
        console.log('error', err);
    });
});

console.log("app running...");

