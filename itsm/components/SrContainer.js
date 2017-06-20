(function (
    exports, 
    $,
    _, 
    Controller, 
    store, 
    service, 
    createSelector,
    actions,
    dispatch
) {


    /**
     * state 컴포넌트에 필요한 데이터 선별작업
     */
    function getSrList (state) {
        return state.srMng;
    }

    function getSabun (state) {
        return state.appMng.get('sabun');
    } 
    
    function getName (state) {
        return state.appMng.get('name');
    }
    
    var selector = createSelector([getSabun, getName, getSrList], function (sabun, name, srList) {
        return {
            sabun: sabun,
            name: name,
            srList: srList
        }
    });



    /**
     * actions
     */
    var actionFetchSrList = actions.actionFetchSrList;

    function fetchSrList () {
        service.send({
            url: '/fetchSrList',
            success: dispatch(actionFetchSrList)
        });
    }

    function registSr (data) {
        return function () {
            if (typeof data != 'object') new Error('data는 오브젝트여야 합니다.');
            service.send({
                url: '/registSr',
                data: data,
                success: fetchSrList 
            });
        }
    }

    function makeASandwichWithSecretSauce(forPerson) {

        // Invert control!
        // Return a function that accepts `dispatch` so we can dispatch later.
        // Thunk middleware knows how to turn thunk async actions into actions.

        return function (dispatch) {
            return registSr().then(
                sauce => dispatch(makeASandwich(forPerson, sauce)),
                error => dispatch(apologize('The Sandwich Shop', forPerson, error))
            )
        }
    }


    var RegSrComponent = Controller.create({
        mod: 'reg',
        elements: {
            '#srNo': 'srNo',
            '#regpeNm': 'regpeNm',
            '#regpeSabun': 'regpeSabun',
            '#title': 'title',
            '#con': 'con'
        },
        events: {
            'click #submitBtn': 'onClickSubmitBtn',
            'click #cancelBtn': 'onClickCancelBtn'
        },
        init () {
            store.subscribe(this.proxy(this.render));
        },
        validation () {
            if (!this.regpeNm || !this.regpeSabun) {
                alert('등록자가 없습니다.')
                return false;
            } else if (!this.title.val()) {
                alert('제목을 입력하세요.');
                return false;
            } else if (!this.con.val()) {
                alert('내용을 입력하세요.');
                return false;
            }
            return true;
        },
        clearFields () {
            this.title.val('');
            this.con.val('');
        },
        onClickSubmitBtn () {
            if (!this.validation()) return;
            registSr({
                title: this.title.val(),
                con: this.con.val(),
                regpeSabun: this.regpeSabun.val(),
                regpeNm: this.regpeNm.val()
            });
            this.clearFields();
        },
        onClickCancelBtn () {
            if (confirm('취소하시겠습니까?')) {
                this.clearFields();
            }
        },
        render () {
            var state = selector(store.getState());
            this.regpeSabun.val(state.sabun);
            this.regpeNm.val(state.name);
        }
    });



    /**
     * view component
     */
    var SrContainer = Controller.create({
        currentTab: 'sr_all_btn',
        init: function () {
            store.subscribe(this.proxy(this.render));
        },
        elements: {
            '#srListComponent': 'srListComponent',
            '#srListContainer': 'srListContainer',
            '#regSrComponent': 'regSrComponent'
        },
        events: {
            'click #sr_all_btn, #sr_process_btn, #sr_completed_btn': 'onClickShowTab',
            'click #sr_regist_btn': 'onClickRegTab'
        },
        onClickShowTab (e) {
            this.srListContainer.show();
            this.regSrComponent.hide();
            var clickedTab = $(e.target);
            if ((clickedTab).is('a')) {
                clickedTab = clickedTab.closest('li');
            } 

            $('#sr_all_btn, #sr_process_btn, #sr_completed_btn, #sr_regist_btn').not(e.target).removeClass('active');
            clickedTab.addClass('active');

            this.currentTab = clickedTab.attr('id');
            this.render();
        },
        onClickRegTab (e) {
            this.srListContainer.hide();
            this.regSrComponent.show();
            var clickedTab = $(e.target);
            if ((clickedTab).is('a')) {
                clickedTab = clickedTab.closest('li');
            } 
            $('#sr_all_btn, #sr_process_btn, #sr_completed_btn, #sr_regist_btn').not(e.target).removeClass('active');
            clickedTab.addClass('active');
            this.currentTab = clickedTab.attr('id');

        },
        template: _.template($('#sr_tmpl').html()),
        render: function () {

            var state = selector(store.getState());

            var html = '';
            var index = 1;
            var currentTab = this.currentTab;

            for (var i=0; i<state.srList.size; i++) {
                var sr = state.srList.get(i);
                if ('sr_process_btn' == currentTab && sr.progStat != '103') {
                    continue;
                } else if ('sr_completed_btn' == currentTab && sr.progStat != '104') {
                    continue;
                }
                var sr = _.extend({}, sr, {index: index++});
                html += this.template(sr);
            }
            this.srListComponent.empty().append(html);
        }
    });

    exports.Components = _.extend({}, exports.Components, {
        regSrComponent: new RegSrComponent({ el: $('#regSrComponent') }),
        srContainer: new SrContainer({ el: $('#srContainer') })
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
    window.dispatch //  ./store.js
);