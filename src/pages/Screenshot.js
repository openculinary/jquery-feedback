

Feedback.Screenshot = function( options ) {
    this.options = options || {};

    this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

    this.h2cDone = false;
};

Feedback.Screenshot.prototype = new Feedback.Page();

Feedback.Screenshot.prototype.end = function( modal ){
    modal.removeClass("feedback-animate-toside");

    // remove event listeners
    $(document.body).off("mousemove", this.mouseMoveEvent);
    $(document.body).off("click", this.mouseClickEvent);

    $(this.h2cCanvas).remove();

    this.h2cDone = false;

};

Feedback.Screenshot.prototype.close = function(){
    this._data = undefined;

    $(this.blackoutBox).remove();
    $(this.highlightContainer).remove();
    $(this.highlightBox).remove();
    this.highlightClose.remove();

    $("." + this.options.blackoutClass).remove();
    $("." + this.options.highlightClass).remove();

};

Feedback.Screenshot.prototype.start = function( modal, nextButton ) {

    var $this = this;

    if ( this.h2cDone ) {
        this.dom.empty();
        nextButton.prop("disabled", false);

        var feedbackHighlightElement = "feedback-highlight-element",
        dataExclude = "data-exclude";

        var action = true;

        // delegate mouse move event for body
        this.mouseMoveEvent = function( e ) {

            // fix SVG errors
            var className = e.target.className;
            className = className.baseVal !== undefined ? className.baseVal : className;

            // don't do anything if we are highlighting a close button or body tag
            if (e.target === document.body || e.target === highlightClose || modal.has(e.target).length) {
                // we are not gonna blackout the whole page or the close item
                clearBox();
                previousElement = e.target;
                return;
            }

            // set close button
            else if ( e.target !== previousElement && (className.indexOf( $this.options.blackoutClass ) !== -1 || className.indexOf( $this.options.highlightClass ) !== -1)) {
                bounds = getBounds(e.target);
                $(highlightClose).css({
                    'left': (window.pageXOffset + bounds.left + bounds.width) + 'px',
                    'top': (window.pageYOffset + bounds.top) + 'px',
                });

                removeElement = e.target;
                clearBox();
                previousElement = undefined;
                return;
            } else {
              hideClose();
            }

            if (e.target !== previousElement ) {
                previousElement = e.target;

                window.clearTimeout( timer );

                timer = window.setTimeout(function(){
                    var bounds = getBounds( previousElement ),
                    item;

                    if ( action === false ) {
                        item = blackoutBox;
                    } else {
                        item = highlightBox;
                        item.width = bounds.width;
                        item.height = bounds.height;
                        ctx.drawImage($this.h2cCanvas, window.pageXOffset + bounds.left, window.pageYOffset + bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                    }

                    // we are only targetting IE>=9, so window.pageYOffset works fine
                    item.setAttribute(dataExclude, false);
                    item.style.left = window.pageXOffset + bounds.left + "px";
                    item.style.top = window.pageYOffset + bounds.top + "px";
                    item.style.width = bounds.width + "px";
                    item.style.height = bounds.height + "px";
                }, 100);



            }


        };


        // delegate event for body click
        this.mouseClickEvent = function( e ){

            e.preventDefault();


            if ( action === false) {
                if ( blackoutBox.getAttribute(dataExclude) === "false") {
                    var blackout = document.createElement("div");
                    blackout.className = $this.options.blackoutClass;
                    blackout.style.left = blackoutBox.style.left;
                    blackout.style.top = blackoutBox.style.top;
                    blackout.style.width = blackoutBox.style.width;
                    blackout.style.height = blackoutBox.style.height;

                    document.body.appendChild( blackout );
                    previousElement = undefined;
                }
            } else {
                if ( highlightBox.getAttribute(dataExclude) === "false") {

                    highlightBox.className += " " + $this.options.highlightClass;
                    highlightBox.className = highlightBox.className.replace(/feedback\-highlight\-element/g,"");
                    $this.highlightBox = highlightBox = document.createElement('canvas');

                    ctx = highlightBox.getContext("2d");

                    highlightBox.className += " " + feedbackHighlightElement;

                    document.body.appendChild( highlightBox );
                    clearBox();
                    previousElement = undefined;
                }
            }



        };

        this.highlightClose = $("<div />", {
          "id": "feedback-highlight-close",
          "text": "×",
        });
        this.blackoutBox = document.createElement('div');
        this.highlightBox = document.createElement( "canvas" );
        this.highlightContainer = document.createElement('div');
        var timer,
        highlightClose = this.highlightClose,
        highlightBox = this.highlightBox,
        blackoutBox = this.blackoutBox,
        highlightContainer = this.highlightContainer,
        removeElement,
        ctx = highlightBox.getContext("2d"),
        buttonClickFunction = function( e ) {
            e.preventDefault();
            
            if (!blackoutButton.hasClass("active")) {
                blackoutButton.addClass("active");
                highlightButton.removeClass("active");
            } else {
                highlightButton.addClass("active");
                blackoutButton.removeClass("active");
            }

            action = !action;
        },
        clearBox = function() {
            
            clearBoxEl(blackoutBox);
            clearBoxEl(highlightBox);

            window.clearTimeout( timer );
        },
        clearBoxEl = function( el ) {
            el.style.left =  "-5px";
            el.style.top =  "-5px";
            el.style.width = "0px";
            el.style.height = "0px";
            el.setAttribute(dataExclude, true);
        },
        hideClose = function() {
            highlightClose.css("left", "-50px");
            highlightClose.css("top", "-50px");

        },
        blackoutButton = $("<a />", {
          "href": "#",
          "text": _("blackout"),
        }),
        highlightButton = $("<a />", {
          "href": "#",
          "text": _("highlight"),
        }),
        previousElement;


        modal.addClass('feedback-animate-toside');


        $(highlightClose).on("click", function(){
            $(removeElement).remove();
            hideClose();
        });

        $(document.body).append(highlightClose);


        this.h2cCanvas.className = 'feedback-canvas';
        document.body.appendChild( this.h2cCanvas);


        var buttonItem = [ highlightButton, blackoutButton ];

        this.dom.append($("<p />", {"text": _("highlightDescription")}));

        // add highlight and blackout buttons
        for (var i = 0; i < 2; i++ ) {
            buttonItem[i].addClass('feedback-btn feedback-btn-small ' + (i === 0 ? 'active' : 'feedback-btn-inverse'));
            buttonItem[i].on("click", buttonClickFunction);

            this.dom.append(buttonItem[i]);
            this.dom.append(" ");
        }



        highlightContainer.id = "feedback-highlight-container";
        highlightContainer.style.width = this.h2cCanvas.width + "px";
        highlightContainer.style.height = this.h2cCanvas.height + "px";

        this.highlightBox.className += " " + feedbackHighlightElement;
        this.blackoutBox.id = "feedback-blackout-element";
        document.body.appendChild( this.highlightBox );
        highlightContainer.appendChild( this.blackoutBox );

        document.body.appendChild( highlightContainer );

        // bind mouse delegate events
        $(document.body).on("mousemove", this.mouseMoveEvent);
        $(document.body).on("click", this.mouseClickEvent);

    } else {
        // still loading html2canvas
        var args = arguments;

        if ( nextButton.prop("disabled", true) ) {
            this.dom.append(loader());
        }

        nextButton.prop("disabled", true);

        window.setTimeout(function(){
            $this.start.apply( $this, args );
        }, 500);
    }

};

Feedback.Screenshot.prototype.render = function() {

    this.dom = $("<div />");

    // execute the html2canvas script
    var $this = this, options = this.options;
    $.getScript(options.h2cPath, function() {
        window.html2canvas(document.body, options).then(function(canvas) {
            $this.h2cCanvas = canvas;
            $this.h2cDone = true;
        }).catch(function(e) {
            $this.h2cDone = true;
            console.log("Error in html2canvas: " + e.message);
        });
    });
    return this;
};

Feedback.Screenshot.prototype.data = function() {

    if ( this._data !== undefined ) {
        return this._data;
    }

    if ( this.h2cCanvas !== undefined ) {
      
        var ctx = this.h2cCanvas.getContext("2d"),
        canvasCopy,
        copyCtx,
        radius = 5;
        ctx.fillStyle = "#000";

        // draw blackouts
        Array.prototype.slice.call( document.getElementsByClassName('feedback-blackedout'), 0).forEach( function( item ) {
            var bounds = getBounds( item );
            ctx.fillRect( bounds.left, bounds.top, bounds.width, bounds.height );
        });

        // draw highlights
        var items = Array.prototype.slice.call( document.getElementsByClassName('feedback-highlighted'), 0);

        if (items.length > 0 ) {

            // copy canvas
            canvasCopy = document.createElement( "canvas" );
            copyCtx = canvasCopy.getContext('2d');
            canvasCopy.width = this.h2cCanvas.width;
            canvasCopy.height = this.h2cCanvas.height;

            copyCtx.drawImage( this.h2cCanvas, 0, 0 );

            ctx.fillStyle = "#777";
            ctx.globalAlpha = 0.5;
            ctx.fillRect( 0, 0, this.h2cCanvas.width, this.h2cCanvas.height );

            ctx.beginPath();

            items.forEach( function( item ) {

                var x = parseInt(item.style.left, 10),
                y = parseInt(item.style.top, 10),
                width = parseInt(item.style.width, 10),
                height = parseInt(item.style.height, 10);

                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
               
            });
            ctx.closePath();
            ctx.clip();

            ctx.globalAlpha = 1;

            ctx.drawImage(canvasCopy, 0,0);
   
        }
        
        // to avoid security error break for tainted canvas   
        try {
            // cache and return data
            return ( this._data = this.h2cCanvas.toDataURL() );
        } catch( e ) {}
        
    }
};


Feedback.Screenshot.prototype.review = function(dom) {
    var data = this.data();
    if ( data !== undefined ) {
        var img = $("<img />", {
          "src": data,
          "style": "width: 300px",
        });
        dom.append(img);
    }
};