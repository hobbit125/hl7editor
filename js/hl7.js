var parseHl7 = function (text) {
    var fieldSep = text.substring(3, 4);
    var compSep = text.substring(4, 5);
    var repeatChar = text.substring(5, 6);
    var escapeChar = text.substring(6, 7);
    var subCompSep = text.substring(7, 8);
    var hl7 = [];

    var lines = text.split(/[\n\r]+/);
    for (var lineIdx in lines) {
        var line = lines[lineIdx];
        if (line.trim() == "") continue;

        var fields = [];

        if (line.indexOf("MSH") == 0) {
            fields.push("MSH");
            fields.push(line.substring(3, 1));
            fields.push(line.substring(4, 3));
            line = line.substring(9);
        }

        var fds = line.split(fieldSep);
        for (var fieldIdx in fds) {
            var field = fds[fieldIdx];

            if (field.indexOf(compSep) >= 0) {
                var components = [];
                components.push(null);
                var cmps = field.split(compSep);
                
                for (var compIdx in cmps) {
                    var component = cmps[compIdx];

                    if (component.indexOf(subCompSep) >= 0){
                        var subComponents = [];
                        subComponents.push(null);

                        var subCmps = component.split(subCompSep);
                        for (var subIdx in subCmps) {
                            var subComponent = subCmps[subIdx];
                            subComponent.push(subComponent);
                        }
                        components.push(subComponents);
                    } else {
                        components.push(component);
                    }
                }

                fields.push(components);
            } else {
                fields.push(field);
            }
        }
        fields.name = fields[0];
        hl7.push(fields);
    }
    return hl7;
};
