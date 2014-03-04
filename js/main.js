var fs = require('fs');
var gui = require('nw.gui');


var clickInput = function (id) {
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click');
    document.getElementById(id).dispatchEvent(event);
}

var viewModel = (function () {
    var obj = {};

    obj.currentSegment = ko.observable({ name: ko.observable(), fields: ko.observableArray() });

    obj.currentLineTextUpdated = function (mshLineText, lineText) {
        if(mshLineText != null) {
            try {
                var fieldSep = mshLineText.substring(3, 4);
                var compSep = mshLineText.substring(4, 5);
                var repeatChar = mshLineText.substring(5, 6);
                var escapeChar = mshLineText.substring(6, 7);
                var subCompSep = mshLineText.substring(7, 8);
                
                var fields = lineText.split(fieldSep);
                obj.currentSegment().name(fields[0]);
                obj.currentSegment().fields.removeAll();
                                
                for (var i in fields) {
                    var cmps = [];
                    if (fields[i].indexOf(compSep) >= 0) {
                        var components = fields[i].split(compSep);

                        for (var j in components) {
                            var comp = components[j];
                            console.log(comp)
                            cmps.push(comp);
                        }
                    }

                    var fieldDef = { idx: i, text: fields[i], components: cmps };
                    
                    

                    obj.currentSegment().fields.push(fieldDef);
                } 

            } catch (ex) { 
                console.log("Error loading line: " + ex);
            }
        }
    };

    return obj;
})();


document.addEventListener('DOMContentLoaded', function () {
    var ed = CodeMirror(document.getElementById('editorContainer'), 
                        {
                            mode: 'hl7',
                            theme: 'midnight',
                            autofocus: true,
                            lineNumbers: true
                        });
    ed.setSize(window.innerWidth * 0.66, window.innerHeight);
    ed.on("cursorActivity", function (doc) {
        var lineNumber = ed.getCursor().line;
        var lineText = doc.getRange({ line: lineNumber, ch: 0 }, { line: lineNumber + 1, ch: 0 });
        var mshLineText = null;

        for (var i = lineNumber; i >= 0; i--) {
            var curLineText = doc.getRange({ line: i, ch: 0 }, { line: i + 1, ch: 0 });

            if (curLineText.indexOf('MSH') == 0) {
                mshLineText = curLineText;
                break;
            }
        }

        viewModel.currentLineTextUpdated(mshLineText, lineText);
    });

    window.addEventListener('resize', function () {
        ed.setSize(window.innerWidth * 0.66, window.innerHeight);
    });


    document.addEventListener('keyup', function (e) {
        if (e.keyCode == 'O'.charCodeAt(0) && e.ctrlKey) {
            clickInput('open');
        } else if (e.keyCode == 'S'.charCodeAt(0) && e.ctrlKey) {
            clickInput('save');
        }
    });

    document.getElementById('open').addEventListener('change', function (e) {
        fs.readFile(this.value, 'utf-8', function (error, contents) {
            try {
                ed.setValue(contents); 
            } catch (ex) {}
        });
    });
     
    document.getElementById('save').addEventListener('change', function (e) {
        try {
            var text = ed.getValue();
            fs.writeFile(this.value, text);
        } catch (ex) {}
    });

    var menu = new gui.Menu({ type: 'menubar' });
    menu.append(new gui.MenuItem({
        label: 'File',
        submenu: new gui.Menu()
    }));

    menu.items[0].submenu.append(new gui.MenuItem({
        label: 'Open',
        click: function () {
            clickInput('open');
        }
    }));
    menu.items[0].submenu.append(new gui.MenuItem({
        label: 'Save',
        click: function () {
            clickInput('save');
        }
    }));
    menu.items[0].submenu.append(new gui.MenuItem({
        type: 'separator'
    }));
    menu.items[0].submenu.append(new gui.MenuItem({
        label: 'Close',
        click: function () {
            gui.Window.get().close();
        }
    }));
    gui.Window.get().menu = menu;

    ko.applyBindings(viewModel);
});


 
