(function (exports, Redux, reducers, actions) {
    
    if (typeof reducers != 'object') throw new Error('reducer는 순수 오브젝트이어야 합니다.');

    function logger(arg) {
        var getState = arg.getState;
        return function (next) {
            return function (action) {
                console.log('dispatch됩니다.', action);
                var returnValue = next(action);
                console.log('after state', getState());
                return returnValue;
            }
        }
    }

    var _extends = Object.assign || function (target) { 
        for (var i = 1; i < arguments.length; i++) { 
            var source = arguments[i]; 
            for (var key in source) { 
                if (Object.prototype.hasOwnProperty.call(source, key)) { 
                    target[key] = source[key]; 
                } 
            } 
        } return target; 
    };

    function _toConsumableArray(arr) { 
        if (Array.isArray(arr)) { 
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { 
                arr2[i] = arr[i]; 
            } 
            return arr2; 
        } else { 
            return Array.from(arr);
        } 
    }

    function compose() {
        for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
        }

        if (funcs.length === 0) {
            return function (arg) {
            return arg;
            };
        }

        if (funcs.length === 1) {
            return funcs[0];
        }

        return funcs.reduce(function (a, b) {
            return function () {
                return a(b.apply(undefined, arguments));
            };
        });
    }

    function applyMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }
        return function (createStore) {
            return function (reducer, preloadedState, enhancer) {
                var store = createStore(reducer, preloadedState, enhancer);
                var _dispatch = store.dispatch;
                var chain = [];

                var middlewareAPI = {
                    getState: store.getState,
                    dispatch: function dispatch(action) {
                        return _dispatch(action);
                    }
                };
                chain = middlewares.map(function (middleware) {
                    return middleware(middlewareAPI);
                });
                _dispatch = compose.apply(undefined, _toConsumableArray(chain))(store.dispatch);

                return _extends({}, store, {
                    dispatch: _dispatch
                });
            };
        };
    }

    function createThunkMiddleware(extraArgument) {
        return function (store) {
            var dispatch = store.dispatch,
                getState = store.getState;
            return function (next) {
                return function (action) {
                    if (typeof action === 'function') {
                        return action(dispatch, getState, extraArgument);
                    }
                    return next(action);
                };
            };
        };
    }

    var thunk = createThunkMiddleware();
    thunk.withExtraArgument = createThunkMiddleware;

    var rootReducers = Redux.combineReducers(reducers);

    exports.store = Redux.createStore(rootReducers, applyMiddleware(logger, thunk));

    //  dispatch 미들웨어
    exports.dispatch = function (action, local) {
        store.dispatch(actions.actionFetching());
        
        return function (server) {
            store.dispatch(action(server || local));
            store.dispatch(actions.actionFetching());
        }
    }

})(window, window.Redux, window.reducers, window.actions);