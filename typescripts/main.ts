import store from './store';
import { createSelector } from 'reselect';

const { dispatch, subscribe, getState } = store;


var selector = createSelector([state => state.myFriendsState.isFetching], function (isFetching) {
    return isFetching;
});

var messageSelector = createSelector ([state => state.myFriendsState.message], function (msg) {
    return msg;
});

var message = '';

subscribe(function () {
    if (selector(getState())) {
        //console.log('----찾고 있는 중입니다!!----');
    } 
    var nowMsg = messageSelector(getState());
    if (nowMsg != message) {
        message = nowMsg;
        //console.log(message);
    } 
    //console.log(getState().myFriendsState)
    //console.log(who);
});

let names = ['니미럴', '김현준', '임성국', '둘리', '도우너', '김정은'];
let ages  = [34, 35, 47, 14, 23, 74];
let hobbys = ['춤', '먹기', '컴퓨터', '윳놀이', '공부', '지랄'];

function finding (name: string) {
    return function (success: Function, fail: Function) {
        setTimeout(function() {
            var person = null;
            for (var i = 0; i < names.length; i++) {
                if (names[i] == name) {
                    person = {
                        name: names[i],
                        age: ages[i],
                        hobby: hobbys[i]
                    }
                    delete names[i];
                    delete ages[i];
                    delete hobbys[i];
                    break;
                }
            }
            if (person) {
                success(person);
            } else {
                fail();
            }
        }, 1000);
    }
}


var index = 0;
function async (name: string) {
    return function (dispatch: Function, getState: Function) {
        if (getState().myFriendsState.byName[name]) {
            console.log(`!!!!${name}은 이미 캐쉬에 있는 사람입니다.!!!`);
            return getState().myFriendsState.byName[name];
        } else {
            //console.log(`!!!${name}은 캐쉬에 없으므로 DB에 한번 다녀오겠습니다.`);
        }

        dispatch({ type: 'FINDING' });

        return finding(name)(
            (person) => {
                dispatch({
                    type: 'FOUND',
                    name: person.name,
                    age: person.age,
                    hobby: person.hobby
                })
                return person;
            },
            (): any => {
                dispatch({
                    type: 'NOT_FOUND',
                    name: name
                })
                return null;
            }
        );
    }
}

var who = dispatch(async('서종효'));

setTimeout(function() {
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
