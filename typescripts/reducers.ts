import { ADD_SR, DEL_SR, LOADING } from './actionTypes';


function appReducer (state, action) {
    switch (action.type) {
        case LOADING: return Object.assign({}, state, { isLoading: true });
        default: return state || { selected: 'selected', isLoading: false };
    }
}

function srReducer (state, action) {
    switch (action.type) {
        case 'ADD_SR': 
        return Object.assign({}, state, { srNo: action.srNo, progStat: action.progStat });
        case 'DEL_SR': return Object.assign({}, state, { srNo: '', progStat: '' });
        default: return state || { srNo: '', progStat: '' };
    }
}

function myFriendsReducer (state, action) {
    switch (action.type) {
        case 'FINDING': return Object.assign({}, state, {
            isFetching: true,
            message: '찾는 중입니다.'
        });
        case 'FOUND': return Object.assign({}, state, {
            isFetching: false,
            byName: Object.assign({}, state.byName, {
                [action.name]: {
                    name: action.name,
                    age: action.age,
                    hobby: action.hobby
                }
            }),
            allName: [].concat(state.allName, [action.name]),
            message: `\t\t${action.name}님을 찾았습니다.`
        });
        case 'NOT_FOUND': return Object.assign({}, state, {
            isFetching: false,
            message: `\t\t\tDB에 ${action.name}님이 안계십니다.`
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

        }
    }
}

export default {
    appState: appReducer,
    srState: srReducer,
    myFriendsState: myFriendsReducer 
}
