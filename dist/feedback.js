/*
 feedback.js <http://experiments.hertzen.com/jsfeedback/>
 Copyright (c) 2012 Niklas von Hertzen. All rights reserved.
 http://www.twitter.com/niklasvh

 Released under MIT License
*/
(function( window, document, undefined ) {
/*
  This allows custom messages and languages in the feedback.js library.
  The precedence order for messages is: Custom Message -> i18l -> defaults
  --------------------
  -Change Language: Include or create a language file. See examples at src/i18n/
  -Change Messages: Include or create a custom_message_strings override file

  Example:
    custom_message_strings.header         = "Please, send us your thoughts";
    custom_message_strings.messageSuccess = "Woah, we succeeded!";
*/

// Message getter function
function _(s) {
  return i18n.gettext(s);
}

// Define default messages
var default_message_strings = {
  label: "Feedback",
  header: "Send your Feedback",
  nextLabel: "Continue",
  reviewLabel: "Review",
  sendLabel: "Send",
  closeLabel: "Close",
  messageSuccess: "Your feedback was sent successfully.",
  messageError: "There was an error sending your feedback to our server.",
  formDescription: "Please describe the issue you are experiencing",
  highlightOrRedactDescription: "Highlight or redact important information",
  highlightDescription: "Highlight important information",
  highlight: "Highlight",
  redact: "Redact",
  issue: "Issue",
  browserInfoConsent: "I would like to provide information about my web browser and device with this feedback",
};

var i18n = Object.create({
  default: default_message_strings,
  lang: "default",
  gettext: function (s) {
    var message_strings = this[this.lang] || this[this.lang.substring(0, 2)];
    if (message_strings && message_strings[s]) {
      return message_strings[s];
    } else if (this.default[s]) {
      return this.default[s];
    } else {
      return s;
    }
  },
});

i18n.de_DE = {
  label: "Ihre Meinung",
  header: "Senden Sie Ihre Meinung",
  nextLabel: "Weiter",
  reviewLabel: "Überprüfen",
  sendLabel: "Senden",
  closeLabel: "Schliessen",
  messageSuccess: "Ihre Meinung wurde erfolgreich gesendet.",
  messageError: "Fehler beim senden Ihrer Meinung an unser Server.",
  formDescription: "Bitte beschreiben Sie das Problem das bei Ihnen auftritt",
  highlightOrRedactDescription: "Wichtige Informationen markieren oder verdunkeln",
  highlightDescription: "Wichtige Informationen markieren",
  highlight: "Markieren",
  redact: "Verdunkeln",
  issue: "Problem",
};
i18n.de = i18n.de_DE;

i18n.es_MX = {
  label: "Comentarios",
  header: "Envíe sus comentarios",
  nextLabel: "Continuar",
  reviewLabel: "Revisar",
  sendLabel: "Enviar",
  closeLabel: "Cerrar",
  messageSuccess: "Sus comentarios fueron enviados con éxito.",
  messageError: "Hubo un error al enviar sus comentarios a nuestro servidor.",
  formDescription: "Por favor describa el problema que está experimentando",
  highlightOrRedactDescription: "Resaltar o ocultar información importante",
  highlightDescription: "Resaltar información importante",
  highlight: "Resaltar",
  redact: "Ocultar",
  issue: "Problema",
};
i18n.es = i18n.es_MX;

i18n.it_IT = {
  label: "Commenta",
  header: "Invia il tuo commento",
  nextLabel: "Continua",
  reviewLabel: "Rivedi",
  sendLabel: "Invia",
  closeLabel: "Chiudi",
  messageSuccess: "Il tuo commento è stato inviato con successo.",
  messageError: "C'è stato un errore nell'invio del tuo commento al nostro server.",
  formDescription: "Per favore descrivi il problema",
  highlightOrRedactDescription: "Evidenzia o nascondi le informazioni importanti",
  highlightDescription: "Evidenzia le informazioni importanti",
  highlight: "Evidenzia",
  redact: "Nascondi",
  issue: "Problema",
  browserInfoConsent: "I would like to provide information about my web browser and device with this feedback",
};
i18n.it = i18n.it_IT;

i18n.pt_BR = {
  label: "Comentários",
  header: "Envie seus comentários",
  nextLabel: "Prossegue",
  reviewLabel: "Revisa",
  sendLabel: "Envia",
  closeLabel: "Fecha",
  messageSuccess: "Seus comentários foram enviados com sucesso.",
  messageError: "Houve um erro ao enviar os seus comentários para o nosso servidor.",
  formDescription: "Por favor, descreva o problema que está ocorrendo",
  highlightOrRedact: "Destaque ou oculte informação importante",
  highlightDescription: "Destaque informação importante",
  highlight: "Destacar",
  redact: "Ocultar",
  issue: "Problema",
  browserInfoConsent: "I would like to provide information about my web browser and device with this feedback",
};
i18n.pt = i18n.pt_BR;

i18n.ru_RU = {
  label: "Сообщить об ошибке",
  header: "Сообщить об ошибке",
  nextLabel: "Далее",
  reviewLabel: "Далее",
  sendLabel: "Отправить",
  closeLabel: "Закрыть",
  messageSuccess: "Ваше сообщение успешно отправлено.",
  messageError: "Произошла ошибка при отправке сообщения на сервер.",
  formDescription: "Пожалуйста, опишите проблему с которой вы столкнулись",
  highlightOrRedactDescription: "Выделите или спрячьте важную информацию",
  highlightDescription: "Выделите важную информацию",
  highlight: "Выделить",
  redact: "Спрятать",
  issue: "Ваше сообщение",
  browserInfoConsent: "I would like to provide information about my web browser and device with this feedback",
};
i18n.ru = i18n.ru_RU;

if (window.Feedback !== undefined) {
  return;
}

const H2C_IGNORE = "data-html2canvas-ignore";

var progressIndicator = function () {
    var div = $("<div />", { class: "feedback-loader" });
    ["*", "*", "*"].forEach(() => {
      $("<span />").appendTo(div);
    });
    return div;
  },
  getLang = function () {
    var lang;
    if (navigator.languages !== undefined) {
      lang = navigator.languages[0];
    } else {
      lang = navigator.language;
    }

    if (lang) {
      return lang.replace("-", "_");
    }
  };

window.Feedback = function (options) {
  options = options || {};

  // default properties
  options.url = options.url || "/";
  options.adapter = options.adapter || new XHR(options.url);
  options.lang = options.lang || "auto";

  if (options.lang === "auto") options.lang = getLang();
  i18n.lang = options.lang;

  if (options.pages === undefined) {
    options.pages = [new Form(), new Screenshot(options), new Review()];
  }

  if (options.redactions === undefined) {
    options.redactions = true;
  }

  var activationButton,
    modal,
    modalBody = $("<div />", { class: "feedback-body" }),
    currentPage,
    nextButton,
    glass = $("<div />", {
      class: "feedback-glass",
      style: "pointer-events: none;",
      attr: { [H2C_IGNORE]: true },
    }),
    returnMethods = {
      // open send feedback modal window
      open: function () {
        $.each(options.pages, (_, page) => {
          if (page instanceof Review) return;
          page.render();
        });

        // modal container
        var modalFooter = $("<div />", { class: "feedback-footer" });

        modal = $("<div />", {
          class: "feedback-modal",
          attr: { [H2C_IGNORE]: true },
        });
        $(document.body).append(glass);

        // modal close button
        var modalClose = $("<a />", {
          class: "feedback-close",
          text: "×",
          href: "#",
          click: returnMethods.close,
        });

        activationButton.prop("disabled", true);

        // build header element
        var modalHeader = $("<div />", { class: "feedback-header" });
        modalHeader.append(modalClose);
        modalHeader.append($("<h3 />", { text: _("header") }));

        modalBody.empty();

        currentPage = 0;
        modalBody.append(options.pages[currentPage++].dom);

        // Next button
        nextButton = $("<button />", {
          text: _("nextLabel"),
          class: "feedback-btn",
        });

        nextButton.on("click", function () {
          if (currentPage > 0) {
            if (options.pages[currentPage - 1].end(modal) === false) {
              // page failed validation, cancel onclick
              return;
            }
          }

          modalBody.empty();

          var lastPage = options.pages.length;
          if (currentPage === lastPage) {
            returnMethods.send(options.adapter);
          } else {
            options.pages[currentPage].start(modal, nextButton);

            if (options.pages[currentPage] instanceof Review) {
              // create DOM for review page, based on collected data
              options.pages[currentPage].render(options.pages);
            }

            // add page DOM to modal
            modalBody.append(options.pages[currentPage++].dom);

            // if last page, change button label to send
            if (currentPage === lastPage) {
              nextButton.text(_("sendLabel"));
            }

            // if next page is review page, change button label
            if (options.pages[currentPage] instanceof Review) {
              nextButton.text(_("reviewLabel"));
            }
          }
        });

        modalFooter.append(nextButton);

        modal.append(modalHeader);
        modal.append(modalBody);
        modal.append(modalFooter);

        $(document.body).append(modal);
      },

      // close modal window
      close: function () {
        activationButton.prop("disabled", false);

        // remove feedback elements
        modal.remove();
        glass.remove();

        // call end event for current page
        if (currentPage > 0) {
          options.pages[currentPage - 1].end(modal);
        }

        // call close events for all pages
        $.each(options.pages, (_, page) => {
          page.close();
        });

        return false;
      },

      // send data
      send: function (adapter) {
        // make sure send adapter is of right prototype
        if (!(adapter instanceof Send)) {
          throw new Error("Adapter is not an instance of Send");
        }

        // fetch data from all pages
        var data = [],
          tmp;
        $.each(options.pages, (i, page) => {
          if ((tmp = page.data()) !== false) {
            data.push(tmp);
          }
        });

        nextButton.prop("disabled", true);

        modalBody.empty();
        modalBody.append(progressIndicator());

        // send data to adapter for processing
        adapter.send(data, function (success) {
          modalBody.empty();
          nextButton.prop("disabled", false);

          nextButton.text(_("closeLabel"));

          nextButton.off("click");
          nextButton.on("click", function () {
            returnMethods.close();
            return false;
          });

          modalBody.text(_(success ? "messageSuccess" : "messageError"));

          //Once the form has been submitted, initialize it.
          // this includes clearing the data collected for feedback
          $.each(options.pages, (_, page) => {
            page.close();
          });
        });
      },
    };

  activationButton = $("<button />", {
    class: "feedback-btn feedback-bottom-right",
    text: _("label"),
    attr: { [H2C_IGNORE]: true },
    click: returnMethods.open,
  });

  options = options || {};
  if (options.appendTo !== null)
    $(options.appendTo || document.body).append(activationButton);

  return returnMethods;
};

class Page {
  start() {}
  render() {}
  end(modal) {
    return true;
  }
  data() {
    // don't collect data from page by default
    return false;
  }
  review(dom) {}
  close() {}
}

class Send {
  send(data, callback) {
    callback(false);
  }
}

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

class Screenshot extends Page {
  constructor(options) {
    super();
    this.options = options || {};

    this.options.redactClass ||= "feedback-redacted";
    this.options.highlightClass ||= "feedback-highlighted";

    this.h2cDone = false;
    this.highlightMode = true;
  }

  #addAnnotationButtons() {
    if (this.options.redactions !== true) return;

    var $this = this,
      highlight = $("<a />", { href: "#", text: _("highlight") }),
      redact = $("<a />", { href: "#", text: _("redact") });

    var buttons = [highlight, redact];
    $.each(buttons, (_, button) => {
      button.addClass("feedback-btn feedback-btn-small");
      button.addClass(button === highlight ? "active" : "feedback-btn-inverse");
      button.on("click", (e) => {
        e.preventDefault();

        highlight.toggleClass("active");
        redact.toggleClass("active");

        $this.highlightMode = !$this.highlightMode;
      });

      this.dom.append(button);
      this.dom.append(" ");
    });
  }

  start(modal, nextButton) {
    var $this = this;

    if (!this.h2cDone) {
      // still loading html2canvas
      var args = arguments;

      if (nextButton.prop("disabled") !== true) {
        this.dom.append(progressIndicator());
      }

      nextButton.prop("disabled", true);

      window.setTimeout(function () {
        $this.start.apply($this, args);
      }, 500);
      return;
    }

    this.dom.empty();
    nextButton.prop("disabled", false);

    var feedbackHighlightElement = "feedback-highlight-element";

    // delegate mouse move event for body
    this.mouseMoveEvent = function (e) {
      // fix SVG errors
      var target = $(e.target);
      // don't do anything if we are highlighting a close button or body tag
      if (
        target.is(document.body) ||
        target.is(highlightClose) ||
        modal.has(e.target).length
      ) {
        // we are not gonna redact the whole page or the close item
        clearBox();
        previousElement = e.target;
        return;
      }

      // focus remains within the same element; do nothing
      else if (target.is(previousElement)) {
        return;
      }

      // set close button
      else if (
        target.hasClass($this.options.redactClass) ||
        target.hasClass($this.options.highlightClass)
      ) {
        var bounds = e.target.getBoundingClientRect();
        highlightClose.css({
          left: window.pageXOffset + bounds.left + bounds.width + "px",
          top: window.pageYOffset + bounds.top + "px",
        });
        highlightClose.off("click");
        highlightClose.on("click", () => {
          target.remove();
          highlightClose.hide();
        });
        highlightClose.show();

        clearBox();
        previousElement = undefined;
        return;
      }

      // focus has changed to another annotatable element
      else {
        highlightClose.hide();
      }

      previousElement = e.target;

      window.clearTimeout(timer);

      timer = window.setTimeout(function () {
        var bounds = previousElement.getBoundingClientRect(),
          item;

        if ($this.highlightMode) {
          item = highlightBox[0];
          item.width = bounds.width;
          item.height = bounds.height;
          ctx.drawImage(
            $this.h2cCanvas,
            window.pageXOffset + bounds.left,
            window.pageYOffset + bounds.top,
            bounds.width,
            bounds.height,
            0,
            0,
            bounds.width,
            bounds.height,
          );
        } else {
          item = redactBox[0];
        }

        // we are only targetting IE>=9, so window.pageYOffset works fine
        $(item).data("exclude", false);
        item.style.left = window.pageXOffset + bounds.left + "px";
        item.style.top = window.pageYOffset + bounds.top + "px";
        item.style.width = bounds.width + "px";
        item.style.height = bounds.height + "px";
      }, 100);
    };

    // delegate event for body click
    this.mouseClickEvent = function (e) {
      e.preventDefault();

      if ($this.options.redactions === true && $this.highlightMode === false) {
        if (redactBox.data("exclude") === false) {
          var redact = redactBox.clone();
          redact.attr("id", undefined);
          redact.addClass($this.options.redactClass);

          $(document.body).append(redact);
          previousElement = undefined;
        }
      } else {
        if (highlightBox.data("exclude") === false) {
          highlightBox.addClass($this.options.highlightClass);
          highlightBox.removeClass(feedbackHighlightElement);
          $this.highlightBox = highlightBox = $("<canvas />");

          ctx = highlightBox[0].getContext("2d");

          highlightBox.addClass(feedbackHighlightElement);

          $(document.body).append(highlightBox);
          clearBox();
          previousElement = undefined;
        }
      }
    };

    this.highlightClose = $("<div />", {
      id: "feedback-highlight-close",
      text: "×",
    });
    this.redactBox = $("<div />");
    this.highlightBox = $("<canvas />");
    var timer,
      highlightClose = this.highlightClose,
      highlightBox = this.highlightBox,
      redactBox = this.redactBox,
      ctx = highlightBox[0].getContext("2d"),
      clearBox = function () {
        clearBoxEl(redactBox);
        clearBoxEl(highlightBox);

        window.clearTimeout(timer);
      },
      clearBoxEl = function (el) {
        el.css("left", "-5px");
        el.css("top", "-5px");
        el.css("width", "0px");
        el.css("height", "0px");
        el.data("exclude", true);
      },
      previousElement;

    modal.addClass("feedback-animate-toside");

    $(document.body).append(highlightClose);

    this.h2cCanvas.className = "feedback-canvas";
    document.body.appendChild(this.h2cCanvas);

    var annotationDescription =
      $this.options.redactions === true
        ? "highlightOrRedactDescription"
        : "highlightDescription";
    this.dom.append($("<p />", { text: _(annotationDescription) }));

    // add highlight and redact buttons
    this.#addAnnotationButtons();

    this.highlightBox.addClass(feedbackHighlightElement);
    this.redactBox.attr("id", "feedback-redact-element");
    $(document.body).append(this.highlightBox);

    var highlightContainer = (this.highlightContainer = $("<div />"));
    highlightContainer.attr("id", "feedback-highlight-container");
    highlightContainer.css("width", `${this.h2cCanvas.width}px`);
    highlightContainer.css("height", `${this.h2cCanvas.height}px`);
    highlightContainer.append(this.redactBox);
    $(document.body).append(highlightContainer);

    // bind mouse delegate events
    $(document.body).on("mousemove", this.mouseMoveEvent);
    $(document.body).on("click", this.mouseClickEvent);
  }

  render() {
    this.dom = $("<div />");

    // execute the html2canvas script
    var $this = this,
      options = this.options;
    $.getScript(options.h2cPath, function () {
      window
        .html2canvas(document.body, options)
        .then(function (canvas) {
          $this.h2cCanvas = canvas;
          $this.h2cDone = true;
        })
        .catch(function (e) {
          $this.h2cDone = true;
          console.log("Error in html2canvas: " + e.message);
        });
    });
  }

  end(modal) {
    modal.removeClass("feedback-animate-toside");

    // remove event listeners
    $(document.body).off("mousemove", this.mouseMoveEvent);
    $(document.body).off("click", this.mouseClickEvent);

    $(this.h2cCanvas).remove();

    this.h2cDone = false;
  }

  data() {
    if (this._data !== undefined) {
      return this._data;
    }

    if (this.h2cCanvas !== undefined) {
      var ctx = this.h2cCanvas.getContext("2d"),
        canvasCopy,
        copyCtx,
        radius = 5;
      ctx.fillStyle = "#000";

      // draw redactions
      $(".feedback-redacted").each(function () {
        ctx.fillRect(
          this.offsetLeft,
          this.offsetTop,
          this.offsetWidth,
          this.offsetHeight,
        );
      });

      // draw highlights
      var items = $(".feedback-highlighted");
      if (items.length > 0) {
        // copy canvas
        canvasCopy = document.createElement("canvas");
        copyCtx = canvasCopy.getContext("2d");
        canvasCopy.width = this.h2cCanvas.width;
        canvasCopy.height = this.h2cCanvas.height;

        copyCtx.drawImage(this.h2cCanvas, 0, 0);

        ctx.fillStyle = "#777";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, this.h2cCanvas.width, this.h2cCanvas.height);

        ctx.beginPath();

        items.each(function () {
          var item = this,
            x = item.offsetLeft,
            y = item.offsetTop,
            width = item.offsetWidth,
            height = item.offsetHeight;

          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height,
          );
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
        });
        ctx.closePath();
        ctx.clip();

        ctx.globalAlpha = 1;

        ctx.drawImage(canvasCopy, 0, 0);
      }

      // to avoid security error break for tainted canvas
      try {
        // cache and return data
        return (this._data = this.h2cCanvas.toDataURL());
      } catch (e) {}
    }
  }

  review(dom) {
    var data = this.data();
    if (!data) return;

    dom.append(
      $("<img />", {
        src: data,
        style: "width: 300px",
      }),
    );
  }

  close() {
    this._data = undefined;

    this.redactBox.remove();
    this.highlightContainer.remove();
    this.highlightBox.remove();
    this.highlightClose.remove();

    $("." + this.options.redactClass).remove();
    $("." + this.options.highlightClass).remove();
  }
}

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

})( window, document );