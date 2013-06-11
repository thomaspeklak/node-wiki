#Usage Guide

##Create new page

Type an url that has not been used yet

##Save a page

Node Wiki automatically saves your changes if you:

- are inactive for 2 seconds
- move the focus out of a editable area
- upload an asset
- drop a media link to the content area

##Edit a page

- click on the area you want to edit
- make your changes
- either wait 2 seconds or click anywhere outside the editable area and the page is saved

##Delete a page

Deleting a page does not really delete a page but marks it as deleted. To restore a deleted page select _restore_ from the tasks menu. After 30 days deleted pages are wiped from the system and can not be restored again. This period is configurable.

##Upload Attachments

Drag files from your computer to the drop zone marked with _drop files here_

##Add media to content

__Drop a ...__

- __image file__ from your computer into the content area where you want the images to appear
- __image url__ from the Images side bar box or from another website to the content area to create an image element
- __link__ to create a link
- __youtube__ link to embed a youtube video
- __vimeo__ link to embed a vimeo video
- __audio__ link to create an audio element
- __video__ link to create a video element
- __slideshare__ link to embed a slideshare presentation

##Internal Linking

To link to another wiki page you can simply use the normal link functionality of the editor, select _Wiki link_ and choose a page from the select box. The links are shown with title an path divided by a pipe ("|") and sorted by path.

##Versions

Node Wiki uses [mongoose-version](https://github.com/saintedlama/mongoose-version) to create a new version on every save of a document. To restore a version go to _show versions_ in the side bar, select a version and restore it.

