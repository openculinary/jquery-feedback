if (window.Feedback !== undefined) {
  return;
}

const H2C_IGNORE = "data-html2canvas-ignore";

var loader = function () {
    var div = $("<div />", { class: "feedback-loader" });
    [1, 2, 3].forEach(function () {
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
  },
  nextButton,
  modalBody = $("<div />", { class: "feedback-body" });

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

  var button,
    modal,
    currentPage,
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

        button.prop("disabled", true);

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
        button.prop("disabled", false);

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
        modalBody.append(loader());

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

  button = $("<button />", {
    class: "feedback-btn feedback-bottom-right",
    text: _("label"),
    attr: { [H2C_IGNORE]: true },
    click: returnMethods.open,
  });

  options = options || {};
  if (options.appendTo !== null)
    $(options.appendTo || document.body).append(button);

  return returnMethods;
};
