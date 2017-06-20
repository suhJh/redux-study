(function (
    exports,
    $,
    _,
    combineReducers
) {


    function pages (pages, action) {
        switch (action.type) {
            case 'REQUEST_TODO_PAGE': 
                return Object.assign({}, pages, {
                    [action.payload.page]: {
                        ids: [],
                        fetching: true
                    }
                });
            case 'RECEIVE_TODO_PAGE':
                return Object.assign({}, pages, {
                    [action.payload.page]: {
                        ids: _.map(action.payload.todos, function (todo) { return todo.id; }),
                        fetching: true
                    }
                });
            default: return pages || {};
        }
    }

    function currentPage (currentPage, action) {
        if (!currentPage) currentPage = 0;
        switch (action.type) {
            case 'REQUEST_TODO_PAGE': return action.payload.page;
            case 'GO_PAGE': return action.page;
            default: return currentPage;
        }
    }

    function totalPages (totalPages, action) {
        if (!totalPages) totalPages = 1;
        switch (action.type) {
            case 'PAGE_INIT': return action.payload.totalPages;
            default: return totalPages;
        }
    }

    function totalElements (totalElements, action) {
        if (!totalElements) totalElements = 0;
        switch (action.type) {
            case 'PAGE_INIT': return action.payload.totalElements;
            default: return totalElements;
        }
    }

    var pagenations = combineReducers({
        pages: pages,
        totalElements: totalElements,
        totalPages: totalPages,
        currentPage: currentPage
    });




    function todos (todos, action) {
        switch (action.type) {
            case 'RECEIVE_TODO_PAGE':
                var _todos = {};
                for (var i in action.payload.todos) {
                    _.extend(_todos, { [action.payload.todos[i].id]: action.payload.todos[i]});
                }
                return _.extend({}, todos, _todos);
            default: return todos || {};
        }
    }

    exports.reducers = combineReducers({
        pagenations: pagenations,
        todos: todos
    });

})(
    window,
    jQuery,
    _,
    window.Redux.combineReducers
);