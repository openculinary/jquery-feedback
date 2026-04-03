class Form extends Page {
  constructor(elements) {
    super();
    this.elements = elements || [
      {
        type: "textarea",
        name: "issue",
        label: _("formDescription"),
        required: false,
      },
    ];

    this.dom = $("<div />");

    this.browserInfoConsentCheckbox = undefined;
    this.browserInfoConsentLabel = undefined;
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
      $("<input />", {
        id: "browser-info-consent",
        type: "checkbox",
        style: "float: left; margin: 8px",
      }),
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

    if ($("#browser-info-consent").is(":checked")) {
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
    return dom;
  }

  close() {
    this._data = undefined;
  }
}
