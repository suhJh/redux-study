(function (exports, _) {

    var LOGIN = 'LOGIN';
    var LOGOUT = 'LOGOUT';

    exports.actionTypes = _.extend({}, exports.actionTypes, {
        LOGIN: LOGIN,
        LOGOUT: LOGOUT
    });

    exports.actions = _.extend({}, exports.actions, {
        actionLogin: function (serverData) {
            return {
                type: LOGIN,
                sabun: serverData.sabun,
                login: serverData.login,
                name: serverData.name,
                role: serverData.role
            }
        },
        actionLogout: function () {
            return {
                type: LOGOUT
            }
        }
    });

})(window, _);