(function (
    exports, 
    _, 
    Immutable, 
    actionTypes
) {

    var List = Immutable.List;
    var Map = Immutable.Map;
    var fromJS = Immutable.fromJS;

    var INIT = actionTypes.INIT;
    var FETCH_SR_LIST = actionTypes.FETCH_SR_LIST;

    function srMng (state, action) {
        switch (action.type) {
            case INIT: return List(action.serverData.srList);
            case FETCH_SR_LIST: return List(action.srList);
            default: return state || List();
        }
    }


    exports.reducers = _.extend({}, exports.reducers, {
        srMng: srMng
    });

})(
    window, 
    _, 
    window.Immutable, 
    window.actionTypes
);