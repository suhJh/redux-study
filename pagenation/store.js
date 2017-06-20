(function (
    exports,
    createStore,
    applyMiddleware,
    thunk,
    reducers
) {
    function logger({getState}) {
        return (next) => (action) => {
            console.log(action);
            console.log('will dispatch', action.type)

            let returnValue = next(action)
            console.log('state after dispatch', getState())
            return returnValue
        }
    }

    exports.store = createStore(reducers, applyMiddleware(logger, thunk));

})(
    window,
    window.Redux.createStore,
    window.Redux.applyMiddleware,
    window.ReduxThunk['default'],
    window.reducers
);