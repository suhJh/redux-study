(function (
    exports, 
    $,
    _, 
    Controller, 
    store, 
    service, 
    createSelector,
    actions,
    dispatch,
    Immutable
) {

    /**
     * actions
     */
    var actionLogin = actions.actionLogin;

    function login (sabun) {
        service.send({
            url: '/login',
            data: { sabun: sabun },
            beforeSend: function (xhr, settings) {

            },
            success: dispatch(actionLogin)
        });
    }


    /**
     * 미들웨어라고 보면 된다. 
     */
     function login (sabun) {
         return function (dispatch, getState) {

            if (getState().appState.login.sabun == 'sabun') return;

            dispatch({
                type: 'LOAD_SUBSR_LIST',
                sabun: sabun
            });

            service.send({
                url: '',
                data: { sabun: sabun },
                success: function (json) {
                    dispatch({
                        type: 'LOAD_SUBSR_SUCCESS',
                        sabun: sabun,
                        subsrList: json
                    });
                },
                error: function (err) {
                    dispatch({
                        type: 'LOAD_SUBSR_FALIURE',
                        err: err
                    });
                }
            });

         }
     }





    var actionLogout = actions.actionLogout;

    function logout () {
        service.send({
            url: '/logout',
            success: dispatch(actionLogout)
        });
    }


    /**
     * state 컴포넌트에 필요한 데이터 선별작업
     */
    function pickLogin (state) { return state.appMng.get('login'); }
    function getUsrs (state) { return state.usrMng }
    function getLoginSabun (state) { return state.appMng.get('sabun')}

    var version = 0;
    var selector = createSelector([pickLogin, getUsrs, getLoginSabun], function (login, usrs, sabun) {
        return {
            login: login,
            usrs: usrs,
            sabun: sabun
        }
    });



    /**
     * view component
     */
    var LoginBox = Controller.create({
        init: function () {
            store.subscribe(this.proxy(this.render));
        },
        template: _.template($('#sabun_tmpl').html()),
        elements: {
            '#sabun': 'sabun'
        },
        events: {
           'click #loginBtn': 'onClickLoginBtn',
           'click #logoutBtn': 'onClickLogoutBtn' 
        },
        onClickLoginBtn() {
            var sabun = this.sabun.val();
            if (!sabun) {
                alert('사번을 체크하여 주십시오.');
                return;
            }
            login(sabun);
        },
        onClickLogoutBtn() {
            logout();
        },
        render: function () {
            var state = selector(store.getState());
            var nowVersion = selector.recomputations();
            if (nowVersion <= version) return;
            else {
                a.b.C.show(`loginBox rerendering ${version} -> ${nowVersion}`, state);
                version = nowVersion;
            }

            this.sabun.empty();
            var compiled = this.template;

            var html = '';
            state.usrs.forEach(function (usr) {
                html += compiled(_.extend({}, usr, {selected: usr.sabun == state.sabun ? true : false }));
            });

            this.sabun.append(html);
        }
    });

    exports.Components = _.extend({}, exports.Components, {
        loginBox: new LoginBox({ el: $('#loginBox') })
    });

})(
    window, 
    jQuery,
    _, 
    window.Controller, 
    window.store, 
    window.httpService,     //  /util/HttpService
    window.createSelector,
    window.actions, //  ./actions/*.js
    window.dispatch, //  ./store.js
    window.Immutable
);