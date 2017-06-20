var store_1 = require('./store');
var reselect_1 = require('reselect');
var dispatch = store_1.default.dispatch, subscribe = store_1.default.subscribe, getState = store_1.default.getState;
var selector = reselect_1.createSelector([function (state) { return state.myFriendsState.isFetching; }], function (isFetching) {
    return isFetching;
});
var messageSelector = reselect_1.createSelector([function (state) { return state.myFriendsState.message; }], function (msg) {
    return msg;
});
var message = '';
subscribe(function () {
    if (selector(getState())) {
    }
    var nowMsg = messageSelector(getState());
    if (nowMsg != message) {
        message = nowMsg;
    }
});
var names = ['니미럴', '김현준', '임성국', '둘리', '도우너', '김정은'];
var ages = [34, 35, 47, 14, 23, 74];
var hobbys = ['춤', '먹기', '컴퓨터', '윳놀이', '공부', '지랄'];
function finding(name) {
    return function (success, fail) {
        setTimeout(function () {
            var person = null;
            for (var i = 0; i < names.length; i++) {
                if (names[i] == name) {
                    person = {
                        name: names[i],
                        age: ages[i],
                        hobby: hobbys[i]
                    };
                    delete names[i];
                    delete ages[i];
                    delete hobbys[i];
                    break;
                }
            }
            if (person) {
                success(person);
            }
            else {
                fail();
            }
        }, 1000);
    };
}
var index = 0;
function async(name) {
    return function (dispatch, getState) {
        if (getState().myFriendsState.byName[name]) {
            console.log("!!!!" + name + "\uC740 \uC774\uBBF8 \uCE90\uC26C\uC5D0 \uC788\uB294 \uC0AC\uB78C\uC785\uB2C8\uB2E4.!!!");
            return getState().myFriendsState.byName[name];
        }
        else {
        }
        dispatch({ type: 'FINDING' });
        return finding(name)(function (person) {
            dispatch({
                type: 'FOUND',
                name: person.name,
                age: person.age,
                hobby: person.hobby
            });
            return person;
        }, function () {
            dispatch({
                type: 'NOT_FOUND',
                name: name
            });
            return null;
        });
    };
}
var who = dispatch(async('서종효'));
setTimeout(function () {
    who = dispatch(async('똘이'));
    setTimeout(function () {
        who = dispatch(async('둘리'));
        setTimeout(function () {
            who = dispatch(async('둘리'));
        }, 1500);
        setTimeout(function () {
            who = dispatch(async('이은순'));
            setTimeout(function () {
                who = dispatch(async('이은순'));
            }, 1000);
            setTimeout(function () {
                who = dispatch(async('도우너'));
            }, 1000);
        }, 1500);
    }, 1000);
}, 2000);
