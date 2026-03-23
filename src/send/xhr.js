window.Feedback.XHR = function(url) {
    this.url = url;
};

window.Feedback.XHR.prototype = new window.Feedback.Send();

window.Feedback.XHR.prototype.send = function(data, callback) {
    $.post({
        url: this.url,
        data: {data: JSON.stringify(data)},
        success: function() { callback(true) },
        error: function() { callback(false) }
    });
};
