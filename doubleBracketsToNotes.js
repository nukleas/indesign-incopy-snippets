function doubleBracketsToNotes() {
    "use strict";
	var found_double_bracket_text, i, len;
    app.findGrepPreferences.properties = {
        findWhat: "\\[\\[(.*?)\\]\\]"
    };
    found_double_bracket_text = app.activeDocument.findGrep();
    for (i = 0, len = found_double_bracket_text.length; i < len; i += 1) {
        if (found_double_bracket_text[i].parent instanceof Note === false) {
            found_double_bracket_text[i].convertToNote();
        }
    }
}
doubleBracketsToNotes();