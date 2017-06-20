(function (
    exports, 
    $, 
    _, 
    store,
    actions,
    Controller,
    service
) {

    function getFetchingState (state) { return state.appMng.get('isFetching'); }
    var isFetching = createSelector([getFetchingState], function (isFetching) {
        return isFetching;
    });

    var actionInit = actions.actionInit;

    function initApp () {
        service.send({
            url: '/init',
            success: dispatch(actionInit)
        });
    }


    var App = Controller.create({
        elements: {
            '#progress': 'progress'
        },
        init: function () {
            store.subscribe(this.proxy(this.showProgressbar));
            //  store.subscribe(this.proxy(this.render));
            //  store.dispatch(actionInit());
            initApp();

            setInterval(initApp, 60000);
        },
        showProgressbar() {
            var flag = isFetching(store.getState());
            if (flag) {
                this.progress.show();
            } else {
                this.progress.hide();
            }
        }
    });

    exports.Components = _.extend({}, exports.Components, {
        app: new App({ el: $('#App') })
    });


})(
    window, 
    jQuery, 
    _, 
    window.store,
    window.actions,
    window.Controller,
    window.httpService
);