var ADD_TODO = "ADD_TODO";
var COMPLETE_TODO = "COMPLETE_TODO";

var FILTER_COMPLETED = "FILTER_COMPLETED";
var UNFILTER = "UNFILTER";

function addTodo(text) {
    return {
        type: ADD_TODO,
        text: text
    }
}

function completeTodo(index) {
  return { 
      type: COMPLETE_TODO, 
      index: index 
    }
}

function unfilter() {
    return {
        type: UNFILTER
    }
}

function filterCompleted() {
    return {
        type: FILTER_COMPLETED
    }
}

function App (state, action) {
    if (!state) {
        state = {
           todos: Immutable.List() 
        }
    }
    switch (action.type) {
        case ADD_TODO: 
            return Object.assign({}, state, {
                todos: state.todos.push(action.text)
            });
        case COMPLETE_TODO:
            var todos = state.todos.update(action.index, function (e) {
                return {
                    text: e.text,
                    completed: !e.completed 
                }
            });
            return Object.assign({}, state, {
                todos: todos
            });
        default: return state;
    }
}

function Filter (state, action) {
    if (!state) {
        state = UNFILTER;
    }
    switch (action.type) {
        case UNFILTER: return UNFILTER;
        case FILTER_COMPLETED: return FILTER_COMPLETED;
        default: return state;
    }
}


var todoApp = Redux.combineReducers({
    app: App,
    filter: Filter
});
var store = Redux.createStore(todoApp);


$(function() {
    _.templateSettings.variable = 'o';

    $('#tbody').bind('render', function () {
        var tmpl = $('#tmpl').html();
        var render = _.template(tmpl);

        var p = {
            filter: store.getState().filter,
            list: store.getState().app.todos.toJS()
        };

        var result = render(p);
        $('#tbody').empty().append(result);
    });

    $('body').delegate('#addBtn', 'click', function () {
        if (!$('#text').val()) return;

        var txt = {
         text: $('#text').val(),
         completed: false
        }

        store.dispatch(addTodo(txt));
        $('#tbody').trigger('render');
        $('#text').val('');
    });

    $('body').delegate('#text', 'keypress', function (e) {
        if (e.which == 13) $('#addBtn').trigger('click');
    });

    $('body').delegate('.completed', 'change', function (e) {
        var idx = $(this).val();
        store.dispatch(completeTodo(idx));
        $('#tbody').trigger('render');
    });

    $('body').delegate('input:radio', 'click', function () {
        var val = $(this).val();
        if (val == 1) {
            store.dispatch(unfilter());
        } else {
            store.dispatch(filterCompleted());
        }
        $('#tbody').trigger('render');
    });

});