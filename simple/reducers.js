(function (exports, $, _) {

    function updateObject (old, newValue) {
        return Object.assign({}, old, newValue);
    }


    function inserteItemInArray (arr, newItem) {
        return [].concat(arr, newItem);
    }

    function updateItemInArray (arr, itemId, updateItemCallback) {
        return _.map(arr, function (item) {
            if (item.id !== itemId) {
                return item;
            }
            return updateItemCallback(item);
        });
    }

    function deleteItemInArray (arr, itemId) {
        var index = _.findIndex(arr, function (item) {
            return item.id == itemId;
        });
        return arr.slice(0, index).concat(arr.slice(index + 1))
    }


    function userReducer (users, action) {
        switch (action.type) {
            case 'REG_USER': return 
        }
    }


    function userManager (state, action) {
        switch (action.type) {
            case 'REG_USER': return updateObject(state, {
                byId: updateObject(state.byId, {[action.user.id]: action.user}),
                allIds: inserteItemInArray(state.allIds, action.user.id)
            });
            default: return state || {
                byId: {
                    'sjs0701': {
                        id: 'sjs0701',
                        pw: 'ev9weubh',
                        name: '서종효'
                    },
                    'a': {
                        id: 'a',
                        pw: 'a',
                        name: 'a'
                    }
                },
                allIds: ['sjs0701', 'a']
            }
        }
    }


    function postManager (state, action) {
        switch (action.type) {
            case "WRITE_POST": 
                var id = _.uniqueId('post_');
                return updateObject(state, {
                    byId: updateObject(state.byId, {
                        [id]: updateObject(action.post, {
                            id: id,
                            comments: []
                        })
                    }),
                    allIds: inserteItemInArray(state.allIds, id)
                });
            case "WRITE_COMMENT": 
                var postId = action.postId;
                return updateObject(state, {
                    byId: updateObject(state.byId, {
                        [postId]: updateObject(state.byId[postId], {
                            comments: inserteItemInArray(state.byId[postId].comments, action.comment.id)
                        })
                    }),
                    allIds: state.allIds
                });
            default: return state || {
                byId: {},
                allIds: []
            }
        }
    }

    function commentManager (state, action) {
        switch (action.type) {
            case "WRITE_COMMENT": 
                return updateObject(state, {
                    byId: updateObject(state.byId, {[action.comment.id]: action.comment}),
                    allIds: inserteItemInArray(state.allIds, action.comment.id)
                });
            default: return state || {
                byId: {},
                allIds: []
            }
        }
    }

    function appManager (state, action) {
        switch (action.type) {
            case 'LOGIN': return updateObject(state, { 
                isLogin: true, 
                loginId: action.user.id 
            });
            case 'LOGOUT': return updateObject(state, {
                isLogin: false, 
                loginId: null
            });
            default: return state || {
                isLogin: false,
                loginId: null,
            }
        }
    }

    exports.reducers = {
        appManager: appManager,
        userManager: userManager,
        postManager: postManager,
        commentManager: commentManager
    }
})(window, jQuery, _);