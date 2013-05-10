/*
* Node-wiki links integration
*/
( function() {
    CKEDITOR.plugins.add( 'nodewikilink',
    {
        init: function( editor )
        {
           CKEDITOR.dialog.add( 'NodeWikiLinkDialog', function (instance)
           {
              return {
                 title : 'Link to wiki page',
                 minWidth : 550,
                 minHeight : 60,
                 onShow: function() {

                     this.getContentElement('iframe', 'wikiLinkAnchor').setValue(
                         editor.getSelection().getSelectedText()
                     );
                 },
                 contents :
                       [
                          {
                             id : 'iframe',
                             expand : true,
                             elements :[{
                                id : 'wikiLinkAnchor',
                                type : 'text',
                                label : 'Name your link target here',
                                'autofocus':'autofocus',
                                setup: function(element){
                                },
                                commit: function(element){
                                }
                              }]
                          }
                       ],
                  onOk: function() {
                        var a = instance.document.createElement('a');
                        a.setAttribute('href', '/' + this.getContentElement('iframe', 'wikiLinkAnchor').getValue());
                        a.setHtml(this.getContentElement('iframe', 'wikiLinkAnchor').getValue());
                        instance.insertElement(a);
                  }
              };
           } );

            editor.addCommand( 'NodeWikiLink', new CKEDITOR.dialogCommand( 'NodeWikiLinkDialog' ) );

            editor.ui.addButton( 'NodeWikiLink',
            {
                label: 'Link to wiki page',
                command: 'NodeWikiLink',
                icon: '/static-images/icons/nodewikilink.png',
                toolbar: 'links,0'
            } );

            console.log('nodewikilink');
        }
    } );
} )();