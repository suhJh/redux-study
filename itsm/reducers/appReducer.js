(function (
    exports, 
    _, 
    Immutable, 
    actionTypes
) {

    var List = Immutable.List;
    var Map = Immutable.Map;

    var INIT    = actionTypes.INIT;
    var LOGIN   = actionTypes.LOGIN;
    var LOGOUT  = actionTypes.LOGOUT;
    var FETCHING = actionTypes.FETCHING;


    function appMng (state, action) {
        switch (action.type) {
            case INIT: return state;
            case FETCHING: return state.set('isFetching', !state.get('isFetching'));
            case LOGIN: return state.set('login', true).set('sabun', action.sabun).set('name', action.name).set('role', action.role);
            case LOGOUT:return state.set('login', false).set('sabun', null).set('name', null).set('role', null);
            default: return state || Map({
                login: false,
                sabun: null,
                name: null,
                roll: null,
                isFetching: false
            });
        }
    }


    exports.reducers = _.extend({}, exports.reducers, {
        appMng: appMng
    });

})(
    window, 
    _, 
    window.Immutable, 
    window.actionTypes
);