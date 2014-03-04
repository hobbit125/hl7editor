CodeMirror.defineMode("hl7", function (options) {
    return {
        startState: function () { return { fieldSeparator: '|', firstSepEncountered: false, segmentName: '', currentField: 0 }; },
        token: function (stream, state) {
            if(stream.sol()) {
                state.currentField = 0;
                state.firstSepEncountered = false;
                state.segmentName = '';
            }

            if (!state.firstSepEncountered) {
                var curChar = stream.eat(function(c) { return c != state.fieldSeparator; });
                if (curChar != null) {
                    state.segmentName += curChar;
                    return "string";    
                }
            }

            state.firstSepEncountered = true;
            if (stream.next() == state.fieldSeparator) {
                state.currentField += 1;
                return "comment";
            } else {
                stream.eatWhile(function(c) { return c != state.fieldSeparator; });

                if (state.segmentName == "MSH" && state.currentField == 8)
                    return "variable";
                else
                    return null;
            }
        }
    }
});

CodeMirror.defineMIME("text/hl7", "hl7");
