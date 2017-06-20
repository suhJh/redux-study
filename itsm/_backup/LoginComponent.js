(function (exports, $, _, Controller) {

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

    exports.Conponents = _.extend({}, exports.Components, { LoginComponent: LoginComponent });

})(window, jQuery, _, window.Controller);