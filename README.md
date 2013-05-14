#Node Wiki

This was formally a proof of concept of easily combing Aloha editor with a node backend to achieve a simple wiki. This project has now started to evolve into a decent wiki platform with tags, recent pages, autosaving and drag and drop file uploads.

##Simplicity

Node-Wiki is designed to have no barriers for content editors. The main two wiki actions _creating a new page_ and _editing an existing page_ are dead simple.

Contrary to other wikis you simply type an URL and if the page does not exist, edit it and you have created a new page. Editing is as simple as clicking in the content area.

##Installation

    git clone git@github.com:thomaspeklak/node-wiki.git
    cd node-wiki
    npm install
    node app.js

Then simply open http://localhost:3000 and edit the page. Or go to another url (e.g. http://localhost:3000/new-entry) and edit this page.

##Usage Guide

###Create new page

type an url that has not been used yet

###Edit a page

- click on the area you want to edit
- make your changes
- either wait 2 seconds or click anywhere outside the editable area and the page is saved

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

###Versions

Node Wiki uses [mongoose-version](https://github.com/saintedlama/mongoose-version) to create a new version on every save of a document. To restore a version go to _show versions_ in the side bar, select a version and restore it.

##What to expect next?

Take a look at the [issue list](https://github.com/thomaspeklak/node-wiki/issues?labels=enhancement&state=open)

Anything you are missing? File an [issue](https://github.com/thomaspeklak/node-wiki/issues) or send a pull request.

##Contributing

Fork the project and send me a pull request. As long as it is aligned with node-wikis philosophy it will be merged in.
