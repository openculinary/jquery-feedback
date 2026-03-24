if ( window.Feedback !== undefined ) { 
    return; 
}

var loader = function() {
    var div = $('<div />', {'class': 'feedback-loader'});
    [1, 2, 3].forEach(function() { $('<span />').appendTo(div); });
    return div;
},
getBounds = function( el ) {
    return el.getBoundingClientRect();
},
element = function( name, text ) {
    var el = document.createElement( name );
    el.appendChild( document.createTextNode( text ) );
    return el;
},
getLang = function() {
    var lang;
    if (navigator.languages !== undefined) {
        lang = navigator.languages[0];
    } else {
        lang = navigator.language;
    }

    if (lang) {
        return lang.replace('-','_');
    }
},
nextButton,
H2C_IGNORE = "data-html2canvas-ignore",
currentPage,
modalBody = $('<div />', {'class': 'feedback-body'});

window.Feedback = function( options ) {

    options = options || {};

    // default properties
    options.url = options.url || "/";
    options.adapter = options.adapter || new Feedback.XHR(options.url);
    options.lang = options.lang || "auto";

    if (options.lang === 'auto')
        options.lang = getLang();
    i18n.lang = options.lang;

    if (options.pages === undefined ) {
        options.pages = [
            new Feedback.Form(),
            new Feedback.Screenshot(options),
            new Feedback.Review()
        ];
    }

    var button,
    modal,
    currentPage,
    glass = $('<div />', {
        'class': 'feedback-glass',
        'style': 'pointer-events: none;',
        'attr': {[H2C_IGNORE]: true}
    }),
    returnMethods = {

        // open send feedback modal window
        open: function() {
            var len = options.pages.length;
            currentPage = 0;
            for (; currentPage < len; currentPage++) {
                // create DOM for each page in the wizard
                if (!(options.pages[currentPage] instanceof Feedback.Review)) {
                    options.pages[ currentPage ].render();
                }
            }

            // modal container
            var modalFooter = $('<div />', {'class': 'feedback-footer'});

            modal = $('<div />', {
                'class': 'feedback-modal',
                'attr': {[H2C_IGNORE]: true}
            });
            $(document.body).append(glass);

            // modal close button
            var modalClose = $('<a />', {
                'class': 'feedback-close',
                'text': '×',
                'href': '#',
                'click': returnMethods.close
            });

            button.prop("disabled", true);

            // build header element
            var modalHeader = $('<div />', {'class': 'feedback-header'});
            modalHeader.append(modalClose);
            modalHeader.append($('<h3 />', {'text': _('header')}));

            modalBody.empty();

            currentPage = 0;
            modalBody.append($(options.pages[ currentPage++ ].dom));


            // Next button
            nextButton = element( "button", _('nextLabel') );

            nextButton.className =  "feedback-btn";
            nextButton.onclick = function() {
                
                if (currentPage > 0 ) {
                    if ( options.pages[ currentPage - 1 ].end( modal ) === false ) {
                        // page failed validation, cancel onclick
                        return;
                    }
                }
                
                $(modalBody).empty();

                if ( currentPage === len ) {
                    returnMethods.send( options.adapter );
                } else {

                    options.pages[ currentPage ].start( modal, nextButton );
                    
                    if (options.pages[currentPage] instanceof Feedback.Review) {
                        // create DOM for review page, based on collected data
                        options.pages[ currentPage ].render( options.pages );
                    }
                    
                    // add page DOM to modal
                    modalBody.append($(options.pages[ currentPage++ ].dom));

                    // if last page, change button label to send
                    if ( currentPage === len ) {
                        nextButton.firstChild.nodeValue = _('sendLabel');
                    }
                    
                    // if next page is review page, change button label
                    if (options.pages[currentPage] instanceof Feedback.Review) {
                        nextButton.firstChild.nodeValue = _('reviewLabel');
                    }

                }

            };

            modalFooter.append($(nextButton));

            modal.append(modalHeader);
            modal.append(modalBody);
            modal.append(modalFooter);

            $(document.body).append(modal);
        },

        // close modal window
        close: function() {

            button.prop("disabled", false);

            // remove feedback elements
            $(modal).remove();
            $(glass).remove();

            // call end event for current page
            if (currentPage > 0 ) {
                options.pages[ currentPage - 1 ].end( modal );
            }
                
            // call close events for all pages    
            for (var i = 0, len = options.pages.length; i < len; i++) {
                options.pages[ i ].close();
            }

            return false;

        },
        
        // send data
        send: function( adapter ) {
            
            // make sure send adapter is of right prototype
            if (!(adapter instanceof Feedback.Send)) {
                throw new Error( "Adapter is not an instance of Feedback.Send" );
            }
            
            // fetch data from all pages   
            for (var i = 0, len = options.pages.length, data = [], p = 0, tmp; i < len; i++) {
                if ( (tmp = options.pages[ i ].data()) !== false ) {
                    data[ p++ ] = tmp;
                }
            }

            nextButton.disabled = true;
                
            $(modalBody).empty();
            $(modalBody).append(loader());

            // send data to adapter for processing
            adapter.send( data, function( success ) {
                
                $(modalBody).empty();
                nextButton.disabled = false;
                
                nextButton.firstChild.nodeValue = _('closeLabel');
                
                nextButton.onclick = function() {
                    returnMethods.close();
                    return false;  
                };
                
                if ( success === true ) {
                    modalBody.text(_('messageSuccess'));
                } else {
                    modalBody.text(_('messageError'));
                }
                //Once the form has been submitted, initialize it.

                var len = options.pages.length;
                var currentPage = 0;
                for (; currentPage < len; currentPage++) {
                    // Delete data from all Form and Screenshot so it does not persist for next feedback.
                    if (!(options.pages[currentPage] instanceof Feedback.Review)) {
                        options.pages[ currentPage ]._data = undefined;
                    }
                }
            } );
  
        }
    };

    button = $('<button />', {
        'class': 'feedback-btn feedback-bottom-right',
        'text': _('label'),
        'attr': {[H2C_IGNORE]: true},
        'click': returnMethods.open
    });

    options = options || {};
    $(options.appendTo || document.body).append(button);

    return returnMethods;
};