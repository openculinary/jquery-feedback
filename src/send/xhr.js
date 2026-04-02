class XHR extends Send {
  constructor(url) {
    super();
    this.url = url;
  }

  send(data, callback) {
    $.post({
      url: this.url,
      data: { data: JSON.stringify(data) },
      success: function () {
        callback(true);
      },
      error: function () {
        callback(false);
      },
    });
  }
}
