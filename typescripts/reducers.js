var actionTypes_1 = require('./actionTypes');
function appReducer(state, action) {
    switch (action.type) {
        case actionTypes_1.LOADING: return Object.assign({}, state, { isLoading: true });
        default: return state || { selected: 'selected', isLoading: false };
    }
}
function srReducer(state, action) {
    switch (action.type) {
        case 'ADD_SR':
            return Object.assign({}, state, { srNo: action.srNo, progStat: action.progStat });
        case 'DEL_SR': return Object.assign({}, state, { srNo: '', progStat: '' });
        default: return state || { srNo: '', progStat: '' };
    }
}
function myFriendsReducer(state, action) {
    switch (action.type) {
        case 'FINDING': return Object.assign({}, state, {
            isFetching: true,
            message: '찾는 중입니다.'
        });
        case 'FOUND': return Object.assign({}, state, {
            isFetching: false,
            byName: Object.assign({}, state.byName, (_a = {},
                _a[action.name] = {
                    name: action.name,
                    age: action.age,
                    hobby: action.hobby
                },
                _a
            )),
            allName: [].concat(state.allName, [action.name]),
            message: "\t\t" + action.name + "\uB2D8\uC744 \uCC3E\uC558\uC2B5\uB2C8\uB2E4."
        });
        case 'NOT_FOUND': return Object.assign({}, state, {
            isFetching: false,
            message: "\t\t\tDB\uC5D0 " + action.name + "\uB2D8\uC774 \uC548\uACC4\uC2ED\uB2C8\uB2E4."
        });
        default: return state || {
            isFetching: false,
            byName: {
                '서종효': {
                    name: '서종효',
                    age: 34,
                    hobby: '기타치기'
                }
            },
            allName: [],
            message: ''
        };
    }
    var _a;
}
exports.default = {
    appState: appReducer,
    srState: srReducer,
    myFriendsState: myFriendsReducer
};
