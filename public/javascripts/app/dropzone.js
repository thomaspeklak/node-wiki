jQuery(document).ready(function() {

    var Dropzone = function (options) {
        this.element = options.element;
        this.toggleState = options.toggleState ||  toggleState;
        this.handleDragOver = options.handleDragOver ||  handleDragOver;
        this.handleFileSelect = options.handleFileSelect ||  handleFileSelect;

        this.addEventListeners();
    };

    Dropzone.prototype.addEventListeners = function () {
        var me = this;
        this.element.addEventListener('dragover', this.handleDragOver, false);
        this.element.addEventListener('dragenter', this.toggleState, false);
        this.element.addEventListener('dragleave', this.toggleState, false);
        this.element.addEventListener('drop', function(evt) {

            // Only handle file uploads, no e.g. text/html copy&pastes
            if (evt.dataTransfer &&
                evt.dataTransfer.files &&
                evt.dataTransfer.files.length && evt.dataTransfer.files.length > 0) {
                me.handleFileSelect.apply(me, arguments);
            }
        }, false);
    };

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    function toggleState(ev) {
        $(ev.target).toggleClass('active');
    }

    app.Dropzone = Dropzone;
});