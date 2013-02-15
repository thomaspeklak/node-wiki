#Node Wiki

This was formally a proof of concept of easily combing Aloha editor with a node backend to achieve a simple wiki. This project has now started to evolve into a decent wiki platform with tags, recent pages, autosaving and drag and drop file uploads.

Contrary to other wikis you simply type an URL and if the page does not exist, edit it and you have created a new page.

##Installation

    git clone git@github.com:thomaspeklak/node-wiki.git
    cd node-wiki
    npm install
    node app.js

Then simply open http://localhost:3000 and edit the page. Or go to another url (e.g. http://localhost:3000/new-entry) and edit this page.

#Usage Guide

###Create new page

type an url that has not been used yet

###Upload Attachments

drag files from your computer to the drop zone marked with _drop files here_

###Add media to content

__Drop a ...__
- __image file__ from your computer into the content area where you want the images to appear
- __image url__ from the Images side bar box or from another website to the content area to create an image element
- __link__ to create a link
- __youtube__ link to embed a youtube video
- __vimeo__ link to embed a vimeo video
- __audio__ link to create an audio element
- __video__ link to create a video element
- __slideshare__ link to embed a slideshare presentation

##What to expect next?

Take a look at the [issue list](https://github.com/thomaspeklak/node-wiki/issues?labels=enhancement&state=open)

Anything you are missing? File an [issue](https://github.com/thomaspeklak/node-wiki/issues) or send a pull request.
