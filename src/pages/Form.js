class Form extends Page {
  constructor(elements, browserInfo) {
    super();
    this.elements = elements || [
      {
        type: "textarea",
        name: "issue",
        label: _("formDescription"),
        required: false,
      },
    ];
    this.browserInfo = browserInfo || this.#defaultBrowserInfo();

    this.dom = $("<div />");
  }

  static #defaultBrowserInfo() {
    return {
      url: true,
      timeOpened: true,
      timezone: true,
      pageon: true,
      referrer: true,
      previousSites: true,
      browserName: true,
      browserEngine: true,
      browserVersion1a: true,
      browserVersion1b: true,
      browserLanguage: true,
      browserOnline: true,
      browserPlatform: true,
      javaEnabled: true,
      dataCookiesEnabled: true,
      dataCookies1: true,
      dataCookies2: true,
      dataStorage: true,
      sizeScreenW: true,
      sizeScreenH: true,
      sizeDocW: true,
      sizeDocH: true,
      sizeInW: true,
      sizeInH: true,
      sizeAvailW: true,
      sizeAvailH: true,
      scrColorDepth: true,
      scrPixelDepth: true,
    };
  }

  render() {
    this.dom.empty();
    $.each(this.elements, (_, item) => {
      switch (item.type) {
        case "textarea":
          var labelText = item.label + (item.required ? " *" : "");
          var label = $("<label />", { text: labelText });
          var formField = (item.element = $("<textarea />"));
          this.dom.append(label);
          this.dom.append(formField);
          break;
      }
    });
  }

  end(modal) {
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
  }

  data() {
    if (this._data !== undefined) {
      // return cached value
      return this._data;
    }

    var data = {};
    $.each(this.elements, (_, item) => {
      data[item.name] = item.element.val();
    });

    if (this.browserInfo.url) data.url = window.location.href;
    if (this.browserInfo.timeOpened) data.timeOpened = new Date();
    if (this.browserInfo.timezone)
      data.timezone = new Date().getTimezoneOffset() / 60;
    if (this.browserInfo.pageon) data.pageon = window.location.pathname;
    if (this.browserInfo.referrer) data.referrer = document.referrer;
    if (this.browserInfo.previousSites) data.previousSites = history.length;
    if (this.browserInfo.browserName) data.browserName = navigator.appName;
    if (this.browserInfo.browserEngine) data.browserEngine = navigator.product;
    if (this.browserInfo.browserVersion1a)
      data.browserVersion1a = navigator.appVersion;
    if (this.browserInfo.browserVersion1b)
      data.browserVersion1b = navigator.userAgent;
    if (this.browserInfo.browserLanguage)
      data.browserLanguage = navigator.language;
    if (this.browserInfo.browserOnline) data.browserOnline = navigator.onLine;
    if (this.browserInfo.browserPlatform)
      data.browserPlatform = navigator.platform;
    if (this.browserInfo.javaEnabled)
      data.javaEnabled = navigator.javaEnabled();
    if (this.browserInfo.dataCookiesEnabled)
      data.dataCookiesEnabled = navigator.cookieEnabled;
    if (this.browserInfo.dataCookies1) data.dataCookies1 = document.cookie;
    if (this.browserInfo.dataCookies2)
      data.dataCookies2 = decodeURIComponent(document.cookie.split(";"));
    if (this.browserInfo.dataStorage) data.dataStorage = localStorage;
    if (this.browserInfo.sizeScreenW) data.sizeScreenW = screen.width;
    if (this.browserInfo.sizeScreenH) data.sizeScreenH = screen.height;
    if (this.browserInfo.sizeDocW) data.sizeDocW = document.width;
    if (this.browserInfo.sizeDocH) data.sizeDocH = document.height;
    if (this.browserInfo.sizeInW) data.sizeInW = innerWidth;
    if (this.browserInfo.sizeInH) data.sizeInH = innerHeight;
    if (this.browserInfo.sizeAvailW) data.sizeAvailW = screen.availWidth;
    if (this.browserInfo.sizeAvailH) data.sizeAvailH = screen.availHeight;
    if (this.browserInfo.scrColorDepth) data.scrColorDepth = screen.colorDepth;
    if (this.browserInfo.scrPixelDepth) data.scrPixelDepth = screen.pixelDepth;

    // cache and return data
    return (this._data = data);
  }

  review(dom) {
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
  }

  close() {
    this._data = undefined;
  }
}
