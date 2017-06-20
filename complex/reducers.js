(function (
    exports, $, _, combineReducers, createStore
) {

function allSubsr (allSubsr, action) {
    switch (action.type) {
        default: return allSubsr || [];
    }
}

function bySubsrNo (subsrs, action) {
    switch (action.type) {
        default: return subsrs || {};
    }
}

var subsrMng = combineReducers({
    allSubsr: allSubsr, 
    bySubsrNo: bySubsr
});



function allSr (allSr, action) {

}


var rootReducers = combineReducers();




})(
    window, jQuery, _, Redux.combineReducers, Redux.createStore
);