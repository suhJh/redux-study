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


    function usrMng (state, action) {
        switch (action.type) {
            case INIT: return List(action.serverData.usrList);
            default: return state || List();
        }
    }


    exports.reducers = _.extend({}, exports.reducers, {
        usrMng: usrMng
    });

})(
    window, 
    _, 
    window.Immutable, 
    window.actionTypes
);