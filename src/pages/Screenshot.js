class Screenshot extends Page {
  constructor(options) {
    super();
    this.options = options || {};

    this.options.blackoutClass ||= "feedback-blackedout";
    this.options.highlightClass ||= "feedback-highlighted";

    this.h2cDone = false;
  }

  start(modal, nextButton) {
    var $this = this;

    if (this.h2cDone) {
      this.dom.empty();
      nextButton.prop("disabled", false);

      var feedbackHighlightElement = "feedback-highlight-element";

      var action = true;

      // delegate mouse move event for body
      this.mouseMoveEvent = function (e) {
        // fix SVG errors
        var className = e.target.className;
        className =
          className.baseVal !== undefined ? className.baseVal : className;

        // don't do anything if we are highlighting a close button or body tag
        if (
          e.target === document.body ||
          e.target === highlightClose ||
          modal.has(e.target).length
        ) {
          // we are not gonna blackout the whole page or the close item
          clearBox();
          previousElement = e.target;
          return;
        }

        // set close button
        else if (
          e.target !== previousElement &&
          (className.indexOf($this.options.blackoutClass) !== -1 ||
            className.indexOf($this.options.highlightClass) !== -1)
        ) {
          var bounds = e.target.getBoundingClientRect();
          highlightClose.css({
            left: window.pageXOffset + bounds.left + bounds.width + "px",
            top: window.pageYOffset + bounds.top + "px",
          });

          removeElement = e.target;
          clearBox();
          previousElement = undefined;
          return;
        } else {
          hideClose();
        }

        if (e.target !== previousElement) {
          previousElement = e.target;

          window.clearTimeout(timer);

          timer = window.setTimeout(function () {
            var bounds = previousElement.getBoundingClientRect(),
              item;

            if (action === false) {
              item = blackoutBox[0];
            } else {
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
            }

            // we are only targetting IE>=9, so window.pageYOffset works fine
            $(item).data("exclude", false);
            item.style.left = window.pageXOffset + bounds.left + "px";
            item.style.top = window.pageYOffset + bounds.top + "px";
            item.style.width = bounds.width + "px";
            item.style.height = bounds.height + "px";
          }, 100);
        }
      };

      // delegate event for body click
      this.mouseClickEvent = function (e) {
        e.preventDefault();

        if (action === false) {
          if (blackoutBox.data("exclude") === false) {
            var blackout = blackoutBox.clone();
            blackout.attr("id", undefined);
            blackout.addClass($this.options.blackoutClass);

            $(document.body).append(blackout);
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
      this.blackoutBox = $("<div />");
      this.highlightBox = $("<canvas />");
      this.highlightContainer = document.createElement("div");
      var timer,
        highlightClose = this.highlightClose,
        highlightBox = this.highlightBox,
        blackoutBox = this.blackoutBox,
        highlightContainer = this.highlightContainer,
        removeElement,
        ctx = highlightBox[0].getContext("2d"),
        buttonClickFunction = function (e) {
          e.preventDefault();

          highlightButton.toggleClass("active");
          blackoutButton.toggleClass("active");

          action = !action;
        },
        clearBox = function () {
          clearBoxEl(blackoutBox);
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
        hideClose = function () {
          highlightClose.css("left", "-50px");
          highlightClose.css("top", "-50px");
        },
        blackoutButton = $("<a />", {
          href: "#",
          text: _("blackout"),
        }),
        highlightButton = $("<a />", {
          href: "#",
          text: _("highlight"),
        }),
        previousElement;

      modal.addClass("feedback-animate-toside");

      highlightClose.on("click", function () {
        $(removeElement).remove();
        hideClose();
      });

      $(document.body).append(highlightClose);

      this.h2cCanvas.className = "feedback-canvas";
      document.body.appendChild(this.h2cCanvas);

      var buttonItem = [highlightButton, blackoutButton];

      this.dom.append($("<p />", { text: _("highlightDescription") }));

      // add highlight and blackout buttons
      $.each(buttonItem, (_, button) => {
        button.addClass("feedback-btn feedback-btn-small");
        button.addClass(
          button === highlightButton ? "active" : "feedback-btn-inverse",
        );
        button.on("click", buttonClickFunction);

        this.dom.append(button);
        this.dom.append(" ");
      });

      highlightContainer.id = "feedback-highlight-container";
      highlightContainer.style.width = this.h2cCanvas.width + "px";
      highlightContainer.style.height = this.h2cCanvas.height + "px";

      this.highlightBox.addClass(feedbackHighlightElement);
      this.blackoutBox.attr("id", "feedback-blackout-element");
      $(document.body).append(this.highlightBox);
      $(highlightContainer).append(this.blackoutBox);

      document.body.appendChild(highlightContainer);

      // bind mouse delegate events
      $(document.body).on("mousemove", this.mouseMoveEvent);
      $(document.body).on("click", this.mouseClickEvent);
    } else {
      // still loading html2canvas
      var args = arguments;

      if (nextButton.prop("disabled") !== true) {
        this.dom.append(progressIndicator());
      }

      nextButton.prop("disabled", true);

      window.setTimeout(function () {
        $this.start.apply($this, args);
      }, 500);
    }
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

      // draw blackouts
      $(".feedback-blackedout").each(function () {
        var bounds = this.getBoundingClientRect();
        ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
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

    this.blackoutBox.remove();
    $(this.highlightContainer).remove();
    this.highlightBox.remove();
    this.highlightClose.remove();

    $("." + this.options.blackoutClass).remove();
    $("." + this.options.highlightClass).remove();
  }
}
