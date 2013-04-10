// AutoURL: inCopy Integration
// By Nader Heidari
// Can automatically build hyperlinks from tab-delimited text
//
var Hyperlinking = {
    insertNoteAfter: function (container, selectionPoint, comment) {
        "use strict";
        var justInserted = container.notes.add(LocationOptions.AFTER, selectionPoint).id;
        container.notes.itemByID(justInserted).texts[0].contents = comment;
    },
    makeHyperlinkDestination: function (URL) {
        //If the hyperlink destination already exists, use it;
        //if it doesn't, then create it.
        "use strict";
        var myHyperlinkDestination;
        if (app.activeDocument.hyperlinkURLDestinations.item(URL).isValid && app.activeDocument.hyperlinkURLDestinations.item(URL).name) {
            return myHyperlinkDestination;
        }
        myHyperlinkDestination = app.activeDocument.hyperlinkURLDestinations.add(URL, {hidden: true, name: Math.random().toString()});
        myHyperlinkDestination.name = URL;
        return myHyperlinkDestination;
    },
    makeHyperlink: function (target, URL) {
        "use strict";
        var hyperlinkTextSource, i, hyperlinkSources = app.activeDocument.hyperlinkTextSources, hyperlink;
        if (target && URL){
            for (i = 0; i < hyperlinkSources.length; i += 1) {
                if (hyperlinkSources[i].sourceText === target) {
                    return hyperlinkSources[i];
                }
            }
            hyperlinkTextSource = app.activeDocument.hyperlinkTextSources.add(target);
            hyperlink = app.activeDocument.hyperlinks.add(hyperlinkTextSource, this.makeHyperlinkDestination(URL), {hidden: false, name: target.contents});
            hyperlink.visible = false;
            this.insertNoteAfter(target, target.insertionPoints.item(0), URL);
            }
    }
};

function mprompt(message, preset) {
    'use strict';
    var messageLength = message ? message.length : 0,
        dialog_window = new Window('dialog { dialog_message: StaticText { characters: ' + messageLength + '},' + ' editbox: EditText { active: true, characters: 80,' + '   properties: { multiline: true } },' + 'b: Group { o: Button { text: "OK" }, ' + '  c: Button { text: "Cancel" } }' + '}');
    if (message) {
        dialog_window.dialog_message.text = message;
    }
    if (preset) {
        dialog_window.editbox.text = preset;
    }
    // We need to define our own event handler to get
    // newline characters
    // into the multiline field when you hit Return
    dialog_window.addEventListener('keydown', function (e) {
        if (e.keyName === 'Enter') {
            dialog_window.editbox.textselection += '\n';
        }
    });
    // Size the input box 6 lines high, unless we know better
    if (!preset) {
        dialog_window.editbox.preferredSize = [-1, dialog_window.editbox.preferredSize[1] * 6];
    }
    // We cannot allow the default event handler to capture Enter
    dialog_window.defaultElement = null;
    // We need our own handler to close the window.
    dialog_window.b.o.onClick = function () {
        dialog_window.close(1);
    };
    if (dialog_window.show() === 1) {
        return dialog_window.editbox.text;
    }
    return null;
}
function insertNoteAfter(container, selectionPoint, comment) {
    "use strict";
    var justInserted = container.notes.add(LocationOptions.AFTER, selectionPoint).id;
    container.notes.itemByID(justInserted).texts[0].contents = comment;
}
/*global app, LocationOptions*/

function returnFirstNotNoteFoundObject(myFoundItems) {
    "use strict";
    var i;
    for (i = 0; i < myFoundItems.length; i += 1) {
        if (myFoundItems[i].parent instanceof Note === false) {
            return myFoundItems[i];
        }
    }
}
function doSearchAndReplace(stringfind, urlstring, searchin) {
    "use strict";
    var myFoundItems, firstInstance;
    app.findTextPreferences.findWhat = stringfind;
    app.findTextPreferences.appliedCharacterStyle = '[No character style]';//This is set to ignore styled text, we have a weird bug with that.
    //app.findTextPreferences.appliedParagraphStyle = "CON_noindent"//This is set to ignore styled text, we have a weird bug with that.
    //app.findTextPreferences.appliedParagraphStyle = "CON_noindent-lead"//This is set to ignore styled text, we have a weird bug with that.
    //Set the find options.
    app.findChangeTextOptions.caseSensitive = true;
    app.findChangeTextOptions.includeFootnotes = false;
    app.findChangeTextOptions.includeHiddenLayers = false;
    app.findChangeTextOptions.includeLockedLayersForFind = false;
    app.findChangeTextOptions.includeLockedStoriesForFind = false;
    app.findChangeTextOptions.includeMasterPages = false;
    app.findChangeTextOptions.wholeWord = true; //set this so you don't get funky hyperlinks in the middle of words.

    myFoundItems = searchin.findText();
    firstInstance = returnFirstNotNoteFoundObject(myFoundItems);
    Hyperlinking.makeHyperlink(firstInstance, urlstring);//I modified this to stop being a loop through all found, and only focus on the first.
    }//One of my additions, adds the note before the link to show the contents of the link in case anything does terribly wrong.



function main() {
    'use strict';
    var i,
        myFindChangeArray,
        hyperlinks = mprompt('Paste <text to link><tab><hyperlink>s here');
    if (hyperlinks !== null) {//if It opened correctly:
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        hyperlinks = hyperlinks.split('\n');
        //Loop through the find/change operations.

        for (i = 0; i < hyperlinks.length; i += 1) {
            myFindChangeArray =  hyperlinks[i].split('\t');

            doSearchAndReplace(myFindChangeArray[0], myFindChangeArray[1], app.selection[0].parentStory);

        }
            // reset search
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
    }
}
function doEverything() {
    'use strict';
    if (app.documents.length > 0) {
        main();
    } else {
        alert('Please open a document');
    }
}
if (parseFloat(app.version) < 6) {
    doEverything();
} else {
    app.doScript(doEverything, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT); //This is here so you don't need to undo a billion+1 times. Basically, it runs the scriptPath in one go.
}