(function (exports, reducers, Redux) {

    /**
     * store
     */
    const rootReducer = Redux.combineReducers({
        appMng, srMng, subsrMng, testMng
    });
    const store = Redux.createStore(rootReducer);

    exports.store = store;

    var version = 0;
    store.subscribe(function () {
        version = version + 1;
        console.log('state version: ' + version, store.getState());
    });

})(window, window.reducers, window.Redux);