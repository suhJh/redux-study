(function (exports, $, store, service) {


    function init () {

    }



    var App = Controller.create({
        init: function () {
            this.store.subscribe(this.proxy(this.renderMachine));
            this.LoginComponent = new LoginConponent({ el: this.$('#loginComponent'), login: this.proxy(this.login), logout: this.proxy(this.logout) });
            this.SrContainer = new SrContainer({ el: this.$('#srContainer') });
            this.initData();
        },
        initData () {
            this.service.fetch({ url: '/init', data: {}, success: this.proxy(this.dispatch(actionInit)) });
        },
        login (data) {
            this.service.fetch({ url: '/login', data, success: this.proxy(this.dispatch(actionLogin, data)) });
        },
        logout () {
            this.service.fetch({ url: '/logout', success: this.proxy(this.dispatch(actionLogout)) });
        },
        dispatch(action, localData) {
            return function (serverData) {
                this.store.dispatch(action(serverData, localData));
            }
        },
        version: {
            usrs: 0
        },
        renderMachine() {  
            console.log(this.version);
            const sabunAndUsrs = this.usrSelector(this.store.getState());
            const version = this.usrSelector.recomputations();
            if (this.version.usrs != version) {
                this.version.usrs = version;
                this.LoginComponent.render(sabunAndUsrs);
            }
        }
    });

    exports.App = App;





})(window, jQuery, window.store, window.HttpService);