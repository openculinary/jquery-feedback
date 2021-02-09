window.Feedback.Form = function( elements ) {

    this.elements = elements || [{
        type: "textarea",
        name: 'issue',
        label: _('formDescription'),
        required: false
    }];

    this.dom = document.createElement("div");

};

window.Feedback.Form.prototype = new window.Feedback.Page();

window.Feedback.Form.prototype.render = function() {

    var i = 0, len = this.elements.length, item;
    emptyElements( this.dom );
    for (; i < len; i++) {
        item = this.elements[ i ];

        switch( item.type ) {
            case "textarea":
                this.dom.appendChild( element("label", item.label + ":" + (( item.required === true ) ? " *" : "")) );
                this.dom.appendChild( ( item.element = document.createElement("textarea")) );
                break;
        }
    }

    return this;

};

window.Feedback.Form.prototype.end = function() {
    // form validation  
    var i = 0, len = this.elements.length, item;
    for (; i < len; i++) {
        item = this.elements[ i ];

        // check that all required fields are entered
        if ( item.required === true && item.element.value.length === 0) {
            item.element.className = "feedback-error";
            return false;
        } else {
            item.element.className = "";
        }
    }
    
    return true;
    
};

window.Feedback.Form.prototype.data = function() {
    
    if ( this._data !== undefined ) {
        // return cached value
        return this._data;
    }
    
    var i = 0, len = this.elements.length, item, data = {};
    
    for (; i < len; i++) {
        item = this.elements[ i ];
        data[ item.name ] = item.element.value;
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


window.Feedback.Form.prototype.review = function( dom ) {
  
    var i = 0, item, len = this.elements.length;
      
    for (; i < len; i++) {
        item = this.elements[ i ];
        
        if (item.element.value.length > 0) {
            dom.appendChild( element("label", item.label + ":") );
            dom.appendChild( document.createTextNode( item.element.value ) );
            dom.appendChild( document.createElement( "hr" ) );
        }
        
    }
    
    return dom;
     
};