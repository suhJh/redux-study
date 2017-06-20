$(function () {

    /**
     * HttpService 전담 객체
     */
    var HttpService = {
        fetch (obj) {
            obj = obj || {};
            console.log('fetch', obj);
            $.ajax({
                url: 'http://localhost:8080' + obj.url,
                data: JSON.stringify(obj.data || {}),
                type: 'POST',
                contentType: 'application/json',
                crossDomain: true,
                success: obj.success || function (data) {
                    console.log('SUCCESS', data);
                },
                error: obj.error || function (data) {
                    console.log('ERROR!!', data);
                    alert(data.responseJSON.message);
                }
            });
        }
    };

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

    /**
     * reducers
     */
    function appMng (state, action) {
        switch (action.type) {
            case INIT: return state.set('sabun', null).set('usrs', Immutable.List(action.usrs));
            case LOGIN: return state.set('sabun', action.sabun);
            case LOGOUT: return state.set('sabun', null);
            default: return state || Immutable.Map({
                usrs: Immutable.List(),
                sabun: null
            });
        }
    }

    function srMng (state, action) {
        switch (action.type) {
            case INIT: return Immutable.List(action.sr); 
            default: return state || Immutable.List();
        }
    }

    function subsrMng (state, action) {
        switch (action.type) {
            case INIT: return Immutable.List(action.subsrs);
            default: return state || Immutable.List();
        }
    }

    function testMng (state, action) {
        switch (action.type) {
            case INIT: return Immutable.List(action.tests);
            default: return state || Immutable.List();
        }
    }


    /**
     * store
     */
    const rootReducer = Redux.combineReducers({
        appMng, srMng, subsrMng, testMng
    });
    let version = 0;
    const store = Redux.createStore(rootReducer);
    store.subscribe(() => { console.log('state버젼: ' + version++, store.getState()); });

    /**
     * selector
     */
     const usrSelector = createSelector(state => state.appMng.get('usrs'), state => state.appMng.get('sabun'), (usrs, sabun) => { return {usrs, sabun}; });

     const srListSelector = createSelector(state => state.srMng, (sr) => { return {sr} });



    /**
     * ViewComponent
     */
    var LoginConponent = Controller.create({
        elements: {
            '#sabun': 'sabun',
            '#loginBtn': 'loginBtn',
            '#logoutBtn': 'logoutBtn'
        },
        events: {
            'click #loginBtn': 'onClickLoginBtn',
            'click #logoutBtn': 'onClickLogoutBtn',
        },
        template: _.template($('#sabun_tmpl').html()),
        render(sabunAndUsrs) {
            const { sabun, usrs } = sabunAndUsrs;
            this.sabun.empty();
            for (var i = 0; i < usrs.size; i++) {
                var obj = usrs.get(i);
                if (obj.sabun == sabun) {
                    obj = _.extend({}, obj, {selected: true});
                } else {
                    obj = _.extend({}, obj, {selected: false});
                }
                var html = this.template(obj);
                this.sabun.append(html);
            }
        },
        onClickLoginBtn() {
            const sabun = this.sabun.val();
            if (!sabun) {
                alert('아이디를 입력하시오.');
                return;
            }
            this.login({ sabun });
        },
        onClickLogoutBtn() {
            this.logout();
        }
    });


    var SrListComponent = Controller.create({
        render() {

        }
    });


    var SrContainer = Controller.create({
        elements: {
            '#sr_all_btn': 'srAllBtn',
            '#sr_process_btn': 'srProcessBtn',
            '#sr_completed_btn': 'srCompletedBtn'
        },
        events: {
            'click #sr_all_btn, #sr_process_btn, #sr_process_btn': 'onClickFilterBtn',
        },
        init() {
            this.SrListComponent = new SrListComponent({ el: this.$('#srListComponent') });
        },
        onClickFilterBtn(e) {
            $('#sr_all_btn, #sr_process_btn, #sr_process_btn').not(e.target).removeClass('active');
            $(e.target).addClass('active');
            const id = $(e.target).attr('id');
            this.SrListComponent.render(id, );
        },
    });


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


    /**
     * App Start
     */
    window.App = new App({ el: $('#App'), service: HttpService, store, 
        usrSelector,
        srListSelector 
    });
});