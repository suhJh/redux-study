(function (exports) {
    
    exports.actions = {};

    

    exports.actions.requestTodoPage = function requestTodoPage (page) {
        return {
            type: 'REQUEST_TODO_PAGE',
            payload: {
                page: page,
            }
        };
    } 

    exports.actions.receiveTodoPage = function receiveTodoPage (page, todos) {
        return {
            type: "RECEIVE_TODO_PAGE",
            payload: {
                page: page,
                todos: todos
            }
        }
    }

    exports.actions.pageInit = function pageInit (totalPages, totalElements) {
        return {
            type: 'PAGE_INIT',
            payload: {
                totalPages: totalPages,
                totalElements: totalElements
            }
        }
    }



})(window);