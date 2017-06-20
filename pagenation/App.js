(function (
    exports,
    Controller,
    $,
    _,
    store,
    actions
) {

    var endpoint = 'http://localhost:8080/todo';

    function asyncPageInit () {
        return function (dispatch, getState) {
            $.getJSON({
                url: 'http://localhost:8080/todos/?size=10',
                success: function (payload) {
                    dispatch(fetchPages(0));
                    dispatch(actions.pageInit(payload.page.totalPages, payload.page.totalElements));
                }
            });
        };
    }

    function fetchPages (page) {
        return function (dispatch, getState) {
            var state = getState();
            if (state.pagenations.pages[page]) {
                dispatch({ type: 'GO_PAGE', page: page });
                return;
            }
            dispatch(actions.requestTodoPage(page));

            $.getJSON({
                url: 'http://localhost:8080/todos/?size=10&page=' + page,
                success: function (payload) {
                    var todos = payload._embedded.todoes;
                    dispatch(actions.receiveTodoPage(page, todos));
                }
            })
        };
    }


    var App = Controller.create({
        elements: {
            '#todoText': 'todoText',
            '#pagenations': 'pagenations',
            '#todos': 'todos'
        },
        events: {
            'click #regBtn': 'onClickRegBtn',
            'click .pageBtn': 'onClickPageBtn'
        },
        pagenationTemplate: _.template($('#pagenation-template').html()),
        todosTemplate: _.template($('#todos-template').html()),
        init: function () {
            store.subscribe(this.proxy(this.render));
            store.dispatch(asyncPageInit());
        },
        onClickRegBtn: function () {
            if (!this.todoText) return;
        },
        onClickPageBtn: function (e) {
            e.preventDefault();
            var page = $(e.target).data('page');
            store.dispatch(fetchPages(page));
        },
        render: function () {
            var pagenations = store.getState().pagenations;
            var totalPages = pagenations.totalPages;
            var totalElements = pagenations.totalElements;
            var currentPage = pagenations.currentPage;
            var pages = pagenations.pages;

            var html = '';
            for (var i = 0; i < totalPages; i++) {
                html = html + this.pagenationTemplate(_.extend({}, {
                    index: i
                }));
            }
            this.pagenations.empty().append(html);

            var todos = store.getState().todos;
            var ids = pages[currentPage].ids;

            var html = '';
            for (var i = 0; i < ids.length; i++) {
                html = html + this.todosTemplate(_.extend({}, todos[ids[i]]));
            }

            this.todos.empty().append(html);

            return this;
        }
    });

    exports.App = new App({ el: $('#App') });
})(
    window,
    window.Controller,
    jQuery,
    _,
    window.store,
    window.actions
);