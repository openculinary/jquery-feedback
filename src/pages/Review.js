Feedback.Review = function() {

    this.dom = document.createElement("div");
    this.dom.className = "feedback-review";

};

Feedback.Review.prototype = new Feedback.Page();

Feedback.Review.prototype.render = function( pages ) {

    var i = 0, len = pages.length, item;
    $(this.dom).empty();
    
    for (; i < len; i++) {
        
        // get preview DOM items
        pages[ i ].review( this.dom );

    }

    return this;

};

