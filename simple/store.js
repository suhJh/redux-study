(function (
    exports,
    $,
    _,
    Redux,
    reducers,
    thunk
) {

    function logger({getState}) {
        return (next) => (action) => {
            console.log(action);
            console.log('will dispatch', action.type)

            let returnValue = next(action)
            console.log('state after dispatch------------------------------------------------------\n', getState())
            return returnValue
        }
    }


    var rootReducer = Redux.combineReducers({
        app: reducers.appManager,
        users: reducers.userManager,
        posts: reducers.postManager,
        comments: reducers.commentManager
    });


    var store = Redux.createStore(rootReducer, Redux.applyMiddleware(logger, thunk));

    exports.store = store;

})(
    window, 
    jQuery,
    _, 
    window.Redux,
    window.reducers,
    window.ReduxThunk['default']
);