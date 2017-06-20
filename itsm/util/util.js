(function (exports) {

    exports.a = {
        b: {
            C: {
                show: function () {
                    console.log('!================================================================');
                    console.log(arguments);
                    console.log('================================================================!');
                }
            }
        }
    }

})(window);