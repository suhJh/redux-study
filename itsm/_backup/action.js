
(function (exports) {

    /**
     * actions
     */
    const INIT = 'INIT';
    function actionInit (server) {
        return { type: INIT, subsrs: server.subsrs, sr: server.sr, tests: server.tests, usrs: server.usrs };
    }
    const LOGIN = 'LOGIN';
    function actionLogin (server, local) {
        return { type: LOGIN, sabun: local.sabun };
    }
    const LOGOUT = 'LOGOUT';
    function actionLogout () {
        return { type: LOGOUT };
    }

    exports.actions = {
        INIT, LOGIN, LOGOUT,
        actionInit,
        actionLogin,
        actionLogout
    }

})(window);    