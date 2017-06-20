(function (
    exports, 
    _
) {

    var INIT = 'INIT';
    var FETCHING = 'FETCHING';

    exports.actionTypes = _.extend({}, exports.actionTypes, {
        INIT: INIT,
        FETCHING: FETCHING
    });

    exports.actions = _.extend({}, exports.actions, {
        actionInit: function (serverData) {
            return {
                type: INIT,
                serverData: serverData
            }
        },
        actionFetching: function () {
            return {
                type: FETCHING
            }
        }
    });

})(
    window, 
    _
);