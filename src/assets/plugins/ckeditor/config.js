/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function(config) {
    config.removePlugins = 'magicline'
    config.extraAllowedContent = 'div(*){*}[*]; ol li span a(*){*}[*]'
    config.toolbarLocation = 'top';
    config.toolbar = [


        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },

    ];
    config.protectedSource.push(/<img \/="\/" .*?>/g)
    config.floatSpacePinnedOffsetY = 120;
    config.disableAutoInline = false;
    config.allowedContent = true;
    // config.removePlugins = 'dragdrop,basket';
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
};