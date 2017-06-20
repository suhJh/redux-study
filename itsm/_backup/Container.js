(function (exports, $, _, Controller, store, service, actions) {

    function dispatch (action, localData) {
        return function (serverData) {
            store.dispatch(action(serverData, localData));
        }
    }

    function initData () {
        service.fetch({
            url: '/init',
            data: {},
            success: dispatch(actions.actionInit)
        });
    }

    var App = Controller.create({
        init: function () {

        },
        login (data) {
            this.service.fetch({ url: '/login', data, success: this.proxy(this.dispatch(actionLogin, data)) });
        },
        logout () {
            this.service.fetch({ url: '/logout', success: this.proxy(this.dispatch(actionLogout)) });
        },
    });

    exports.App = App;

})(window, jQuery, _, window.Controller, window.store, window.HttpService, window.actions);