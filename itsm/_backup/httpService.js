(function (exports, $) {

    /**
     * HttpService 전담 객체
     */
    var HttpService = {
        fetch (obj) {
            obj = obj || {};
            console.log('fetch', obj);
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
        }
    };


    exports.service = HttpService;

})(window, jQuery);