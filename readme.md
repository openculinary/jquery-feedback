feedback.js - Feedback form with screenshot
===========================================

wip... preview available at http://experiments.hertzen.com/jsfeedback/

This script allows you to create feedback forms which include a screenshot, created on the clients browser, along with the form. The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.

## How does it work? ##
The script is based on the <a href="http://html2canvas.hertzen.com/">html2canvas library</a>, which renders the current page as a canvas image, by reading the DOM and the different styles applied to the elements. This script adds the options for the user to draw elements on top of that image, such as mark points of interest on the image along with the feedback they send.

No plugins, no flash, no interaction needed from the server, just pure JavaScript!

## Options ##

Pass to constructor, e.g.

    Feedback({
        h2cPath:'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
        url: '/rest/feedback'});

* adapter
* allowTaint
* appendTo
* blackoutClass
* canvas
* closeLabel
* complete
* e
* el
* elements
* feedback
* flashcanvas
* for
* h2cPath - url to html2canvas
* hasOwnProperty
* height
* highlightClass
* if
* iframeDefault
* ignoreElements
* j
* key
* lang - "auto" for autodetect from browser or language code like 'ru_RU'
* length
* letterRendering
* logging
* nextLabel - label on the continue button of the first dialog box
* onparsed
* onpreloaded
* onrendered
* pages - dialogs with user.  defaults to Feedback.Form, Feedback.Screenshot, Feedback.Review
* proxy
* renderer
* svgRendering
* taintTest
* timeout
* url - url to post form data
* useCORS
* useOverflow
* width


## Building feedback.js ##
1. Install gulp and uglifier at the command line if you don't already have it (uglifier is only needed if you are going to compile the minified version)
```bash
    npm install gulp gulp-concat
    npm install gulp-uglify
```

2. Navigate to the feedback.js directory in the terminal and run one of the following
```bash
    gulp build
    gulp build:min
```

## Browser compatibility ##

 - Firefox 3.5+
 - Newer versions of Google Chrome, Safari & Opera
 - IE9

## License ##
 
feedback.js is released under the MIT license:

* http://www.opensource.org/licenses/MIT