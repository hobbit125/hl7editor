CodeMirror.defineMode("hl7", function (options) {
    return {
        startState: function () { return { fieldSeparator: '|', segmentName: null }; },
        token: function (stream, state) {
            if(stream.sol()) {
                stream.eatWhile(function(c) { return c != state.fieldSeparator; });
                return "string";
            } else {
                
                if(stream.next() == state.fieldSeparator)
                    return "comment";
                else {
                    stream.eatWhile(function(c) { return c != state.fieldSeparator; });
                    return null;
                }
            }
        },
    }

});

CodeMirror.defineMIME("text/hl7", "hl7");
