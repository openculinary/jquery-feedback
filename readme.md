feedback.js - Feedback form with screenshot
===========================================

Original preview available at http://experiments.hertzen.com/jsfeedback/

This script allows you to create feedback forms which include:

- a screenshot, created on the clients browser

- the user-supplied information

- all sorts of info gathered about the client.

The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.

## How does it work? ##

The script is based on the <a href="http://html2canvas.hertzen.com/">html2canvas library</a>, which renders the current page as a canvas image, by reading the DOM and the different styles applied to the elements. This script adds the options for the user to draw elements on top of that image, such as mark points of interest on the image along with the feedback they send.

No plugins, no flash, no interaction needed from the server, just pure JavaScript!

## Try it out locally (frontend + backend) ##

- start a webserver in the root of feedback.js:
```bash
    python -m http.server --bind 127.0.0.1
```

- start the supplied sample backend:
```bash
    ./sample_backend.py
```

- open the http://localhost:8000/examples/ URL in the browser

- submit a feedback, and ignore the error (it's caused by CORS)

- watch the information gathered at the client side as logged by the sample backend

- examine the screenshot which the backend saves in the screenshot.png file

## Options ##

Pass to constructor, e.g.

    Feedback({
        h2cPath:'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
        url: '/rest/feedback'});

Available options:

* adapter - sends the data overriding the default adapter in src/send/xhr.js
* appendTo - DOM element where to add the feedback button, defaults to document.body
* blackoutClass - CSS class to use for elements that have been blacked out by the user during the screenshot review, defaults to feedback-blackedout
* canvas
* closeLabel- override the label of the closing popup, defaults to "Close", can change to "Thanks for the feedback"
* complete
* e
* el
* elements
* feedback
* for
* h2cPath - url to html2canvas
* highlightClass - CSS class to use for elements that have been highlighted by the user during the screenshot review, defaults to  feedback-highlighted
* j
* key
* lang - "auto" for autodetect from browser or language code like 'ru_RU'
* nextLabel - label on the continue button of the first dialog box
* pages - dialogs with user.  defaults to Feedback.Form, Feedback.Screenshot, Feedback.Review
* url - url to post form data

html2canvas options (see http://html2canvas.hertzen.com/documentation.html#available-options):
* allowTaint
* background
* height
* letterRendering
* logging
* proxy
* taintTest
* timeout
* width
* useCORS

## Building feedback.js ##

- Install gulp and uglifier at the command line if you don't already have it (uglifier is only needed if you are going to compile the minified version)
```bash
    npm install gulp gulp-concat
    npm install gulp-uglify
```

- Navigate to the feedback.js directory in the terminal and run one of the following
```bash
    gulp build
    gulp build:min
```
  or both:
```bash
    gulp build build:min
```

## License ##
 
feedback.js is released under the MIT license:

* http://www.opensource.org/licenses/MIT