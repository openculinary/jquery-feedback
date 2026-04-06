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

    this.browserInfoConsentCheckbox = undefined;
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

    const browserInfoConsent = $("<div />");
    browserInfoConsent.append(
      (this.browserInfoConsentCheckbox = $("<input />", {
        id: "browser-info-consent",
        type: "checkbox",
        style: "float: left; margin: 8px",
      })),
    );
    browserInfoConsent.append(
      $("<label />", {
        for: "browser-info-consent",
        text: _("browserInfoConsent"),
      }),
    );
    browserInfoConsent.append(
      $("<div />", {
        style: "clear: both",
      }),
    );

    this.dom.append(browserInfoConsent);
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

    if (this.browserInfoConsentCheckbox.is(":checked")) {
      const browserInfo = this.browserInfo;
      if (browserInfo.url) data.url = window.location.href;
      if (browserInfo.timeOpened) data.timeOpened = new Date();
      if (browserInfo.timezone)
        data.timezone = new Date().getTimezoneOffset() / 60;
      if (browserInfo.pageon) data.pageon = window.location.pathname;
      if (browserInfo.referrer) data.referrer = document.referrer;
      if (browserInfo.previousSites) data.previousSites = history.length;
      if (browserInfo.browserName) data.browserName = navigator.appName;
      if (browserInfo.browserEngine) data.browserEngine = navigator.product;
      if (browserInfo.browserVersion1a)
        data.browserVersion1a = navigator.appVersion;
      if (browserInfo.browserVersion1b)
        data.browserVersion1b = navigator.userAgent;
      if (browserInfo.browserLanguage)
        data.browserLanguage = navigator.language;
      if (browserInfo.browserOnline) data.browserOnline = navigator.onLine;
      if (browserInfo.browserPlatform)
        data.browserPlatform = navigator.platform;
      if (browserInfo.javaEnabled) data.javaEnabled = navigator.javaEnabled();
      if (browserInfo.dataCookiesEnabled)
        data.dataCookiesEnabled = navigator.cookieEnabled;
      if (browserInfo.dataCookies1) data.dataCookies1 = document.cookie;
      if (browserInfo.dataCookies2)
        data.dataCookies2 = decodeURIComponent(document.cookie.split(";"));
      if (browserInfo.dataStorage) data.dataStorage = localStorage;
      if (browserInfo.sizeScreenW) data.sizeScreenW = screen.width;
      if (browserInfo.sizeScreenH) data.sizeScreenH = screen.height;
      if (browserInfo.sizeDocW) data.sizeDocW = document.width;
      if (browserInfo.sizeDocH) data.sizeDocH = document.height;
      if (browserInfo.sizeInW) data.sizeInW = innerWidth;
      if (browserInfo.sizeInH) data.sizeInH = innerHeight;
      if (browserInfo.sizeAvailW) data.sizeAvailW = screen.availWidth;
      if (browserInfo.sizeAvailH) data.sizeAvailH = screen.availHeight;
      if (browserInfo.scrColorDepth) data.scrColorDepth = screen.colorDepth;
      if (browserInfo.scrPixelDepth) data.scrPixelDepth = screen.pixelDepth;
    }

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

    if (this.browserInfoConsentCheckbox.is(":checked")) {
      const data = this.data();
      const browserDetails = $("<details />");
      browserDetails.append($("<summary />", { text: "Browser-Info" }));
      const browserInfoCollected = $("<table />");
      $.each(Form.#defaultBrowserInfo(), (field, enabled) => {
        // field can be collected, is configured for reporting, and was collected
        if (field in this.browserInfo && enabled && field in data) {
          const row = $("<tr />");
          row.append($("<th />", { text: field }));
          row.append($("<td />", { text: data[field] }));
          browserInfoCollected.append(row);
        }
      });
      browserDetails.append($("<br />"));
      browserDetails.append(browserInfoCollected);
      browserDetails.appendTo(dom);

      dom.append($("<hr />"));
    }

    return dom;
  }

  close() {
    this._data = undefined;
  }
}
