Feedback.Page = function() {};
Feedback.Page.prototype = {

    render: function(dom) {
        this.dom = dom;
    },
    start: function() {},
    close: function() {},
    data: function() {
        // don't collect data from page by default
        return false;
    },
    review: function() {
        return null;
    },
    end: function() { return true; }

};