CodeMirror.defineMode("hl7", function (options) {
    return {
        startState: function () { 
            return { 
                fieldSeparator: '|', 
                componentSeparator: '^',
                fieldRepeater: '~',
                escapeCharacter: '\\',
                subComponentSeparator: '&',

                atSep1: false,
                atSep2: false,
                atSep3: false,
                atSep4: false,
                atSep5: false,

                firstSepEncountered: false, 
                segmentName: '', 
                currentField: 0 
            }; 
        },
        token: function (stream, state) {
            if (state.atSep1) {
                state.fieldSeparator = stream.next();
                state.atSep1 = false;
                state.atSep2 = true;
                state.firstSepEncountered = true;
                state.currentField += 1;
                return "comment";
            }
            
            if (state.atSep2) {
                state.componentSeparator = stream.next();
                state.atSep2 = false;
                state.atSep3 = true;
                return "comment";
            }

            if (state.atSep3) {
                state.fieldRepeater = stream.next();
                state.atSep3 = false;
                state.atSep4 = true;
                return "comment";
            }

            if (state.atSep4) {
                state.escapeCharacter = stream.next();
                state.atSep4 = false;
                state.atSep5 = true;
                return "comment";
            }

            if (state.atSep5) {
                state.subComponentSeparator = stream.next();
                state.atSep5 = false;
                return "comment";
            }

            if (stream.sol()) {
                state.currentField = 0;
                state.firstSepEncountered = false;
                state.segmentName = '';
            }
            

            if (!state.firstSepEncountered) {
                var curChar = stream.eat(function(c) { return c != state.fieldSeparator; });

                if (curChar != null) {
                    state.segmentName += curChar;
                    
                    if (state.segmentName == "MSH")
                        state.atSep1 = true;

                    return "string";
                }
            }

            state.firstSepEncountered = true;

            var nextChar = stream.peek();

            if (nextChar == state.fieldSeparator) {
                state.currentField += 1;
                stream.next();
                return "comment";
            } else if (nextChar == state.componentSeparator) {
                stream.next();
                return "comment";
            } else if (nextChar == state.fieldRepeater) {
                stream.next();
                return "comment";
            } else if (nextChar == state.escapeCharacter) {
                stream.next();
                return "comment";
            } else if (nextChar == state.subComponentSeparator) {
                stream.next();
                return "comment";
            } else {
                stream.eatWhile(function (c) { 
                    return c != state.fieldSeparator  && 
                        c != state.componentSeparator && 
                        c != state.fieldRepeater && 
                        c != state.escapeCharacter && 
                        c != state.subComponentSeparator; 
                });

                if (state.segmentName == "MSH" && state.currentField == 8)
                    return "variable";
                else
                    return null;
            }
        }
    }
});

CodeMirror.defineMIME("text/hl7", "hl7");
