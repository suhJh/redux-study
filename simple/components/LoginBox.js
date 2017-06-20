(function (exports, $, _, Controller, store, createSelector) {

    var pickLoginStatus = function (state) {
        return {
            isLogin: state.app.isLogin,
            loginId: state.app.loginId
        }
    }

    var loginStatusSelector = createSelector([pickLoginStatus], function (status) {
        return status;
    });

    var pickUsers = function (state) {
        return state.users.allIds;
    }

    var usersSelector = createSelector([pickUsers], function (allIds) {
        return allIds;
    });

    function idDuplicationCheck (id) {
        var allIds = usersSelector(store.getState());
        for (var i = 0; i < allIds.length; i++) {
            if (allIds[i] == id) return true
        }
        return false;
    }


    var LoginBox = Controller.create({
        elements: {
            '#loginPanel': 'loginPanel',
            '#myInfoPanel': 'myInfoPanel',
            '#userId': 'userId',
            '#inputId': 'inputId',
            '#inputPw': 'inputPw',
            '#regFormModal': 'regFormModal',
            '#duplCheck': 'duplCheck',
            '#regUserId': 'regUserId',
            '#regUserName': 'regUserName',
            '#regUserPw': 'regUserPw',
        },
        events: {
            'click #loginBtn': 'onClickLoginBtn',
            'click #logoutBtn': 'onClickLogoutBtn',
            'click #callRegFormBtn': 'onClickCallRegFormBtn',
            'click #regUserBtn': 'onClickRegUserBtn',
            'keyup #regUserId': 'onKeyupRegUserId'
        },
        renderVersion: 0,
        init: function () {
            store.subscribe(this.proxy(this.render));
        },
        onClickLoginBtn: function () {
            var id = this.inputId.val();
            var pw = this.inputPw.val();

            if (!id || !pw) {
                alert('id와 pw를 모두 입력해주세요.');
                return
            }

            var users = store.getState().users.byId;

            var matchUser = users[id];

            if (!matchUser) {
                alert('회원 아이디가 없습니다.');
                return;
            }

            if (matchUser.pw != pw) {
                alert('비밀번호가 틀렸습니다.');
                return;
            }
            store.dispatch({ type: 'LOGIN', user: matchUser });
        },
        onClickLogoutBtn: function () {
            store.dispatch({ type: 'LOGOUT' });
        },
        onClickCallRegFormBtn: function () {
            this.regFormModal.modal('show');
        },
        onClickRegUserBtn: function () {
            var id = this.regUserId.val();
            var name = this.regUserName.val();
            var pw = this.regUserPw.val();
            if (!(id && name && pw)) {
                alert('입력이 필요한 곳이 있습니다.');
                return;
            }

            var isDupl = idDuplicationCheck(id);
            if (isDupl) {
                alert ('회원이 존재합니다. 다른 아이디를 입력해주십시오.');
                return;
            }
            store.dispatch({ type: 'REG_USER', user: {
                id: id, name: name, pw: pw
            }});
            this.regFormModal.modal('hide');
        },
        onKeyupRegUserId: function () {
            var inputUserId = this.regUserId.val();
            if (!inputUserId) return;
            var isDupl = idDuplicationCheck(inputUserId)
            if (isDupl) {
                this.duplCheck.text('회원이 존재합니다.').css({color: 'red'});
            } else {
                this.duplCheck.text('사용가능한 ID입니다.').css({color: 'green'});
            }
        },
        render: function () {
            var state = loginStatusSelector(store.getState());
            var version = loginStatusSelector.recomputations();

            if (version === this.renderVersion) {
                console.log('loginBox는 랜더가 필요없습니다.');
                return;
            } else {
                this.renderVersion = version;
            }

            if (state.isLogin) {
                this.loginPanel.hide();
                this.myInfoPanel.show();
                this.userId.text(state.loginId);
            } else {
                this.loginPanel.show();
                this.myInfoPanel.hide();
                this.userId.val('');
            }
            this.inputId.val('');
            this.inputPw.val('');
        }
    });

    exports.LoginBox = new LoginBox({ el: $('#loginBox')});

})(
window,
jQuery,
_,
window.Controller,
window.store,
window.createSelector
);