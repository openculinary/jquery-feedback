Feedback.Form = function(elements) {

    this.elements = elements || [{
        type: "textarea",
        name: 'issue',
        label: _('formDescription'),
        required: false
    }];

    this.dom = $("<div />");

};

Feedback.Form.prototype = new Feedback.Page();

Feedback.Form.prototype.render = function() {

    var i = 0, len = this.elements.length, item;
    this.dom.empty();
    for (; i < len; i++) {
        item = this.elements[ i ];

        switch( item.type ) {
            case "textarea":
                var labelText = item.label + (item.required === true ? " *" : "");
                var label = $("<label />", {"text": labelText});
                var formField = item.element = $("<textarea />");
                this.dom.append(label);
                this.dom.append(formField);
                break;
        }
    }

    return this;

};

Feedback.Form.prototype.end = function() {
    // form validation  
    var i = 0, len = this.elements.length, item;
    for (; i < len; i++) {
        item = this.elements[ i ];

        // check that all required fields are entered
        if ( item.required === true && item.element.val().length === 0) {
            item.element.addClass("feedback-error");
            return false;
        } else {
            item.element.removeClass();
        }
    }
    
    return true;
    
};

Feedback.Form.prototype.close = function(){
    this._data = undefined;
};

Feedback.Form.prototype.data = function() {
    
    if ( this._data !== undefined ) {
        // return cached value
        return this._data;
    }
    
    var i = 0, len = this.elements.length, item, data = {};
    
    for (; i < len; i++) {
        item = this.elements[ i ];
        data[ item.name ] = item.element.val();
    }
    data.url = window.location.href;
    data.timeOpened = new Date();
    data.timezone = (new Date()).getTimezoneOffset()/60;
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
    return ( this._data = data );
};


Feedback.Form.prototype.review = function(dom) {
    var i = 0, item, len = this.elements.length;
    for (; i < len; i++) {
        item = this.elements[ i ];
        
        if (item.element.val().length > 0) {
            var labelText = item.label + ":";
            var label = $("<label />", {"text": labelText});
            var fieldValue = item.element.val();
            dom.append(label);
            dom.append(fieldValue);
            dom.append($("<hr />"));
        }
    }
    return dom;
};