$(function () {

var CREATE_SUBSR = "CREATE_SUBSR";
var DEMOTE_SUBSR = "DEMOTE_SUBSR";
var COMPLETE_SUBSR = "COMPLETE_SUBSR";
var REQ_DSTRB = "REQ_DSTRB";
var FETCH_SERVER = "FETCH_SERVER";
var CHECK = 'CHECK';

function createSubsr (subsr) {
    return {
        type: CREATE_SUBSR,
        subsr: subsr
    }
}

function demoteSubsr (subsrs) {
    return {
        type: DEMOTE_SUBSR,
        subsrs: subsrs
    }
}

function completeSubsr (subsrs) {
    return {
        type: COMPLETE_SUBSR,
        subsrs: subsrs
    }
}

function reqDstrb (subsrs) {
    return {
        type: REQ_DSTRB,
        subsrs: subsrs
    }
}

function fetchServer (srNo, subsrs) {
    return {
        type: FETCH_SERVER,
        srNo: srNo,
        subsrs: subsrs
    }
}

function check (index) {
    return {
        type: CHECK,
        index: index
    }
}


function app (state, action) {
    if (!state) {
        state = {
            srNo: '',
            subsrs: Immutable.List()
        }
    }
    switch (action.type) {
        case CREATE_SUBSR:
            return Object.assign({}, state, {
                subsrs: state.subsrs.push(action.subsr)
            });
        case REQ_DSTRB:
        case COMPLETE_SUBSR:
        case DEMOTE_SUBSR:
        case FETCH_SERVER: 
            return Object.assign({}, state, {
                srNo: action.srNo,
                subsrs: Immutable.List(action.subsrs)
            });
        case CHECK: 
            return Object.assign({}, state, {
                subsrs: state.subsrs.update(action.index, function (me) { return Object.assign({}, me, {checked: !me.checked }); })
            });
        default: return state;
    }
}



/**
 * reducer들을 등록한다.
 */
var rootReducer = Redux.combineReducers({
    app: app,
});

/**
 * reducer를 통해 model을 만든다.
 */
var store = Redux.createStore(rootReducer);


var fetch = function (obj) {
    obj = obj || {};
    $.ajax({
        url: 'http://localhost:8080' + obj.url,
        data: JSON.stringify(obj.data || {}),
        type: 'POST',
        contentType: 'application/json',
        crossDomain: true,
        success: obj.success || function (data) {
            console.log('SUCCESS', data);
        },
        error: obj.error || function (data) {
            console.log('ERROR!!', data);
            alert(data.responseJSON.message);
        }
    });
};


/**
 * subsr 목록이 출력되는 곳
 */
var Container = Controller.create({
    elements: {

    },
    events: {
        'render': 'render',
        'click input:checkbox': 'check'
    },
    init: function () {
        _.templateSettings.variable = 'o';
    },
    check: function (e) {
        var index = $(e.target).data('index');
        this.controller.dispatch(check(index));
    },
    render: function () {
        var tmpl = $('#tmpl').html();
        var render = _.template(tmpl);

        var p = {
            srNo: store.getState().app.srNo,
            list: store.getState().app.subsrs.toJS()
        };

        var result = render(p);
        $('#container').empty().append(result);
    }
});


/**
 * 버튼그룹들
 */
var ActionGroup = Controller.create({
    elements: {
        '#completeSubsr': 'completeBtn',
        '#createSubsr': 'createBtn',
        '#demoteSubsr': 'demoteBtn',
        '#reqDstrb': 'reqDstrbBtn',
    },
    events: {
        'click #completeSubsr': 'completeSubsr',
        'click #createSubsr': 'createSubsr',
        'click #demoteSubsr': 'demoteSubsr',
        'click #reqDstrb': 'reqDstrb',
    },
    init: function () {
        this.container.render();
    },
    completeSubsr: function () {
        alert('complete');
        this.container.trigger('render');
    },
    createSubsr: function () {
        this.pop.show();
    },
    demoteSubsr: function () {
        var subset = this.store.getState().app.subsrs.filter(function (me) { return me.checked }).toJS();

        if (!subset.length) return;

        fetch({
            url: '/demoteSubsr',
            data: subset
        });
    },
    reqDstrb: function () {
        var subset = this.store.getState().app.subsrs.filter(function (me) { return me.checked }).toJS();
        
        var vali = true;
        _.each(subset, function (it) {
            if (it.dstrbStat == '배포요청중' || it.progStat == 'SUBSR종료') {
                vali = false;
            }
            it.dstrbStat = '배포요청중';
        });

        if (!vali) {
            alert('배포요청중이다. 병순아.');
            return;
        }
        fetch({
            url: '/reqDstrb',
            data: subset,
            success: this.controller.proxy(this.controller.fetch)
        });
    },
});

var Pop = Controller.create({
    elements: {
        '#subsrNo': 'subsrNo',
        '#regBtn': 'regBtn',
        '#closeBtn': 'closeBtn'
    },
    events: {
        'hide': 'hide',
        'show': 'show',
        'keypress #subsrNo': 'enter',
        'click #regBtn': 'regSubsr',
        'click #closeBtn': 'hide'
    },
    hide: function () {
        this.subsrNo.val('');
        $(this.el).hide();
    }, 
    show: function () {
        $(this.el).show();
        this.subsrNo.focus();
    },
    enter: function (e) {
        if (e.which == 13) this.regSubsr();
    },
    regSubsr: function () {
        if (!this.subsrNo.val()) {
            alert('subsr번호를 입력하세요');
            return;
        }
        var subsr = {
            subsrNo: this.subsrNo.val(),
            progStat: '',
            dstrbStat: '',
            trfrStge: '',
            chngChrpeNm: ''
        }
        fetch({
            url: '/createSubsr',
            data: subsr,
            success: this.proxy(function () {
                this.controller.dispatch(createSubsr(subsr), this.proxy(this.hide), this.controller.proxy(this.controller.fetch));
            })
        });
    },
});

var Master = Controller.create({
    init: function () {
        this.pop = new Pop({ el: $('#createSubsrPop'), store: store, controller: this });
        this.container = new Container({ el: $('#container'), store: store, controller: this });
        this.actionGroup = new ActionGroup({ el: $('#actionGroup'), container: this.container, store: store, pop: this.pop, controller: this });

        var disconnect = store.subscribe(this.container.render);
        store.subscribe(function () {
            console.log(store.getState());
        });
        this.fetch();

        setInterval(this.proxy(this.fetch), 15000);

    },
    fetch: function () {
        fetch({
            url: '/init',
            data: {},
            success: this.proxy(function (data) {
                console.log('fetched', data);
                this.dispatch(fetchServer(data.srNo, data.subsrs || []));
            })
        });
    },
    dispatch: function (action) {
        store.dispatch(action);
        var callbacks = [].slice.call(arguments, 1);
        if (callbacks) {
            for (var i=0; i<callbacks.length; i++) {
                var cb = callbacks[i];
                if (_.isFunction(cb)) cb();
            }
        }
    }

});

var master = new Master({ el: $('body') });

});
