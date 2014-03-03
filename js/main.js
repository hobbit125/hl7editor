var fs = require('fs');
var gui = require('nw.gui');

document.addEventListener('DOMContentLoaded', function() {
    var ed = CodeMirror(document.getElementById('editorContainer'), 
                        {
                            mode: 'hl7',
                            theme: 'midnight',
                            autofocus: true,
                            lineNumbers: true
                        });
    ed.setSize(window.innerWidth * 0.66, window.innerHeight);

    window.addEventListener('resize', function () {
        ed.setSize(window.innerWidth * 0.66, window.innerHeight);
    });
});







