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

###Configuration

To configure NodeWiki to your needs you can create a `production.js` in the config folder and start it with `NODE_ENV=production node app.js`

####Options

- __port__: The port for the internal HTTP server
- __locales:__: Used locales are defined as array, e.g. `["en", "de"]`. The first locale is the default language.
- __wikiLanguage:__: Used for the text search to provide stemming support.
- __siteName:__: The name of the wiki.
- __secret__: The encryption key for cookies.
- __db.url__: The URL to MongoDB `mongodb://localhost/nodewiki`
- __keepDeletedItemsPeriod__: This is the time in milliseconds that deleted pages are kept, before they are completly wiped.

NodeWiki has sensible defaults and if you do not wish to override an option you do not have to mention it in your configuration. Just provide what you want to be different.

###Text search

As search engine Mongodb 2.4 experimental text search is used. This feature has to be explicitly enabled as startup parameter `textSearchEnabled=true` or in the _mongod.conf_ with `setParameter = textSearchEnabled=true`. If you do not have a MongoDB with text search or can not use it, please use the 0.1.x branch.

###Localization

Currently NodeWiki supports English and German out of the box. If you want a new locale you can define it in the locales directory. NodeWiki uses the [i18n-2](http://github.com/jeresig/i18n-node-2) module. Therefore it uses a JSON formattet list of key value pairs.

##Usage Guide

###Create new page

Type an url that has not been used yet

###Edit a page

- click on the area you want to edit
- make your changes
- either wait 2 seconds or click anywhere outside the editable area and the page is saved

###Delete a page

Deleting a page does not really delete a page but marks it as deleted. To restore a deleted page select _restore_ from the tasks menu. After 30 days deleted pages are wiped from the system and can not be restored again. This period is configurable, see the [configuration section](#configuration)

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

###Internal Linking

To link to another wiki page you can simply use the normal link functionality of the editor, select _Wiki link_ and choose a page from the select box. The links are shown with title an path divided by a pipe ("|") and sorted by path.

###Versions

Node Wiki uses [mongoose-version](https://github.com/saintedlama/mongoose-version) to create a new version on every save of a document. To restore a version go to _show versions_ in the side bar, select a version and restore it.

##NodeWiki Versioning

As of version 0.2 Node Wiki follows the same versioning concept as NodeJs. Odd
numbers represent unstable versions, even numbers represent stable versions.
The master branch represents the latest unstable version. As of this writing
0.2 is stable and 0.3 is unstable.

##What to expect next?

Take a look at the [issue list](https://github.com/thomaspeklak/node-wiki/issues?labels=enhancement&state=open)

Anything you are missing? File an [issue](https://github.com/thomaspeklak/node-wiki/issues) or send a pull request.

##Contributing

Fork the project and send me a pull request. As long as it is aligned with node-wikis philosophy it will be merged in.
