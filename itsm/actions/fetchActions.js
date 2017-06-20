(function (exports, _) {

    var FETCH_SR_LIST = 'FETCH_SR_LIST';
    var FETCH_USR_LIST = 'FETCH_USR_LIST';
    var FETCH_SUBSR_LIST = 'FETCH_SUBSR_LIST';


    exports.actionTypes = _.extend({}, exports.actionTypes, {
        FETCH_SR_LIST: FETCH_SR_LIST,
        FETCH_USR_LIST: FETCH_USR_LIST,
        FETCH_SUBSR_LIST: FETCH_SUBSR_LIST
    });

    exports.actions = _.extend({}, exports.actions, {
        actionFetchSrList: function (serverData) {
            return {
                type: FECH_SR_LIST,
                srList: serverData,
            }
        },
        actionFetchSubsrList: function (serverData) {
            return {
                type: FETCH_USR_LIST,
                subsrList: serverData
            }
        },
        actionFetchUsrList: function (serverData) {
            return {
                type: FETCH_SUBSR_LIST,
                usrList: serverData
            }
        }
    });

})(window, _);