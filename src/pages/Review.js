class Review extends Page {
  constructor() {
    super();
    this.dom = $("<div />", { class: "feedback-review" });
  }

  render(pages) {
    this.dom.empty();
    $.each(pages, (_, page) => {
      page.review(this.dom);
    });
  }
}
