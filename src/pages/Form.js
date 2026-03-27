Feedback.Form = function (elements) {
  this.elements = elements || [
    {
      type: "textarea",
      name: "issue",
      label: _("formDescription"),
      required: false,
    },
  ];

  this.dom = $("<div />");
};

Feedback.Form.prototype = new Feedback.Page();

Feedback.Form.prototype.render = function () {
  this.dom.empty();
  $.each(this.elements, (_, item) => {
    switch (item.type) {
      case "textarea":
        var labelText = item.label + (item.required === true ? " *" : "");
        var label = $("<label />", { text: labelText });
        var formField = (item.element = $("<textarea />"));
        this.dom.append(label);
        this.dom.append(formField);
        break;
    }
  });
  return this;
};

Feedback.Form.prototype.end = function () {
  // form validation
  $.each(this.elements, (_, item) => {
    // check that all required fields are entered
    if (item.required === true && item.element.val().length === 0) {
      item.element.addClass("feedback-error");
      return false;
    } else {
      item.element.removeClass();
    }
  });
  return true;
};

Feedback.Form.prototype.close = function () {
  this._data = undefined;
};

Feedback.Form.prototype.data = function () {
  if (this._data !== undefined) {
    // return cached value
    return this._data;
  }

  var data = {};
  $.each(this.elements, (_, item) => {
    data[item.name] = item.element.val();
  });

  data.url = window.location.href;
  data.timeOpened = new Date();
  data.timezone = new Date().getTimezoneOffset() / 60;
  data.pageon = window.location.pathname;
  data.referrer = document.referrer;
  data.previousSites = history.length;
  data.browserName = navigator.appName;
  data.browserEngine = navigator.product;
  data.browserVersion1a = navigator.appVersion;
  data.browserVersion1b = navigator.userAgent;
  data.browserLanguage = navigator.language;
  data.browserOnline = navigator.onLine;
  data.browserPlatform = navigator.platform;
  data.javaEnabled = navigator.javaEnabled();
  data.dataCookiesEnabled = navigator.cookieEnabled;
  data.dataCookies1 = document.cookie;
  data.dataCookies2 = decodeURIComponent(document.cookie.split(";"));
  data.dataStorage = localStorage;
  data.sizeScreenW = screen.width;
  data.sizeScreenH = screen.height;
  data.sizeDocW = document.width;
  data.sizeDocH = document.height;
  data.sizeInW = innerWidth;
  data.sizeInH = innerHeight;
  data.sizeAvailW = screen.availWidth;
  data.sizeAvailH = screen.availHeight;
  data.scrColorDepth = screen.colorDepth;
  data.scrPixelDepth = screen.pixelDepth;

  // cache and return data
  return (this._data = data);
};

Feedback.Form.prototype.review = function (dom) {
  $.each(this.elements, (_, item) => {
    if (item.element.val().length > 0) {
      var labelText = item.label + ":";
      var label = $("<label />", { text: labelText });
      var fieldValue = item.element.val();
      dom.append(label);
      dom.append(fieldValue);
      dom.append($("<hr />"));
    }
  });
  return dom;
};
