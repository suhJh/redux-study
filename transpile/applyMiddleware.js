function compose() {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i - 0] = arguments[_i];
    }
    if (funcs.length === 0) {
        return function (arg) { return arg; };
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce(function (a, b) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return a(b.apply(void 0, args));
    }; });
}
function applyMiddleware() {
    var middlewares = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        middlewares[_i - 0] = arguments[_i];
    }
    return function (createStore) { return function (reducer, preloadedState, enhancer) {
        var store = createStore(reducer, preloadedState, enhancer);
        var dispatch = store.dispatch;
        var chain = [];
        var middlewareAPI = {
            getState: store.getState,
            dispatch: function (action) { return dispatch(action); }
        };
        chain = middlewares.map(function (middleware) { return middleware(middlewareAPI); });
        dispatch = compose.apply(void 0, chain)(store.dispatch);
        return {
            store: store,
            dispatch: dispatch
        };
    }; };
}
