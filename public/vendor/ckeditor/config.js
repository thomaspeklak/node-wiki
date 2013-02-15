/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
        { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
        { name: 'links' },
        { name: 'insert' },
        { name: 'forms' },
        { name: 'tools' },
        { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'others' },
        '/',
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
        { name: 'styles' },
        { name: 'colors' },
        { name: 'about' }
    ];

    // Remove some buttons, provided by the standard plugins, which we don't
    // need to have in the Standard(s) toolbar.
    config.removeButtons = '';
    config.format_tags = 'p;h2;h3;h4;h5;pre;address;div';
    config.stylesSet = [
        { name: 'Marker: Yellow',	element: 'span', styles: { 'background-color': 'Yellow' } },
        { name: 'Marker: Green',	element: 'span', styles: { 'background-color': 'Lime' } },

        { name: 'Computer Code',	element: 'code' },
        { name: 'Keyboard Phrase',	element: 'kbd' },

        { name: 'Deleted Text',		element: 'del' },
        { name: 'Inserted Text',	element: 'ins' },

        { name: 'Blockquote',		element: 'blockquote' },
        { name: 'Inline Quotation',	element: 'q' },
    ]
};
