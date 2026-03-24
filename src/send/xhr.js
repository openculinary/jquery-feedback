Feedback.XHR = function(url) {
    this.url = url;
};

Feedback.XHR.prototype = new Feedback.Send();

Feedback.XHR.prototype.send = function(data, callback) {
    $.post({
        url: this.url,
        data: {data: JSON.stringify(data)},
        success: function() { callback(true) },
        error: function() { callback(false) }
    });
};