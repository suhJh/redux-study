var requestStream = Rx.Observable.fromEvents('#inputText', 'keyup')
                                 .debounce(500)
                                 .filter(function (text) {
                                    return text.length > 2;
                                });


var responseStream = function (text) {
    return $.ajax({
        url: ''    
    }).promise();
}


requestStream.subscribe(reponseStream);
