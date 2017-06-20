var redux_1 = require('redux');
var redux_thunk_1 = require('redux-thunk');
var reducers_1 = require('./reducers');
function logger(_a) {
    var getState = _a.getState;
    return function (next) { return function (action) {
        //console.log(action);
        //console.log('will dispatch', action.type)
        var returnValue = next(action);
        return returnValue;
    }; };
}
var rootReducer = redux_1.combineReducers(reducers_1.default);
exports.default = redux_1.createStore(rootReducer, redux_1.applyMiddleware(logger, redux_thunk_1.default));
