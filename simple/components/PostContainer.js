(function (exports, $, _, Controller, store, createSelector) {

    var pickLoginId = function (state) {
        return state.app.loginId;
    }
    var pickPosts = function (state) {
        return state.posts;
    }
    var pickComments = function (state) {
        return state.comments.byId;
    }

    var postsSelector = createSelector([pickPosts, pickLoginId], function (posts, loginId) {
        return {
            posts: posts.byId,
            loginId: loginId
        };
    });

    var postsAndCommentsSelector = createSelector([pickPosts, pickComments], function (posts, comments) {
        var postsById = posts.byId;
        return _.map(posts.allIds, function (postId) {
            var post = postsById[postId];
            return _.extend({}, post, {
                comments: _.map(post.comments, function (commentId) {
                    return comments[commentId];
                })
            });
        });
    }); 

    var PostContainer = Controller.create({
        elements: {
            '#regPostModal': 'regPostModal',
            '#title': 'title',
            '#content': 'content',
            '#callRegPostModalBtn': 'callRegPostModalBtn',
            '#timeline': 'timeline',
        },
        events: {
            'click #callRegPostModalBtn': 'onClickCallRegPostModalBtn',
            'click #regPost': 'onClickRegPostBtn',
            'click .commentBtn': 'onClickCommentBtn'
        },
        template: _.template($('#postTemplate').html()),
        init: function () {
            store.subscribe(this.proxy(this.render));
        },
        onClickCallRegPostModalBtn: function () {
            this.regPostModal.modal('show');
        },
        onClickRegPostBtn: function () {
            var content = this.content.val();
            var title = this.title.val();

            if (!title) {
                alert('제목 입력은 필수입니다.');
                return;
            }
            if (!content) {
                alert('내용 입력은 필수입니다.');
                return;
            }
            var writer = postsSelector(store.getState()).loginId;

            store.dispatch({ type: 'WRITE_POST', post: {
                writer: writer,
                content: content,
                title: title
            }});

            this.regPostModal.modal('hide');
            this.title.val('');
            this.content.val('');


        },
        onClickCommentBtn: function (e) {
            var postId = $(e.target).data('id');
            var content = $(e.target).prev('input').val();
            var writer = postsSelector(store.getState()).loginId;
            var commentId = _.uniqueId('comment_');
            store.dispatch({ type: 'WRITE_COMMENT', postId: postId, comment: { id: commentId, writer: writer, content: content } });

        },
        render: function () {
            var state = postsSelector(store.getState());
            var loginId = state.loginId;
            var postAndComment = postsAndCommentsSelector(store.getState());

            if (!loginId) {
                this.callRegPostModalBtn.hide();
            } else {
                this.callRegPostModalBtn.show();
            }
            var html = '';

            for (var i = 0; i < postAndComment.length; i++) {
                html = this.template(_.extend({}, postAndComment[i], { loginId: loginId })) + html;
            }
            this.timeline.empty().append(html);

        }
    });

    exports.PostContainer = new PostContainer({ el: $('#postContainer') });

})(window, jQuery, _, window.Controller, window.store, window.createSelector);