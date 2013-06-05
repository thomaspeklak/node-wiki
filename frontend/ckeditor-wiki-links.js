"use strict";

module.exports = function (CKEDITOR) {
    var getById = function (array, id, recurse) {
        for (var i = 0, item;
            (item = array[i]); i++) {
                if (item.id == id) return item;
                if (recurse && item[recurse]) {
                    var retval = getById(item[recurse], id, recurse);
                    if (retval) return retval;
                }
            }
            return null;
    };

    var extractTitleAndPath = function (page) {
        return [page.title, page.path];
    };

    CKEDITOR.plugins.add('wiki_link', {
        init: function (editor, pluginPath) {
            CKEDITOR.on('dialogDefinition', function (e) {
                if ((e.editor != editor) || (e.data.name != 'link')) return;

                // Overrides definition.
                var definition = e.data.definition;
                definition.onFocus = CKEDITOR.tools.override(definition.onFocus, function (original) {
                    return function () {
                        original.call(this);
                        if (this.getValueOf('info', 'linkType') == 'wiki') {
                            this.getContentElement('info', 'wiki_link').selectParentTab();
                        }
                    };
                });

                var infoTab = definition.getContents('info');
                var content = getById(infoTab.elements, 'linkType');
                content.items.unshift(["Wiki link", 'wiki']);
                infoTab.elements.push({
                    type: 'vbox',
                    id: 'wikiOptions',
                    children: [{
                        type: 'select',
                        items: [],
                        id: 'wiki_link',
                        label: editor.lang.link.title,
                        required: true,
                        onLoad: function () {
                            //getAllPages
                        },
                        setup: function (data) {
                            var element_id = '#' + this.getInputElement().$.id;
                            var self = this;
                            $.getJSON("/pages.json?sort_by=path", function (pages) {
                                pages.forEach(function(page) {
                                    $(element_id).get(0).options[$(element_id).get(0).options.length] = new Option(page.title + " | " + page.path, page.path);
                                });
                                self.setValue(data.wiki_link || '');
                                self.getDialog().getContentElement('info', 'wiki_link').selectParentTab();
                            });
                        },
                    }
                    ]
                });
                content.onChange = CKEDITOR.tools.override(content.onChange, function (original) {
                    return function () {
                        original.call(this);
                        var dialog = this.getDialog();
                        var element = dialog.getContentElement('info', 'wikiOptions').getElement().getParent().getParent();
                        if (this.getValue() == 'wiki') {
                            element.show();
                            if (editor.config.linkShowTargetTab) {
                                dialog.showPage('target');
                            }
                            var uploadTab = dialog.definition.getContents('upload');
                            if (uploadTab && !uploadTab.hidden) {
                                dialog.hidePage('upload');
                            }
                        } else {
                            element.hide();
                        }
                    };
                });
                content.setup = function (data) {
                    if (data.type == "url" && data.url && data.url.protocol == undefined) {
                        data.type = 'wiki';
                        data.wiki_link = data.url.url;
                        delete data.url;
                    }
                    this.setValue(data.type);
                };
                content.commit = function (data) {
                    data.type = this.getValue();
                    if (data.type == 'wiki') {
                        data.type = 'url';
                        var dialog = this.getDialog();
                        dialog.setValueOf('info', 'protocol', '');
                        dialog.setValueOf('info', 'url', dialog.getValueOf('info', 'wiki_link'));
                    }
                };
            });
        }
    });
};

