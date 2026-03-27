Feedback.Review = function() {
    this.dom = $("<div />", {"class": "feedback-review"});
};

Feedback.Review.prototype = new Feedback.Page();

Feedback.Review.prototype.render = function( pages ) {
    this.dom.empty();
    $.each(pages, (_, page) => {
        page.review(this.dom);
    });
    return this;
};