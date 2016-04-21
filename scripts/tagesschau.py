#!/usr/bin/python
'''
parse the 100-seconds tagesschau stream,
get the right link and download the video
'''

from BeautifulSoup import BeautifulSoup
import urllib2
import re

url = "https://www.tagesschau.de/100sekunden/"

html_page = urllib2.urlopen(url)
soup = BeautifulSoup(html_page)
for link in soup.findAll('a'):
    target = link.get('href')
    if target:
        if "mp4" in target and "webl" in target:
            # now get the video and directly save to the web-folder
            import urllib
            test=urllib.FancyURLopener()
            test.retrieve(target,"/var/www/smartmirror2/tagesschau.mp4")


