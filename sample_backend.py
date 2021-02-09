#!/usr/bin/env python
# coding=utf-8

""" test backend to receive the data send by feedback.js """

from __future__ import division

import bottle
import urllib
import json
import base64


@bottle.route('/', method='POST')
def test():
    print("content length = %s" % bottle.request.content_length)

    postdata = bottle.request.body.read()

    # skip the initial 'data=' prolog
    payload = urllib.parse.unquote(postdata[5:])
    alldata = json.loads(payload)

    data = alldata[0]
    print("issue = %s" % data.get("issue"))
    print("url = %s" % data.get("url"))
    print("timeOpened = %s" % data.get("timeOpened"))
    print("timezone = %s" % data.get("timezone"))
    print("pageon = %s" % data.get("pageon"))
    print("referrer = %s" % data.get("referrer"))
    print("previousSites = %s" % data.get("previousSites"))
    print("browserName = %s" % data.get("browserName"))
    print("browserEngine = %s" % data.get("browserEngine"))
    print("browserVersion1a = %s" % data.get("browserVersion1a"))
    print("browserVersion1b = %s" % data.get("browserVersion1b"))
    print("browserLanguage = %s" % data.get("browserLanguage"))
    print("browserOnline = %s" % data.get("browserOnline"))
    print("browserPlatform = %s" % data.get("browserPlatform"))
    print("javaEnabled = %s" % data.get("javaEnabled"))
    print("dataCookiesEnabled = %s" % data.get("dataCookiesEnabled"))
    print("dataCookies1 = %s" % data.get("dataCookies1"))
    print("dataCookies2 = %s" % data.get("dataCookies2"))
    print("dataStorage = %s" % data.get("dataStorage"))
    print("sizeScreenW = %s" % data.get("sizeScreenW"))
    print("sizeScreenH = %s" % data.get("sizeScreenH"))
    print("sizeDocW = %s" % data.get("sizeDocW"))
    print("sizeDocH = %s" % data.get("sizeDocH"))
    print("sizeInW = %s" % data.get("sizeInW"))
    print("sizeInH = %s" % data.get("sizeInH"))
    print("sizeAvailW = %s" % data.get("sizeAvailW"))
    print("sizeAvailH = %s" % data.get("sizeAvailH"))
    print("scrColorDepth = %s" % data.get("scrColorDepth"))
    print("scrPixelDepth = %s" % data.get("scrPixelDepth"))

    # skip the initial 'data:image/png;base64,' prolog
    encoded_image = alldata[1][22:]
    image = base64.b64decode(encoded_image)
    png = open("screenshot.png", "wb")
    png.write(image)

    return bottle.HTTPResponse(status=201, body='OK')


if __name__ == '__main__':
    bottle.debug(True)
    bottle.run(host='127.0.0.1', port=8080, reloader=True)
